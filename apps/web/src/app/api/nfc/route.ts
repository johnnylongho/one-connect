import { NextResponse } from 'next/server';
import { DbService } from '@/lib/db-service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cardUid = searchParams.get('cardUid');

  if (!cardUid) {
    return NextResponse.json(
      { success: false, error: 'Thiếu tham số cardUid' },
      { status: 400 }
    );
  }

  const { card, identity } = await DbService.resolveCardUid(cardUid);

  if (!card) {
    return NextResponse.json({
      success: false,
      error: 'Thẻ NFC chưa được đăng ký hoặc không tồn tại.',
      cardUid,
    }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    cardUid,
    status: card.status,
    cardType: card.cardType,
    matchedIdentity: identity ? {
      id: identity.id,
      username: identity.username,
      fullName: identity.fullName,
      displayName: identity.displayName,
      title: identity.title,
      company: identity.businesses?.[0]?.businessName || 'Doanh Nghiệp Đổi Mới Sáng Tạo',
      avatarUrl: identity.avatarUrl,
      profileUrl: `https://oneconnect.network/p/${identity.username}`,
    } : null,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cardUid, readerDeviceId, eventId } = body;

    if (!cardUid) {
      return NextResponse.json(
        { success: false, message: 'Thiếu tham số cardUid' },
        { status: 400 }
      );
    }

    const { card, identity } = await DbService.resolveCardUid(cardUid);

    if (!card || card.status === 'REVOKED') {
      return NextResponse.json({
        success: false,
        message: 'Thẻ NFC đã bị khóa hoặc không hợp lệ!',
        isBlocked: true,
      }, { status: 403 });
    }

    // Log Audit sub-second tap
    await DbService.logAudit({
      actorUserId: identity?.userId || 'guest',
      actorName: identity?.fullName || 'Anonymous Tap',
      action: 'NFC_CARD_TAPPED',
      objectType: 'ACCESS_CARD',
      objectId: card.id,
      ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
    });

    return NextResponse.json({
      success: true,
      message: 'Chạm thẻ NFC thành công (<0.42s)!',
      card,
      identity,
      actionUrl: identity ? `/p/${identity.username}` : `/c/${cardUid}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Lỗi xử lý chạm thẻ NFC.' },
      { status: 500 }
    );
  }
}
