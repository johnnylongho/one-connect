import { NextRequest, NextResponse } from 'next/server';
import { ZaloService } from '@/lib/services/zalo-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, payload } = body;

    if (!action || !payload) {
      return NextResponse.json(
        { error: 'Thiếu tham số action hoặc payload' },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'CHECKIN_ALERT':
        result = await ZaloService.triggerCheckinSuccessAlert(payload);
        break;

      case 'CONSENT_REQUEST':
        result = await ZaloService.triggerConsentRequestAlert(payload);
        break;

      case 'FOLLOWUP_REMINDER':
        result = await ZaloService.triggerFollowUpReminder(payload);
        break;

      case 'DIRECT_ZNS':
        result = await ZaloService.sendZns(payload);
        break;

      default:
        return NextResponse.json(
          { error: `Hành động action '${action}' không hợp lệ` },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Lỗi xử lý ZNS Gateway' },
      { status: 500 }
    );
  }
}
