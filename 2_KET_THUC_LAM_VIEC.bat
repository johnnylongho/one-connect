@echo off
chcp 65001 >nul
title ONE CONNECT - KET THUC & DONG BO CLOUD
color 0A

echo ====================================================================
echo   ONE CONNECT NETWORK - KET THUC & DONG BO LEN GITHUB
echo ====================================================================
echo.

cd /d "%~dp0"

echo [1/3] Kiem tra trang thai thay doi (git status)...
git status -s
echo.

echo [2/3] Dang dong goi cac file thay doi (git add)...
git add .

echo.
echo [3/3] Dang day len GitHub (git commit & push)...
git commit -m "Auto save - %DATE% %TIME%"
git push origin main

echo.
echo ====================================================================
echo   DONG BO HOAN TAT 100%!
echo   - GitHub: https://github.com/johnnylongho/one-connect
echo   - Live:   https://one-connect-network.vercel.app/
echo.
echo   Ban co the YEN TAM TAT MAY!
echo ====================================================================
echo.
pause

