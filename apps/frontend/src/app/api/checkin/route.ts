import { NextResponse } from 'next/server';
import { processFastCheckIn } from '@/lib/services/checkin';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventId, codeOrUid, method, scannedByUserId, gateLocation } = body;

    if (!eventId || !codeOrUid || !method) {
      return NextResponse.json(
        { success: false, error: 'Thiếu các trường bắt buộc (eventId, codeOrUid, method).' },
        { status: 400 }
      );
    }

    const result = await processFastCheckIn({
      eventId,
      codeOrUid,
      method,
      scannedByUserId,
      gateLocation,
    });

    return NextResponse.json(result, { status: result.success || result.isDuplicate ? 200 : 400 });
  } catch (error: any) {
    console.error('API Checkin error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi server xử lý check-in' },
      { status: 500 }
    );
  }
}
