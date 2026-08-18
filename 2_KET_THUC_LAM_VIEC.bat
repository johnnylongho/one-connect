@echo off
chcp 65001 >nul
title ONE CONNECT - KẾT THÚC PHIÊN LÀM VIỆC & ĐỒNG BỘ CLOUD
color 0A

echo ====================================================================
echo   ONE CONNECT NETWORK - KẾT THÚC & ĐỒNG BỘ LÊN GITHUB / VERCEL
echo ====================================================================
echo.

cd /d "%~dp0"

echo [1/4] Danh sách file có thay đổi:
git status -s
echo.

set "commit_msg="
set /p commit_msg="👉 Nhập ghi chú công việc vừa làm (Bấm Enter để dùng mặc định): "

if "%commit_msg%"=="" (
    set commit_msg=Luu tien do lam viec ngay %date% luc %time%
)

echo.
echo [2/4] Đang đóng gói các file thay đổi (git add)...
git add .

echo.
echo [3/4] Đang tạo commit lưu trữ: "%commit_msg%"...
git commit -m "%commit_msg%"

echo.
echo [4/4] Đang đẩy lên GitHub (git push origin main)...
git push origin main

if %errorlevel% equ 0 (
    echo.
    echo ====================================================================
    echo   🎉 ĐỒNG BỘ THÀNH CÔNG 100%!
    echo   - GitHub Repo: https://github.com/johnnylongho/one-connect
    echo   - Live Website: https://one-connect-pink.vercel.app/ (Vercel tự deploy)
    echo.
    echo   Bạn có thể yên tâm tắt máy!
    echo   Khi sang máy khác (Nhà/Công ty), chỉ cần click:
    echo   [ 1_BAT_DAU_LAM_VIEC.bat ] để tiếp tục!
    echo ====================================================================
) else (
    echo.
    echo [CHÚ Ý] Nếu không có thay đổi mới nào hoặc lỗi mạng, kiểm tra lại thông báo ở trên.
)

echo.
pause
