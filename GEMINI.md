# Development Guidelines & Language Standards

## Language & Encoding Conventions
- **Code & Scripts:** All code files (`.ts`, `.tsx`, `.js`, `.json`), script files (`.bat`, `.sh`, `.ps1`), CLI outputs, system logs, code comments, and Git commit messages should use **English / pure ASCII** by default.
  - This avoids encoding issues (UTF-8 multibyte parsing bugs in Windows CMD, PowerShell, Turbo, or CI/CD pipelines).
- **User Interface (UI):** User-facing text, content, and product copy in the web application can be in **Vietnamese** (or multi-language) as required by product specifications.
- **Batch Files (`.bat`):** Must always be saved with **CRLF (`\r\n`)** line endings and avoid special characters or unescaped parentheses inside conditional blocks.
