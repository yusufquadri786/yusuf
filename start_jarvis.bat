@echo off
title JARVIS X Backend
echo ========================================
echo        JARVIS X BACKEND
echo ========================================
if not exist .env (
  echo.
  echo ERROR: .env was not found.
  echo Copy .env.example to .env and add your private AI API key.
  echo.
  pause
  exit /b 1
)
python -m pip install -r requirements-jarvis.txt
echo.
echo Starting JARVIS at http://127.0.0.1:8000
echo Keep this window open while using jarvis.html
echo.
python jarvis_server.py
pause
