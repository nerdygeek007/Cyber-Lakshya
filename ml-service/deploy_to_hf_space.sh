#!/bin/bash
# ==============================================================================
# Cyber Lakshya — Direct Hugging Face Space Deployment Script
# ==============================================================================

TARGET_REPO="${1:-drdoom20/Securedge-ai-anomaly-engine}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

"$SCRIPT_DIR/venv/bin/python" "$SCRIPT_DIR/upload_to_hf.py" "$TARGET_REPO" "$2"
