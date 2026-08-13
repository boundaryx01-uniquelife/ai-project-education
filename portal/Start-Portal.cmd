@echo off
setlocal
cd /d "%~dp0"

start "LEVEL 1 Portal Server" powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0Start-LocalPortal.ps1"
timeout /t 1 /nobreak >nul
start "" "http://127.0.0.1:8080/modules/level-1-chat-agent/"
endlocal
