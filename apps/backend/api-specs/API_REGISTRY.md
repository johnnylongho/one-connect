# ONE CONNECT NETWORK — API REGISTRY & CONTRACTS

Tài liệu quy chuẩn toàn bộ danh mục REST API routes đang hoạt động trên hệ thống One Connect:

| Nhóm Nghiệp Vụ | Đường Dẫn API | Phương Thức | Mục Đích Sử Dụng | Quyền Hạn |
| :--- | :--- | :--- | :--- | :--- |
| **Xác thực** | `/api/auth/otp` | `POST` | Gửi mã OTP xác thực qua Email/SMS | Public |
| **Xác thực** | `/api/auth/check-username` | `GET` | Kiểm tra tính khả dụng của username | Public |
| **Xác thực** | `/api/auth/send-welcome` | `POST` | Gửi email chào mừng hội viên mới | Authenticated |
| **Điểm danh MICE** | `/api/checkin` | `POST` | Trạm check-in tốc độ cao (<0.8s) NFC/QR | Operator / Admin |
| **Sự kiện** | `/api/events` | `GET`, `POST` | Lấy danh sách sự kiện & đăng ký tham dự | Public / Member |
| **Kết nối B2B** | `/api/connections` | `GET`, `POST` | Quản lý quan hệ 2 chiều & yêu cầu kết nối | Member |
| **Nhu cầu Thị trường**| `/api/market-demand` | `GET`, `POST` | Tiếp nhận Lead gói dịch vụ & theo dõi lượt quan tâm | Public / Admin |
| **Zalo ZNS** | `/api/zalo/zns` | `POST` | Gửi thông báo vé & sơ đồ gian hàng qua Zalo | System / Operator |
| **Tự động hóa** | `/api/automation/webhooks` | `POST` | Webhook đồng bộ luồng công việc sang n8n/CRM | System Webhook |
| **Báo cáo & Xuất file**| `/api/reports` | `GET` | Thống kê KPI sự kiện & tải file Excel/CSV | Organizer / Admin |
| **Quản trị người dùng**| `/api/admin/users` | `GET`, `PATCH` | Quản lý tài khoản và phân quyền quản trị | Super Admin |
| **NFC & Hồ sơ** | `/api/nfc` | `GET`, `POST` | Tra cứu và kích hoạt liên kết thẻ NFC | Public / Member |
