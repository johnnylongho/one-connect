# 📘 HƯỚNG DẪN KẾT NỐI SUPABASE & VẬN HÀNH GIAI ĐOẠN PILOT
## DỰ ÁN ONE CONNECT NETWORK (KHÁNH HÒA 2026)

Tài liệu này hướng dẫn chi tiết quy trình thiết lập cơ sở dữ liệu **Supabase PostgreSQL**, nạp dữ liệu mẫu (Seed Data) và chạy thử nghiệm Pilot phục vụ sự kiện 100 - 500 đại biểu.

---

### 🚀 BƯỚC 1: TẠO PROJECT SUPABASE MIỄN PHÍ (2 PHÚT)

1. Truy cập [https://supabase.com](https://supabase.com) và đăng nhập bằng tài khoản GitHub hoặc Google.
2. Bấm **"New Project"**:
   * **Project Name:** `one-connect-production` (hoặc `one-connect-pilot`)
   * **Database Password:** Thiết lập mật khẩu mạnh (và lưu lại)
   * **Region:** Chọn `Southeast Asia (Singapore) - ap-southeast-1` để có tốc độ truy cập nhanh nhất tại Việt Nam.
   * **Pricing Plan:** Free Plan (đủ sức chứa 500MB CSDL và 50.000 người dùng hàng tháng).
3. Chờ 1–2 phút để Supabase hoàn tất cấp phát server.

---

### 🗄️ BƯỚC 2: NẠP CẤU TRÚC 11 BẢNG & DỮ LIỆU MẪU (1 CLICK)

1. Trên menu bên trái của Supabase Dashboard, chọn biểu tượng **SQL Editor**.
2. Bấm **"New Query"**.
3. Mở file [supabase/migrations/20260814000000_complete_11_tables.sql](file:///d:/ONE%20CONNECT/one-connect/supabase/migrations/20260814000000_complete_11_tables.sql) trong project, copy toàn bộ nội dung và dán vào cửa sổ SQL Editor.
4. Bấm nút **"Run"** (Ctrl + Enter).
5. ➡️ **Kết quả:** Hệ thống tự động tạo 11 bảng chuẩn hóa:
   * `users`, `person_identities`, `identity_social_links`, `person_businesses`
   * `access_cards`, `events`, `event_registrations`, `check_ins`
   * `connections`, `connection_notes`, `audit_logs`
   * Toàn bộ dữ liệu đại biểu VIP (Hồ Hoàng Long, Trần Minh Đức, Ban Tổ Chức...) đã được nạp sẵn.

---

### 🔑 BƯỚC 3: LẤY KHÓA API & ĐIỀN VÀO FILE `.env.local`

1. Trên Supabase Dashboard, vào menu **Project Settings (⚙️) → API**.
2. Copy 2 thông số sau:
   * **Project URL** (VD: `https://xyzcompany.supabase.co`)
   * **Project API Keys:** `anon` (Public) và `service_role` (Secret)
3. Mở file `.env.local` trong thư mục `apps/web/` và điền:
   ```env
   NEXT_PUBLIC_SUPABASE_URL="https://xyzcompany.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOi..."
   SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOi..."
   ```

---

### 🧪 BƯỚC 4: KIỂM TRA HỆ THỐNG REST API PILOT

Sau khi cấu hình, bạn có thể kiểm tra trực tiếp các Endpoint phục vụ ngày Pilot:

1. **Kiểm tra Tra cứu thẻ NFC (<0.42s):**
   ```bash
   curl http://localhost:3000/api/nfc?cardUid=04:8F:2A:1B:9C:5D:80
   ```
2. **Kiểm tra Điểm danh Trạm cửa siêu tốc:**
   ```bash
   curl -X POST http://localhost:3000/api/checkin -H "Content-Type: application/json" -d "{\"eventId\":\"ev-1\",\"codeOrUid\":\"04:8F:2A:1B:9C:5D:80\",\"method\":\"NFC\"}"
   ```
3. **Kiểm tra Đăng nhập OTP / Magic Link:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/otp -H "Content-Type: application/json" -d "{\"emailOrPhone\":\"contact.johnnylongho@gmail.com\",\"action\":\"SEND\"}"
   ```

---

### 🌐 BƯỚC 5: DEPLOY LÊN VERCEL / DOMAIN CHÍNH THỨC

1. Đẩy code lên GitHub repository `one-connect`.
2. Đăng nhập [https://vercel.com](https://vercel.com) → **Add New Project** → Chọn repo `one-connect`.
3. Trong phần **Environment Variables**, dán toàn bộ các biến trong file `.env.example` vào.
4. Bấm **Deploy**. Sau ~1 phút, bạn sẽ có đường link production `https://oneconnect.network` sẵn sàng cho đại biểu chạm thẻ!
