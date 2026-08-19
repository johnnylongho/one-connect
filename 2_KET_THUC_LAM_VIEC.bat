@echo off
chcp 65001 >nul
title ONE CONNECT - KET THUC VA DONG BO CLOUD
color 0A

:: 1. Chuyen huong den thu muc repo git
cd /d "%~dp0"
if not exist "package.json" (
    if exist "one-connect\package.json" (
        cd /d "%~dp0\one-connect"
    )
)

:SYNC_PROCESS
cls
echo ====================================================================
echo   ONE CONNECT NETWORK - KET THUC VA DONG BO LEN GITHUB
echo ====================================================================
echo.

:: 2. Kiem tra Git
where git >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [LOI] Khong tim thay Git tren he thong!
    echo Vui long kiem tra lai phan mem Git.
    pause
    exit /b 1
)

:: 3. Kiem tra thay doi ma nguon
echo [1/3] Kiem tra trang thai thay doi ma nguon...
git status --porcelain > "%temp%\oc_git_status.tmp"

set HAS_CHANGES=0
for /f "usebackq delims=" %%A in ("%temp%\oc_git_status.tmp") do (
    set HAS_CHANGES=1
)
if exist "%temp%\oc_git_status.tmp" del "%temp%\oc_git_status.tmp" >nul 2>nul

if "%HAS_CHANGES%"=="0" goto NO_LOCAL_CHANGES

:HAS_LOCAL_CHANGES
echo Danh sach cac file vua duoc thay doi:
echo --------------------------------------------------------------------
git status -s
echo --------------------------------------------------------------------
echo.
echo [2/3] Dang dong goi cac thay doi (git add)...
git add -A

echo.
set "USER_INPUT="
set /p USER_INPUT="Nhap ghi chu cho phien lam viec (Nhan Enter de dung mac dinh): "

if "%USER_INPUT%"=="" (
    set "USER_INPUT=Dong bo tu %COMPUTERNAME% luc %TIME%"
)

git commit -m "%USER_INPUT%"
goto DO_PUSH

:NO_LOCAL_CHANGES
echo [THONG TIN] Toan bo ma nguon da duoc dong bo sach se.
echo He thong se kiem tra va day cac commit ton dong len Cloud neu co.
goto DO_PUSH

:DO_PUSH
echo.
echo [3/3] Dang day du lieu len GitHub (git push origin main)...
git push origin main
if %errorlevel% neq 0 goto PUSH_FAILED

:PUSH_SUCCESS
color 0A
echo.
echo ====================================================================
echo   [THANH CONG] DONG BO HOAN TAT 100%% LEN GITHUB!
echo ====================================================================
echo   - Ban cap nhat moi nhat tren Cloud:
git log -1 --format="     + Commit: %%h - %%s"
echo   - GitHub Repo: https://github.com/johnnylongho/one-connect
echo   - Live Web:    https://one-connect-network.vercel.app/
echo.
echo   [OK] TOAN BO MA NGUON DA AN TOAN - BAN CO THE YEN TAM TAT MAY!
echo ====================================================================
echo.
echo Nhan phim bat ky de dong cua so nay...
pause >nul
exit /b 0

:PUSH_FAILED
color 0C
echo.
echo ====================================================================
echo   [CANH BAO] DONG BO CLOUD CHUA HOAN TAT!
echo ====================================================================
echo   Nguyen nhan co the do:
echo    1. Mat ket noi Internet tren thiet bi nay.
echo    2. Tren GitHub dang co ban moi hon chua duoc keo ve (Conflict).
echo    3. Quyen dang nhap hoac token GitHub can duoc xac thuc lai.
echo.
set /p RETRY="Go Y de thu dong bo lai (hoac nhan Enter de thoat): "
if /i "%RETRY%"=="Y" goto SYNC_PROCESS

echo.
echo Nhan phim bat ky de dong cua so nay...
pause >nul
exit /b 1
