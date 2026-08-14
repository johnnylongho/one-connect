import { NextResponse } from 'next/server';
import { getConnectionsForIdentity, respondToConnection } from '@/lib/services/connections';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const identityId = searchParams.get('identityId');

  if (!identityId) {
    return NextResponse.json(
      { success: false, error: 'Thiếu tham số identityId' },
      { status: 400 }
    );
  }

  const data = await getConnectionsForIdentity(identityId);
  return NextResponse.json({ success: true, ...data });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { connectionId, status } = body;

    if (!connectionId || !['ACCEPTED', 'DECLINED'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Dữ liệu không hợp lệ (connectionId, status: ACCEPTED | DECLINED).' },
        { status: 400 }
      );
    }

    const ok = await respondToConnection(connectionId, status);
    return NextResponse.json({ success: ok });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi xử lý phản hồi kết nối.' },
      { status: 500 }
    );
  }
}
