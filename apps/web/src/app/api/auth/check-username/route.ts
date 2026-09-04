import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aybjbklbkrgoapakgnbs.supabase.co';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// System reserved words that cannot be used as personal usernames
const RESERVED_USERNAMES = new Set([
  'admin',
  'administrator',
  'root',
  'system',
  'support',
  'oneconnect',
  'yba',
  'yba-khanhhoa',
  'api',
  'auth',
  'login',
  'register',
  'dashboard',
  'settings',
  'demo',
  'events',
  'checkout',
  'card',
  'cards',
  'p',
  'c',
  'operator',
  'verify',
  'help',
  'null',
  'undefined',
]);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawUsername = searchParams.get('username')?.trim() || '';

    if (!rawUsername) {
      return NextResponse.json({
        available: false,
        error: 'Vui lòng cung cấp tên đăng nhập',
      }, { status: 400 });
    }

    const cleanUsername = rawUsername.toLowerCase();

    // 1. Format validation: only lowercase letters, digits, underscore, dot, or hyphen; 3-30 chars
    const isValidFormat = /^[a-z0-9][a-z0-9_.-]{1,28}[a-z0-9]$/.test(cleanUsername);
    if (!isValidFormat) {
      return NextResponse.json({
        available: false,
        username: cleanUsername,
        reason: 'Tên đăng nhập từ 3-30 ký tự, chỉ gồm chữ thường, số, dấu gạch dưới hoặc gạch ngang',
      });
    }

    // 2. Check reserved usernames
    if (RESERVED_USERNAMES.has(cleanUsername)) {
      return NextResponse.json({
        available: false,
        username: cleanUsername,
        reason: 'Tên đăng nhập này đã được hệ thống bảo lưu',
      });
    }

    // 3. Query Supabase for duplicate username in person_identities
    if (supabaseUrl && anonKey) {
      try {
        const checkRes = await fetch(
          `${supabaseUrl}/rest/v1/person_identities?or=(id.eq.${encodeURIComponent(cleanUsername)},display_name.eq.${encodeURIComponent(cleanUsername)})&select=id`,
          {
            headers: {
              apikey: anonKey,
              Authorization: `Bearer ${anonKey}`,
            },
          }
        );

        if (checkRes.ok) {
          const data = await checkRes.json();
          if (Array.isArray(data) && data.length > 0) {
            return NextResponse.json({
              available: false,
              username: cleanUsername,
              reason: 'Tên đăng nhập đã được sử dụng',
            });
          }
        }
      } catch (dbErr) {
        console.warn('Supabase check-username query warning:', dbErr);
      }
    }

    return NextResponse.json({
      available: true,
      username: cleanUsername,
      previewUrl: `oneconnect.id.vn/p/${cleanUsername}`,
      message: 'Tên đăng nhập khả dụng',
    });
  } catch (err: any) {
    console.error('Check username error:', err);
    return NextResponse.json({
      available: false,
      error: err?.message || 'Lỗi kiểm tra tên đăng nhập',
    }, { status: 500 });
  }
}
