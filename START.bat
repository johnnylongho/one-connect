@echo off
title One Connect — START Working Session
color 0A
echo =========================================================================
echo             🚀 ONE CONNECT NETWORK — KHOI DONG PHIEN LAM VIEC
echo =========================================================================
echo.

:: Setup Node.js & pnpm PATH
set "PATH=C:\Program Files\nodejs;%USERPROFILE%\AppData\Roaming\npm;%APPDATA%\npm;%PATH%"

cd /d "%~dp0one-connect"

echo [1/3] 🔄 Dang cap nhat ma nguon moi nhat tu GitHub (git pull)...
git pull origin main

:: Tu dong dong bo file docx va md tu docs ra thu muc goc
xcopy /y /d "%~dp0docs\*.docx" "%~dp0..\" >nul 2>nul
xcopy /y /d "%~dp0docs\*.md" "%~dp0..\" >nul 2>nul

echo.
echo [2/3] 🌐 Dang mo trinh duyet http://localhost:3000...
start "" "http://localhost:3000"

echo.
echo [3/3] ⚡ Dang khoi dong Next.js Server (Turbopack)...
echo (Hay de cua so nay chay trong suot qua trinh lam viec)
echo =========================================================================
echo.
where pnpm >nul 2>nul
if %errorlevel% equ 0 (
    pnpm dev
) else (
    npm run dev
)
pause
