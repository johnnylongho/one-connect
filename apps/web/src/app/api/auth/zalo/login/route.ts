import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  const appId =
    process.env.ZALO_APP_ID ||
    process.env.NEXT_PUBLIC_ZALO_APP_ID ||
    '208082851799800309';

  const host = req.headers.get('host') || '';
  const isLocal = host.includes('localhost') || host.includes('127.0.0.1');
  const redirectUri = isLocal
    ? `http://${host}/api/auth/zalo/callback`
    : 'https://oneconnect.id.vn/api/auth/zalo/callback';

  // PKCE Code Verifier: 43 characters Base64URL string
  const codeVerifier = crypto.randomBytes(32).toString('base64url');
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');

  const state = crypto.randomBytes(16).toString('hex');

  const zaloAuthUrl = new URL('https://oauth.zaloapp.com/v4/permission');
  zaloAuthUrl.searchParams.set('app_id', appId);
  zaloAuthUrl.searchParams.set('redirect_uri', redirectUri);
  zaloAuthUrl.searchParams.set('code_challenge', codeChallenge);
  zaloAuthUrl.searchParams.set('state', state);

  const response = NextResponse.redirect(zaloAuthUrl.toString());

  // Store verifier in temporary cookie for callback exchange
  response.cookies.set('zalo_code_verifier', codeVerifier, {
    path: '/',
    httpOnly: true,
    maxAge: 600,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  return response;
}
