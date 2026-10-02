# ONE CONNECT NETWORK — FRONTEND APPLICATION (WEB PWA)

Phân hệ Frontend chuyên trách toàn bộ Giao diện Người dùng, Trải nghiệm Doanh nhân (UX/UI), Các trang tương tác, PWA, Chạm thẻ NFC và Điều phối Sự kiện MICE.

---

## 1. Cấu Trúc Thư Mục Frontend

```text
apps/frontend/
├── src/
│   ├── app/                     # Next.js 16 App Router Pages & API Gateway
│   │   ├── (auth)/              # Luồng đăng nhập, callback
│   │   ├── admin/               # Cổng Quản trị Hiệp hội, Báo cáo, Tổ chức
│   │   ├── c/[cardUid]/         # Trang đích khi quét thẻ vật lý NFC
│   │   ├── dashboard/           # Không gian làm việc cá nhân của Doanh nhân
│   │   ├── demo/                # Hub Trình diễn & Mô phỏng luồng hệ thống
│   │   ├── events/              # Danh sách sự kiện & Đăng ký tham dự
│   │   ├── matching/            # Giao diện B2B AI Matchmaking 1:1
│   │   ├── operator/            # Trạm Check-in tốc độ cao (<0.8s) cho BTC
│   │   ├── p/[card_id]/         # Trang Public Profile doanh nhân
│   │   ├── posts/               # Cổng thông tin, tin tức doanh nghiệp
│   │   ├── reports/             # Báo cáo chuyển đổi & KPI sự kiện MICE
│   │   ├── services/            # Bảng giá & Đăng ký gói dịch vụ
│   │   ├── layout.tsx           # Layout gốc với font, metadata & PWA
│   │   └── page.tsx             # Trang chủ One Connect Network
│   ├── components/              # Các UI Components tái sử dụng
│   │   ├── dashboard/           # Components hiển thị biểu đồ & dữ liệu
│   │   ├── layout/              # Shell, Header, Navigation
│   │   ├── matching/            # Bảng ghép cặp đàm phán 1:1
│   │   ├── organizer/           # Bảng điểm danh đại biểu real-time
│   │   ├── realtime/            # Modal thông báo yêu cầu kết nối
│   │   ├── services/            # Modal & form đăng ký gói dịch vụ
│   │   ├── shared/              # Header, Footer, Logo, QrScanner
│   │   └── ui/                  # Design System (Button, Badge, Card, Dialog...)
│   └── lib/                     # Client utilities, state, Supabase client
├── public/                      # Tài nguyên tĩnh: ảnh, icons, logo
├── tailwind.config.ts           # Cấu hình Tailwind CSS
├── tsconfig.json                # Cấu hình TypeScript
├── package.json                 # Cấu hình Turborepo package "frontend"
└── README.md                    # Hướng dẫn phát triển Frontend
```

---

## 2. Quy Trình Nâng Cấp & Cập Nhật Giao Diện Frontend

Khi có yêu cầu cập nhật hoặc phát triển tính năng mới cho Frontend:

1. **Thêm / Sửa Giao diện**:
   * Toàn bộ mã nguồn trang nằm trong `src/app/`.
   * Các khối giao diện nhỏ chia tách vào `src/components/`.
2. **Quy tắc Thẩm mỹ & Thiết kế**:
   * Thiết kế theo phong cách hiện đại, trực quan, độ tương phản cao, tối ưu tuyệt đối cho thiết bị di động (Mobile-first).
   * Đạt chuẩn phản hồi nhanh (Latency < 0.5s), hiệu ứng chạm mượt mà.
3. **Tuân thủ Nguyên tắc Dữ liệu Zero Mock**:
   * Khi chưa có dữ liệu từ Supabase Backend, bắt buộc hiển thị trạng thái **Empty State** sạch đẹp, lịch sự, minh bạch. Tuyệt đối không hardcode danh sách người dùng hay lead ảo.
