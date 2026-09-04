import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aybjbklbkrgoapakgnbs.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const PROTECTED_IDS = [
  '11111111-1111-1111-1111-111111111111',
  'id-001',
  'usr-001',
];

const PROTECTED_EMAILS = [
  'contact.johnnylongho@gmail.com',
  'johnny@aplusvn.com',
];

/**
 * PATCH: Deactivate or Activate user
 * Body: { id: string, status: 'ACTIVE' | 'INACTIVE' }
 */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'User ID and status are required' }, { status: 400 });
    }

    if (PROTECTED_IDS.includes(id)) {
      return NextResponse.json(
        { success: false, error: 'Cannot deactivate Super Administrator account' },
        { status: 403 }
      );
    }

    // Update status in users table
    const updateRes = await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        status: status,
        updated_at: new Date().toISOString(),
      }),
    });

    if (!updateRes.ok) {
      const err = await updateRes.text();
      console.warn('Supabase users status update warning:', err);
    }

    return NextResponse.json({ success: true, id, status });
  } catch (error: any) {
    console.error('Admin users PATCH error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * DELETE: Permanently delete user and cascade related data
 * Body: { id: string }
 */
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    if (PROTECTED_IDS.includes(id)) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete Super Administrator account' },
        { status: 403 }
      );
    }

    // 1. Delete connections where user is requester or receiver
    await fetch(`${supabaseUrl}/rest/v1/connections?or=(requester_identity_id.eq.${id},receiver_identity_id.eq.${id})`, {
      method: 'DELETE',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    }).catch(console.warn);

    // 2. Delete access cards
    await fetch(`${supabaseUrl}/rest/v1/access_cards?person_identity_id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    }).catch(console.warn);

    // 3. Delete check-ins
    await fetch(`${supabaseUrl}/rest/v1/check_ins?person_identity_id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    }).catch(console.warn);

    // 4. Delete event registrations
    await fetch(`${supabaseUrl}/rest/v1/event_registrations?person_identity_id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    }).catch(console.warn);

    // 5. Delete person_identities
    await fetch(`${supabaseUrl}/rest/v1/person_identities?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    }).catch(console.warn);

    // 6. Delete from users table
    await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    }).catch(console.warn);

    // 7. Delete from Supabase Auth admin users if UUID format
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    if (isUuid) {
      await fetch(`${supabaseUrl}/auth/v1/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
      }).catch(console.warn);
    }

    return NextResponse.json({ success: true, id, message: 'User deleted successfully' });
  } catch (error: any) {
    console.error('Admin users DELETE error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
