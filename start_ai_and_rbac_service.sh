#!/bin/bash
# =========================================================================
# Cyber Lakshya (SIH-2026 / CHA-39) — Unified AI/ML & Zero-Trust RBAC Launcher
# =========================================================================
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ML_DIR="$ROOT_DIR/ml-service"

echo "========================================================================="
echo "🛡️ CYBER LAKSHYA — UNIFIED AI/ML & ZERO-TRUST RBAC MICROSERVICE (CHA-39)"
echo "========================================================================="
echo "[*] Launching FastAPI Gateway on http://localhost:8000..."
echo "[*] Interactive Testing UI: http://localhost:8000/ui"
echo "[*] Interactive API Docs:   http://localhost:8000/docs"
echo "========================================================================="

cd "$ML_DIR"
"$ML_DIR/venv/bin/uvicorn" app:app --host 0.0.0.0 --port 8000 --reload
