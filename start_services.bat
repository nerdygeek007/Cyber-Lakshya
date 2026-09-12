@echo off
REM =========================================================================
REM Cyber Lakshya (SIH-2026 / CHA-39) — Dual Microservice Launcher (Windows)
REM =========================================================================
set ROOT_DIR=%~dp0

echo =========================================================================
echo 🛡️ CYBER LAKSHYA — DUAL MICROSERVICE GATEWAY (CHA-39)
echo =========================================================================
echo [1] 🤖 ML Engine:  http://localhost:8000 (UI: http://localhost:8000/ui)
echo [2] 🛡️ RBAC-IAM:   http://localhost:5000 (Docs: http://localhost:5000/docs)
echo =========================================================================

REM Start RBAC-IAM on Port 5000
start "Cyber Lakshya RBAC-IAM (Port 5000)" cmd /k "cd /d %ROOT_DIR%rbac-iam-service && %ROOT_DIR%ml-service\venv\Scripts\uvicorn.exe app:app --host 0.0.0.0 --port 5000 --reload"

REM Start ML Service on Port 8000
start "Cyber Lakshya ML Engine (Port 8000)" cmd /k "cd /d %ROOT_DIR%ml-service && %ROOT_DIR%ml-service\venv\Scripts\uvicorn.exe app:app --host 0.0.0.0 --port 8000 --reload"

echo [+] Both services launched in separate windows!
