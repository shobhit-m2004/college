$root = Split-Path -Parent $MyInvocation.MyCommand.Path

function Start-AppWindow {
  param(
    [string]$Title,
    [string]$WorkingDirectory,
    [string]$Command
  )

  $escapedDirectory = $WorkingDirectory.Replace("'", "''")
  $escapedCommand = $Command.Replace("'", "''")
  $fullCommand = "Set-Location '$escapedDirectory'; `$Host.UI.RawUI.WindowTitle = '$Title'; $escapedCommand"

  Start-Process powershell -ArgumentList "-NoExit", "-Command", $fullCommand -WorkingDirectory $WorkingDirectory
}

Start-AppWindow -Title "Backend API :7777" -WorkingDirectory (Join-Path $root "Backend") -Command "$env:PORT='7777'; npm.cmd run dev"
Start-AppWindow -Title "Patient Frontend :5173" -WorkingDirectory (Join-Path $root "Frontend") -Command "npm.cmd run dev -- --host 0.0.0.0 --port 5173"
Start-AppWindow -Title "Admin Panel :5174" -WorkingDirectory (Join-Path $root "admin") -Command "npm.cmd run dev -- --host 0.0.0.0 --port 5174"
Start-AppWindow -Title "Disease Prediction :8501" -WorkingDirectory $root -Command "streamlit run streamlit_app.py --server.port 8501 --server.address 0.0.0.0"

Write-Host ""
Write-Host "All apps are starting in separate windows with fixed local URLs:" -ForegroundColor Cyan
Write-Host "Frontend : http://localhost:5173" -ForegroundColor Green
Write-Host "Admin    : http://localhost:5174" -ForegroundColor Green
Write-Host "Backend  : http://localhost:7777" -ForegroundColor Green
Write-Host "Streamlit: http://localhost:8501" -ForegroundColor Green
Write-Host ""
