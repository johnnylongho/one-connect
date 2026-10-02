import { NextResponse } from 'next/server';
import { DbService } from '@/lib/db-service';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Thiếu định danh hồ sơ.' },
        { status: 400 }
      );
    }

    const identity = await DbService.getIdentity(id);

    if (!identity) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy hồ sơ người dùng.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: identity,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Lỗi lấy thông tin hồ sơ.' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const updates = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Thiếu định danh hồ sơ.' },
        { status: 400 }
      );
    }

    const updatedIdentity = await DbService.updateIdentity(id, updates);

    if (!updatedIdentity) {
      return NextResponse.json(
        { success: false, message: 'Không thể cập nhật hồ sơ.' },
        { status: 404 }
      );
    }

    // Log Audit
    await DbService.logAudit({
      actorUserId: id,
      actorName: updatedIdentity.fullName,
      action: 'IDENTITY_PROFILE_UPDATED',
      objectType: 'PERSON_IDENTITY',
      objectId: updatedIdentity.id,
      ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
    });

    return NextResponse.json({
      success: true,
      message: 'Đã cập nhật hồ sơ thành công!',
      data: updatedIdentity,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Lỗi cập nhật hồ sơ.' },
      { status: 500 }
    );
  }
}
