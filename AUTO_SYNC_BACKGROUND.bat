@echo off
title One Connect - Auto Sync Cloud Daemon (Moi 10 Phut)
color 0B
cls
echo ====================================================================
echo   ONE CONNECT NETWORK - TIEN TRINH TU DONG DONG BO GITHUB CLOUD
echo   Kich hoat: Tu dong Commit & Push moi 10 phut
echo ====================================================================
echo.
echo [INFO] Tien trinh dang chay ngam. Ban co the thu nho cua so nay xuong.
echo.

:loop
echo [%date% %time%] Dang kiem tra thay doi ma nguon...
git status --porcelain > nul 2>&1
git diff --quiet
if %errorlevel% neq 0 (
    echo [DETECTED] Phat hien co thay doi moi, dang tu dong dong bo len GitHub...
    git add -A
    git commit -m "Auto-save snapshot: %date% %time%"
    git push origin main
    echo [SUCCESS] Da sao luu an toan len GitHub Cloud thanh cong!
) else (
    echo [CLEAN] Ma nguon da o trang thai dong bo moi nhat.
)

echo.
echo [TIMER] Dang cho 10 phut cho lan sao luu tiep theo... (Nhan Ctrl+C de dung)
timeout /t 600 /nobreak > nul
goto loop
