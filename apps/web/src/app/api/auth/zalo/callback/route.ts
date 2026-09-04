import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://aybjbklbkrgoapakgnbs.supabase.co';
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const error = searchParams.get('error');
  const errorDesc = searchParams.get('error_description');
  const code = searchParams.get('code');

  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || '';
  const isLocal = host.includes('localhost') || host.includes('127.0.0.1');
  const origin = isLocal
    ? `http://${host}`
    : host.includes('www.oneconnect.id.vn')
      ? 'https://www.oneconnect.id.vn'
      : 'https://oneconnect.id.vn';

  if (error || !code) {
    console.error('Zalo OAuth callback error:', error, errorDesc);
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(errorDesc || error || 'Xác thực Zalo không thành công')}`,
        origin
      )
    );
  }

  const codeVerifier = req.cookies.get('zalo_code_verifier')?.value || '';
  const appId =
    process.env.ZALO_APP_ID ||
    process.env.NEXT_PUBLIC_ZALO_APP_ID ||
    '208082851799800309';
  const secretKey =
    process.env.ZALO_APP_SECRET || '99HkFGW7iYIB5cYWMLLY';

  try {
    // 1. Exchange authorization code for User Access Token
    const tokenRes = await fetch('https://oauth.zaloapp.com/v4/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        secret_key: secretKey,
      },
      body: new URLSearchParams({
        code,
        app_id: appId,
        grant_type: 'authorization_code',
        code_verifier: codeVerifier,
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      console.error('Zalo Token Exchange failed:', tokenData);
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent(tokenData.error_name || tokenData.error_description || 'Không nhận được Access Token từ Zalo')}`,
          origin
        )
      );
    }

    // 2. Fetch User Profile from Zalo Graph API
    const userRes = await fetch(
      'https://graph.zalo.me/v2.0/me?fields=id,name,picture',
      {
        headers: {
          access_token: tokenData.access_token,
        },
      }
    );

    const userData = await userRes.json();

    if (!userData.id) {
      console.error('Failed to fetch Zalo profile:', userData);
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent(userData.error_name || 'Không thể lấy thông tin tài khoản Zalo')}`,
          origin
        )
      );
    }

    const zaloId = userData.id;
    const zaloName = userData.name || 'Hội viên Zalo';
    const avatarUrl =
      userData.picture?.data?.url ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(zaloName)}&background=0068FF&color=fff&bold=true`;

    const cleanUsername = `zalo_${zaloId.slice(-6)}`;
    const userId = `usr_zalo_${zaloId}`;
    const email = `zalo_${zaloId}@oneconnect.id.vn`;

    // 3. Sync to Supabase Database (public.users)
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
          id: userId,
          email: email,
          full_name: zaloName,
          phone: null,
          role: 'MEMBER',
          created_at: new Date().toISOString(),
        }),
      });
    } catch (dbErr) {
      console.warn('Supabase DB sync note for Zalo user:', dbErr);
    }

    // 4. Redirect to callback page to sync local state
    const targetUrl = new URL('/auth/callback', origin);
    targetUrl.searchParams.set('provider', 'zalo');
    targetUrl.searchParams.set('name', zaloName);
    targetUrl.searchParams.set('id', userId);
    targetUrl.searchParams.set('user', cleanUsername);
    targetUrl.searchParams.set('avatar', avatarUrl);

    const response = NextResponse.redirect(targetUrl);

    // 5. Set session cookie for Middleware recognition
    response.cookies.set('one_connect_auth_session', userId, {
      path: '/',
      maxAge: 2592000, // 30 days
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    // Clear temporary code verifier cookie
    response.cookies.delete('zalo_code_verifier');

    return response;
  } catch (err: any) {
    console.error('Zalo OAuth processing error:', err);
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(err?.message || 'Lỗi kết nối máy chủ Zalo')}`,
        origin
      )
    );
  }
}
