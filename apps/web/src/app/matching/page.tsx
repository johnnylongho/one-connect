import React from 'react';
import { B2BMatchmakingView, MatchingRequest } from '@/components/matching/b2b-matchmaking';
import { ToastProvider } from '@/components/ui/toast';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'B2B Matchmaking - Kết Nối Doanh Nghiệp | One Connect',
  description: 'Tính năng quản lý và xếp bàn hẹn giao thương 1:1 B2B giữa các doanh nghiệp tại sự kiện.',
};

export default async function MatchingPage() {
  let initialMatchings: MatchingRequest[] | undefined = undefined;

  try {
    const supabase = await createClient();

    // Query business_matching records joined with users
    const { data } = await supabase
      .from('business_matching')
      .select(`
        id,
        event_id,
        sender_user_id,
        receiver_user_id,
        status,
        meeting_time,
        table_number,
        created_at,
        sender:users!business_matching_sender_user_id_fkey(
          id,
          full_name,
          avatar_url
        ),
        receiver:users!business_matching_receiver_user_id_fkey(
          id,
          full_name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false });

    if (data && data.length > 0) {
      initialMatchings = data.map((item: any) => ({
        id: item.id,
        eventId: item.event_id,
        senderId: item.sender_user_id,
        senderName: item.sender?.full_name || 'Đại biểu Doanh nhân',
        senderCompany: 'Doanh nghiệp Hội viên',
        senderAvatar: item.sender?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        receiverId: item.receiver_user_id,
        receiverName: item.receiver?.full_name || 'Đối tác B2B',
        receiverCompany: 'Doanh nghiệp Đối tác',
        receiverAvatar: item.receiver?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
        status: item.status,
        meetingTime: item.meeting_time
          ? new Date(item.meeting_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
          : '14:30 - 15:00',
        tableNumber: item.table_number || 'Bàn B2B-01',
        note: 'Trao đổi hợp tác chiến lược và giao thương sản phẩm dịch vụ',
        createdAt: item.created_at
          ? new Date(item.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
          : 'Gần đây',
      }));
    }
  } catch (error) {
    // Offline preview fallback
  }

  return (
    <ToastProvider>
      <B2BMatchmakingView initialMatchings={initialMatchings} />
    </ToastProvider>
  );
}
