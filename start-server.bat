@echo off
title One Connect Localhost Webserver
echo =========================================================================
echo               ONE CONNECT LOCALHOST SERVER LAUNCHER
echo =========================================================================
echo.
echo Dang khoi dong Webserver bang PowerShell...
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
