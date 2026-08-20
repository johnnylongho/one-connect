---
title: "ONE CONNECT — Bộ Brief Vibe Coding cho MVP v1.0"
type: synthesis
created: 2026-08-12
updated: 2026-08-12
sources: ["[[one-connect-prd.md]]", "[[one-connect-user-flows.md]]", "[[one-connect-database-erd.md]]", "[[one-connect-screen-list.md]]", "[[one-connect-mvp-sprint-plan-task-breakdown.md]]", "[[one-connect-pilot-plan-kpis.md]]"]
related: ["[[../wiki/concepts/mo-hinh-business-identity.md]]", "[[../wiki/concepts/bao-mat-va-tuan-thu-du-lieu.md]]", "[[../wiki/entities/aplusvn.md]]"]
tags: [production, vibe-coding, mvp, one-connect, technical-brief, vertical-slice]
---

# ONE CONNECT — Bộ Brief Vibe Coding cho MVP v1.0

> **Mục tiêu của tài liệu:** cung cấp một bản đặc tả đủ rõ để đội ngũ hoặc công cụ AI có thể xây dựng MVP theo từng lát cắt dọc (vertical slice), kiểm thử liên tục và giữ quyền kiểm soát mã nguồn. Tài liệu này không phải là mô tả ý tưởng chung và không cho phép tự đoán các quyết định kỹ thuật hoặc pháp lý còn bỏ trống.

## 0. Quyết định nền tảng

### 0.1. Sản phẩm dùng để làm thật hay chỉ demo?

**One Connect MVP được xây dựng để dùng thật trong một Pilot (thử nghiệm thực tế) với một sự kiện doanh nhân hoặc hiệp hội doanh nghiệp quy mô mục tiêu 150–300 người tham dự.** Bản demo có thể dùng dữ liệu mẫu để trình bày giao diện, nhưng không được xem là hoàn thành MVP nếu chưa chứng minh được luồng thực tế: định danh → đăng ký → check-in → kết nối có đồng ý → ghi nhớ quan hệ → báo cáo hậu sự kiện.

Phương án triển khai được phép dùng **Demo Mode** trong giai đoạn phát triển để seed dữ liệu và kiểm tra giao diện. Demo Mode phải được tách rõ khỏi **Pilot Mode**, không được làm sai lệch quyền truy cập, consent hoặc dữ liệu thật. Không được tạo đánh giá, testimonial hoặc dữ liệu người dùng giả để trình bày như dữ liệu thực tế.

**Nguồn:** `one-connect-prd.md`, mục 1–2; `one-connect-pilot-plan-kpis.md`, mục 1.

### 0.2. Định vị sản phẩm

One Connect là một lớp hạ tầng phần mềm SaaS (phần mềm cung cấp như một dịch vụ) cho **định danh số và quan hệ doanh nghiệp**. NFC/QR là access interface (giao diện truy cập), không phải toàn bộ sản phẩm. Giá trị cốt lõi là lưu được bối cảnh của cuộc gặp và biến một điểm chạm thành một quan hệ có thể tiếp tục follow-up (theo dõi sau kết nối).

### 0.3. Phạm vi MVP được khóa

MVP gồm bốn nhóm giá trị:

1. **Identity & Card:** hồ sơ cá nhân/doanh nghiệp, public profile, QR và quản lý thẻ NFC độc lập với identity.
2. **Organization & Membership:** tổ chức Hội/CLB, thành viên, vai trò và phạm vi dữ liệu theo tổ chức.
3. **Event & Check-in:** tạo sự kiện, đăng ký, check-in QR và NFC fallback sau PoC.
4. **Networking & Relationship Memory:** yêu cầu kết nối, đồng ý hai chiều, ghi chú riêng tư, tag lead và follow-up cơ bản.

Không xây trong MVP: full CRM, marketplace, AI matching nâng cao, social feed, thu phí hội viên trực tuyến, blockchain/NFT hoặc tích hợp CRM sâu với Salesforce/HubSpot.

**Nguồn:** `one-connect-prd.md`, mục 2; `one-connect-mvp-feature-map.md`.

## 1. Người dùng, bối cảnh và vấn đề cần giải quyết

### 1.1. Persona và quyền hạn

| Persona | Bối cảnh sử dụng | Vấn đề chính | Kết quả mong muốn | Quyền dữ liệu chính |
|---|---|---|---|---|
| **Doanh nhân / người tham dự** | Dùng smartphone tại sự kiện, qua NFC hoặc QR | Danh thiếp và kênh liên lạc bị phân mảnh; sau sự kiện quên gặp ai và bàn gì | Có một identity dùng lại nhiều nơi; kết nối có consent; lưu note và follow-up | Sở hữu profile, privacy, connection, note và lead của mình |
| **Hội / CLB doanh nghiệp** | Quản lý cộng đồng và chuỗi sự kiện định kỳ | Thiếu hồ sơ thành viên thống nhất và dữ liệu tương tác sau sự kiện | Quản lý thành viên, sự kiện, check-in và báo cáo hoạt động cộng đồng | Chỉ xem dữ liệu thuộc tổ chức theo role |
| **Ban tổ chức sự kiện** | Vận hành cửa check-in và networking trong ngày event | Ùn tắc check-in, danh sách rời rạc, khó báo cáo hậu sự kiện | Check-in nhanh, attendee directory và báo cáo có thể truy vết | Chỉ xem dữ liệu tối thiểu cần cho event |
| **Platform Admin** | Vận hành hệ thống, hỗ trợ và kiểm soát sự cố | Cần quản lý lỗi, quyền, audit và môi trường | Theo dõi sức khỏe hệ thống, xử lý hỗ trợ và rollback | Quyền cao nhất; mọi thao tác phải audit |

### 1.2. Ba vấn đề sản phẩm

1. **Phân mảnh định danh:** một doanh nhân có nhiều kênh nhưng không có điểm chạm định danh tập trung.
2. **Đứt gãy bối cảnh sự kiện:** cuộc gặp kết thúc mà không lưu lại sự kiện, thời điểm và nội dung trao đổi.
3. **Khoảng trống trước CRM:** người dùng cần một lớp relationship memory (ghi nhớ quan hệ) nhẹ trước khi cần CRM đầy đủ.

**Nguồn:** `one-connect-prd.md`, mục 1.1; `one-connect-user-flows.md`, mục 1–3.

## 2. Quyết định kỹ thuật tối thiểu cho MVP

### 2.1. App, đăng nhập và lưu trữ

| Câu hỏi | Quyết định MVP | Điều không được tự đoán |
|---|---|---|
| App là gì? | PWA (Progressive Web App — ứng dụng web có trải nghiệm gần app), mobile-first cho attendee; portal cho admin/organizer | Không tự biến thành native app nếu chưa có quyết định mới |
| Có đăng nhập không? | Có. OTP qua email hoặc số điện thoại; session/token sau khi OTP hợp lệ | Nhà cung cấp OTP, chi phí và fallback cần Tech Lead chốt |
| Có database không? | Có. Cơ sở dữ liệu quan hệ cho 11 bảng lõi | Chưa tự chốt cloud/provider nếu chưa có quyết định hạ tầng |
| Có cần phân quyền không? | Có. Member, Association Admin/Board, Event Organizer, Platform Admin | Ma trận role phải được duyệt trước khi mở API |
| Có NFC không? | Có trong product flow; triển khai NFC sau PoC thiết bị, QR là phương án fallback bắt buộc | Không giả định mọi trình duyệt/thiết bị đọc NFC giống nhau |
| Có dữ liệu thật không? | Có trong Pilot, sau khi được duyệt privacy notice, consent và retention | Không dùng dữ liệu cá nhân thật ở dev/staging |

### 2.2. Quy tắc dữ liệu và nguồn sự thật

- API là nguồn sự thật cho trạng thái; frontend không tự suy diễn trạng thái connection, registration hoặc check-in.
- Mỗi bảng có UUID (định danh duy nhất), timestamps, ràng buộc khóa ngoại và index phù hợp.
- Mọi thao tác thay đổi dữ liệu phải có log, actor, correlation ID (mã truy vết giao dịch) và error code ổn định.
- Dữ liệu cá nhân phải được phân loại; log không được chứa OTP, token, dữ liệu nhạy cảm hoặc payload profile đầy đủ.
- Demo seed phải có cờ hoặc namespace riêng; không được trộn với tenant/event Pilot.

## 3. Mô hình dữ liệu MVP

### 3.1. Mười một bảng cốt lõi

| Bảng | Vai trò | Quan hệ chính |
|---|---|---|
| `users` | Identity cá nhân và privacy | Gắn với businesses, cards, memberships, registrations, check_ins, connections |
| `businesses` | Hồ sơ doanh nghiệp đại diện bởi user | `user_id → users.id` |
| `cards` | Thẻ NFC và QR độc lập với identity | `user_id → users.id`; đổi thẻ không làm mất lịch sử |
| `organizations` | Hội, CLB hoặc đơn vị tổ chức | Gắn với memberships và events |
| `memberships` | Thành viên và role trong tổ chức | `user_id + org_id` |
| `events` | Ngữ cảnh sự kiện | Thuộc organization hoặc event owner |
| `registrations` | Đăng ký của user vào event | `event_id + user_id`; không trùng |
| `check_ins` | Điểm danh thực tế | `event_id + user_id`; idempotent (gửi lặp không tạo bản ghi hiệu lực thứ hai) |
| `connections` | Quan hệ hai chiều có consent | sender, receiver, event, status |
| `notes` | Ghi chú riêng tư theo connection | Chỉ author có quyền đọc/sửa |
| `leads` | Phân loại follow-up cơ bản | Gắn với connection; không phải CRM đầy đủ |

### 3.2. Trạng thái cần khóa trước khi code

- `cards.status`: `ACTIVE`, `LOCKED`, `REVOKED`.
- `memberships.status`: `ACTIVE`, `EXPIRED`.
- `events.status`: `DRAFT`, `OPEN`, `CLOSED`.
- `registrations.status`: `REGISTERED`, `CANCELLED`.
- `connections.status`: `PENDING`, `ACCEPTED`; chỉ `ACCEPTED` được tính là kết nối thành công.
- `leads.status`: `NEW`, `WARM`, `HOT`, `CONVERTED`.

Không được thêm trạng thái mới trong quá trình vibe code nếu chưa cập nhật state machine, API contract, UI state và test case.

**Nguồn:** `one-connect-database-erd.md`, mục 1–3; `one-connect-sprint-plan-task-breakdown.md`, mục 7–9.

## 4. Input, output và luồng dữ liệu chính

### 4.1. Identity onboarding

**Input:** token từ NFC/QR, email hoặc số điện thoại, OTP, họ tên, chức vụ, bio, avatar, social links, tên doanh nghiệp, mã số thuế, ngành nghề, website, privacy choice.

**Xử lý:** validate token/card; gửi và xác thực OTP; tạo hoặc cập nhật `users`; tạo `businesses` nếu có; liên kết `cards`; ghi audit privacy.

**Output:** session hợp lệ, digital profile, QR/deep link và trạng thái card.

**Lỗi tối thiểu phải xử lý:** token sai/hết hạn, card locked/revoked, OTP sai/hết hạn, vượt rate limit, email/số điện thoại trùng, thiếu trường bắt buộc.

### 4.2. Registration và check-in

**Input:** event link hoặc event ID, authenticated user, QR payload/NFC card UID, operator session.

**Xử lý:** kiểm tra event `OPEN`; chống đăng ký trùng; tại cửa kiểm tra registration hợp lệ; ghi `check_ins` với method, timestamp và operator; dùng transaction/idempotency cho quét lặp hoặc retry mạng.

**Output:** registration status, check-in success/failure, attendee counter và audit event.

**Lỗi tối thiểu phải xử lý:** event đã đóng, user chưa đăng ký, QR không hợp lệ, card không tồn tại/khóa, đã check-in, operator không đủ quyền, mạng chập chờn.

### 4.3. Connection và consent

**Input:** public profile URL từ NFC/QR, authenticated receiver, event context, nút Connect.

**Xử lý:** chỉ hiển thị field được phép public; chặn self-connect và duplicate; tạo `connections.status = PENDING`; receiver accept/decline; chỉ `ACCEPTED` mới xuất hiện trong My Connections.

**Output:** connection status, notification/state UI, relationship context và quyền tạo note/lead sau khi kết nối.

**Lỗi tối thiểu phải xử lý:** profile private, user bị khóa, connection trùng, người dùng tự kết nối với chính mình, request trái quyền, request đã xử lý.

### 4.4. Relationship memory và follow-up

**Input:** connection ID, private note, tags, lead status, follow-up date, next action.

**Xử lý:** kiểm tra owner/author; lưu note riêng tư; gắn lead vào connection; kiểm tra ngày và state hợp lệ.

**Output:** connection detail có bối cảnh sự kiện, note, tag, trạng thái lead và hành động tiếp theo.

## 5. Bản đồ màn hình và route đề xuất

### Nhóm A — onboarding và public profile

- `/tap/:cardToken` — `SCR-A01`, landing từ NFC/QR.
- `/auth/otp` — `SCR-A02`, gửi và xác thực OTP.
- `/onboarding/profile` — `SCR-A03`, tạo identity/business.
- `/profile/:userId` — `SCR-A04`, public profile và Connect.

### Nhóm B — member app

- `/app` — `SCR-B01`, digital card và QR.
- `/app/connections` — `SCR-B02`, accepted connections, tìm kiếm, tag filter.
- `/app/connections/:id` — `SCR-B03`, context, note, lead và follow-up.
- `/app/events` — `SCR-B04`, upcoming/history và registration state.
- `/app/settings` — `SCR-B05`, privacy, card management, data rights.

### Nhóm C — association admin

- `/admin/association` — `SCR-C01`, metrics theo organization.
- `/admin/association/members` — `SCR-C02`, member directory và roles.
- `/admin/association/events` — `SCR-C03`, event CRUD.

### Nhóm D — event organizer

- `/organizer/events/:id` — `SCR-D01`, event operations home.
- `/organizer/events/:id/check-in` — `SCR-D02`, QR/NFC terminal.
- `/organizer/events/:id/attendees` — `SCR-D03`, attendee directory.
- `/organizer/events/:id/report` — `SCR-D04`, report và guarded CSV export.

Các màn hình phải có đủ trạng thái loading, empty, error, success, permission denied, offline/weak network và reduced motion khi có animation.

## 6. Xây dựng theo lát cắt dọc

Không xây riêng toàn bộ frontend rồi mới nối backend. Mỗi Sprint phải tạo ra một luồng chạy được từ UI đến dữ liệu, có test, log và demo.

### Slice S0 — Foundation

**Mục tiêu:** nền kỹ thuật, schema 11 bảng, auth/RBAC, CI/CD, log, KPI events và PWA shell.

**Đầu vào:** quyết định stack, cloud, domain, secret, OTP sandbox.

**Đầu ra:** staging deploy được lặp lại; migration; permission matrix; error code; correlation ID; shell responsive.

**Acceptance:** automated check chặn merge khi lỗi; migration an toàn; không lộ secret; sai role bị từ chối; dữ liệu test được phân loại.

**Negative tests:** token hết hạn, sai role, cross-tenant access, migration duplicate/FK failure, log chứa secret.

### Slice S1 — Identity & Card

**Mục tiêu:** người dùng có thể kích hoạt identity từ NFC/QR, hoàn thành profile, xem public profile và thay thẻ không mất lịch sử.

**Đầu vào:** card token/UID, contact, OTP, profile form.

**Đầu ra:** user/business/card, session, profile theo privacy, QR deep link.

**Acceptance:** OTP hợp lệ mới tạo session; profile private không lộ field; card replacement bảo toàn membership/event/connection history.

### Slice S2 — Organization & Event

**Mục tiêu:** admin tạo tổ chức, mời thành viên, tạo event và mở registration.

**Đầu vào:** organization form, invite contact, event form, user session/role.

**Đầu ra:** organization, membership, event, registration state.

**Acceptance:** tenant isolation; role đúng; event state hợp lệ; một user không đăng ký trùng một event; event đóng không nhận registration.

### Slice S3 — Event Operations

**Mục tiêu:** chứng minh check-in QR end-to-end và NFC sau PoC, có fallback rõ ràng.

**Đầu vào:** QR payload hoặc NFC UID, event context, operator session.

**Đầu ra:** check-in success, attendee counters, method, timestamp, error code.

**Acceptance:** không tạo check-in trùng; phản hồi mục tiêu dưới 1 giây; QR vẫn chạy khi NFC không hỗ trợ; có benchmark và error-rate report.

### Slice S4 — Networking & Pilot Ready

**Mục tiêu:** hoàn tất connection consent, note, lead, report, data rights và rehearsal.

**Đầu vào:** profile interaction, connect request, consent action, note/lead form.

**Đầu ra:** accepted connections, relationship memory, lead state, post-event report, export/delete audit.

**Acceptance:** chỉ accepted mới được tính; note chỉ owner đọc/sửa; report khớp DB; không còn Blocker/Critical; Go/No-Go được PO ký.

**Nguồn:** `one-connect-mvp-sprint-plan-task-breakdown.md`, mục 4–9.

## 7. Nguyên tắc vibe coding và quyền kiểm soát

### 7.1. Mỗi thay đổi phải có phạm vi nhỏ

AI chỉ nhận một task có thể hoàn tất trong một lát cắt nhỏ. Prompt phải nêu: persona, màn hình, API/dữ liệu, acceptance criteria, negative tests và file dự kiến thay đổi.

Không yêu cầu “xây toàn bộ app” trong một lần. Không cho phép AI tự thêm tính năng ngoài scope hoặc đổi schema mà không cập nhật brief.

### 7.2. Luôn yêu cầu AI giải thích code

Sau mỗi thay đổi, yêu cầu AI trả lời bốn câu:

1. File nào đã được tạo hoặc sửa? Mỗi file chịu trách nhiệm gì?
2. Luồng dữ liệu chạy từ input đến output qua những module/API nào?
3. Các điểm yếu bảo mật có thể có là gì: auth, RBAC, privacy, injection, leakage, replay, rate limit?
4. Test nào đã chạy, kết quả là gì và phần nào chưa được kiểm chứng?

Nếu AI không giải thích được data flow hoặc security impact, không merge thay đổi.

### 7.3. Kiểm thử liên tục

Sau mỗi thay đổi nhỏ phải chạy tối thiểu:

- typecheck/lint/build;
- unit test cho validation và state transition;
- API/integration test cho database mutation;
- UI smoke test cho loading/error/success/empty;
- regression test khu vực bị tác động.

Với check-in, consent, RBAC, card replacement và data rights, luôn có negative test và retry/network test.

### 7.4. Khi app hỏng, phải gửi error log đầy đủ

Không mô tả chung như “app không chạy”. Hãy copy nguyên văn:

```text
[THỜI GIAN]
[MÔI TRƯỜNG: local / staging / pilot]
[THIẾT BỊ + TRÌNH DUYỆT]
[ACTION NGAY TRƯỚC KHI LỖI]
[URL / API ENDPOINT]
[HTTP STATUS]
[TOÀN BỘ ERROR LOG]
[STACK TRACE]
[REQUEST ID / CORRELATION ID]
[KẾT QUẢ MONG ĐỢI]
[KẾT QUẢ THỰC TẾ]
[BƯỚC ĐÃ THỬ]
```

Không gửi token, mật khẩu, OTP hoặc dữ liệu cá nhân thật trong log chia sẻ cho AI.

### 7.5. Checkpoint và rollback

Checkpoint bắt buộc tại các cổng: sau S0 foundation, sau S1 identity, sau S2 event, sau S3 check-in và trước Pilot Go/No-Go. Mỗi checkpoint cần có: mã phiên bản, nội dung thay đổi, test đã chạy, migration, biến môi trường, known issues và hướng rollback.

Không reset phá hủy lịch sử. Khi cần quay lại, dùng rollback tới checkpoint ổn định và ghi lại lý do.

## 8. Bảo mật, riêng tư và tuân thủ

- Public Profile chỉ render trường được phép; `users.is_public` không được xử lý chỉ ở frontend.
- Kết nối phải có consent; `PENDING` không được hiển thị như mutual connection.
- Note và lead là dữ liệu riêng tư; kiểm tra owner ở backend cho mọi read/write.
- API phải có RBAC và tenant isolation; không tin `org_id`, `user_id` hoặc role do client gửi.
- OTP có timeout, resend control, rate limit và không ghi vào log.
- Card token/QR cần chống replay; card locked/revoked không được mở dữ liệu riêng tư.
- CSV export phải guarded theo quyền, lọc dữ liệu tối thiểu và ghi audit.
- Có flow export/delete data rights được legal owner duyệt trước Pilot.
- Dev/staging dùng dữ liệu tổng hợp hoặc đã ẩn danh; không dùng dữ liệu cá nhân thật.

Tài liệu kỹ thuật phải được đối chiếu với đầu mối pháp lý trước khi triển khai Pilot; brief không thay thế tư vấn pháp lý.

**Nguồn:** `one-connect-prd.md`, mục 5; `one-connect-database-erd.md`, mục 3; `one-connect-mvp-sprint-plan-task-breakdown.md`, mục 3 và 9.

## 9. KPI và tiêu chí Pilot

| Nhóm | Chỉ số | Mục tiêu theo Pilot Plan | Cách đo |
|---|---|---:|---|
| Hiệu năng | Check-in latency | `< 1,0 giây/lượt` | Từ scan đến success trên terminal |
| Ổn định | Error rate | `< 0,5%` giao dịch | Log hệ thống trong event |
| Kích hoạt | Activation rate | `≥ 80%` khách tham dự | Hoàn tất profile / khách đăng ký |
| Networking | Connection rate | `≥ 5 kết nối/user` | Connections ở trạng thái `ACCEPTED` |
| Consent | Consent acceptance | `≥ 90%` yêu cầu | Accepted / request hợp lệ |
| Hài lòng | NPS | `≥ 50` | Khảo sát sau sự kiện |

Pilot target là mục tiêu đo lường, không phải số liệu đã đạt. Hệ thống phải ghi đủ event để tính KPI và có thể truy vết ngược tới bản ghi nguồn.

Phương án dự phòng: QR khi NFC lỗi; volunteer hỗ trợ tại cửa; local caching/offline mode chỉ triển khai sau khi được duyệt và phải có cơ chế đồng bộ, chống trùng.

**Nguồn:** `one-connect-pilot-plan-kpis.md`, mục 1–4.

## 10. Definition of Ready / Definition of Done

### Definition of Ready (DoR)

User story chỉ vào Sprint khi có persona, giá trị kinh doanh, màn hình, input/output, API/data impact, acceptance criteria, thiết kế đã duyệt, privacy purpose, field tối thiểu, quyền truy cập, retention dự kiến và hành vi khi user từ chối/rút consent.

### Definition of Done (DoD)

Story hoàn thành khi code review đạt; migration/API/UI chạy trên staging; test phù hợp đạt; regression khu vực tác động đạt; không còn Blocker/Critical; telemetry/log hoạt động; tài liệu/runbook cập nhật; PO nghiệm thu. Consent, RBAC, check-in và card replacement bắt buộc có negative test.

## 11. Prompt khởi động cho AI coding agent

Sao chép prompt dưới đây khi bắt đầu xây dựng:

```text
Bạn là kỹ sư full-stack và QA đồng hành xây dựng One Connect Network MVP v1.0.

Bối cảnh sản phẩm:
- Đây là PWA dùng thật trong Pilot một sự kiện doanh nhân 150–300 người.
- Ba persona chính: attendee, association admin, event organizer.
- Core loop: Identity → Registration → Check-in → Consent Connection → Relationship Memory → Report.
- NFC/QR là access interface; QR luôn là fallback cho NFC.
- MVP không gồm full CRM, marketplace, AI matching, payment, social feed hoặc blockchain/NFT.

Task hiện tại: [MÔ TẢ MỘT LÁT CẮT NHỎ]

Persona và bối cảnh: [AI ĐANG LÀM GÌ]
Input: [TRƯỜNG DỮ LIỆU / PAYLOAD]
Output: [UI STATE / API RESPONSE / DB MUTATION]
Màn hình: [SCR-* hoặc route]
Bảng dữ liệu: [TABLES]
Acceptance criteria:
1. [CRITERION]
2. [CRITERION]
Negative tests:
1. [CASE]
2. [CASE]

Ràng buộc:
- Không tự thêm scope.
- Không đặt trust ở frontend cho auth, RBAC, privacy hoặc consent.
- Không dùng dữ liệu cá nhân thật.
- Nếu quyết định kỹ thuật chưa có trong brief, hãy dừng và hỏi, không tự đoán.
- Chạy test sau thay đổi và trả về toàn bộ command + kết quả.

Trước khi sửa code, hãy nêu kế hoạch file-level ngắn.
Sau khi sửa code, hãy giải thích:
1. File nào thay đổi và trách nhiệm của từng file.
2. Data flow từ input đến output.
3. Security weaknesses và cách giảm thiểu.
4. Test đã chạy, kết quả, known issues và checkpoint đề xuất.
```

## 12. Backlog quyết định chưa được phép tự đoán

Các mục dưới đây phải được người phụ trách chốt bằng decision record trước khi build sâu:

- stack frontend/backend/database và môi trường cloud;
- OTP provider, chi phí, email/SMS fallback;
- ma trận thiết bị NFC và thư viện đọc NFC;
- domain, secret management, CI/CD và monitoring;
- nội dung privacy notice, consent wording, retention, export/delete;
- mô hình tenant và phân quyền chi tiết;
- offline/local cache có được phép trong Pilot không;
- thiết bị, số cổng check-in, chất lượng mạng và runbook vận hành;
- ngày Pilot, đối tác Pilot, nhân lực thật và ngân sách.

## 13. Trình tự bàn giao cho đội phát triển

1. PO duyệt scope và decision backlog.
2. Tech Lead chốt stack, auth, database, OTP và PoC NFC.
3. Thiết kế DoR cho S0; tạo repository, CI/CD và staging.
4. Xây S0 rồi checkpoint.
5. Xây S1 identity/card; demo luồng NFC/QR → OTP → profile; checkpoint.
6. Xây S2 organization/event/registration; checkpoint.
7. Xây S3 QR check-in trước, NFC sau PoC; đo latency; checkpoint.
8. Xây S4 consent/networking/note/lead/report/data rights; rehearsal.
9. UAT trên seed data, kiểm tra regression, chuẩn bị runbook và Go/No-Go.
10. Pilot thật, thu KPI, error log và feedback; không thương mại hóa rộng trước khi review hậu sự kiện.

## 14. Kết luận

One Connect MVP cần được vibe code như một **hệ thống quan hệ có dữ liệu và quyền kiểm soát**, không phải một landing page có hiệu ứng NFC. Cách làm đúng là tạo từng lát cắt dọc có thể demo và kiểm thử, bắt đầu từ identity, đi qua event operations, rồi hoàn thiện consent và relationship memory. Mỗi bước phải có input/output rõ, error log đầy đủ, giải thích code, test và checkpoint có thể rollback.

---

**Tài liệu nguồn chính:** `one-connect-prd.md`; `one-connect-user-flows.md`; `one-connect-database-erd.md`; `one-connect-screen-list.md`; `one-connect-mvp-sprint-plan-task-breakdown.md`; `one-connect-pilot-plan-kpis.md`.

## References

[1]: file:///home/ubuntu/production/one-connect-prd.md "ONE CONNECT — Product Requirement Document MVP v1.0"
[2]: file:///home/ubuntu/production/one-connect-user-flows.md "ONE CONNECT — User Flows MVP"
[3]: file:///home/ubuntu/production/one-connect-database-erd.md "ONE CONNECT — Database / Data Model ERD MVP"
[4]: file:///home/ubuntu/production/one-connect-screen-list.md "ONE CONNECT — Screen List MVP"
[5]: file:///home/ubuntu/production/one-connect-mvp-sprint-plan-task-breakdown.md "ONE CONNECT — MVP Sprint Plan & Task Breakdown"
[6]: file:///home/ubuntu/production/one-connect-pilot-plan-kpis.md "ONE CONNECT — Pilot Plan & KPI Framework"
