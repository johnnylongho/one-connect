# ONE CONNECT NETWORK — MONOREPO WORKSPACE

Hệ thống hạ tầng định danh doanh nhân số & kết nối giao thương B2B (AI-Powered B2B Smart Identity & Relationship Infrastructure).

---

## 1. Cấu Trúc Monorepo (Frontend & Backend)

Monorepo được tổ chức chuyên biệt thành 2 phân hệ cốt lõi:

```text
one-connect/
├── apps/
│   ├── frontend/                # Ứng dụng Web PWA (Next.js 16, React 19, Tailwind)
│   │   ├── src/app/             # Các trang người dùng, PWA, NFC routing & API Gateway
│   │   ├── src/components/      # Toàn bộ React UI components
│   │   └── package.json         # Package "@one-connect/frontend"
│   │
│   └── backend/                 # Hạ tầng Dữ liệu & Tích hợp (Supabase, SQL, Migrations)
│       ├── database/migrations/ # 13+ bảng quan hệ và lịch sử SQL migrations
│       ├── database/seed.sql    # Dữ liệu khởi tạo chuẩn
│       ├── api-specs/           # Quy chuẩn API contracts
│       ├── integrations/        # Hướng dẫn cấu hình Zalo ZNS, Resend, n8n
│       └── package.json         # Package "backend"
│
├── packages/
│   ├── ui/                      # Thư viện UI dùng chung (@repo/ui)
│   ├── eslint-config/           # Cấu hình linter chuẩn
│   └── typescript-config/       # Cấu hình tsconfig dùng chung
│
├── turbo.json                   # Cấu hình Turborepo pipeline
├── vercel.json                  # Cấu hình Vercel Production deployment
├── pnpm-workspace.yaml          # Quản lý dependencies đa gói
└── README.md
```

---

## 2. Hướng Dẫn Vận Hành & Nâng Cấp Hệ Thống

### A. Nâng cấp & Cập nhật Frontend
* Khi bổ sung trang mới, sửa giao diện, làm việc với CSS, NFC hoặc UI components:
* Mọi thao tác thực hiện trực tiếp trong `apps/frontend/`.
* Chạy dev: `pnpm --filter=frontend dev` hoặc file `1_BAT_DAU_LAM_VIEC.bat`.
* Kiểm tra types: `pnpm --filter=frontend check-types`.

### B. Nâng cấp & Cập nhật Backend
* Khi thay đổi schema cơ sở dữ liệu, thêm trường dữ liệu, cập nhật RLS hoặc tích hợp API:
* Mọi file SQL migrations lưu trữ tại `apps/backend/database/migrations/`.
* Tra cứu danh mục API tại `apps/backend/api-specs/API_REGISTRY.md`.
* Tra cứu tích hợp Zalo/Email/n8n tại `apps/backend/integrations/INTEGRATIONS.md`.

---

## 3. Lệnh Thường Dùng

```sh
# Cài đặt toàn bộ dependencies
pnpm install

# Khởi động môi trường phát triển
pnpm dev

# Build toàn bộ hệ thống
pnpm build

# Kiểm tra kiểu dữ liệu TypeScript
pnpm check-types
```
