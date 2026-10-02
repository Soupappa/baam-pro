@echo off
setlocal
call "%~dp0..\_tools\portguard.bat" 8088 "BAAM.pro"
if errorlevel 1 exit /b 1
cd /d "%~dp0"
start "" http://127.0.0.1:8088
node server.js
endlocal

