import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import nodemailer from 'nodemailer';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Gmail SMTP Transporter (Alternative Free Option)
const gmailUser = process.env.GMAIL_USER || process.env.SMTP_USER;
const gmailPass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASSWORD;

const smtpTransporter = (gmailUser && gmailPass)
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    })
  : null;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, fullName, otp, type } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email là bắt buộc' }, { status: 400 });
    }

    const otpCode = otp || Math.floor(100000 + Math.random() * 900000).toString();
    const recipientName = fullName || 'Quý Doanh Nhân';
    const isRegister = type === 'register';

    const subject = isRegister
      ? `[ONE CONNECT] Mã xác thực kích hoạt tài khoản: ${otpCode}`
      : `[ONE CONNECT] Mã OTP đăng nhập bảo mật: ${otpCode}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #070A12; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #F1F5F9;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #070A12; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="100%" max-width="560" border="0" cellspacing="0" cellpadding="0" style="max-width: 560px; background-color: #0F172A; border-radius: 24px; border: 1px solid #1E293B; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
                <!-- Header -->
                <tr>
                  <td style="padding: 36px 36px 20px 36px; text-align: center; background: linear-gradient(180deg, rgba(0, 102, 255, 0.15) 0%, rgba(15, 23, 42, 0) 100%);">
                    <div style="font-size: 24px; font-weight: 900; letter-spacing: 1px; color: #FFFFFF; font-family: 'Segoe UI', sans-serif;">
                      ONE<span style="color: #00C2FF;">CONNECT</span>
                    </div>
                    <div style="font-size: 11px; font-weight: 700; color: #94A3B8; letter-spacing: 2px; text-transform: uppercase; margin-top: 6px;">
                      Hệ Sinh Thái Danh Thiếp Số & Giao Thương B2B
                    </div>
                  </td>
                </tr>

                <!-- Content Body -->
                <tr>
                  <td style="padding: 20px 36px 36px 36px;">
                    <p style="font-size: 16px; line-height: 24px; color: #F8FAFC; margin: 0 0 16px 0;">
                      Kính gửi <strong>${recipientName}</strong>,
                    </p>
                    <p style="font-size: 14px; line-height: 22px; color: #94A3B8; margin: 0 0 24px 0;">
                      ${isRegister ? 'Cảm ơn bạn đã đăng ký gia nhập Hệ sinh thái One Connect Network. Dưới đây là mã xác thực OTP 6 số để kích hoạt danh tính số và thẻ NFC của bạn:' : 'Bạn vừa yêu cầu mã xác thực đăng nhập bảo mật vào hệ thống One Connect. Dưới đây là mã OTP 6 số của bạn:'}
                    </p>

                    <!-- OTP Box -->
                    <div style="background-color: #070A12; border: 1px solid #0066FF; border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 24px; box-shadow: 0 0 20px rgba(0, 102, 255, 0.2);">
                      <div style="font-size: 11px; font-weight: 800; color: #00C2FF; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px;">
                        MÃ XÁC THỰC BẢO MẬT (OTP)
                      </div>
                      <div style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #FFFFFF; font-family: Courier, monospace;">
                        ${otpCode}
                      </div>
                      <div style="font-size: 12px; color: #64748B; margin-top: 8px;">
                        Hiệu lực trong vòng <strong>5 phút</strong> • Không chia sẻ cho người khác
                      </div>
                    </div>

                    <!-- Security Alert -->
                    <div style="background-color: rgba(234, 179, 8, 0.1); border-left: 4px solid #EAB308; padding: 12px 16px; border-radius: 8px; margin-bottom: 24px;">
                      <p style="font-size: 12px; line-height: 18px; color: #FDE047; margin: 0;">
                        <strong>Bảo mật thông tin:</strong> Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email hoặc liên hệ ngay hotline <strong>0794.677.369</strong> để được hỗ trợ.
                      </p>
                    </div>

                    <p style="font-size: 13px; line-height: 20px; color: #64748B; margin: 0;">
                      Trân trọng,<br>
                      <strong style="color: #94A3B8;">Ban Quản Trị Hệ Sinh Thái One Connect</strong>
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 20px 36px; background-color: #070A12; border-top: 1px solid #1E293B; text-align: center;">
                    <p style="font-size: 11px; color: #475569; margin: 0 0 6px 0;">
                      © 2026 One Connect Network • Tuân thủ Nghị định 91/2025/NĐ-CP về Bảo vệ Dữ liệu Cá nhân
                    </p>
                    <p style="font-size: 11px; color: #334155; margin: 0;">
                      Tầng 8, Tòa nhà ASIA, 25 Lê Lợi, TP. Nha Trang, Tỉnh Khánh Hòa
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // 1. OPTION 1: Send via Gmail SMTP (Direct from your personal/work Gmail)
    if (smtpTransporter && gmailUser) {
      try {
        await smtpTransporter.sendMail({
          from: `"One Connect Network" <${gmailUser}>`,
          to: email,
          subject,
          html: htmlContent,
        });

        return NextResponse.json({
          success: true,
          delivered: true,
          provider: 'GMAIL_SMTP',
          otp: otpCode,
          message: `Mã OTP đã được gửi thành công từ ${gmailUser} đến ${email}`,
        });
      } catch (smtpErr: any) {
        console.error('SMTP send error:', smtpErr);
      }
    }

    // 2. OPTION 2: Send via Resend API
    if (resend) {
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'One Connect <onboarding@resend.dev>';
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: [email],
        subject,
        html: htmlContent,
      });

      if (error) {
        console.error('Resend email error:', error);
        return NextResponse.json({
          success: true,
          delivered: false,
          otp: otpCode,
          message: 'Lỗi gửi qua Resend (Cần kiểm tra API Key hoặc Domain)',
          resendError: error.message,
        });
      }

      return NextResponse.json({
        success: true,
        delivered: true,
        provider: 'RESEND',
        otp: otpCode,
        message: `Mã OTP đã được gửi thành công qua Resend đến ${email}`,
        data,
      });
    }

    // 3. Fallback when neither key is configured yet
    return NextResponse.json({
      success: true,
      delivered: false,
      otp: otpCode,
      message: `Đã sinh mã OTP: ${otpCode}. (Chưa cấu hình RESEND_API_KEY hoặc GMAIL_APP_PASSWORD)`,
    });
  } catch (err: any) {
    console.error('API send-otp error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Lỗi gửi email OTP' }, { status: 500 });
  }
}
