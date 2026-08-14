import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cardUid = searchParams.get('cardUid');

  if (!cardUid) {
    return NextResponse.json(
      { success: false, error: 'Thiếu tham số cardUid' },
      { status: 400 }
    );
  }

  // Mock lookup database record for NFC card UID
  return NextResponse.json({
    success: true,
    cardUid,
    status: 'ACTIVE',
    matchedIdentity: {
      fullName: 'Johnny Long Hồ',
      title: 'Project Manager kiêm Media',
      company: 'Aplusvn',
      avatarUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
    timestamp: new Date().toISOString(),
  });
}
