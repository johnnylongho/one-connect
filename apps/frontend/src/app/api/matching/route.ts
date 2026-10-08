import { NextResponse } from 'next/server';
import { MatchingService } from '@/lib/services/matching-service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  const startTime = performance.now();
  const { searchParams } = new URL(request.url);
  const identityId = searchParams.get('identityId') || '11111111-1111-1111-1111-111111111111';
  const eventId = searchParams.get('eventId') || 'ea111111-1111-1111-1111-111111111111';

  try {
    const { candidates, latencyMs } = await MatchingService.getMatchmakingCandidates(identityId, eventId);
    const totalLatency = Math.round(performance.now() - startTime);

    return NextResponse.json(
      {
        success: true,
        count: candidates.length,
        candidates,
        latencyMs: totalLatency,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
          'Server-Timing': `matching;dur=${totalLatency}`,
          'X-Response-Time': `${totalLatency}ms`,
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi xử lý thuật toán AI Matchmaking' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const startTime = performance.now();
  try {
    const body = await request.json();
    const { action = 'CREATE_REQUEST', ...params } = body;

    if (action === 'CREATE_REQUEST') {
      const { requesterIdentityId, receiverIdentityId, eventId, meetingTime, tableNumber, note } = params;

      if (!requesterIdentityId || !receiverIdentityId) {
        return NextResponse.json(
          { success: false, error: 'Thiếu định danh đại biểu gửi hoặc nhận' },
          { status: 400 }
        );
      }

      const result = await MatchingService.createMatchRequest({
        requesterIdentityId,
        receiverIdentityId,
        eventId,
        meetingTime,
        tableNumber,
        note,
      });

      const totalLatency = Math.round(performance.now() - startTime);
      return NextResponse.json(
        { ...result, latencyMs: totalLatency },
        {
          status: result.success ? 200 : 400,
          headers: {
            'Server-Timing': `match_create;dur=${totalLatency}`,
            'X-Response-Time': `${totalLatency}ms`,
          },
        }
      );
    }

    if (action === 'RESPOND_REQUEST') {
      const { connectionId, status } = params;

      if (!connectionId || !['ACCEPTED', 'REJECTED'].includes(status)) {
        return NextResponse.json(
          { success: false, error: 'Dữ liệu phản hồi không hợp lệ' },
          { status: 400 }
        );
      }

      const result = await MatchingService.respondMatchRequest(connectionId, status);
      const totalLatency = Math.round(performance.now() - startTime);

      return NextResponse.json(
        { ...result, latencyMs: totalLatency },
        {
          status: result.success ? 200 : 400,
          headers: {
            'Server-Timing': `match_respond;dur=${totalLatency}`,
            'X-Response-Time': `${totalLatency}ms`,
          },
        }
      );
    }

    return NextResponse.json(
      { success: false, error: `Hành động ${action} không được hỗ trợ` },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi máy chủ' },
      { status: 500 }
    );
  }
}
