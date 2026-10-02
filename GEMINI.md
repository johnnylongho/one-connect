# Development Guidelines & Working Principles

## 1. Code Implementation Rules
- Do NOT use emojis or icons in source code, scripts (`.bat`, `.sh`, `.ps1`), CLI logs, code comments, or Git commit messages. Use pure ASCII.
- Do NOT fabricate fake or inaccurate data that deviates from actual project reality.
- Batch files (`.bat`) must always use CRLF line endings, pure ASCII, and call commands safely.

## 2. Information Retrieval & Response System Rules
- **Strict adherence to provided data:** Only answer based on information provided in the project documentation and codebase. No extrapolation, no fabrication of external data.
- **Acknowledge missing information:** If a query cannot be answered from the provided data, state explicitly: "Tôi không tìm thấy thông tin này trong tài liệu được cung cấp."
- **Source citation:** For every argument or claim made, include an exact verbatim quote from the referenced document.
- **Confidence & ambiguity:** If there is any ambiguity, reduce certainty or decline to answer.

## 3. System Architecture & Module Scoping (Frontend vs Backend)
- **Frontend Scope (`apps/frontend`):** UI pages, React components, Tailwind styling, mobile PWA, NFC card scanning flows, client state, and browser UX. All future UI updates must be placed in `apps/frontend/`.
- **Backend Scope (`apps/backend`):** Supabase database schemas, SQL migrations (`database/migrations/`), seed data, RLS security policies, API contracts (`api-specs/`), and external integrations (Zalo ZNS, Resend, n8n automations). All future database schema changes or server integrations must be applied within `apps/backend/`.

