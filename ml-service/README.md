---
title: Securedge Ai Anomaly Engine
emoji: 🛡️
colorFrom: indigo
colorTo: blue
sdk: docker
app_port: 7860
pinned: false
---

# 🛡️ Cyber Lakshya: Tri-Guard AI Anomaly Engine & DCIM Gateway
### Smart India Hackathon 2026 | Problem Statement: CHA-39 (AICTE DCIM)

This Hugging Face Space runs the **Cyber Lakshya Tri-Guard ML/DL Anomaly Detection & AI Copilot Microservice**.

## 🚀 Live API Endpoints Exposed on this Space:
* `GET /api/v1/health` — Microservice health & loaded model status
* `POST /api/v1/predict` — Real-time Tri-Guard Anomaly Detection (GMM + Autoencoder + iForest)
* `POST /api/v1/predict/batch` — High-throughput batch network traffic scoring
* `POST /api/v1/predict/ueba` — Parameter-free identity & authentication abuse scoring
* `POST /api/v1/forecast/telemetry` — Zero-shot time-series telemetry forecasting with 95% dynamic bounds
* `POST /api/v1/copilot/explain` — 4-Question Plain-Language Incident Translator
* `POST /api/v1/copilot/chat` — Interactive natural language SOC Copilot chat assistant
* `GET /api/v1/models/benchmark` — Real-time comparative benchmark report (100,655 real records)
* `GET /docs` — Interactive OpenAPI / Swagger UI documentation

## 🔬 Benchmark Summary:
* **Ensemble ROC-AUC:** `0.9980`
* **Inference Latency:** `0.02 ms`
* **False Positive Rate:** `0.00%`
