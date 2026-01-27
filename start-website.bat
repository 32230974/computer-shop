@echo off
title TechHub Website Server
color 0A

echo ============================================
echo      TechHub E-Commerce Website
echo ============================================
echo.

:: Check if MySQL is running
tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I /N "mysqld.exe">NUL
if "%ERRORLEVEL%"=="1" (
    echo [!] MySQL is not running. Starting MySQL...
    start "" "C:\xampp\mysql\bin\mysqld.exe"
    timeout /t 3 /nobreak >nul
    echo [OK] MySQL started
) else (
    echo [OK] MySQL is already running
)

echo.
echo [*] Starting TechHub server...
echo.
echo ============================================
echo   Website: http://localhost:5000
echo   API:     http://localhost:5000/api
echo ============================================
echo.
echo Press Ctrl+C to stop the server
echo.

cd /d "%~dp0backend"
node server.js

pause
