import { supabase, getServiceSupabase, isSupabaseConfigured } from './supabase-client';
import { ZaloService } from './zalo-service';
import { CheckIn, CheckInMethod } from '@/lib/types';

export interface CheckInRequest {
  eventId: string;
  codeOrUid: string;
  method: CheckInMethod;
  scannedByUserId?: string;
  gateLocation?: string;
}

export interface CheckInResult {
  success: boolean;
  isDuplicate: boolean;
  message: string;
  checkIn?: CheckIn;
  delegate?: {
    fullName: string;
    title?: string;
    company?: string;
    avatarUrl?: string;
    ticketTier?: string;
  };
  latencyMs: number;
}

const CANONICAL_EVENT_UUID_MAP: Record<string, string> = {
  'evt-001': 'ea111111-1111-1111-1111-111111111111',
  'evt-002': 'ea222222-2222-2222-2222-222222222222',
};

export function resolveEventId(id: string): string {
  if (!id) return 'ea111111-1111-1111-1111-111111111111';
  const clean = id.trim().toLowerCase();
  if (CANONICAL_EVENT_UUID_MAP[clean]) return CANONICAL_EVENT_UUID_MAP[clean];
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clean);
  if (isUuid) return clean;
  return 'ea111111-1111-1111-1111-111111111111';
}

export function extractCleanCode(input: string): string {
  let cleaned = input.trim();
  if (cleaned.includes('/p/')) {
    cleaned = cleaned.split('/p/').pop()?.split('?')[0] || cleaned;
  } else if (cleaned.includes('/c/')) {
    cleaned = cleaned.split('/c/').pop()?.split('?')[0] || cleaned;
  } else if (cleaned.includes('data=')) {
    cleaned = cleaned.split('data=').pop()?.split('&')[0] || cleaned;
  }
  return decodeURIComponent(cleaned).trim();
}

/**
 * High-performance MICE Check-in Processor (< 0.8s SLA)
 * Leverages database indexing, parallel lookup, and non-blocking asynchronous notifications
 */
export async function processFastCheckIn(req: CheckInRequest): Promise<CheckInResult> {
  const startTime = performance.now();
  const { eventId, codeOrUid, method, scannedByUserId, gateLocation = 'Gate 1 - VIP NFC Terminal' } = req;
  const rawCode = codeOrUid.trim();
  const cleanCode = extractCleanCode(rawCode);
  const targetEventId = resolveEventId(eventId);

  const db = getServiceSupabase() || supabase;

  if (isSupabaseConfigured() && db) {
    try {
      let identityId: string | null = null;
      let ticketTier = 'VIP';
      let personData: {
        id?: string;
        full_name: string;
        title?: string;
        avatar_url?: string;
        phone?: string;
        email?: string;
        businesses?: Array<{ legal_name?: string; display_name?: string }>;
      } | null = null;

      // 1. FAST PARALLEL LOOKUP: Query Card & Registration simultaneously in a single roundtrip
      const [cardResult, regResult] = await Promise.all([
        db
          .from('access_cards')
          .select('person_identity_id, status, person_identities(id, full_name, title, avatar_url, phone, email, businesses(legal_name, display_name))')
          .or(`card_uid.eq.${cleanCode},card_uid.ilike.${cleanCode}`)
          .maybeSingle(),
        db
          .from('event_registrations')
          .select('id, person_identity_id, ticket_tier, status, person_identities(id, full_name, title, avatar_url, phone, email, businesses(legal_name, display_name))')
          .eq('event_id', targetEventId)
          .or(`qr_code_hash.eq.${cleanCode},qr_code_hash.ilike.${cleanCode}`)
          .maybeSingle(),
      ]);

      if (cardResult.data && cardResult.data.status === 'ACTIVE' && cardResult.data.person_identity_id) {
        identityId = cardResult.data.person_identity_id;
        const identityRel = cardResult.data.person_identities as any;
        if (identityRel) {
          personData = Array.isArray(identityRel) ? identityRel[0] : identityRel;
        }
      }

      if (!identityId && regResult.data && regResult.data.person_identity_id) {
        identityId = regResult.data.person_identity_id;
        ticketTier = regResult.data.ticket_tier || 'VIP';
        const identityRel = regResult.data.person_identities as any;
        if (identityRel) {
          personData = Array.isArray(identityRel) ? identityRel[0] : identityRel;
        }
      }

      // 2. Fallback lookup by person identity directly if rawCode is username or UUID
      if (!identityId) {
        const { data: person } = await db
          .from('person_identities')
          .select('id, full_name, title, avatar_url, phone, email, businesses(legal_name, display_name)')
          .or(`id.eq.${cleanCode},full_name.ilike.%${cleanCode}%`)
          .maybeSingle();

        if (person) {
          identityId = person.id;
          personData = person as any;
        }
      }

      if (identityId) {
        // Fetch personData if not pre-joined
        if (!personData) {
          const { data: fetchedPerson } = await db
            .from('person_identities')
            .select('id, full_name, title, avatar_url, phone, email, businesses(legal_name, display_name)')
            .eq('id', identityId)
            .maybeSingle();
          if (fetchedPerson) {
            personData = fetchedPerson as any;
          }
        }

        // 3. IDEMPOTENCY CHECK: Filter precisely by event_id AND person_identity_id using indexed query
        const { data: existingCheckIn } = await db
          .from('check_ins')
          .select('id, check_in_time, created_at, status')
          .eq('event_id', targetEventId)
          .eq('person_identity_id', identityId)
          .eq('status', 'CHECKED_IN')
          .maybeSingle();

        const latencyMs = Math.round(performance.now() - startTime);
        const companyName = personData?.businesses?.[0]?.display_name || personData?.businesses?.[0]?.legal_name;

        if (existingCheckIn) {
          const checkedTime = new Date(existingCheckIn.check_in_time || existingCheckIn.created_at).toLocaleTimeString('vi-VN');
          return {
            success: false,
            isDuplicate: true,
            message: `Đại biểu [${personData?.full_name || 'VIP'}] đã điểm danh trước đó lúc ${checkedTime}.`,
            delegate: {
              fullName: personData?.full_name || 'Đại biểu VIP',
              title: personData?.title || 'Chủ tịch / CEO',
              company: companyName,
              avatarUrl: personData?.avatar_url,
              ticketTier,
            },
            latencyMs,
          };
        }

        // 4. INSERT CHECK-IN RECORD
        const { data: newCheckInRecord } = await db
          .from('check_ins')
          .insert({
            event_id: targetEventId,
            person_identity_id: identityId,
            method,
            scanned_by_user_id: scannedByUserId || null,
            gate_location: gateLocation,
            status: 'CHECKED_IN',
            latency_ms: latencyMs,
          })
          .select()
          .maybeSingle();

        // 5. ASYNC NON-BLOCKING NOTIFICATIONS (Zalo ZNS & Webhook)
        // Fire-and-forget: Execution continues in background without blocking the <0.8s HTTP response
        if (personData?.phone) {
          ZaloService.triggerCheckinSuccessAlert({
            fullName: personData.full_name || 'Đại biểu VIP',
            phone: personData.phone,
            eventName: 'Diễn Đàn Kết Nối Doanh Nghiệp 2026',
            tableNumber: ticketTier === 'VIP' ? 'Bàn VIP A1' : 'Bàn Tự Do',
            seatRole: ticketTier,
          }).catch((znsErr) => {
            console.warn('[Async Zalo ZNS Error Non-blocking]:', znsErr);
          });
        }

        return {
          success: true,
          isDuplicate: false,
          message: `Xác thực check-in thành công cho đại biểu [${personData?.full_name || 'VIP'}]!`,
          checkIn: newCheckInRecord ? {
            id: newCheckInRecord.id,
            eventId: targetEventId,
            registrationId: `reg-${identityId}`,
            personIdentityId: identityId,
            method,
            checkedInAt: newCheckInRecord.check_in_time || new Date().toISOString(),
            operatorName: gateLocation,
          } : undefined,
          delegate: {
            fullName: personData?.full_name || 'Đại biểu VIP',
            title: personData?.title || 'Chủ tịch / CEO',
            company: companyName,
            avatarUrl: personData?.avatar_url,
            ticketTier,
          },
          latencyMs,
        };
      }
    } catch (err) {
      console.warn('[Supabase checkin error]:', err);
    }
  }

  const fallbackLatency = Math.round(performance.now() - startTime);
  return {
    success: false,
    isDuplicate: false,
    message: `Không tìm thấy thẻ NFC hoặc mã vé "${cleanCode}" trên hệ thống Supabase.`,
    latencyMs: fallbackLatency,
  };
}
