import { NextResponse } from 'next/server';
import { dispatchAutomationWebhook, getRecentWebhookLogs } from '@/lib/services/automation';

export async function GET() {
  const logs = getRecentWebhookLogs();
  return NextResponse.json({
    success: true,
    totalLogs: logs.length,
    logs,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventType, data } = body;

    if (!eventType || !data) {
      return NextResponse.json(
        { success: false, error: 'Thiếu trường eventType hoặc data' },
        { status: 400 }
      );
    }

    const log = await dispatchAutomationWebhook(eventType, data);
    return NextResponse.json({ success: true, log });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi điều phối webhook' },
      { status: 500 }
    );
  }
}
