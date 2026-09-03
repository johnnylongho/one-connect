import { supabase, isSupabaseConfigured } from './supabaseClient';
import { PersonIdentity, AccessCard, CheckIn, Connection, AuditLog, ConnectionStatus } from './types';
import { INITIAL_IDENTITIES, INITIAL_CARDS, INITIAL_CONNECTIONS } from './mock-data';

/**
 * Data Access Layer (DAL) for One Connect Network
 * Connects directly to Supabase Cloud PostgreSQL with Realtime WebSockets
 */

export const LEGACY_UUID_MAP: Record<string, string> = {
  'id-001': '11111111-1111-1111-1111-111111111111',
  'usr-001': '11111111-1111-1111-1111-111111111111',
  'johnnylongho': '11111111-1111-1111-1111-111111111111',
  'johnnylong': '11111111-1111-1111-1111-111111111111',

  'id-002': '22222222-2222-2222-2222-222222222222',
  'usr-002': '22222222-2222-2222-2222-222222222222',
  'thuha': '22222222-2222-2222-2222-222222222222',

  'id-003': '33333333-3333-3333-3333-333333333333',
  'usr-003': '33333333-3333-3333-3333-333333333333',
  'minhduc': '33333333-3333-3333-3333-333333333333',

  'id-004': '44444444-4444-4444-4444-444444444444',
  'usr-004': '44444444-4444-4444-4444-444444444444',
  'hoangnam': '44444444-4444-4444-4444-444444444444',

  'id-005': '55555555-5555-5555-5555-555555555555',
  'usr-005': '55555555-5555-5555-5555-555555555555',
  'phuonganh': '55555555-5555-5555-5555-555555555555',
};

export function ensureUuid(id: string): string {
  if (!id) return '11111111-1111-1111-1111-111111111111';
  const clean = id.toLowerCase().trim();
  if (LEGACY_UUID_MAP[clean]) return LEGACY_UUID_MAP[clean];
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clean);
  if (isUuid) return clean;
  // Deterministic fallback for text-based ID
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = ((hash << 5) - hash) + clean.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `${hex}-0000-4000-8000-${hex.repeat(2).slice(0, 12)}`;
}

let localIdentities: PersonIdentity[] = [...INITIAL_IDENTITIES];
let localCards: AccessCard[] = [...INITIAL_CARDS];
let localConnections: Connection[] = [...INITIAL_CONNECTIONS];

export const DbService = {
  /**
   * 1. Fetch all Identities from Cloud Database
   */
  async fetchCloudIdentities(): Promise<PersonIdentity[]> {
    if (!isSupabaseConfigured) return localIdentities;

    try {
      const { data, error } = await supabase
        .from('person_identities')
        .select(`
          *,
          cards:access_cards(*)
        `)
        .order('created_at', { ascending: false });

      if (data && !error && data.length > 0) {
        const cloudIdentities: PersonIdentity[] = data.map((d: any) => {
          const rawUsername = (d.full_name || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]/g, '') || 'user';
          
          return {
            id: d.id,
            userId: d.user_id || d.id,
            username: rawUsername,
            fullName: d.full_name,
            displayName: d.display_name || d.full_name,
            avatarUrl: d.avatar_url || '/avatar-johnny-long.jpg',
            coverUrl: d.cover_url || undefined,
            title: d.title || 'Doanh Nhân Hội Viên',
            bio: d.bio || 'Hội viên Mạng lưới Định danh Doanh nhân One Connect.',
            phone: d.phone || '0901234567',
            email: d.email || 'member@oneconnect.id.vn',
            website: d.website || 'https://oneconnect.id.vn',
            role: 'MEMBER',
            socialLinks: [
              { id: `soc-${d.id}-1`, identityId: d.id, platform: 'phone', url: `tel:${d.phone || ''}`, isPublic: true },
              { id: `soc-${d.id}-2`, identityId: d.id, platform: 'website', url: d.website || 'https://oneconnect.id.vn', isPublic: true },
            ],
            businesses: [
              {
                id: `biz-${d.id}`,
                personIdentityId: d.id,
                businessId: `b-${d.id}`,
                businessName: d.title ? `${d.title} Corp` : 'One Connect Partner',
                position: d.title || 'Đại Diện',
                relationType: 'FOUNDER_OWNER',
                isPrimary: true,
                status: 'ACTIVE',
              },
            ],
            createdAt: d.created_at,
            updatedAt: d.updated_at,
          };
        });

        // Merge with local identities if not present
        localIdentities = cloudIdentities;
        return cloudIdentities;
      }
    } catch (err) {
      console.warn('Supabase fetchCloudIdentities error:', err);
    }
    return localIdentities;
  },

  /**
   * 2. Get Identity by ID or Username
   */
  async getIdentity(idOrUsername: string): Promise<PersonIdentity | null> {
    const cleanParam = idOrUsername.toLowerCase().trim();
    const resolvedUuid = ensureUuid(cleanParam);

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('person_identities')
          .select(`
            *,
            cards:access_cards(*)
          `)
          .or(`id.eq.${resolvedUuid},email.ilike.${cleanParam},phone.eq.${cleanParam},full_name.ilike.%${cleanParam}%`)
          .limit(1)
          .maybeSingle();

        if (data && !error) {
          const rawUsername = (data.full_name || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]/g, '') || 'user';

          return {
            id: data.id,
            userId: data.user_id || data.id,
            username: rawUsername,
            fullName: data.full_name,
            displayName: data.display_name || data.full_name,
            avatarUrl: data.avatar_url || '/avatar-johnny-long.jpg',
            coverUrl: data.cover_url || undefined,
            title: data.title || 'Doanh Nhân',
            bio: data.bio || '',
            phone: data.phone || '',
            email: data.email || '',
            website: data.website || '',
            role: 'MEMBER',
            socialLinks: [
              { id: `soc-${data.id}-1`, identityId: data.id, platform: 'phone', url: `tel:${data.phone || ''}`, isPublic: true },
              { id: `soc-${data.id}-2`, identityId: data.id, platform: 'website', url: data.website || 'https://oneconnect.id.vn', isPublic: true },
            ],
            businesses: [
              {
                id: `biz-${data.id}`,
                personIdentityId: data.id,
                businessId: `b-${data.id}`,
                businessName: data.title || 'One Connect Partner',
                position: data.title || 'Thành Viên',
                relationType: 'FOUNDER_OWNER',
                isPrimary: true,
                status: 'ACTIVE',
              },
            ],
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          };
        }
      } catch (err) {
        console.warn('Supabase getIdentity query error:', err);
      }
    }

    const found = localIdentities.find(
      i => i.id.toLowerCase() === cleanParam ||
           i.id.toLowerCase() === resolvedUuid ||
           i.username.toLowerCase() === cleanParam ||
           i.userId.toLowerCase() === cleanParam
    );
    return found || localIdentities[0] || null;
  },

  /**
   * 3. Save New Person Identity to Cloud Database
   */
  async createIdentity(identity: PersonIdentity, card: AccessCard, password?: string): Promise<PersonIdentity> {
    const validUserId = ensureUuid(identity.userId || identity.id);
    const validIdentityId = ensureUuid(identity.id);

    const savedIdentity: PersonIdentity = {
      ...identity,
      id: validIdentityId,
      userId: validUserId,
    };

    localIdentities = [savedIdentity, ...localIdentities.filter(i => i.id !== validIdentityId)];
    localCards = [card, ...localCards.filter(c => c.id !== card.id)];

    if (!isSupabaseConfigured) return savedIdentity;

    try {
      // 1. Insert into users
      const { data: userData, error: uErr } = await supabase
        .from('users')
        .insert({
          id: validUserId,
          email: identity.email || null,
          phone: identity.phone || null,
          auth_provider: 'otp',
          status: 'ACTIVE',
        })
        .select()
        .maybeSingle();

      if (uErr && !uErr.message.includes('duplicate')) {
        console.warn('Supabase users insert error:', uErr);
      }

      // 2. Insert into person_identities
      const { data: identityData, error: idErr } = await supabase
        .from('person_identities')
        .insert({
          id: validIdentityId,
          user_id: validUserId,
          full_name: identity.fullName,
          display_name: identity.displayName || identity.fullName,
          avatar_url: identity.avatarUrl || null,
          title: identity.title || null,
          bio: identity.bio || null,
          phone: identity.phone || null,
          email: identity.email || null,
          website: identity.website || null,
        })
        .select()
        .single();

      if (idErr) {
        console.warn('Supabase person_identities insert error:', idErr);
      }

      // 3. Insert into access_cards
      await supabase.from('access_cards').insert({
        card_uid: card.cardUid,
        person_identity_id: validIdentityId,
        card_type: card.cardType || 'NFC_BUSINESS_PRO',
        status: 'ACTIVE',
      });
    } catch (err) {
      console.warn('Supabase createIdentity error:', err);
    }

    return savedIdentity;
  },

  /**
   * 4. Update Person Identity in Cloud Database
   */
  async updateIdentity(identityId: string, updates: Partial<PersonIdentity> & { businessName?: string }): Promise<PersonIdentity | null> {
    const validId = ensureUuid(identityId);

    if (isSupabaseConfigured) {
      try {
        const updatePayload: Record<string, any> = {
          updated_at: new Date().toISOString(),
        };
        if (updates.fullName !== undefined) updatePayload.full_name = updates.fullName;
        if (updates.displayName !== undefined) updatePayload.display_name = updates.displayName;
        if (updates.title !== undefined) updatePayload.title = updates.title;
        if (updates.bio !== undefined) updatePayload.bio = updates.bio;
        if (updates.phone !== undefined) updatePayload.phone = updates.phone;
        if (updates.email !== undefined) updatePayload.email = updates.email;
        if (updates.website !== undefined) updatePayload.website = updates.website;

        const { data, error } = await supabase
          .from('person_identities')
          .update(updatePayload)
          .eq('id', validId)
          .select()
          .single();

        if (data && !error) return data as PersonIdentity;
      } catch (err) {
        console.warn('Supabase updateIdentity error:', err);
      }
    }

    localIdentities = localIdentities.map(item => {
      if (item.id !== validId && item.username !== identityId) return item;
      return {
        ...item,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
    });

    return localIdentities.find(i => i.id === validId) || null;
  },

  /**
   * 5. Resolve NFC Card UID to Identity
   */
  async resolveCardUid(cardUid: string): Promise<{ card: AccessCard | null; identity: PersonIdentity | null }> {
    if (isSupabaseConfigured) {
      try {
        const { data: cardData, error } = await supabase
          .from('access_cards')
          .select('*, identity:person_identities(*)')
          .eq('card_uid', cardUid)
          .maybeSingle();

        if (cardData && !error && cardData.identity) {
          const rawUsername = (cardData.identity.full_name || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]/g, '') || 'user';

          const ident: PersonIdentity = {
            id: cardData.identity.id,
            userId: cardData.identity.user_id || cardData.identity.id,
            username: rawUsername,
            fullName: cardData.identity.full_name,
            displayName: cardData.identity.display_name || cardData.identity.full_name,
            avatarUrl: cardData.identity.avatar_url || '/avatar-johnny-long.jpg',
            title: cardData.identity.title,
            bio: cardData.identity.bio,
            phone: cardData.identity.phone,
            email: cardData.identity.email,
            website: cardData.identity.website,
            socialLinks: [],
            businesses: [],
            createdAt: cardData.identity.created_at,
            updatedAt: cardData.identity.updated_at,
          };

          const c: AccessCard = {
            id: cardData.id,
            personIdentityId: cardData.person_identity_id,
            cardUid: cardData.card_uid,
            cardType: cardData.card_type || 'NFC_BUSINESS_PRO',
            dynamicUrl: `https://oneconnect.id.vn/p/${rawUsername}`,
            qrValue: `https://oneconnect.id.vn/p/${rawUsername}`,
            status: cardData.status || 'ACTIVE',
            issuedAt: cardData.issued_at || new Date().toISOString(),
          };

          return { card: c, identity: ident };
        }
      } catch (err) {
        console.warn('Supabase resolveCardUid error:', err);
      }
    }

    const cleanUid = cardUid.toLowerCase();
    const foundCard = localCards.find(c => c.cardUid.toLowerCase() === cleanUid);
    const card = foundCard || localCards[0] || null;
    const identity = card ? (localIdentities.find(i => i.id === card.personIdentityId) || localIdentities[0] || null) : null;
    return { card, identity };
  },

  /**
   * 6. Fetch Connections from Cloud Database
   */
  async fetchCloudConnections(currentIdentityId?: string): Promise<Connection[]> {
    if (!isSupabaseConfigured) return localConnections;

    try {
      const validId = currentIdentityId ? ensureUuid(currentIdentityId) : null;
      let query = supabase
        .from('connections')
        .select(`
          id,
          requester_identity_id,
          receiver_identity_id,
          event_id,
          status,
          requested_at,
          responded_at,
          requester:person_identities!requester_identity_id(*),
          receiver:person_identities!receiver_identity_id(*)
        `)
        .order('requested_at', { ascending: false });

      if (validId) {
        query = query.or(`requester_identity_id.eq.${validId},receiver_identity_id.eq.${validId}`);
      }

      const { data, error } = await query;
      if (data && !error) {
        const cloudConnections: Connection[] = data.map((d: any) => {
          const isRequester = validId ? d.requester_identity_id === validId : true;
          const partnerRaw = isRequester ? d.receiver : d.requester;
          
          let partner: PersonIdentity | undefined = undefined;
          if (partnerRaw) {
            const partnerUsername = (partnerRaw.full_name || '')
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/[^a-z0-9]/g, '') || 'partner';

            partner = {
              id: partnerRaw.id,
              userId: partnerRaw.user_id || partnerRaw.id,
              username: partnerUsername,
              fullName: partnerRaw.full_name,
              displayName: partnerRaw.display_name || partnerRaw.full_name,
              avatarUrl: partnerRaw.avatar_url || '/avatar-johnny-long.jpg',
              title: partnerRaw.title || 'Doanh Nhân',
              bio: partnerRaw.bio || '',
              phone: partnerRaw.phone || '',
              email: partnerRaw.email || '',
              website: partnerRaw.website || '',
              socialLinks: [],
              businesses: [],
              createdAt: partnerRaw.created_at,
              updatedAt: partnerRaw.updated_at,
            };
          }

          let uiStatus: ConnectionStatus = 'PENDING';
          if (d.status === 'ACCEPTED') uiStatus = 'CONNECTED';
          else if (d.status === 'REJECTED') uiStatus = 'BLOCKED';

          return {
            id: d.id,
            requesterIdentityId: d.requester_identity_id,
            receiverIdentityId: d.receiver_identity_id,
            status: uiStatus,
            connectedAt: d.responded_at || undefined,
            createdAt: d.requested_at || new Date().toISOString(),
            partner,
            contextEventName: 'Diễn Đàn Kết Nối Doanh Nghiệp 2026',
            notesCount: 0,
          };
        });

        localConnections = cloudConnections;
        return cloudConnections;
      }
    } catch (err) {
      console.warn('Supabase fetchCloudConnections error:', err);
    }

    return localConnections;
  },

  /**
   * 7. Send Real Connection Request (PENDING)
   */
  async sendConnectionRequest(fromId: string, toId: string, eventId?: string): Promise<Connection> {
    const validFrom = ensureUuid(fromId);
    const validTo = ensureUuid(toId);
    const validEvent = eventId ? ensureUuid(eventId) : 'ea111111-1111-1111-1111-111111111111';

    const newConnection: Connection = {
      id: `conn-${Date.now()}`,
      requesterIdentityId: validFrom,
      receiverIdentityId: validTo,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('connections')
          .insert({
            requester_identity_id: validFrom,
            receiver_identity_id: validTo,
            event_id: validEvent,
            status: 'PENDING',
            requested_at: newConnection.createdAt,
          })
          .select()
          .single();

        if (data && !error) {
          newConnection.id = data.id;
        }
      } catch (err) {
        console.warn('Supabase sendConnectionRequest error:', err);
      }
    }

    localConnections = [newConnection, ...localConnections.filter(c => c.id !== newConnection.id)];
    return newConnection;
  },

  /**
   * 8. Respond to Connection Request (ACCEPTED | REJECTED)
   */
  async respondToConnection(connectionId: string, status: 'ACCEPTED' | 'REJECTED'): Promise<boolean> {
    const respondedAt = new Date().toISOString();

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('connections')
          .update({
            status,
            responded_at: respondedAt,
          })
          .eq('id', connectionId);

        if (error) {
          console.warn('Supabase respondToConnection error:', error);
          return false;
        }
      } catch (err) {
        console.warn('Supabase respondToConnection exception:', err);
        return false;
      }
    }

    localConnections = localConnections.map(c => {
      if (c.id === connectionId) {
        return {
          ...c,
          status: status === 'ACCEPTED' ? 'CONNECTED' : 'BLOCKED',
          connectedAt: respondedAt,
        };
      }
      return c;
    });

    return true;
  },

  /**
   * 9. Record Check-in Live in Cloud Database
   */
  async recordCheckIn(params: {
    eventId?: string;
    personIdentityId: string;
    checkInMethod: 'NFC' | 'QR' | 'MANUAL';
    verifiedBy?: string;
  }): Promise<CheckIn> {
    const validEventId = ensureUuid(params.eventId || 'ea111111-1111-1111-1111-111111111111');
    const validPersonId = ensureUuid(params.personIdentityId);

    const newCheckIn: CheckIn = {
      id: `chk-${Date.now()}`,
      eventId: validEventId,
      registrationId: `reg-${Date.now()}`,
      personIdentityId: validPersonId,
      method: params.checkInMethod,
      checkedInAt: new Date().toISOString(),
      operatorName: params.verifiedBy || 'Lễ tân Cửa Chính',
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('check_ins')
          .insert({
            event_id: validEventId,
            person_identity_id: validPersonId,
            check_in_time: newCheckIn.checkedInAt,
            method: params.checkInMethod,
            gate_location: params.verifiedBy || 'Gate 1 - VIP NFC Terminal',
            status: 'CHECKED_IN',
            latency_ms: 120,
          })
          .select()
          .single();

        if (data && !error) {
          newCheckIn.id = data.id;
        }
      } catch (err) {
        console.warn('Supabase recordCheckIn error:', err);
      }
    }

    return newCheckIn;
  },

  /**
   * 10. Record Audit Log (PDPL 91/2025 Compliance)
   */
  async logAudit(log: Omit<AuditLog, 'id' | 'createdAt'>): Promise<void> {
    const fullLog: AuditLog = {
      ...log,
      id: `log-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      try {
        await supabase.from('audit_logs').insert({
          actor_user_id: ensureUuid(log.actorUserId),
          actor_name: log.actorName,
          action: log.action,
          object_type: log.objectType,
          object_id: log.objectId,
          ip_address: log.ipAddress || '127.0.0.1',
          created_at: fullLog.createdAt,
        });
      } catch (err) {
        // silently fallback
      }
    }
  },

  /**
   * 11. Exchange Contact from NFC Visitor / Guest (via Server API & Realtime Broadcast)
   */
  async exchangeGuestContact(params: {
    ownerIdentityId: string;
    guestName: string;
    guestPhone: string;
    guestCompany?: string;
    guestNote?: string;
  }): Promise<{ success: boolean; connectionId: string }> {
    const ownerUuid = ensureUuid(params.ownerIdentityId);

    try {
      // 1. Call server API (Runs with Service Role Key - completely bypasses RLS)
      const res = await fetch('/api/connections/exchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerIdentityId: ownerUuid,
          guestName: params.guestName,
          guestPhone: params.guestPhone,
          guestCompany: params.guestCompany,
          guestNote: params.guestNote,
        }),
      });

      const data = await res.json();
      const connectionId = data?.connectionId || `conn-${Date.now()}`;

      // 2. Broadcast on the live network channel instantly (< 50ms)
      await this.broadcastEvent('new_connection_request', {
        id: connectionId,
        receiver_identity_id: ownerUuid,
        requester_identity_id: data?.guestId || `guest-${Date.now()}`,
        requester_name: params.guestName,
        requester_phone: params.guestPhone,
        requester_title: params.guestCompany || 'Đối tác chạm thẻ NFC',
        status: 'PENDING',
        requested_at: new Date().toISOString(),
      });

      return { success: true, connectionId };
    } catch (err) {
      console.warn('exchangeGuestContact error:', err);
      return { success: true, connectionId: `local-${Date.now()}` };
    }
  },

  /**
   * 12. Broadcast Instant WebSocket Event Across All Connected Devices
   */
  async broadcastEvent(event: string, payload: any) {
    if (!isSupabaseConfigured) return;

    try {
      const channel = supabase.channel('oneconnect-live-network');
      await channel.send({
        type: 'broadcast',
        event,
        payload,
      });
    } catch (e) {
      console.warn('Supabase broadcastEvent error:', e);
    }
  },

  /**
   * 13. Unified Realtime Listener Subscription (PostgreSQL WAL + Broadcast)
   */
  subscribeToRealtime(onEvent: (payload: { table: string; eventType: string; newRecord: any; oldRecord?: any }) => void) {
    if (!isSupabaseConfigured) return () => {};

    try {
      const channelName = 'oneconnect-live-network';
      const channel = supabase.channel(channelName);

      channel
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'connections' },
          (payload) => {
            onEvent({ table: 'connections', eventType: payload.eventType, newRecord: payload.new, oldRecord: payload.old });
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'check_ins' },
          (payload) => {
            onEvent({ table: 'check_ins', eventType: payload.eventType, newRecord: payload.new, oldRecord: payload.old });
          }
        )
        .on(
          'broadcast',
          { event: 'new_connection_request' },
          (payload) => {
            if (payload?.payload) {
              onEvent({
                table: 'broadcast_connection',
                eventType: 'INSERT',
                newRecord: payload.payload,
              });
            }
          }
        )
        .on(
          'broadcast',
          { event: 'connection_accepted' },
          (payload) => {
            if (payload?.payload) {
              onEvent({
                table: 'broadcast_accepted',
                eventType: 'UPDATE',
                newRecord: payload.payload,
              });
            }
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('✅ OneConnect Realtime channel connected:', channelName);
          }
        });

      return () => {
        try {
          supabase.removeChannel(channel);
        } catch (e) {
          // safe cleanup
        }
      };
    } catch (err) {
      console.warn('Supabase Realtime subscription error:', err);
      return () => {};
    }
  },
};
