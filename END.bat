@echo off
title One Connect — END Session & Auto Sync to GitHub
color 0B
echo =========================================================================
echo             💾 ONE CONNECT NETWORK — DONG BO DULIEU LEN GITHUB
echo =========================================================================
echo.

:: Setup Node.js & pnpm PATH
set "PATH=C:\Program Files\nodejs;%USERPROFILE%\AppData\Roaming\npm;%APPDATA%\npm;%PATH%"

:: Tu dong dong bo tat ca file docx va md o thu muc goc vao one-connect\docs
xcopy /y /d "%~dp0*.md" "%~dp0one-connect\docs\" >nul 2>nul
xcopy /y /d "%~dp0*.docx" "%~dp0one-connect\docs\" >nul 2>nul

cd /d "%~dp0one-connect"

echo [1/4] 🔍 Kiem tra cac file ban da chinh sua:
git status -s

echo.
echo -------------------------------------------------------------------------
set /p msg="📝 Nhap mo ta ngan noi dung da lam (Enter de dung mac dinh): "
if "%msg%"=="" set msg=Auto-sync: %date% %time%

echo.
echo [2/4] 📦 Dang dong goi cac thay doi (git add)...
git add -A

echo.
echo [3/4] 📌 Dang tao ban ghi nhot (git commit)...
git commit -m "%msg%"

echo.
echo [4/4] 🚀 Dang day du lieu an toan len GitHub (git push)...
git push origin main

echo.
echo =========================================================================
echo  ✅ [THANH CONG] Toan bo du lieu da duoc dong bo an toan len GitHub!
echo  Ban co the sang may khac va double-click "START.bat" de tiep tuc.
echo =========================================================================
echo.
pause
