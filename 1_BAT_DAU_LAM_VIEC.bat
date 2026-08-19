@echo off
chcp 65001 >nul
title ONE CONNECT - KHOI DONG & DONG BO PHIEN LAM VIEC
color 0B

cd /d "%~dp0"

echo ====================================================================
echo   ONE CONNECT NETWORK - BAT DAU PHIEN LAM VIEC
echo ====================================================================
echo.

:: 1. Kiem tra Git
where git >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [LOI] Khong tim thay Git tren may tinh nay!
    echo Vui long cai dat Git truoc khi tiep tuc.
    echo.
    pause
    exit /b 1
)

:: 2. Kiem tra xung dot hoac thay doi chua luu truoc khi pull
echo [1/4] Kiem tra trang thai ma nguon hien tai...
git status -s > temp_status.txt
set /p LOCAL_CHANGES=<temp_status.txt
del temp_status.txt >nul 2>nul

if not "%LOCAL_CHANGES%"=="" (
    color 0E
    echo [CANH BAO] Phat hien cac file da bi chinh sua cuc bo tren may nay:
    git status -s
    echo.
    echo He thong se tien hanh luu tam (stash) hoac tu dong hop nhat khi tai ban moi nhat.
    echo.
)

:: 3. Pull code moi nhat tu GitHub
echo [2/4] Dang tai ban moi nhat tu GitHub (git pull origin main)...
git pull origin main
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo ====================================================================
    echo [CANH BAO] KHONG THE TAI CODE MOI NHAT!
    echo Nguyen nhan co the do:
    echo  1. Mat ket noi Internet.
    echo  2. Xung dot code (Conflict) giua may nha va may cong ty.
    echo.
    echo Ban van co the chay code hien co tren may, hoac kiem tra lai mang.
    echo ====================================================================
    echo.
) else (
    color 0A
    echo [OK] Dong bo ban moi nhat tu Cloud thanh cong!
    echo Ban code hien tai:
    git log -1 --format=" - Commit: %%h - %%s (%%cr)"
    echo.
)

:: 4. Hoi y kien chay Dev Server
color 0B
echo [3/4] Chuan bi khoi dong moi truong Dev Server...
echo.
echo Ban co muon mo trinh duyet va chay Server ngay bay gio khong?
set /p START_DEV="Nhan Enter de bat dau (hoac go N de bo qua): "

if /i "%START_DEV%"=="N" (
    echo.
    echo [HOAN TAT] Ma nguon da duoc cap nhat moi nhat.
    pause
    exit /b 0
)

echo.
echo [4/4] Dang khoi dong Dev Server...
echo Dang mo trinh duyet http://localhost:3000 sau 3 giay...
start /b cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:3000"

echo ====================================================================
echo   Server dang chay! Hay giu cua so nay trong khi lam viec.
echo   Nhan Ctrl+C de dung server khi muon nghi.
echo ====================================================================
echo.

:: Chay bang pnpm neu co, nguoc lai dung npm
where pnpm >nul 2>nul
if %errorlevel% equ 0 (
    pnpm dev
) else (
    npm run dev
)

pause
