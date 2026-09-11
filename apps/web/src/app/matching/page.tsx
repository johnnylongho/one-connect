import React from 'react';
import { B2BMatchmakingView, MatchingRequest, BusinessUser } from '@/components/matching/b2b-matchmaking';
import { ToastProvider } from '@/components/ui/toast';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'B2B Matchmaking - Kết Nối Doanh Nghiệp | One Connect',
  description: 'Tính năng quản lý và xếp bàn hẹn giao thương 1:1 B2B giữa các doanh nghiệp tại sự kiện.',
};

export default async function MatchingPage() {
  let initialMatchings: MatchingRequest[] = [];
  let companies: BusinessUser[] = [];

  try {
    const supabase = await createClient();

    // 1. Query real connections from Supabase
    const { data: connData } = await supabase
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
          phone
        ),
        receiver:person_identities!receiver_identity_id(
          id,
          full_name,
          title,
          avatar_url,
          phone
        )
      `)
      .order('requested_at', { ascending: false });

    if (connData && connData.length > 0) {
      initialMatchings = connData.map((item: any) => {
        const reqP = Array.isArray(item.requester) ? item.requester[0] : item.requester;
        const recP = Array.isArray(item.receiver) ? item.receiver[0] : item.receiver;
        const uiStatus: 'pending' | 'accepted' | 'rejected' =
          item.status === 'ACCEPTED' ? 'accepted' : item.status === 'REJECTED' ? 'rejected' : 'pending';

        return {
          id: item.id,
          eventId: item.event_id || 'ea111111-1111-1111-1111-111111111111',
          senderId: item.requester_identity_id,
          senderName: reqP?.full_name || 'Đại biểu Doanh nhân',
          senderCompany: reqP?.title || 'Doanh nghiệp Hội viên',
          senderAvatar: reqP?.avatar_url || '/avatar-johnny-long.jpg',
          receiverId: item.receiver_identity_id,
          receiverName: recP?.full_name || 'Đối tác B2B',
          receiverCompany: recP?.title || 'Doanh nghiệp Đối tác',
          receiverAvatar: recP?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(recP?.full_name || 'Partner')}&background=0284c7&color=fff`,
          status: uiStatus,
          meetingTime: item.responded_at
            ? new Date(item.responded_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
            : '14:30 - 15:00',
          tableNumber: 'Bàn B2B VIP',
          note: 'Trao đổi cơ hội giao thương B2B và ký kết biên bản ghi nhớ hợp tác (MOU).',
          createdAt: item.requested_at
            ? new Date(item.requested_at).toLocaleDateString('vi-VN')
            : 'Gần đây',
        };
      });
    }

    // 2. Query real person_identities for available business partners
    const { data: identData } = await supabase
      .from('person_identities')
      .select('id, full_name, phone, avatar_url, title, bio')
      .order('created_at', { ascending: false });

    if (identData && identData.length > 0) {
      companies = identData.map((p: any) => ({
        id: p.id,
        fullName: p.full_name,
        phone: p.phone || '0901234567',
        avatarUrl: p.avatar_url || (p.id === '11111111-1111-1111-1111-111111111111' ? '/avatar-johnny-long.jpg' : `https://ui-avatars.com/api/?name=${encodeURIComponent(p.full_name)}&background=0284c7&color=fff&bold=true`),
        company: p.title || 'Hội Viên Doanh Nghiệp',
        position: p.title || 'Đại Diện Doanh Nghiệp',
        industry: p.bio || 'Công nghệ & Thương mại B2B',
        association: 'Hiệp hội Doanh nhân Công nghệ Aplusvn',
      }));
    }
  } catch (error) {
    console.warn('MatchingPage fetch error:', error);
  }

  return (
    <ToastProvider>
      <B2BMatchmakingView initialMatchings={initialMatchings} companies={companies} />
    </ToastProvider>
  );
}
