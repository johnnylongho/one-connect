import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aybjbklbkrgoapakgnbs.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ownerIdentityId, guestName, guestPhone, guestCompany, guestNote } = body;

    if (!ownerIdentityId || !guestName || !guestPhone) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng điền đủ Họ tên và Số điện thoại' },
        { status: 400 }
      );
    }

    const guestId = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : `${Math.random().toString(16).slice(2, 10)}-0000-4000-8000-${Date.now().toString(16).padStart(12, '0')}`;

    const guestAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(guestName)}&background=0284c7&color=fff&bold=true`;

    // 1. Insert guest into person_identities
    const { error: pErr } = await supabaseAdmin.from('person_identities').insert({
      id: guestId,
      full_name: guestName,
      phone: guestPhone,
      title: guestCompany || 'Đối tác chạm thẻ NFC',
      bio: guestNote || 'Khách chạm thẻ NFC và gửi danh thiếp.',
      avatar_url: guestAvatar,
    });

    if (pErr) {
      console.warn('Supabase Admin person_identities error:', pErr);
    }

    // 2. Insert into connections with status PENDING
    const { data: conn, error: cErr } = await supabaseAdmin.from('connections').insert({
      requester_identity_id: guestId,
      receiver_identity_id: ownerIdentityId,
      status: 'PENDING',
      requested_at: new Date().toISOString(),
    }).select().single();

    if (cErr) {
      console.warn('Supabase Admin connections error:', cErr);
    }

    // 3. Insert lead
    if (conn) {
      await supabaseAdmin.from('leads').insert({
        connection_id: conn.id,
        owner_identity_id: ownerIdentityId,
        status: 'HOT',
        next_action: `Gọi điện / Zalo: ${guestPhone}`,
      });
    }

    return NextResponse.json({
      success: true,
      connectionId: conn?.id || guestId,
      guestId,
    });
  } catch (error: any) {
    console.error('API /api/connections/exchange error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi server' },
      { status: 500 }
    );
  }
}
