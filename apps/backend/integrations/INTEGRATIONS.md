# ONE CONNECT NETWORK — INTEGRATIONS GUIDE

Tài liệu hướng dẫn cấu hình và vận hành các kênh tích hợp ngoại vi của One Connect:

## 1. Google OAuth 2.0
* **Client ID**: Cấu hình trong biến môi trường `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
* **Callback URL**: `https://one-connect-network.vercel.app/auth/callback`

## 2. Zalo Official Account (ZNS)
* **Zalo App ID**: `NEXT_PUBLIC_ZALO_APP_ID` & `ZALO_APP_ID`
* **Secret Key**: `ZALO_APP_SECRET` & `ZALO_OA_SECRET_KEY`
* **Mục đích**: Gửi thông báo vé sự kiện MICE tự động khi đại biểu điểm danh qua cổng check-in.

## 3. Email Delivery (Resend / Gmail SMTP)
* **Resend API Key**: `RESEND_API_KEY`
* **Gmail SMTP Fallback**: `GMAIL_USER` & `GMAIL_APP_PASSWORD`
* **Mục đích**: Gửi mã OTP xác thực và thư chào mừng (welcome email) đại biểu.

## 4. Webhook Automation (n8n / CRM)
* **Webhook Endpoint**: `N8N_WEBHOOK_URL`
* **Sự kiện hỗ trợ**: `NFC_CARD_TAPPED`, `CHECKIN_COMPLETED`, `B2B_CONNECTION_ACCEPTED`, `MARKET_LEAD_CREATED`.
