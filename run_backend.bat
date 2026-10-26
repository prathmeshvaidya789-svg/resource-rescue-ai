@echo off
title Resource Rescue AI - Flask Backend
echo ========================================================
echo   Resource Rescue AI - Flask Backend (Port 5000)
echo   Connecting to Ollama qwen2.5:3b
echo ========================================================
cd /d "%~dp0"
python backend\app.py
pause
