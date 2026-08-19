@echo off
chcp 65001 >nul
title ONE CONNECT - KET THUC & DONG BO CLOUD
color 0A

cd /d "%~dp0"

:SYNC_PROCESS
cls
echo ====================================================================
echo   ONE CONNECT NETWORK - KET THUC & DONG BO LEN GITHUB
echo ====================================================================
echo.

:: 1. Kiem tra Git
where git >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [LOI] Khong tim thay Git tren he thong!
    echo Vui long kiem tra lai phan mem Git.
    pause
    exit /b 1
)

:: 2. Kiem tra xem co file thay doi khong
echo [1/3] Kiem tra trang thai thay doi ma nguon...
git status -s > temp_changes.txt
set /p HAS_CHANGES=<temp_changes.txt
del temp_changes.txt >nul 2>nul

if "%HAS_CHANGES%"=="" (
    echo [THONG TIN] Khong co file moi nao bi thay doi.
    echo He thong se kiem tra va day cac commit con ton dong len Cloud...
) else (
    echo Danh sach cac file vua duoc thay doi:
    echo --------------------------------------------------------------------
    git status -s
    echo --------------------------------------------------------------------
    echo.
    echo [2/3] Dang dong goi cac thay doi (git add)...
    git add -A

    echo.
    set "CUSTOM_MSG="
    set /p CUSTOM_MSG="Nhap ghi chu cho phien lam viec nay (Nhan Enter de dung mac dinh): "

    if "%CUSTOM_MSG%"=="" (
        set "CUSTOM_MSG=Dong bo tu %COMPUTERNAME% luc %DATE% %TIME%"
    )

    git commit -m "%CUSTOM_MSG%"
    if %errorlevel% neq 0 (
        echo [THONG BAO] Khong can tao commit moi.
    )
)

echo.
echo [3/3] Dang day du lieu len GitHub (git push origin main)...
git push origin main
set PUSH_RESULT=%errorlevel%

echo.
if %PUSH_RESULT% equ 0 (
    color 0A
    echo ====================================================================
    echo   [THANH CONG] DONG BO HOAN TAT 100%!
    echo ====================================================================
    echo   - Ban cap nhat moi nhat:
    git log -1 --format="     + Commit: %%h - %%s"
    echo   - GitHub Repo: https://github.com/johnnylongho/one-connect
    echo   - Live Web:    https://one-connect-network.vercel.app/
    echo.
    echo   >>> BAN CO THE YEN TAM TAT MAY HOAC DI CHUYEN! <<<
    echo ====================================================================
) else (
    color 0C
    echo ====================================================================
    echo   [CANH BAO] DONG BO CLOUD THAT BAI! KHONG NEN TAT MAY NGAY!
    echo ====================================================================
    echo   Nguyen nhan co the do:
    echo    1. Mat ket noi Internet tren thiet bi nay.
    echo    2. Tren GitHub dang co ban moi hon chua duoc keo ve (Conflict).
    echo       (Thu chay file 1_BAT_DAU_LAM_VIEC.bat truoc de pull ve).
    echo    3. Het han Token / Quyen dang nhap GitHub.
    echo.
    echo   Ban co muon thu lai khong?
    set /p RETRY="Go Y de thu dong bo lai (hoac nhan Enter de thoat): "
    if /i "%RETRY%"=="Y" (
        goto SYNC_PROCESS
    )
)

echo.
pause
