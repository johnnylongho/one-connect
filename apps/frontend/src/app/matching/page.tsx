import React from 'react';
import { cookies } from 'next/headers';
import { B2BMatchmakingView, MatchingRequest, BusinessUser } from '@/components/matching/b2b-matchmaking';
import { ToastProvider } from '@/components/ui/toast';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { MatchingService } from '@/lib/services/matching-service';
import { getServiceSupabase, supabase } from '@/lib/services/supabase-client';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'AI B2B Matchmaking - Kết Nối Doanh Nghiệp | One Connect',
  description: 'Hệ thống gợi ý ghép đôi đàm phán 1:1 B2B thông minh dựa trên ngành nghề, năng lực cung ứng và nhu cầu hợp tác thực tế.',
};

const CANONICAL_FALLBACK_USER_ID = '11111111-1111-1111-1111-111111111111';

export default async function MatchingPage() {
  let initialMatchings: MatchingRequest[] = [];
  let companies: BusinessUser[] = [];
  let aiCandidates: any[] = [];

  const db = getServiceSupabase() || supabase;

  // Dynamically resolve current identity from session cookie or Supabase auth
  let currentUserId = '';
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('one_connect_auth_session')?.value;
    if (sessionCookie) {
      currentUserId = decodeURIComponent(sessionCookie.trim());
    }

    if (!currentUserId) {
      const serverSupabase = await createClient();
      const {
        data: { user },
      } = await serverSupabase.auth.getUser();

      if (user && db) {
        const { data: idnt } = await db
          .from('person_identities')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();
        if (idnt?.id) {
          currentUserId = idnt.id;
        }
      }
    }
  } catch (err) {
    console.warn('[MatchingPage] Auth resolution warning:', err);
  }

  if (!currentUserId) {
    currentUserId = CANONICAL_FALLBACK_USER_ID;
  }

  try {
    // 1. Fetch AI B2B Matchmaking Candidates via algorithmic service
    const matchResult = await MatchingService.getMatchmakingCandidates(currentUserId);
    aiCandidates = matchResult.candidates;

    if (db) {
      // 2. Query real connections from Supabase joined with person_identities and businesses
      const { data: connData } = await db
        .from('connections')
        .select(`
          id,
          event_id,
          requester_identity_id,
          receiver_identity_id,
          status,
          requested_at,
          responded_at,
          requester:person_identities!requester_identity_id(
            id,
            full_name,
            title,
            avatar_url,
            phone,
            businesses(id, legal_name, display_name, industry)
          ),
          receiver:person_identities!receiver_identity_id(
            id,
            full_name,
            title,
            avatar_url,
            phone,
            businesses(id, legal_name, display_name, industry)
          )
        `)
        .order('requested_at', { ascending: false });

      if (connData && connData.length > 0) {
        initialMatchings = connData.map((item: any) => {
          const reqP = Array.isArray(item.requester) ? item.requester[0] : item.requester;
          const recP = Array.isArray(item.receiver) ? item.receiver[0] : item.receiver;
          const reqBiz = reqP?.businesses?.[0];
          const recBiz = recP?.businesses?.[0];

          const uiStatus: 'pending' | 'accepted' | 'rejected' =
            item.status === 'ACCEPTED' ? 'accepted' : item.status === 'REJECTED' ? 'rejected' : 'pending';

          const senderName = reqP?.full_name || 'Đại biểu Doanh nghiệp';
          const receiverName = recP?.full_name || 'Đối tác Giao thương';

          return {
            id: item.id,
            eventId: item.event_id || 'ea111111-1111-1111-1111-111111111111',
            senderId: item.requester_identity_id,
            senderName,
            senderCompany: reqBiz?.display_name || reqBiz?.legal_name || reqP?.title || 'Doanh nghiệp Hội viên',
            senderAvatar: reqP?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(senderName)}&background=0066FF&color=fff&bold=true`,
            receiverId: item.receiver_identity_id,
            receiverName,
            receiverCompany: recBiz?.display_name || recBiz?.legal_name || recP?.title || 'Doanh nghiệp Đối tác',
            receiverAvatar: recP?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(receiverName)}&background=0284c7&color=fff&bold=true`,
            status: uiStatus,
            meetingTime: item.responded_at
              ? new Date(item.responded_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
              : '14:30 - 15:00',
            tableNumber: 'Bàn B2B VIP',
            note: 'Trao đổi cơ hội giao thương B2B và biên bản ghi nhớ hợp tác (MOU).',
            createdAt: item.requested_at
              ? new Date(item.requested_at).toLocaleDateString('vi-VN')
              : 'Gần đây',
          };
        });
      }

      // 3. Query real businesses table joined with owners
      const { data: bizData } = await db
        .from('businesses')
        .select(`
          id,
          legal_name,
          display_name,
          industry,
          tax_code,
          website,
          logo_url,
          owner_identity_id,
          owner:person_identities!owner_identity_id(
            id,
            full_name,
            title,
            avatar_url,
            phone
          )
        `)
        .order('created_at', { ascending: false });

      if (bizData && bizData.length > 0) {
        companies = bizData.map((b: any) => {
          const owner = Array.isArray(b.owner) ? b.owner[0] : b.owner;
          const ownerName = owner?.full_name || b.legal_name;
          const companyName = b.display_name || b.legal_name;

          return {
            id: owner?.id || b.id,
            fullName: ownerName,
            phone: owner?.phone || '',
            avatarUrl: owner?.avatar_url || b.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(ownerName)}&background=0066FF&color=fff&bold=true`,
            company: companyName,
            position: owner?.title || 'Đại diện Doanh nghiệp',
            industry: b.industry || 'Thương mại & Dịch vụ',
            association: b.tax_code ? `MST: ${b.tax_code}` : 'Hội viên One Connect',
          };
        });
      }
    }
  } catch (error) {
    console.error('[MatchingPage Data Fetch Error]:', error);
  }

  return (
    <ToastProvider>
      <ErrorBoundary fallbackTitle="Không thể tải dữ liệu B2B Matchmaking">
        <B2BMatchmakingView
          initialMatchings={initialMatchings}
          companies={companies}
          aiCandidates={aiCandidates}
          currentUserId={currentUserId}
        />
      </ErrorBoundary>
    </ToastProvider>
  );
}
