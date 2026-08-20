# ONE CONNECT NETWORK — HƯỚNG DẪN CHẠY LOCALHOST & ĐỌC FOLDER ONE-CONNECT

Tài liệu này hướng dẫn cách chạy webserver localhost và đọc/khám phá toàn bộ cấu trúc mã nguồn trong thư mục `one-connect`.

---

## ⚡ Quy Trình 1-Click Tự Động Làm Việc & Đồng Bộ 2 Máy Tính

Bây giờ bạn chỉ cần sử dụng **2 file 1-Click** nằm ngay thư mục gốc `d:\One Connect\`:

### 🚀 1. Khi BẮT ĐẦU làm việc: Double-click file [`START.bat`](file:///d:/One%20Connect/START.bat)
- Tự động kéo mã nguồn mới nhất từ GitHub (`git pull`).
- Tự động mở trình duyệt `http://localhost:3000`.
- Khởi chạy server Next.js (Turbopack).

### 💾 2. Khi KẾT THÚC làm việc: Double-click file [`END.bat`](file:///d:/One%20Connect/END.bat)
- Tự động đóng gói tất cả tệp vừa sửa (`git add .`).
- Nhập mô tả công việc (hoặc nhấn Enter để tự động lưu thời gian).
- Tự động đẩy dữ liệu an toàn lên GitHub (`git push`).
- Sang máy tính khác chỉ cần bấm `START.bat` để tiếp tục!

---

## 🌐 2. Các Đường Dẫn Truy Cập Localhost

Sau khi server khởi chạy (mặc định cổng `8080`, tự chuyển sang `8088`, `3000`... nếu trùng):

- 🏠 **Ứng dụng One Connect Client (PWA v2.1):**
  [http://localhost:8080/](http://localhost:8080/)
- 📁 **Trình đọc/Khám phá thư mục `one-connect` (Next.js Monorepo):**
  [http://localhost:8080/one-connect/](http://localhost:8080/one-connect/)
- 📱 **Địa chỉ IP máy nội bộ:**
  [http://127.0.0.1:8080/](http://127.0.0.1:8080/)

---

## 📂 3. Cấu trúc thư mục `one-connect` được tích hợp

Thư mục `one-connect` chứa dự án **Monorepo Next.js 16 + Turborepo**:

- `one-connect/apps/web`: Ứng dụng Web chính (Next.js 16, Supabase, TailwindCSS, React 19).
- `one-connect/apps/docs`: Documentation app.
- `one-connect/packages/ui`: Thư viện giao diện dùng chung.
- `one-connect/packages/typescript-config`: Cấu hình TypeScript chuẩn.
- `one-connect/package.json`: Cấu hình script và dependencies monorepo.
- `one-connect/.env.example`: Cấu hình biến môi trường kết nối Supabase, Redis, Auth.

---

## ✨ 4. Các tính năng nổi bật của Local Server mới:

1. **Auto Port Fallback:** Tự động tìm cổng khả dụng (8080 -> 8088 -> 3000 -> 3001 -> 8000).
2. **Directory Explorer cho `one-connect`:** Tự động tạo giao diện duyệt file chuyên nghiệp khi truy cập thư mục.
3. **MIME Types & CORS:** Hỗ trợ đầy đủ MIME types cho `.json`, `.js`, `.ts`, `.tsx`, `.css`, `.png`, `.svg` và bật CORS `*`.
4. **Quick Chip Navigation:** Đã thêm nút bấm nhanh `📁 Folder one-connect` trực tiếp trên thanh điều khiển của ứng dụng web.
