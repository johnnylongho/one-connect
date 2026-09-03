import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aybjbklbkrgoapakgnbs.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, username, email, phone, password, fullName, title, businessName, cardUid } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email là bắt buộc' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username?.trim().toLowerCase() || `user_${Date.now()}`;
    const cleanPassword = password || 'OneConnect@2026';
    const userId = id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `usr_${Date.now()}`);

    // 1. Create User in Supabase Auth via Admin API
    let authUser = null;
    try {
      const authRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        body: JSON.stringify({
          email: cleanEmail,
          password: cleanPassword,
          email_confirm: true,
          user_metadata: {
            username: cleanUsername,
            full_name: fullName || cleanUsername,
            phone: phone || null,
            role: 'MEMBER',
            business_name: businessName || null,
          },
        }),
      });

      if (authRes.ok) {
        authUser = await authRes.json();
      } else {
        const errText = await authRes.text();
        console.warn('Supabase Auth user create warning (may already exist):', errText);
      }
    } catch (authErr) {
      console.warn('Supabase Auth network warning:', authErr);
    }

    const finalUserId = authUser?.id || userId;

    // 2. Insert into public.users table
    try {
      await fetch(`${supabaseUrl}/rest/v1/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          Prefer: 'resolution=merge-duplicates',
        },
        body: JSON.stringify({
          id: finalUserId,
          email: cleanEmail,
          phone: phone || null,
          auth_provider: 'email_password',
          status: 'ACTIVE',
        }),
      });
    } catch (uErr) {
      console.warn('users table sync warning:', uErr);
    }

    // 3. Insert into public.person_identities table
    try {
      await fetch(`${supabaseUrl}/rest/v1/person_identities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          Prefer: 'resolution=merge-duplicates',
        },
        body: JSON.stringify({
          id: finalUserId,
          user_id: finalUserId,
          full_name: fullName || cleanUsername,
          display_name: fullName || cleanUsername,
          title: title || 'Hội Viên Doanh Nghiệp',
          email: cleanEmail,
          phone: phone || null,
          bio: `Đại diện ${businessName || 'Doanh nghiệp'} - Hội Viên One Connect Network`,
        }),
      });
    } catch (pErr) {
      console.warn('person_identities table sync warning:', pErr);
    }

    // 4. Insert into access_cards table
    if (cardUid) {
      try {
        await fetch(`${supabaseUrl}/rest/v1/access_cards`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: serviceRoleKey,
            Authorization: `Bearer ${serviceRoleKey}`,
            Prefer: 'resolution=merge-duplicates',
          },
          body: JSON.stringify({
            card_uid: cardUid,
            person_identity_id: finalUserId,
            card_type: 'NFC_BUSINESS_PRO',
            status: 'ACTIVE',
          }),
        });
      } catch (cErr) {
        console.warn('access_cards sync warning:', cErr);
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: finalUserId,
        username: cleanUsername,
        email: cleanEmail,
        fullName,
        role: 'MEMBER',
      },
    });
  } catch (err: any) {
    console.error('API register error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Lỗi đăng ký tài khoản' }, { status: 500 });
  }
}
