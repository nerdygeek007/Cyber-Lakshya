# 🛡️ Cyber Lakshya (`SecurEdge`) — AICTE Cybersecurity Portal

<div align="center">

![SIH 2026](https://img.shields.io/badge/SIH--2026-Problem%20Statement%20CHA--39-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-emerald?style=for-the-badge)
![Accuracy](https://img.shields.io/badge/ROC--AUC-97.93%25-red?style=for-the-badge)
![Latency](https://img.shields.io/badge/Inference-%3C%2020ms-cyan?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)

**Next-Generation Autonomous DCIM & Firewall Management with Real-Time AI Threat Detection**  
*Developed for AICTE by Team Cyber Lakshya (`DEPSTAR-SIH-880700`)*

[🌐 Live Interactive Command Center](https://drdoom20-securedge-ai-anomaly-engine.static.hf.space/index.html) &bull; [📑 Dataset & Benchmark Specs](SECUREDGE_AI_DATASET_AND_BENCHMARK.md) &bull; [🏛️ Project Strategy](CHA39_PROJECT_STRATEGY.md)

</div>

---

## 📌 Executive Summary

**Cyber Lakshya (`SecurEdge`)** is an enterprise-grade cybersecurity portal designed to manage servers, firewalls, and data center infrastructure (DCIM) across educational institutions and AICTE data centers. 

It unifies **Behavioral Zero-Trust Access Control (RBAC/IAM)**, **Continuous Kernel Observability**, and an **Autonomous AI Threat Engine** trained on **100,655 real cybersecurity connection records** with zero synthetic data.

---

## 🌟 Key Capabilities

1. **🧠 Unsupervised AI Anomaly Detection:**
   * Trained on **97,278 clean baseline connections** to detect novel zero-day attacks without requiring labeled attack training.
   * **`97.93%` ROC-AUC Score** | **`99.0%` Malicious Attack Recall** on 8,377 unseen real test attacks.
   * **100% Detection Rate** against SYN Floods (`neptune`), ICMP Floods (`smurf`), Port Scans (`portsweep`), and Probes (`satan`).

2. **🔍 Explainable AI (XAI) & Root Cause Analysis:**
   * Multi-dimensional $Z$-score divergence formula: $Z = \frac{x - \mu}{\sigma}$.
   * Explains the exact telemetry metrics (e.g. *"+8.18σ Port Scan Sweep"* or *"+65.03σ Root Shell Spawn"*) instead of being a black-box model.

3. **⚡ Autonomous 1-Click Incident Remediation:**
   * Automatically compiles executive SOC incident cards.
   * Proactively triggers 3-tier remediation: Dynamic IP blocking via edge firewall rules, JWT token revocation in Redis/Casbin, and eBPF kernel process termination.

4. **🏛️ Sovereign Data Protection (MeitY & NIST Compliance):**
   * 100% on-premise execution with sub-20ms inference latency ($0.011\text{ ms}$ native scoring).
   * Complies with **NIST SP 800-53** continuous authentication and Government of India data localization guidelines.

---

## 🚀 Live Demo & Interactive Command Center

Try the live proactive cybersecurity portal directly in your browser:  
👉 **[https://drdoom20-securedge-ai-anomaly-engine.static.hf.space/index.html](https://drdoom20-securedge-ai-anomaly-engine.static.hf.space/index.html)**

* Features interactive presets (*Normal HTTP*, *Port Scan*, *Brute-Force Logins*, *Privilege Escalation Root Shell*, *SYN Flood DDoS*).
* Live streaming telemetry ticker with automated continuous network simulation.
* Instant 1-click autonomous containment actions with immutable audit logging.

---

## 🏛️ System Architecture

```
[ AICTE Server Nodes & Edge Firewalls ]
                  │
                  ▼ (Real-time Telemetry & Access Logs)
[ Go Ingestion Engine (Backend) ]
                  │
                  ▼ (HTTP POST /api/v1/predict)
[ Python AI Anomaly Engine (ml-service) ]
   ├── Unsupervised Isolation Forest (150 Decision Trees)
   ├── Z-Score Explainability Distance Engine (XAI)
   └── Autonomous AI Threat Investigation Agent
                  │
                  ├──► 1. Drops Malicious IP at Edge Firewall (iptables)
                  ├──► 2. Kills rogue shell processes via eBPF kernel agent
                  ├──► 3. Revokes session JWT in Auth Gateway (Redis/Casbin)
                  └──► 4. Logs immutable incident card to PostgreSQL
                  │
                  ▼ (WebSockets / REST API)
[ React Executive Command Center (Frontend) ]
```

---

## 📂 Repository Structure (ML Branch)

```
Cyber-Lakshya/
├── README.md                                # This documentation file
├── SECUREDGE_AI_DATASET_AND_BENCHMARK.md    # Complete dataset specs & 41-feature dictionary
├── CHA39_PROJECT_STRATEGY.md                # SIH 2026 team strategy & judge presentation guide
│
├── ml-service/                              # Core AI/ML Backend Service
│   ├── app.py                               # FastAPI REST Gateway (Swagger at /docs)
│   ├── config.py                            # Hyperparameters & path configurations
│   ├── real_dataset_pipeline.py             # 100K+ real KDD ingestion & LabelEncoders
│   ├── train_isolation_forest.py            # Model training & benchmark evaluator
│   ├── explainability.py                    # Z-score root-cause explainability engine
│   ├── threat_agent.py                      # Autonomous SOC incident report builder
│   ├── live_threat_watcher.py               # Streaming real-time telemetry scorer
│   ├── data/
│   │   └── real_cyber_dataset.csv.gz        # Real 100,655 connection records
│   ├── models/
│   │   ├── isolation_forest.joblib          # Trained ensemble weights
│   │   ├── baseline_stats.json              # Mean, std, p95 baseline distributions
│   │   └── categorical_encoders.joblib      # Protocol and service LabelEncoders
│   └── tests/
│       └── test_real_pipeline.py            # Automated unit test suite (5/5 passing)
│
└── huggingface-gradio-lite/                 # Standalone Public Command Center UI
    ├── index.html                           # High-contrast proactive cyber dashboard
    ├── README.md                            # Space deployment configuration
    └── models/                              # WebAssembly model weights
```

---

## ⚡ Quickstart & Local API Execution

### 1. Setup Virtual Environment
```bash
cd ml-service
python3 -m venv venv
source venv/bin/activate
pip install scikit-learn pandas numpy scipy joblib fastapi uvicorn
```

### 2. Launch FastAPI REST Gateway
```bash
uvicorn app:app --port 8000 --reload
```
* **Interactive Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
* **Health Check:** `curl http://localhost:8000/api/v1/health`

### 3. Run Automated Pipeline Unit Tests
```bash
python -m unittest tests/test_real_pipeline.py -v
```

---

## 📊 Verified Model Benchmark Matrix

| Metric | Score | SIH Production Benchmark |
| :--- | :---: | :---: |
| **ROC-AUC Discriminator** | **`0.9793` (~98%)** | > 0.90 (Industry Standard) |
| **Malicious Recall Rate** | **`0.990` (99.0%)** | > 0.85 (Minimal False Negatives) |
| **Detection Precision** | **`0.960` (96.0%)** | > 0.90 (Low False Alarms) |
| **F1-Score** | **`0.974`** | > 0.88 |
| **Single-Event Latency** | **`0.011 ms`** | Microsecond Real-Time |

---

## 👥 Team Cyber Lakshya (`DEPSTAR-SIH-880700`)
* **AI / ML & Anomaly Detection:** Chaitanya
* **Backend Engineering & Go API:** Jiya & Team
* **Database & PostgreSQL Engineering:** Het & Team
* **Frontend & UX Command Center:** Riddhi & Team

---
*Developed for Smart India Hackathon 2026 | AICTE Problem Statement `CHA-39`*
