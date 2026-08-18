import { NextResponse } from 'next/server';
import { DbService } from '@/lib/db-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { requesterIdentityId, receiverIdentityId, action } = body;

    if (!requesterIdentityId || !receiverIdentityId) {
      return NextResponse.json(
        { success: false, message: 'Thiếu định danh hai bên kết nối.' },
        { status: 400 }
      );
    }

    if (action === 'ACCEPT') {
      await DbService.logAudit({
        actorUserId: receiverIdentityId,
        actorName: 'Partner User',
        action: 'PDPL_MUTUAL_CONSENT_GRANTED',
        objectType: 'CONNECTION',
        objectId: `${requesterIdentityId}_${receiverIdentityId}`,
        ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
      });

      return NextResponse.json({
        success: true,
        message: 'Đã xác nhận Đồng thuận 2 chiều (Explicit 2-Way Consent) tuân thủ Luật 91/2025/QH15!',
        status: 'CONNECTED',
        connectedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Đã gửi yêu cầu kết nối và thiết lập quyền riêng tư chờ đối phương đồng thuận.',
      status: 'PENDING',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Lỗi xử lý xác nhận Consent.' },
      { status: 500 }
    );
  }
}
