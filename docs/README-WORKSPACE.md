# 📂 QUY HOẠCH CÂY THƯ MỤC & CHUẨN HÓA GIAO DIỆN ONE CONNECT NETWORK

Tài liệu này định vị toàn bộ quy hoạch cây thư mục làm việc, chuẩn hóa kích thước trang (Container), hệ thống tiêu đề (Typography) và phân định giữa **Tính Năng Chính (Core MVP)** và **Tính Năng Phụ (Secondary/Management)**.

---

## 🌳 1. Cây Thư Mục Làm Việc Chuẩn (`d:\One Connect\`)

```
d:\One Connect\
├── 🚀 START.bat                   # [SCRIPT 1-CLICK] Bắt đầu phiên làm việc: git pull & chạy server
├── 💾 END.bat                     # [SCRIPT 1-CLICK] Kết thúc phiên làm việc: git add, commit & push
├── 🌐 index.html                  # [LOCAL DASHBOARD] Giao diện đón localhost & directory explorer
├── ⚙️ server.ps1                  # [SERVER CORE] PowerShell server tự chọn cổng (8080/8088/3000)
├── 📜 README-LOCALHOST.md          # Hướng dẫn quy trình 1-click & đường dẫn truy cập local
├── 📜 README-WORKSPACE.md          # [TÀI LIỆU NÀY] Quy hoạch thư mục & tiêu chuẩn giao diện
├── 📘 ONE CONNECT — Bộ Brief...md # Bản đặc tả PRD / Vibe Coding MVP v1.0
│
├── 📁 one-connect/                # [MÃ NGUỒN CHÍNH - NEXT.JS 16 MONOREPO]
│   ├── apps/
│   │   ├── web/                   # Ứng dụng PWA Mobile & Web Portal (35 routes)
│   │   └── docs/                  # Documentation app
│   ├── packages/                  # UI components, typescript-config, eslint-config
│   ├── supabase/                  # SQL Migrations (11 tables) & Seed data
│   └── package.json               # Turbo monorepo script runner
│
├── 📦 archive/                    # [LƯU TRỮ] Chứa các bản đóng gói ZIP dự phòng (.zip)
├── 📄 docs/                       # [TÀI LIỆU] Chứa các file brief Word (.docx)
├── 🎨 css/ & js/                  # Assets tĩnh phục vụ index.html localhost launcher
└── 📱 manifest.json & service-worker.js # PWA manifest & Offline cache worker
```

---

## 📐 2. Chuẩn Kích Thước Trang (Fixed Containers)

Tất cả giao diện giao diện web/PWA được gói trong 3 kích thước chuẩn:

1. **Mobile PWA Container (`.app-container-mobile`):**  
   - Kích thước: `max-w-md` (448px), căn giữa màn hình.  
   - Phạm vi sử dụng: Thẻ danh thiếp NFC (`/dashboard/card`), đón chạm thẻ (`/c/[cardUid]`), profile công khai (`/p/[card_id]`), OTP (`/auth/otp`), onboarding (`/onboarding`).

2. **Dashboard / Portal Container (`.app-container-desktop`):**  
   - Kích thước: `max-w-6xl` (1152px), padding lề phản hồi (`px-4 sm:px-6 lg:px-8`).  
   - Phạm vi sử dụng: Tổng quan (`/dashboard`), Mạng lưới B2B (`/dashboard/connections`), AI Matching (`/matching`), Lịch trình sự kiện (`/events`).

3. **Admin / Data Container (`.app-container-admin`):**  
   - Kích thước: `max-w-7xl` (1280px), tối ưu cho bảng dữ liệu lớn.  
   - Phạm vi sử dụng: Trạm Check-in siêu tốc (`/operator/checkin`), Danh sách điểm danh (`/operator/attendees`), Quản lý tổ chức (`/admin/org`), Báo cáo (`/reports`).

---

## 🔤 3. Chuẩn Tiêu Đề & Typography (Typography Scale)

* **Page Main Title (`.page-title` / `h1`):** `text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight` (Tiêu đề chính mỗi trang).
* **Section Title (`.section-title` / `h2`):** `text-lg sm:text-xl font-bold text-slate-800 tracking-tight` (Tiêu đề từng khối nội dung).
* **Card Title (`.card-title` / `h3`):** `text-base font-semibold text-slate-900` (Tiêu đề trong thẻ card).
* **Subtitle / Description (`.page-subtitle`):** `text-xs sm:text-sm text-slate-500 font-medium` (Mô tả phụ bên dưới tiêu đề).

---

## 🎯 4. Phân Định Tính Năng Chính vs Tính Năng Phụ

### 🔥 TÍNH NĂNG CHÍNH (CORE MVP - Vòng Lặp Trải Nghiệm Cốt Lõi)
Các tính năng bắt buộc cho Pilot 150-300 khách tham dự:
1. **Định Danh Số & Thẻ NFC/QR:** Chạm thẻ 1s mở profile, tạo danh thiếp điện tử B2B (`/dashboard/card`, `/c/[cardUid]`, `/p/[card_id]`).
2. **Trạm Check-in Sự Kiện Siêu Tốc:** Quét QR/NFC tốc độ dưới 1s cho Ban tổ chức (`/operator/checkin`, `/operator/attendees`).
3. **Mạng Lưới Kết Nối 2 Chiều Consent:** Gửi và đồng ý yêu cầu kết nối tuân thủ PDPL 91 (`/matching`, `/dashboard/connections`).
4. **Ghi Nhớ Quan Hệ (Relationship Memory):** Lưu bối cảnh cuộc gặp, ghi chú riêng tư & tag lead follow-up (`/dashboard/connections/[id]`).

### ⚙️ TÍNH NĂNG PHỤ & QUẢN TRỊ (SECONDARY & ADMIN SUPPORT)
Các công cụ phục vụ quản trị và hỗ trợ vận hành:
1. **Quản trị Tổ chức & Đại biểu:** Quản lý danh sách hội viên, phân quyền role (`/admin/org`, `/admin/org/members`).
2. **Kho Thẻ & Phôi NFC:** Quản lý mã chip NFC và cấp phát thẻ (`/admin/nfc-cards`).
3. **Báo cáo & Export CSV:** Báo cáo thống kê chỉ số MICE & xuất file danh sách (`/reports`, `/admin/reports`).
4. **Live Demo Hub:** Sân chơi thử nghiệm các kịch bản demo (`/demo`).
