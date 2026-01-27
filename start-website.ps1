# TechHub Website Startup Script
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "     TechHub E-Commerce Website" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check if MySQL is running
$mysql = Get-Process -Name "mysqld" -ErrorAction SilentlyContinue
if (-not $mysql) {
    Write-Host "[!] MySQL is not running. Starting MySQL..." -ForegroundColor Yellow
    Start-Process "C:\xampp\mysql\bin\mysqld.exe" -WindowStyle Hidden
    Start-Sleep -Seconds 3
    Write-Host "[OK] MySQL started" -ForegroundColor Green
} else {
    Write-Host "[OK] MySQL is already running" -ForegroundColor Green
}

Write-Host ""
Write-Host "[*] Starting TechHub server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  Website: http://localhost:5000" -ForegroundColor Green
Write-Host "  API:     http://localhost:5000/api" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

# Start the server
Set-Location "$PSScriptRoot\backend"
node server.js
