import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import nodemailer from 'nodemailer';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const rawGmailUser = process.env.GMAIL_USER || process.env.SMTP_USER;
const rawGmailPass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASSWORD;
const gmailUser = rawGmailUser?.trim();
const gmailPass = rawGmailPass ? rawGmailPass.replace(/\s+/g, '') : undefined;

const smtpTransporter = (gmailUser && gmailPass)
  ? nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })
  : null;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, fullName, title, businessName, profileUrl } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email là bắt buộc' }, { status: 400 });
    }

    const recipientName = fullName || 'Quý Doanh Nhân';
    const memberTitle = title || 'Giám Đốc Doanh Nghiệp';
    const company = businessName || 'Doanh Nghiệp Hội Viên';
    const cardLink = profileUrl || `https://one-connect-network.vercel.app/p/johnnylongho`;

    const subject = `Chào mừng Quý Doanh nhân ${recipientName} gia nhập Hệ sinh thái One Connect Network!`;

    const textContent = `
THƯ CHÀO MỪNG TÂN HỘI VIÊN - ONE CONNECT NETWORK
-------------------------------------------------
Kính gửi Quý Doanh nhân ${recipientName},

Ban Quản Trị Hệ sinh thái One Connect Network trân trọng chúc mừng Quý Doanh nhân đã kích hoạt thành công Danh Thiếp Số Định Danh & Thẻ NFC Doanh Nghiệp!

THÔNG TIN HỒ SƠ ĐỊNH DANH SỐ:
- Họ và tên: ${recipientName}
- Chức vụ: ${memberTitle}
- Doanh nghiệp: ${company}
- Đường link Danh thiếp Live: ${cardLink}

HƯỚNG DẪN 3 BƯỚC BẮT ĐẦU GIAO THƯƠNG:
1. Mở đường link danh thiếp của bạn trên điện thoại để kiểm tra hồ sơ.
2. Tại các sự kiện kết nối B2B, chạm nhẹ thẻ NFC hoặc đưa mã QR cho đối tác quét.
3. Đối tác có thể bấm "Lưu Danh Bạ" để lưu ngay thông tin của bạn vào điện thoại của họ trong 1 giây.

Trân trọng,
Ban Quản Trị Hệ Sinh Thái One Connect Network
Tầng 8, Tòa nhà ASIA, 25 Lê Lợi, TP. Nha Trang, Tỉnh Khánh Hòa
Hotline: 0794.677.369 | Website: https://one-connect-network.vercel.app
    `.trim();

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
              <table width="100%" max-width="580" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #0F172A; border-radius: 24px; border: 1px solid #1E293B; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
                <!-- Header -->
                <tr>
                  <td style="padding: 36px 36px 20px 36px; text-align: center; background: linear-gradient(180deg, rgba(0, 102, 255, 0.2) 0%, rgba(255, 107, 0, 0.08) 50%, rgba(15, 23, 42, 0) 100%);">
                    <div style="font-size: 26px; font-weight: 900; letter-spacing: 1.5px; color: #FFFFFF; font-family: 'Segoe UI', sans-serif;">
                      ONE<span style="color: #00C2FF;">CONNECT</span>
                    </div>
                    <div style="font-size: 11px; font-weight: 800; color: #FF6B00; letter-spacing: 2px; text-transform: uppercase; margin-top: 6px;">
                      THƯ CHÀO MỪNG TÂN HỘI VIÊN VIP
                    </div>
                  </td>
                </tr>

                <!-- Content Body -->
                <tr>
                  <td style="padding: 20px 36px 36px 36px;">
                    <p style="font-size: 16px; line-height: 26px; color: #F8FAFC; margin: 0 0 16px 0;">
                      Kính gửi Quý Doanh nhân <strong>${recipientName}</strong>,
                    </p>
                    <p style="font-size: 14px; line-height: 22px; color: #94A3B8; margin: 0 0 24px 0;">
                      Ban Quản Trị Hệ sinh thái <strong>One Connect Network</strong> trân trọng chúc mừng bạn đã chính thức kích hoạt thành công <strong>Danh Thiếp Số Định Danh & Thẻ NFC Doanh Nghiệp</strong>.
                    </p>

                    <!-- Digital VIP Card Box -->
                    <div style="background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%); border: 1px solid #334155; border-radius: 20px; padding: 24px; margin-bottom: 24px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);">
                      <div style="font-size: 11px; font-weight: 800; color: #00C2FF; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px;">
                        EXECUTIVE DIGITAL PASS
                      </div>
                      <div style="font-size: 20px; font-weight: 900; color: #FFFFFF; margin-bottom: 4px;">
                        ${recipientName}
                      </div>
                      <div style="font-size: 13px; color: #E2E8F0; font-weight: 600; margin-bottom: 2px;">
                        ${memberTitle}
                      </div>
                      <div style="font-size: 12px; color: #94A3B8; margin-bottom: 18px;">
                        ${company}
                      </div>

                      <div style="text-align: center; margin-top: 12px;">
                        <a href="${cardLink}" target="_blank" style="display: inline-block; background: linear-gradient(90deg, #0066FF 0%, #FF6B00 100%); color: #FFFFFF; text-decoration: none; font-size: 13px; font-weight: 800; padding: 12px 28px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0, 102, 255, 0.4);">
                          Mở Danh Thiếp Số Của Bạn ➔
                        </a>
                      </div>
                    </div>

                    <!-- 3 Quick Steps -->
                    <div style="background-color: #070A12; border: 1px solid #1E293B; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
                      <div style="font-size: 12px; font-weight: 800; color: #F8FAFC; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px;">
                        3 BƯỚC BẮT ĐẦU GIAO THƯƠNG:
                      </div>
                      <div style="font-size: 12.5px; line-height: 20px; color: #94A3B8; margin-bottom: 8px;">
                        <strong style="color: #00C2FF;">1. Chạm thẻ NFC:</strong> Chạm thẻ vào mặt sau điện thoại đối tác tại các sự kiện B2B để mở ngay profile.
                      </div>
                      <div style="font-size: 12.5px; line-height: 20px; color: #94A3B8; margin-bottom: 8px;">
                        <strong style="color: #FF6B00;">2. Lưu Danh Bạ 1-Click:</strong> Đối tác chỉ cần bấm nút "Lưu Danh Bạ" để lưu toàn bộ số điện thoại, email, MST vào danh bạ điện thoại của họ.
                      </div>
                      <div style="font-size: 12.5px; line-height: 20px; color: #94A3B8;">
                        <strong style="color: #10B981;">3. Kết Nối Realtime:</strong> Quản lý danh sách đối tác và khách hàng tiềm năng đã kết nối tại Trung tâm điều hành.
                      </div>
                    </div>

                    <p style="font-size: 13px; line-height: 20px; color: #64748B; margin: 0;">
                      Trân trọng kính chúc Quý Doanh nghiệp ngày càng phát triển và bứt phá giao thương!<br>
                      <strong style="color: #94A3B8;">Ban Quản Trị Hệ Sinh Thái One Connect Network</strong>
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 20px 36px; background-color: #070A12; border-top: 1px solid #1E293B; text-align: center;">
                    <p style="font-size: 11px; color: #475569; margin: 0 0 6px 0;">
                      © 2026 One Connect Network • Nền Tảng Danh Thiếp Số Doanh Nghiệp Khánh Hòa
                    </p>
                    <p style="font-size: 11px; color: #334155; margin: 0;">
                      Tầng 8, Tòa nhà ASIA, 25 Lê Lợi, TP. Nha Trang, Tỉnh Khánh Hòa | Hotline: 0794.677.369
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

    if (smtpTransporter && gmailUser) {
      try {
        await smtpTransporter.sendMail({
          from: `"One Connect Network" <${gmailUser}>`,
          to: email,
          replyTo: 'contact.johnnylongho@gmail.com',
          subject,
          text: textContent,
          html: htmlContent,
        });

        return NextResponse.json({
          success: true,
          delivered: true,
          provider: 'GMAIL_SMTP',
          message: `Thư chào mừng VIP đã được gửi thành công đến ${email}`,
        });
      } catch (smtpErr: any) {
        console.error('SMTP send welcome error:', smtpErr);
      }
    }

    if (resend) {
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'One Connect <onboarding@resend.dev>';
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: [email],
        subject,
        html: htmlContent,
      });

      if (!error) {
        return NextResponse.json({
          success: true,
          delivered: true,
          provider: 'RESEND',
          message: `Thư chào mừng VIP đã được gửi thành công đến ${email}`,
          data,
        });
      }
    }

    return NextResponse.json({
      success: true,
      delivered: false,
      message: 'Đã hoàn tất đăng ký (Chưa cấu hình cổng gửi email)',
    });
  } catch (err: any) {
    console.error('API send-welcome error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Lỗi gửi thư chào mừng' }, { status: 500 });
  }
}
