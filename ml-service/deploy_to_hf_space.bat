@echo off
REM ==============================================================================
REM Cyber Lakshya — Direct Hugging Face Space Deployment Script (Windows)
REM ==============================================================================

set TARGET_REPO=%~1
if "%TARGET_REPO%"=="" set TARGET_REPO=drdoom20/Securedge-ai-anomaly-engine

python upload_to_hf.py %TARGET_REPO% %2
