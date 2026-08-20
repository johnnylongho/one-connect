@echo off
chcp 65001 >nul
title ONE CONNECT - BAT DAU PHIEN LAM VIEC
color 0B

:: 1. Chuyen huong den thu muc ma nguon one-connect
cd /d "%~dp0"
if exist "one-connect\package.json" (
    cd /d "%~dp0one-connect"
)

cls
echo ====================================================================
echo   ONE CONNECT NETWORK - KHOI DONG PHIEN LAM VIEC
echo ====================================================================
echo.

:: 2. Kiem tra Git
where git >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [LOI] Khong tim thay Git tren may tinh!
    echo Vui long cai dat hoac kiem tra lai bien moi truong Git.
    echo.
    pause
    exit /b 1
)

:: 3. Dong bo code moi nhat tu GitHub
echo [1/3] Dang kiem tra va tai code moi nhat tu GitHub...
git pull origin main
if %errorlevel% neq 0 (
    color 0E
    echo [CANH BAO] Chua the tai code moi nhat tu GitHub - kiem tra mang hoac conflict.
    echo Ban van co the tiep tuc chay code hien tai tren may.
) else (
    echo [OK] Da dong bo ban moi nhat tu GitHub thanh cong!
)
echo.

:: 4. Mo trinh duyet tu dong
color 0B
echo [2/3] Dang chuan bi mo trinh duyet toi http://localhost:3000 ...
start /b cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:3000"
echo.

:: 5. Khoi dong Dev Server
echo [3/3] Dang khoi dong Dev Server...
echo ====================================================================
echo   Server dang chay! Hay giu cua so nay trong khi lam viec.
echo   Nhan Ctrl+C de dung server khi muon nghi.
echo ====================================================================
echo.

where pnpm >nul 2>nul
if %errorlevel% equ 0 (
    pnpm dev
) else (
    npm run dev
)

pause
