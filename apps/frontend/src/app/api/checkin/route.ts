import { NextResponse } from 'next/server';
import { processFastCheckIn } from '@/lib/services/checkin';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const reqStart = performance.now();
  try {
    const body = await request.json();
    const { eventId, codeOrUid, method, scannedByUserId, gateLocation } = body;

    if (!eventId || !codeOrUid || !method) {
      return NextResponse.json(
        { success: false, error: 'Thiếu các trường bắt buộc (eventId, codeOrUid, method).' },
        { 
          status: 400,
          headers: {
            'Cache-Control': 'no-store, max-age=0',
          }
        }
      );
    }

    const result = await processFastCheckIn({
      eventId,
      codeOrUid,
      method,
      scannedByUserId,
      gateLocation,
    });

    const totalDur = Math.round(performance.now() - reqStart);

    return NextResponse.json(result, { 
      status: result.success || result.isDuplicate ? 200 : 400,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Server-Timing': `checkin;dur=${result.latencyMs}, total;dur=${totalDur}`,
        'X-Response-Time': `${totalDur}ms`,
      }
    });
  } catch (error: any) {
    console.error('[API Checkin Exception]:', error);
    const totalDur = Math.round(performance.now() - reqStart);
    return NextResponse.json(
      { success: false, error: error?.message || 'Lỗi server xử lý check-in' },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
          'Server-Timing': `error;dur=${totalDur}`,
        }
      }
    );
  }
}
