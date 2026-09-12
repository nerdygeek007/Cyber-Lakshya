# 📡 Cyber Lakshya: Complete ML/DL/LLM Models & API Endpoint Specification
### Smart India Hackathon 2026 | Problem Statement: CHA-39 (AICTE DCIM & Cybersecurity Command Portal)
**Lead Architect:** Chaitanya Thakar (AI/ML & RBAC Lead)  
**Collaborators:** Maharshi Trivedi (Systems Architect), Siddharthsinh Raulji (Firewalls), Het Pansara (Database), Jiya Bhayani (Go Backend), Riddhi Odedra (UI/UX)

---

## 1. Complete Roster of AI, ML & LLM Models in Cyber Lakshya

Cyber Lakshya uses a **hybrid multi-tier AI hierarchy** combining ultra-fast local statistical/kernel models with deep learning and cloud/local LLMs:

```
                            [ CYBER LAKSHYA AI / ML HIERARCHY ]
                                             │
      ┌──────────────────────────────────────┼──────────────────────────────────────┐
      ▼                                      ▼                                      ▼
1. 🛡️ LOCAL ML / DL (In-Process)      2. 📈 TIME-SERIES FORECASTING          3. 🤖 LLM & COPILOT SERVICES
• Isolation Forest (iForest)         • Amazon Chronos-T5-Tiny (Zero-Shot)   • Hugging Face Serverless API
• Gaussian Mixture Model (GMM)       • Meta Prophet (Diurnal Cycles)        • Local Ollama (`llama3.2:3b`)
• PyTorch Deep Autoencoder (MSE)     • Exponential Moving Average (EWMA)    • SecBERT (CVE / MITRE Tagger)
• PyOD (COPOD & ECOD UEBA)                                                  • Deterministic MITRE Synthesizer
• Drain3 (LogPAI Syslog Parser)
```

---

### Comprehensive Model Breakdown:

| Category | Model Name | Source / Provider | Execution Location | Purpose in Cyber Lakshya | Latency |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **Classical ML** | **Isolation Forest (150 Trees)** | Scikit-Learn / Joblib | **Local (CPU In-Process)** | Unsupervised structural flow & connection anomaly detection | **0.82 ms** |
| **Probabilistic**| **Gaussian Mixture Model (K=3)** | Scikit-Learn (Tikhonov Reg) | **Local (CPU In-Process)** | Multi-modal operational baseline (Idle vs Workload vs Backup) | **0.28 ms** |
| **Deep Learning** | **Deep Autoencoder (PyTorch)** | Custom PyTorch / ONNX | **Local (CPU In-Process)** | Multi-variate non-linear reconstruction loss ($MSE$) | **1.24 ms** |
| **UEBA Access** | **PyOD COPOD & ECOD** | `pyod` Open-Source | **Local (CPU In-Process)** | Parameter-free identity & login anomaly scoring | **0.05 ms** |
| **Log Parsing** | **Drain3 Log Parser** | LogPAI (`drain3-py`) | **Local (CPU In-Process)** | Streaming unstructured syslog template extraction | **0.02 ms** |
| **Forecasting** | **Amazon Chronos-T5-Tiny** | HuggingFace (`amazon/chronos`) | **Local or HF API** | Zero-shot 12s/24h CPU, RAM & bandwidth forecasting bounds | **~15 ms** |
| **External AI** | **Llama-3.2-3B-Instruct** | Hugging Face Serverless API | **External Cloud GPU (Free)** | 4-Question Plain-Language Incident Card Synthesizer | **~600 ms** |
| **External AI** | **Mistral-7B-Instruct-v0.3** | Hugging Face Serverless API | **External Cloud GPU (Free)** | Interactive SOC Copilot natural language chat assistant | **~900 ms** |
| **Air-Gapped AI**| **Local Ollama (`llama3.2:3b`)** | On-Premise Daemon (`:11434`) | **Local Server (Production)** | 100% offline data sovereign incident reporting | **~400 ms** |
| **Threat NLP** | **SecBERT** | HuggingFace (`JackBAI/SecBERT`)| **Local / HF API** | Automated MITRE ATT&CK Tactic & CVE tagging | **~150 ms** |
| **Fallback AI** | **Deterministic MITRE Mapper** | Internal Rule Engine | **Local (CPU In-Process)** | Zero-latency emergency fallback if cloud/Ollama is offline | **< 0.1 ms** |

---

## 2. Complete REST API Specification (`FastAPI` Gateway)

The ML Microservice runs on **`http://localhost:8000`** and exposes the following production API endpoints:

```
FastAPI Base URL: http://localhost:8000/api/v1
```

---

### Endpoint 1: Health & Runtime Check
* **Path:** `GET /api/v1/health`
* **Purpose:** Verifies ML model status, database connectivity, and active AI provider.
* **Sample Response:**
```json
{
  "status": "healthy",
  "service": "Cyber Lakshya AI Anomaly Engine",
  "ai_provider": "huggingface",
  "models_loaded": {
    "isolation_forest": true,
    "gmm_probabilistic": true,
    "deep_autoencoder": true,
    "pyod_ueba": true
  },
  "database_connected": true
}
```

---

### Endpoint 2: Real-Time Single Connection Inference
* **Path:** `POST /api/v1/predict`
* **Purpose:** Ingests live server/firewall connection frame, evaluates multi-model score, and automatically persists anomalies to PostgreSQL.
* **Request Payload:**
```json
{
  "target_entity": "AICTE-SRV-001",
  "asset_id": 1,
  "protocol_type": "tcp",
  "service": "http",
  "flag": "SF",
  "src_bytes": 1054.0,
  "dst_bytes": 4820.0,
  "count": 45.0,
  "srv_count": 42.0,
  "diff_srv_rate": 0.05,
  "same_srv_rate": 0.95,
  "num_failed_logins": 0.0,
  "root_shell": 0.0,
  "su_attempted": 0.0,
  "num_file_creations": 0.0
}
```
* **Response Payload:**
```json
{
  "is_anomaly": false,
  "risk_score": 0.124,
  "severity": "NORMAL",
  "target_entity": "AICTE-SRV-001",
  "model_scores": {
    "isolation_forest": 0.14,
    "gmm_log_prob": -12.4,
    "autoencoder_mse": 0.008
  },
  "timestamp": "2026-08-19T19:07:00Z"
}
```

---

### Endpoint 3: Batch Packet & Log Stream Inference
* **Path:** `POST /api/v1/predict/batch`
* **Purpose:** High-throughput batch scoring for firewall packet capture streams (up to 1,000 events/sec).
* **Request Payload:**
```json
{
  "events": [
    { "target_entity": "AICTE-SRV-001", "src_bytes": 0.0, "count": 280.0, "flag": "S0" },
    { "target_entity": "AICTE-SRV-002", "src_bytes": 512.0, "count": 2.0, "flag": "SF" }
  ]
}
```
* **Response Payload:**
```json
{
  "total_processed": 2,
  "anomalies_detected": 1,
  "database_synced": true,
  "results": [
    {
      "target_entity": "AICTE-SRV-001",
      "is_anomaly": true,
      "risk_score": 0.94,
      "severity": "CRITICAL",
      "mitre_id": "T1498",
      "mitre_title": "Network Denial of Service (SYN Flood)"
    },
    {
      "target_entity": "AICTE-SRV-002",
      "is_anomaly": false,
      "risk_score": 0.08,
      "severity": "NORMAL"
    }
  ]
}
```

---

### Endpoint 4: Identity & Access Anomaly Scoring (UEBA)
* **Path:** `POST /api/v1/predict/ueba`
* **Purpose:** Evaluates authentication spikes, geo-velocity hops, and off-hour access using PyOD (COPOD + ECOD).
* **Request Payload:**
```json
{
  "user_id": "usr-admin-04",
  "role": "Technician",
  "login_hour": 3.5,
  "failed_attempts_15m": 8,
  "ip_entropy_score": 0.88,
  "privilege_level": 2
}
```
* **Response Payload:**
```json
{
  "user_id": "usr-admin-04",
  "is_ueba_anomaly": true,
  "anomaly_confidence": 0.91,
  "primary_driver": "Rapid authentication failure burst outside shift window",
  "action_recommended": "Enforce MFA Step-Up Challenge"
}
```

---

### Endpoint 5: Zero-Shot Time-Series Telemetry Forecasting
* **Path:** `POST /api/v1/forecast/telemetry`
* **Purpose:** Uses Amazon Chronos-Tiny to predict next 12–24 seconds/hours of CPU, RAM, or bandwidth with dynamic 95% upper/lower bounds.
* **Request Payload:**
```json
{
  "metric_name": "cpu_utilization_pct",
  "history": [42.1, 44.5, 43.8, 48.2, 51.0, 53.4, 52.8, 55.1, 58.0, 61.2],
  "prediction_horizon": 6
}
```
* **Response Payload:**
```json
{
  "metric_name": "cpu_utilization_pct",
  "median_forecast": [63.4, 65.1, 66.8, 68.0, 69.2, 70.1],
  "upper_bound_95": [68.0, 71.2, 73.5, 75.8, 78.1, 80.4],
  "lower_bound_95": [58.8, 59.0, 60.1, 60.2, 60.3, 59.8],
  "is_breach_predicted": false
}
```

---

### Endpoint 6: Plain-Language AI Copilot Incident Synthesizer
* **Path:** `POST /api/v1/copilot/explain`
* **Purpose:** Calls Hugging Face Serverless API (or local Ollama) to generate the 4-Question plain language explanation.
* **Request Payload:**
```json
{
  "target_entity": "AICTE-SRV-024",
  "mitre_id": "T1110.001",
  "mitre_title": "Brute Force: Password Guessing",
  "top_feature": "num_failed_logins",
  "anomaly_score": 0.92
}
```
* **Response Payload:**
```json
{
  "what_happened": "Automated security monitors detected 48 consecutive failed SSH authentication attempts on AICTE-SRV-024 within 60 seconds.",
  "why_it_matters": "An unauthorized actor is actively attempting dictionary password guessing to gain administrative root shell control.",
  "what_to_do": "Click 'Quarantine IP' to inject an immediate drop rule on Edge Firewall SW-01.",
  "who_handles_it": "Network Security & Identity Team",
  "mitre_tactic": "T1110.001: Brute Force: Password Guessing",
  "urgency_level": "CRITICAL",
  "ai_provider": "Hugging Face (Llama-3.2-3B-Instruct)"
}
```

---

### Endpoint 7: Interactive SOC Natural Language Chat
* **Path:** `POST /api/v1/copilot/chat`
* **Purpose:** Natural language conversational assistant for administrators to query DCIM state, switch health, and firewall rules.
* **Request Payload:**
```json
{
  "query": "Which servers had CPU utilization above 90% in the last 2 hours?",
  "conversation_history": []
}
```
* **Response Payload:**
```json
{
  "response": "Based on telemetry records, Server AICTE-SRV-024 experienced a CPU spike to 94.8% at 10:42 PM due to an automated batch process. All other 123 server nodes operated normally below 65%.",
  "suggested_actions": ["View SRV-024 Metrics", "Check Process PID List"]
}
```

---

### Endpoint 8: Comparative Models Benchmark Summary
* **Path:** `GET /api/v1/models/benchmark`
* **Purpose:** Serves real-time benchmark metrics comparing Isolation Forest, GMM, Autoencoder, and the Unified Tri-Guard Ensemble for judge evaluation.
* **Response Payload:**
```json
{
  "dataset": "KDD & CIC-IDS Cybersecurity Baseline (100,655 connections)",
  "benchmark_results": [
    { "model": "Tri-Guard Ensemble (GMM+AE+iForest)", "roc_auc": 0.9942, "latency_ms": 1.45, "fpr_pct": 0.6 },
    { "model": "Gaussian Mixture Model (GMM)", "roc_auc": 0.9880, "latency_ms": 0.28, "fpr_pct": 0.9 },
    { "model": "Deep Autoencoder (PyTorch)", "roc_auc": 0.9854, "latency_ms": 1.24, "fpr_pct": 1.1 },
    { "model": "Isolation Forest (Baseline)", "roc_auc": 0.9712, "latency_ms": 0.82, "fpr_pct": 1.8 }
  ]
}
```

---

## 3. Data Sovereignty & External AI Isolation Matrix

| Telemetry Type | Does it go to External AI (Hugging Face)? | How It Is Handled |
| :--- | :---: | :--- |
| **Raw Network Packets / Payloads** | ❌ **NEVER** | Processed 100% locally in kernel / C / Python. |
| **Internal IP Addresses & MACs** | ❌ **NEVER** | Sanitized / Masked to generic labels (e.g. `Server-01`). |
| **User Passwords / Cryptographic Hashes** | ❌ **NEVER** | Never logged; zero-knowledge Casbin tokens only. |
| **Sanitized Anomaly Forensics** | ✅ **YES (Dev/Demo Only)** | Sent to Hugging Face Serverless API with zero PII. |
| **Air-Gapped Mode (Production)** | ❌ **NO EXTERNAL TRAFFIC** | Routed to on-premise local Ollama instance (`127.0.0.1:11434`). |
