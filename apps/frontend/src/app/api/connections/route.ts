import { NextResponse } from 'next/server';
import { getConnectionsForIdentity, respondToConnection } from '@/lib/services/connections';
import { MatchingService } from '@/lib/services/matching-service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
  return NextResponse.json(
    { success: true, ...data },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { connectionId, status, requesterIdentityId, receiverIdentityId, eventId, note } = body;

    // 1. Create connection flow
    if (requesterIdentityId && receiverIdentityId) {
      const result = await MatchingService.createMatchRequest({
        requesterIdentityId,
        receiverIdentityId,
        eventId,
        note,
      });
      return NextResponse.json(result, { status: result.success ? 200 : 400 });
    }

    // 2. Respond to connection flow
    if (!connectionId || !['ACCEPTED', 'DECLINED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Dữ liệu không hợp lệ (connectionId, status: ACCEPTED | DECLINED | REJECTED).' },
        { status: 400 }
      );
    }

    const normalizedStatus = status === 'DECLINED' ? 'REJECTED' : (status as 'ACCEPTED' | 'REJECTED');
    const result = await MatchingService.respondMatchRequest(connectionId, normalizedStatus);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi xử lý phản hồi kết nối.' },
      { status: 500 }
    );
  }
}
