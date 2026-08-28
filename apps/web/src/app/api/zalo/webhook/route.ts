import { NextRequest, NextResponse } from 'next/server';

/**
 * Zalo OpenAPI Webhook Handler
 * Nhận trạng thái giao tin ZNS, tương tác của người dùng trên Zalo OA và Mini App
 */
export async function GET(req: NextRequest) {
  // Xác thực Webhook Challenge từ Zalo for Developers
  const { searchParams } = new URL(req.url);
  const challenge = searchParams.get('challenge');
  const oaId = searchParams.get('oa_id');

  console.log(`[Zalo Webhook Verification] OA ID: ${oaId}, Challenge: ${challenge}`);

  if (challenge) {
    return new NextResponse(challenge, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  return NextResponse.json({ status: 'Zalo Webhook Ready', timestamp: new Date().toISOString() });
}

export async function POST(req: NextRequest) {
  try {
    const event = await req.json();
    console.log('[Zalo Webhook Event Received]:', JSON.stringify(event, null, 2));

    // Xử lý các sự kiện từ Zalo OA: user_send_text, user_submit_info, zns_delivery_status
    const eventName = event.event_name || event.event;

    switch (eventName) {
      case 'zns_delivery_status':
        console.log(`[ZNS Status]: Message ${event.msg_id} status is ${event.status}`);
        break;

      case 'user_send_text':
        console.log(`[Zalo Chat]: User ${event.sender?.id} sent: ${event.message?.text}`);
        break;

      case 'user_follow_oa':
        console.log(`[Zalo OA]: New follower: ${event.follower?.id}`);
        break;

      default:
        console.log(`[Zalo Event Ignored]: ${eventName}`);
    }

    return NextResponse.json({ success: true, received: true });
  } catch (err: any) {
    console.error('[Zalo Webhook Error]:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
