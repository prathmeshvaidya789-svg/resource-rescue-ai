@echo off
title Launch Resource Rescue AI
echo Starting Resource Rescue AI Backend and Frontend...
start "Resource Rescue Backend" cmd /k "cd /d "%~dp0" && python backend\app.py"
timeout /t 2 /nobreak >nul
start "Resource Rescue Frontend" cmd /k "cd /d "%~dp0\frontend" && npm run dev"
echo.
echo ==========================================================
echo  Resource Rescue AI is launching!
echo  Frontend: http://localhost:5173
echo  Backend:  http://127.0.0.1:5000
echo ==========================================================
pause
