# ONE CONNECT NETWORK — BACKEND ARCHITECTURE & DATA LAYER

Module phụ trách toàn bộ Cơ sở Dữ liệu, Lược đồ quan hệ (Schema & Migrations), Chính sách Bảo mật Dữ liệu (Row Level Security - RLS), và Tích hợp Server-to-Server (Zalo ZNS, Email SMTP, n8n Webhook).

---

## 1. Cấu Trúc Thư Mục Backend

```text
apps/backend/
├── database/
│   ├── migrations/              # Toàn bộ file SQL Migrations (Supabase)
│   │   ├── 20260813000000_initial_schema.sql
│   │   ├── 20260814000000_complete_11_tables.sql
│   │   ├── 20260905000000_create_articles_table.sql
│   │   └── 20260905100000_create_market_leads_and_demand.sql
│   └── seed.sql                 # Dữ liệu mẫu khởi tạo chuẩn hoá
├── api-specs/
│   └── API_REGISTRY.md          # Tài liệu quy chuẩn toàn bộ REST API endpoints
├── integrations/
│   └── INTEGRATIONS.md          # Hướng dẫn cấu hình Zalo ZNS, Resend, n8n
├── package.json                 # Cấu hình Turborepo package "backend"
└── README.md                    # Hướng dẫn vận hành Backend
```

---

## 2. Danh Sách 13 Bảng Dữ Liệu Cốt Lõi (Core Database Schema)

1. `users`: Bảng định danh người dùng nền tảng (email, phone, provider).
2. `person_identities`: Hồ sơ cá nhân doanh nhân (họ tên, chức danh, bio, liên kết MXH).
3. `businesses`: Hồ sơ doanh nghiệp gắn với doanh nhân (mã số thuế, ngành nghề).
4. `access_cards`: Quản trị thẻ vật lý NFC (tách rời UID thẻ khỏi User ID - Card Continuity).
5. `organizations`: Thông tin Hiệp hội, Câu lạc bộ, Ban Tổ Chức sự kiện.
6. `memberships`: Phân quyền và tư cách thành viên trong tổ chức (`MEMBER`, `BOARD`, ...).
7. `events`: Quản lý sự kiện, hội nghị MICE, hội thảo xúc tiến đầu tư.
8. `event_registrations`: Đăng ký tham dự, hạng vé, mã hash QR Code định danh.
9. `check_ins`: Ghi nhận điểm danh thực tế (thời gian, độ trễ ms, cổng quét, nhân sự quét).
10. `connections`: Đồ thị quan hệ 2 chiều có kiểm soát đồng ý (Luật PDPL 91/2025/QH15).
11. `connection_notes`: Ghi chú ngữ cảnh gặp gỡ riêng tư giữa các doanh nhân.
12. `leads`: Phân loại trạng thái lead (`HOT`, `WARM`, `COLD`) và ngày hẹn follow-up.
13. `market_leads` & `market_demand_events`: Theo dõi nhu cầu gói dịch vụ và sự kiện bấm nút CTA theo thời gian thực.
14. `articles`: Cổng thông tin, tin tức và bài viết B2B.

---

## 3. Quy Trình Nâng Cấp & Cập Nhật Dữ Liệu Backend

Khi có yêu cầu cập nhật backend, thực hiện theo các bước sau:

1. **Tạo Migration Mới**:
   * Đặt tên file theo định dạng: `YYYYMMDDHHMMSS_<ten_thay_doi>.sql` trong thư mục `database/migrations/`.
   * Luôn kích hoạt Row Level Security (RLS) cho bất kỳ bảng dữ liệu mới nào (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`).
   * Sử dụng UUID v4 ngẫu nhiên (`DEFAULT gen_random_uuid()`).
2. **Cập nhật Typescript Models**:
   * Đồng bộ kiểu dữ liệu tương ứng trong `apps/frontend/lib/types.ts` hoặc shared types.
3. **Cập nhật API Endpoints**:
   * Cập nhật logic xử lý tại `apps/frontend/src/app/api/...` và cập nhật thông số trong `api-specs/API_REGISTRY.md`.
4. **Kiểm tra Zero Mock Data Mandate**:
   * Tuyệt đối không chèn dữ liệu ảo/fake stats vào cơ sở dữ liệu.
