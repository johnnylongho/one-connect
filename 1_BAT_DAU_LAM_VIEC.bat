@echo off
chcp 65001 >nul
title ONE CONNECT - BẮT ĐẦU PHIÊN LÀM VIỆC
color 0B

echo ====================================================================
echo   ONE CONNECT NETWORK - KHỞI ĐỘNG PHIÊN LÀM VIỆC
echo ====================================================================
echo.

cd /d "%~dp0"

echo [1/3] Đang kiểm tra và tải code mới nhất từ GitHub (git pull)...
git pull origin main
if %errorlevel% neq 0 (
    echo [CẢNH BÁO] Chưa thể tải code mới nhất (kiểm tra mạng hoặc conflict).
    echo Bạn vẫn có thể tiếp tục chạy code hiện tại trên máy.
) else (
    echo [OK] Đã đồng bộ bản mới nhất từ GitHub thành công!
)
echo.

echo [2/3] Đang mở trình duyệt tới http://localhost:3000 ...
start http://localhost:3000
echo.

echo [3/3] Đang khởi động Dev Server (Turbopack)...
echo ====================================================================
echo   Server đang chạy! Hãy giữ cửa sổ này trong khi làm việc.
echo   Nhấn Ctrl+C để dừng server khi muốn nghỉ.
echo ====================================================================
echo.

npm run dev
pause
