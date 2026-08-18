import { NextResponse } from 'next/server';
import { DbService } from '@/lib/db-service';

// Mock OTP storage for simulation / passwordless login
const OTP_STORE: Record<string, { code: string; expiresAt: number }> = {
  'contact.johnnylongho@gmail.com': { code: '888888', expiresAt: Date.now() + 1000 * 60 * 60 },
  '0794677369': { code: '888888', expiresAt: Date.now() + 1000 * 60 * 60 },
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { emailOrPhone, action, code } = body;

    if (!emailOrPhone) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng cung cấp Email hoặc Số điện thoại.' },
        { status: 400 }
      );
    }

    const cleanInput = emailOrPhone.trim().toLowerCase();

    // 1. GỬI MÃ OTP / MAGIC LINK
    if (action === 'SEND') {
      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      OTP_STORE[cleanInput] = {
        code: cleanInput === 'contact.johnnylongho@gmail.com' || cleanInput === '0794677369' ? '888888' : generatedCode,
        expiresAt: Date.now() + 5 * 60 * 1000, // 5 phút
      };

      await DbService.logAudit({
        actorUserId: 'system',
        actorName: 'Auth System',
        action: 'OTP_REQUESTED',
        objectType: 'AUTH',
        objectId: cleanInput,
        ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
      });

      return NextResponse.json({
        success: true,
        message: `Mã OTP đã được gửi đến ${emailOrPhone}! (Mã thử nghiệm: ${OTP_STORE[cleanInput].code})`,
        demoCode: OTP_STORE[cleanInput].code,
      });
    }

    // 2. XÁC THỰC MÃ OTP
    if (action === 'VERIFY') {
      const record = OTP_STORE[cleanInput];
      if (!record || record.code !== code) {
        // Cho phép 888888 là master code cho test
        if (code !== '888888') {
          return NextResponse.json(
            { success: false, message: 'Mã xác thực OTP không đúng hoặc đã hết hạn.' },
            { status: 401 }
          );
        }
      }

      // Tra cứu tài khoản tương ứng
      let identity = await DbService.getIdentity('usr-001');

      return NextResponse.json({
        success: true,
        message: 'Xác thực đăng nhập thành công!',
        user: {
          id: identity?.userId || 'usr-001',
          email: cleanInput.includes('@') ? cleanInput : identity?.email,
          phone: !cleanInput.includes('@') ? cleanInput : identity?.phone,
          identity,
        },
        token: `oneconnect_token_${Date.now()}`,
      });
    }

    return NextResponse.json(
      { success: false, message: 'Hành động không hợp lệ (hỗ trợ SEND hoặc VERIFY).' },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Lỗi xử lý xác thực OTP.' },
      { status: 500 }
    );
  }
}
