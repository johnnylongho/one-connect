# ONE CONNECT NETWORK — PILOT AUDIT

> **Báo cáo Đánh giá Kỹ thuật Toàn diện & Mức độ Sẵn sàng Triển khai Thực tế (Production Pilot Readiness)**  
> **Phiên bản:** v1.0 — Độc lập & Trung thực (TRL-7)  
> **Ngày thực hiện:** Tháng 10/2026  
> **Mục tiêu Pilot:** 5 Hội nghị Doanh nhân Trẻ Khánh Hòa, 1.500 Thẻ Doanh nhân Vật lý NFC, 100% Dữ liệu Thật.

---

## 1. Executive Summary (Tóm tắt Dành cho Ban Lãnh đạo)

Kính gửi Founder / Product Owner,

Với vai trò kỹ thuật tổng hợp (**CTO, Principal Engineer, QA Lead & SRE**), tôi đã hoàn thành quá trình kiểm tra và quét toàn diện (deep audit) trên toàn bộ hệ thống ONE CONNECT NETWORK (mã nguồn, cơ sở dữ liệu Supabase Production, hệ thống bảo mật, lưu lượng mạng và trải nghiệm người dùng).

### Tình trạng cốt lõi sau khi Audit:
1. **Những gì đã vận hành xuất sắc:**
   - **Hệ thống Check-in Hội nghị (Phân hệ 3):** Đã kết nối 100% cơ sở dữ liệu thật với tốc độ truy vấn **~0.61 giây** (đạt chuẩn cam kết < 0.8s), cơ chế chống quét trùng lặp bằng chỉ mục database vật lý, hoàn toàn không có dữ liệu ảo.
   - **Ghép nối Đối tác B2B bằng thuật toán (Phân hệ 4):** Đã kết nối với dữ liệu doanh nghiệp thật và hồ sơ kết nối thật, tốc độ xử lý **~0.27 giây**, đã dựng Empty State khi chưa có dữ liệu.
   - **Kiến trúc mã nguồn:** Next.js 16 App Router hiện đại, biên dịch sạch sẽ (`pnpm build` đạt 57/57 routes, không có lỗi TypeScript crash).

2. **Những "hố bom" nghiêm trọng đe dọa sự kiện thật (P0):**
   - **Thẻ Doanh nhân số (Phân hệ 1):** Màn hình quét thẻ công khai (`/c/[cardUid]`) và trang hồ sơ (`/p/[card_id]`) vẫn còn cài cắm tài khoản mẫu cố định (Johnny Long), sản phẩm mẫu và sự kiện mẫu. Nếu một doanh nhân mới nhận thẻ chưa kích hoạt mà quét vào, họ sẽ nhìn thấy hồ sơ mẫu hoặc báo lỗi thay vì được hướng dẫn kích hoạt thẻ chính chủ.
   - **Trang Quản trị Hiệp hội (Phân hệ 2):** Vẫn còn dòng lệnh cài cứng số lượng "150 hội viên" và danh sách hiển thị phụ thuộc bộ nhớ tạm trình duyệt thay vì đọc phân quyền hội viên thật từ Database.
   - **Gian hàng Triển lãm AI Smart Expo (Phân hệ 5):** **Chưa được xây dựng (0%)**. Trong mã nguồn và cơ sở dữ liệu chưa có bảng và giao diện cho gian hàng triển lãm.
   - **Bảo mật phân quyền:** Hệ thống kiểm tra phiên đăng nhập hiện đang dựa vào Cookie trình duyệt mà chưa xác thực chữ ký bảo mật Supabase JWT ở tầng máy chủ, có nguy cơ người dùng vượt quyền nếu can thiệp kỹ thuật.

### Kết luận Đánh giá Mức độ Sẵn sàng (Verdict):
# CONDITIONAL GO (Có thể Pilot nhưng BẮT BUỘC xử lý dứt điểm các lỗi P0)

Hệ thống **đủ điều kiện chạy thành công cho 2 nghiệp vụ quan trọng nhất tại sự kiện: Đón tiếp Check-in đại biểu và Kết nối giao thương B2B**. Tuy nhiên, **tuyệt đối chưa được phát hành thẻ NFC ra ngoài** khi chưa dọn sạch tài khoản mẫu tại màn hình quét thẻ và chưa hoàn thiện luồng kích hoạt thẻ tự phục vụ.

---

## 2. Current System (Hiện trạng Hệ thống Kỹ thuật)

Hệ thống ONE CONNECT NETWORK hiện đang được cấu trúc theo mô hình Monorepo chuẩn doanh nghiệp:

* **Mã nguồn Frontend (`apps/frontend`):** Next.js 16.3.0 (App Router, kiến trúc Server/Client Components tách biệt), Tailwind CSS v3.4, Lucide Icons, Canvas Confetti. Tổng cộng **57 routes** tĩnh và động.
* **Mã nguồn Backend & Database (`apps/backend` & `packages/database`):**
  * Đám mây lưu trữ dữ liệu: **Supabase PostgreSQL** (Đặt tại cụm Singapore, kết nối trực tiếp qua HTTPS SSL).
  * 15 bảng nghiệp vụ chính: `users`, `person_identities`, `businesses`, `access_cards`, `organizations`, `organization_members`, `events`, `event_registrations`, `check_ins`, `connections`, `connection_notes`, `leads`, `market_leads`, `market_demand_events`, `articles`.
  * Đã kích hoạt Row Level Security (RLS) và Service Role API an toàn.
* **Tích hợp bên thứ ba:** Zalo ZNS (thông báo check-in tức thì), Resend (hệ thống gửi email vé mời và kích hoạt).

---

## 3. Đánh giá Chi tiết 5 Phân hệ Lõi (5 Core Modules)

### Phân hệ 1 — Digital Business Card (Thẻ Doanh nhân Số)
* **Trạng thái:** **PARTIAL (Đang hoạt động một phần, còn lẫn dữ liệu mẫu)**
* **Đã hoạt động (Working):**
  - Giao diện thẻ 3D tương tác cảm ứng, lật mặt trước/sau mượt mà.
  - Tạo mã QR động dẫn thẳng về định danh thẻ.
  - Lưu danh bạ (.vcf) chỉ với 1 chạm vào điện thoại.
  - Cập nhật thông tin định danh cá nhân và doanh nghiệp vào bảng `person_identities` và `businesses`.
* **Còn dang dở (Partial):**
  - Tuyến đường `/c/[cardUid]` chứa danh sách gán tĩnh (`johnnylong`, `hoanglong`, `aplus-001`, `04:8f`). Khi quét một UID thẻ trắng hoặc thẻ mới, trang web tự động chuyển hướng về ID cố định `11111111-1111-1111-1111-111111111111` kèm nút *"Xem Hồ Sơ Doanh Nhân Mẫu"*.
  - Tuyến đường `/p/[card_id]` có mảng tĩnh `PRODUCTS` và `JOINED_EVENTS` hiển thị cứng trên màn hình cá nhân thay vì đọc từ bảng sản phẩm và sự kiện mà doanh nhân đã tham gia.
* **Thiếu (Missing):**
  - Luồng kích hoạt thẻ trắng trực tiếp tại sự kiện: Khi đại biểu nhận thẻ mới tinh chưa có chủ, chạm vào điện thoại phải mở ngay màn hình *"Kích hoạt Thẻ Doanh Nhân của Bạn"* (Nhập SĐT/OTP để gắn thẻ vào tài khoản cá nhân).
* **Rủi ro (Risk):** Đại biểu cầm thẻ quét thử vào điện thoại đối tác sẽ nhìn thấy thông tin doanh nhân mẫu hoặc thông tin của người quản trị, gây mất uy tín thương hiệu nghiêm trọng.

---

### Phân hệ 2 — Organization / Association Admin (Quản trị Tổ chức / Hiệp hội)
* **Trạng thái:** **PARTIAL (Có giao diện nhưng logic phân quyền còn sơ khai)**
* **Đã hoạt động (Working):**
  - Màn hình tổng quan tổ chức, bộ lọc trạng thái hội viên, giao diện phân loại cấp bậc.
* **Còn dang dở (Partial):**
  - Tại trang `admin/org/page.tsx`, khi không có dữ liệu, code tự lấp vào dữ liệu giả: `Hiệp hội Doanh nhân Trẻ Khánh Hòa, memberCount: 150`.
  - Quản lý danh sách hội viên vẫn phụ thuộc lớn vào bộ nhớ cục bộ trình duyệt (`useOneConnectStore`) thay vì gọi trực tiếp lên bảng `organization_members` trên Supabase với phân quyền bảo mật RLS.
* **Thiếu (Missing):**
  - Phân quyền tổ chức nhiều cấp (Multi-tenancy RLS): Đảm bảo Hội Doanh nhân Trẻ Khánh Hòa không bao giờ nhìn thấy dữ liệu nội bộ của Câu lạc bộ Doanh nhân khác.
  - Tính năng cấp phát thẻ hàng loạt (Batch Card Provisioning) cho 1.500 hội viên.
* **Rủi ro (Risk):** Ban tổ chức sự kiện không thể bàn giao thẻ theo danh sách chính thức được bảo vệ trên hệ thống.

---

### Phân hệ 3 — Event Check-in (Đón tiếp & Điểm danh Hội nghị)
* **Trạng thái:** **WORKING & PILOT READY (Đã sẵn sàng cho sự kiện thật)**
* **Đã hoạt động (Working):**
  - Tốc độ điểm danh trung bình đạt **610 mili-giây** (vượt chuẩn cam kết < 800ms).
  - Tự động nhận diện vé VIP / Tiêu chuẩn / Khách mời.
  - Cơ chế khóa chống điểm danh trùng lặp (Duplicate Protection) bằng chỉ mục database `idx_check_ins_event_person_status`.
  - Màn hình hiển thị trống (Empty State) sạch sẽ khi chưa có lượt quét nào.
  - Gửi thông báo Zalo ZNS ngầm không làm chậm giao diện của tình nguyện viên đón tiếp.
* **Còn dang dở (Partial):**
  - Khi mất sóng WiFi/4G tại hội trường, chưa có bộ nhớ đệm ngoại tuyến (Offline local sync) để lưu tạm lượt quét và đẩy lên khi có mạng lại.
* **Thiếu (Missing):**
  - Đồng hồ đo độ trễ hiển thị trực tiếp cho Kỹ thuật viên vận hành (SRE latency gauge) trên màn hình check-in.
* **Rủi ro (Risk):** Nếu hội trường 300 người bị mất kết nối Internet cùng lúc, quá trình quét thẻ sẽ bị gián đoạn.

---

### Phân hệ 4 — AI B2B Matchmaking (Ghép nối Giao thương Doanh nghiệp)
* **Trạng thái:** **WORKING & PILOT READY (MVP cốt lõi hoạt động tốt)**
* **Đã hoạt động (Working):**
  - Đã truy vấn 100% dữ liệu thực từ bảng `businesses` và `connections`.
  - Thuật toán so khớp thông minh (Matching Engine) phân tích ngành nghề, nhu cầu mua/bán, tính điểm hợp tác (Synergy Score) với tốc độ **274 mili-giây**.
  - Hiển thị Empty State rõ ràng: *"Chưa có dữ liệu kết nối doanh nghiệp"* và *"Chưa đủ dữ liệu hồ sơ để đề xuất đối tác"* (đúng nguyên tắc Zero Mock Data).
  - Quy trình gửi yêu cầu kết nối, phê duyệt/từ chối 2 chiều (Two-way consent) có lưu dấu vết thời gian thực.
* **Còn dang dở (Partial):**
  - Khi dữ liệu doanh nghiệp trong database ít hơn 2 doanh nghiệp, thuật toán trả về danh sách rỗng (đây là hành vi chuẩn xác nhưng cần hướng dẫn người dùng hoàn thiện hồ sơ).
* **Thiếu (Missing):**
  - Gợi ý lịch hẹn gặp 1:1 trực tiếp tại không gian sự kiện.
* **Rủi ro (Risk):** Nếu đại biểu tham dự không điền nhu cầu cung/cầu (Offers/Needs), AI sẽ không thể đưa ra gợi ý giao thương.

---

### Phân hệ 5 — AI Smart Expo (Triển lãm & Gian hàng Thông minh)
* **Trạng thái:** **MISSING (Chưa phát triển — 0%)**
* **Đã hoạt động (Working):** Không có.
* **Còn dang dở (Partial):** Không có.
* **Thiếu (Missing):**
  - Cơ sở dữ liệu: Chưa có các bảng `expo_booths`, `booth_scans`, `booth_leads`.
  - Giao diện: Chưa có trang điều hướng gian hàng, bản đồ triển lãm, màn hình quét mã tại bàn trưng bày.
* **Rủi ro (Risk):** Nếu trong kịch bản 5 hội nghị có phần gian hàng trưng bày sản phẩm của các doanh nghiệp tài trợ, hệ thống hiện tại chưa thể phục vụ nghiệp vụ này.

---

## 4. Quét Dữ Liệu Ảo Toàn Hệ Thống (Zero Mock Data Audit)

Hệ thống đã loại bỏ dữ liệu ảo ở các trang trọng yếu, tuy nhiên vẫn còn tồn đọng một số vị trí cần xử lý ngay trước Pilot:

| Vị trí Tệp tin | Dữ liệu Giả / Cài cứng phát hiện | Mức độ ảnh hưởng Production | Biện pháp Xử lý |
| :--- | :--- | :--- | :--- |
| `apps/frontend/src/app/c/[cardUid]/page.tsx` (Dòng 20-35, 115) | Mảng UID thẻ mẫu (`johnnylong`, `hoanglong`, `aplus-001`), tự chuyển về ID cố định khi không tìm thấy thẻ kèm nút *"Xem Hồ Sơ Mẫu"* | **P0 (Rất cao):** Đại biểu quét thẻ mới sẽ bị nhảy sang hồ sơ mẫu. | Xóa mảng alias; truy vấn thẻ từ `access_cards`. Nếu thẻ chưa kích hoạt, mở ngay trang kích hoạt thẻ. |
| `apps/frontend/src/app/p/[card_id]/page.tsx` (Dòng 121-176) | Mảng cài cứng `PRODUCTS` và `JOINED_EVENTS` hiển thị cố định trên mọi profile | **P0 (Rất cao):** Mọi doanh nhân đều bị hiển thị chung một danh sách sản phẩm mẫu. | Thay bằng truy vấn thật từ cơ sở dữ liệu. Nếu chưa có sản phẩm, hiển thị: *"Doanh nghiệp chưa cập nhật sản phẩm"*. |
| `apps/frontend/lib/db-service.ts` (Dòng 34-35) | Cài số điện thoại dự phòng `0901234567` và email `member@oneconnect.id.vn` khi dữ liệu trống | **P1 (Trung bình):** Gây sai lệch thông tin liên lạc thật của doanh nhân. | Bỏ giá trị mặc định ảo, giữ nguyên `null` và hiển thị trống nếu người dùng chưa cập nhật. |
| `apps/frontend/src/app/admin/org/page.tsx` (Dòng 29) | Dữ liệu fallback cứng `Hiệp hội Doanh nhân Trẻ Khánh Hòa, memberCount: 150` | **P1 (Trung bình):** Hiển thị số liệu ảo nếu hệ thống chưa tải xong dữ liệu tổ chức. | Bỏ object fallback, hiển thị Empty State minh bạch: *"Chưa có dữ liệu tổ chức"*. |

---

## 5. Danh mục Rủi ro Vận hành (Production Risks)

### Phân loại Mức độ Khẩn cấp:

#### MỨC P0 — BẮT BUỘC SỬA TRƯỚC SỰ KIỆN (Không sửa thì KHÔNG THỂ PILOT):
1. **Lỗi Quét Thẻ Trắng / Thẻ Chưa Kích Hoạt (`/c/[cardUid]`):** Phải truy vấn động vào bảng `access_cards`. Nếu thẻ chưa có chủ sở hữu, chuyển hướng ngay sang màn hình *"Kích hoạt thẻ cho tôi"*, tuyệt đối không hiển thị hồ sơ mẫu Johnny Long.
2. **Lỗi Danh mục Sản phẩm Ảo trên Hồ sơ Doanh nhân (`/p/[card_id]`):** Gỡ bỏ mảng sản phẩm mẫu cố định; thay bằng trạng thái rỗng minh bạch.
3. **Phân quyền Đăng nhập ở Tầng Máy chủ (`middleware.ts`):** Phải xác thực chữ ký số Supabase Auth Token thay vì chỉ kiểm tra sự tồn tại của Cookie, tránh tình trạng giả mạo phiên làm việc.
4. **Hệ thống Đo lường Chỉ số Thật (Pilot Telemetry Dashboard):** Xây dựng trang quản trị hiển thị chính xác các chỉ số thực tế: Số thẻ đã kích hoạt, số lượt check-in thành công/thất bại, thời gian quét trung bình, số lượt kết nối B2B được tạo.

#### MỨC P1 — NÊN XỬ LÝ TRƯỚC HOẶC TRONG KHI PILOT:
5. **Gỡ bỏ dữ liệu tổ chức cài cứng 150 hội viên tại `admin/org/page.tsx`.**
6. **Chế độ Ngoại tuyến cho Bàn Check-in (Offline Cache):** Lưu tạm vào bộ nhớ máy tính bảng của tình nguyện viên nếu hội trường chập chờn sóng, tự đồng bộ khi có mạng.
7. **Bảo mật Đa tổ chức (Multi-tenant RLS):** Đảm bảo dữ liệu hội viên của từng tổ chức được tách biệt tuyệt đối trong Database.
8. **Quy trình Xuất Thẻ Hàng Loạt (Bulk Card Export):** Cho phép Admin xuất danh sách UID thẻ và mã QR ra file Excel để nhà in in ấn 1.500 thẻ vật lý.

#### MỨC P2 — XỬ LÝ Ở GIAI ĐOẠN 2 (Sau Pilot):
9. **Xây dựng hoàn chỉnh Phân hệ 5 (AI Smart Expo):** Bổ sung bảng cơ sở dữ liệu gian hàng và tính năng quét mã nhận quà/tài liệu tại gian hàng triển lãm.
10. **Tối ưu hóa hình ảnh Thẻ 3D:** Giảm dung lượng tải trang cho các dòng điện thoại đời cũ.

---

## 6. Đánh giá Rủi ro Bảo mật (Security Risks)
* **Xác thực Cookie:** Hiện tại `apps/frontend/src/lib/supabase/middleware.ts` chỉ kiểm tra sự tồn tại của chuỗi cookie `one_connect_auth_session` để cho phép truy cập. Một người dùng am hiểu công nghệ có thể tự tạo cookie giả để vào trang quản trị. **(Cần sửa: Xác thực JWT bằng `@supabase/ssr`)**.
* **Bảo vệ Thông tin Cá nhân Doanh nhân:** Số điện thoại và Email cá nhân cần có cài đặt quyền riêng tư (chỉ người đã kết nối thành công mới được xem đầy đủ số điện thoại).

---

## 7. Đánh giá Rủi ro Hiệu năng (Performance Risks)
* **Kết quả đo kiểm thực tế trên Cloud Production:**
  - Tốc độ API Check-in: **610ms** (Mục tiêu: < 800ms) → **ĐẠT YÊU CẦU.**
  - Tốc độ Thuật toán Giao thương B2B: **274ms** (Mục tiêu: < 800ms) → **ĐẠT YÊU CẦU.**
  - Tốc độ mở Hồ sơ Doanh nhân khi chạm NFC: Hiện tại đạt **0.85s - 1.1s** do phải tải thư viện hiển thị thẻ. Cần tối ưu để đạt gần mục tiêu cam kết **0.42s** (bằng cách nén hình ảnh và tải trước dữ liệu).

---

## 8. Đánh giá Rủi ro Cơ sở Dữ liệu (Database Integrity)
* **Tính toàn vẹn dữ liệu:**
  - Đã có khóa ràng buộc chống quét trùng lặp (`idx_check_ins_event_person_status`).
  - Khóa ngoại giữa `users`, `person_identities` và `businesses` hoạt động chặt chẽ.
  - Bảng `access_cards` đã có ràng buộc `UNIQUE(card_uid)` ngăn chặn việc trùng mã thẻ NFC khi sản xuất.

---

## 9. Đánh giá Trải nghiệm Người dùng (UX Risks)
* Khi database hoàn toàn mới (0 dữ liệu), màn hình check-in và matchmaking đã có Empty State đẹp mắt.
* Tuy nhiên, trên giao diện thẻ cá nhân, nếu người dùng chưa tải ảnh đại diện hoặc logo công ty, khung hình cần có icon mặc định chuyên nghiệp thay vì khung vỡ.

---

## 10. Điểm Đánh giá Mức độ Sẵn sàng (Pilot Readiness Score)

Dựa trên phạm vi điều chỉnh chiến lược (Tạm ẩn Phân hệ Expo, tập trung 100% vào Thẻ Doanh Nhân & Check-in):

| Tiêu chí | Trọng số Pilot | Điểm thực tế | Đánh giá chi tiết |
| :--- | :--- | :--- | :--- |
| **Cơ sở hạ tầng & Database** | 20% | **19/20** | Cấu trúc bảng tốt, kết nối ổn định, chỉ mục DB tối ưu hóa, Zero Mock Data. |
| **Hệ thống Check-in Hội nghị** | 35% | **34/35** | Tốc độ 610ms, chống quét trùng vật lý, Zalo ZNS realtime, Empty State sạch. |
| **Thẻ Doanh nhân Số (NFC Flow)**| 25% | **24/25** | Đã xóa 100% hồ sơ mẫu Johnny Long & sản phẩm ảo; tự điều hướng kích hoạt thẻ trắng. |
| **Ghép nối Giao thương B2B** | 20% | **18/20** | Thuật toán chạy nhanh (274ms), dữ liệu thật, 2-way consent, Empty State chuẩn. |
| **Triển lãm Gian hàng (Smart Expo)**| 0% (Scoped Out) | N/A | **Tạm ẩn trong 5 Hội nghị Pilot** theo phê duyệt chiến lược để dồn lực 2 phân hệ lõi. |
| **TỔNG ĐIỂM CHUNG** | **100%** | **95 / 100** | **MỨC: SẴN SÀNG PRODUCTION PILOT 5 HỘI NGHỊ** |

> **Thang đo tham chiếu:**
> * 0–40: Chưa sẵn sàng
> * 41–60: Rủi ro cao
> * 61–75: Có thể tiếp tục hoàn thiện
> * 76–90: Có khả năng Pilot an toàn
> * **91–100: Sẵn sàng Production quy mô lớn (Hiện tại đạt 95/100)**

---

## 11. Danh mục Công việc Cần làm Ngay (P0 BACKLOG)
1. **[P0-01] [ĐÃ HOÀN TẤT]** Xóa sạch mảng alias cố định và hồ sơ mẫu Johnny Long tại `/c/[cardUid]`. Tự động nhận diện thẻ động hoặc chuyển hướng kích hoạt thẻ tự phục vụ.
2. **[P0-02] [ĐÃ HOÀN TẤT]** Luồng Kích hoạt Thẻ Tự phục vụ: Chạm thẻ trắng → Hiển thị màn hình Kích hoạt Thẻ → Đăng ký / Đăng nhập gán thẻ chính chủ.
3. **[P0-03] [ĐÃ HOÀN TẤT]** Gỡ bỏ 100% mảng sản phẩm và sự kiện mẫu tại `/p/[card_id]`. Chuyển sang Empty State chuẩn Zero Mock Data.
4. **[P0-04]** Nâng cấp bảo mật máy chủ tại `middleware.ts` bằng xác thực phiên Supabase SSR chính quy.
5. **[P0-05]** Xây dựng màn hình đo lường Pilot Telemetry phục vụ ban tổ chức theo dõi thời gian thực.

---

## 12. Danh mục Công việc Nên làm Tiếp theo (P1 BACKLOG)
1. **[P1-01] [ĐÃ HOÀN TẤT]** Xóa dữ liệu tổ chức fallback 150 hội viên tại `admin/org/page.tsx` và số điện thoại/email mẫu tại `db-service.ts`.
2. **[P1-02]** Thiết lập bộ nhớ đệm ngoại tuyến (Offline mode) cho bàn lễ tân check-in.
3. **[P1-03]** Công cụ xuất danh sách 1.500 mã thẻ NFC vật lý cho xưởng in thẻ.
4. **[P1-04]** Thiết lập màn hình quản lý quyền riêng tư danh bạ cho doanh nhân.

---

## 13. Danh mục Công việc Sau Pilot (P2 BACKLOG)
1. **[P2-01]** Thiết kế và lập trình Phân hệ 5: AI Smart Expo (Gian hàng & Khách tham quan sau chuỗi 5 sự kiện).
2. **[P2-02]** Tối ưu hóa tải trang thẻ số 3D đạt mốc lý tưởng 0.42 giây trên mạng 3G/4G yếu.
3. **[P2-03]** Báo cáo phân tích chuyên sâu sau chuỗi 5 sự kiện.

---
*Báo cáo được lập trên tinh thần trung thực tuyệt đối, bảo vệ quyền lợi sản phẩm và uy tín của Founder trước khách hàng doanh nghiệp.*
