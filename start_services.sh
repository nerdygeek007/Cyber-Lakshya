#!/bin/bash
# =========================================================================
# Cyber Lakshya (SIH-2026 / CHA-39) — Dual Microservice Launcher
# =========================================================================
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_PYTHON="$ROOT_DIR/ml-service/venv/bin/uvicorn"

echo "========================================================================="
echo "🛡️ CYBER LAKSHYA — DUAL MICROSERVICE GATEWAY (CHA-39)"
echo "========================================================================="
echo "[1] 🤖 ML Engine:  http://localhost:8000 (UI: http://localhost:8000/ui)"
echo "[2] 🛡️ RBAC-IAM:   http://localhost:5000 (Docs: http://localhost:5000/docs)"
echo "========================================================================="

# Start RBAC-IAM on port 5000 in background
cd "$ROOT_DIR/rbac-iam-service"
"$VENV_PYTHON" app:app --host 0.0.0.0 --port 5000 --reload &
RBAC_PID=$!
echo "[+] RBAC-IAM Service started on port 5000 (PID: $RBAC_PID)"

# Start ML Service on port 8000 in foreground
cd "$ROOT_DIR/ml-service"
echo "[+] ML Anomaly Engine started on port 8000..."
"$VENV_PYTHON" app:app --host 0.0.0.0 --port 8000 --reload

trap "kill $RBAC_PID" EXIT
