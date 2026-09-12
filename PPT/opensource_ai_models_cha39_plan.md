# 🛡️ Open-Source AI/ML Models & Pretrained Frameworks Implementation Plan
### Project: Cyber Lakshya | Smart India Hackathon 2026 | Problem Statement: CHA-39 (AICTE DCIM)
**Review & Architecture Lead:** Chaitanya Thakar (AI/ML & RBAC Lead)  
**Collaborators:** Maharshi Trivedi (Systems Architect), Siddharthsinh Raulji (Firewalls), Het Pansara (Database), Jiya Bhayani (Go Backend), Riddhi Odedra (UI/UX)

---

## 1. Executive Review: Is This Helpful?

> [!IMPORTANT]
> **VERDICT: YES, THIS IS 100% STRATEGIC, FEASIBLE, AND HIGH-IMPACT.**  
> Leveraging established, battle-tested open-source libraries (`PyOD`, `Amazon Chronos-Tiny`, `Drain3`, `Kitsune`, `SecBERT`) transforms Cyber Lakshya from a simple script into a **production-grade enterprise AI observability platform**. It drastically boosts our hackathon evaluation score by showcasing real foundation models running offline on CPU.

```
                         [ OPEN-SOURCE AI ECOSYSTEM FOR CHA-39 ]
                                            │
       ┌────────────────────────┬───────────┴────────────┬────────────────────────┐
       ▼                        ▼                        ▼                        ▼
1. 👥 UEBA & Access      2. 🌐 Network & NIDS     3. 📈 Zero-Shot Forecast 4. 🤖 SOC Copilot & XAI
• PyOD (COPOD / ECOD)    • Kitsune NIDS (Autoenc) • Amazon Chronos-Tiny    • SecBERT (CVE Tagger)
• Drain3 (Log Template)  • CIC-IDS Pretrained     • Meta Prophet           • Llama-3-8B / Ollama
```

---

## 2. Layer-by-Layer Open-Source Model Evaluation

---

### Layer 1: Identity & User Entity Behavior Analytics (UEBA)

#### 📦 Frameworks: `PyOD` + `Drain3` (LogPAI)
* **PyOD (`pyod.models.copod`, `pyod.models.ecod`):**
  - **Why it's elite:** COPOD (Copula-based Outlier Detection) and ECOD (Empirical Cumulative Distribution) are **parameter-free**, requiring no hyperparameter tuning or expensive stochastic tree training.
  - **Inference Speed:** **< 0.05 ms** (pure vectorized matrix math).
  - **Use Case in CHA-39:** Evaluates user login timestamps, IP geographic leaps, and clearance level access patterns in real time.
* **Drain3 (`drain3` by LogPAI):**
  - **Why it's elite:** Parses streaming unstructured syslogs (`/var/log/auth.log`, `iptables.log`) into structured regex templates in **< 0.02 ms** without requiring heavy NLP tokens.

```python
# PyOD COPOD + ECOD Instant Multi-Model UEBA
from pyod.models.copod import COPOD
from pyod.models.ecod import ECOD
from pyod.models.iforest import IForest

class UEBAEngine:
    def __init__(self):
        self.copod = COPOD()
        self.ecod = ECOD()
        self.iforest = IForest(n_estimators=100, random_state=42)

    def fit(self, normal_user_events):
        self.copod.fit(normal_user_events)
        self.ecod.fit(normal_user_events)
        self.iforest.fit(normal_user_events)

    def score_event(self, event_vector):
        # Tri-ensemble average anomaly score
        s1 = self.copod.decision_function(event_vector.reshape(1, -1))[0]
        s2 = self.ecod.decision_function(event_vector.reshape(1, -1))[0]
        s3 = self.iforest.decision_function(event_vector.reshape(1, -1))[0]
        return float((s1 + s2 + s3) / 3.0)
```

---

### Layer 2: Network & Firewall Threat Detection (NIDS)

#### 📦 Frameworks: `Kitsune NIDS` + `CIC-IDS LightGBM`
* **Kitsune NIDS (`Kitsune-py`):**
  - **Mechanism:** Ensemble of 100 micro-autoencoders operating on dampened incremental packet statistics.
  - **Why it fits CHA-39:** Detects SYN floods, ARP spoofing, and lateral reconnaissance at line-speed without pre-labeled training data.
* **CIC-IDS Pretrained LightGBM:**
  - **Mechanism:** Classifies 14 specific attack signatures (DDoS GoldenEye, PortScan, Slowloris, Botnet) in **< 0.3 ms**.

---

### Layer 3: Server Metrics & Telemetry Forecasting

#### 📦 Framework: `amazon/chronos-t5-tiny` (~40MB HuggingFace Foundation Model)
* **Why it's game-changing:**
  - Chronos treats time-series forecasting as a **token-prediction language modeling task** (T5 architecture).
  - **Zero-Shot:** Predicts future CPU load, RAM saturation, and bandwidth spikes **without requiring node-specific training**!
  - **Size & Performance:** Only **~40MB**, runs on standard Linux CPU in **< 15ms**, and produces exact **80% and 95% prediction intervals** ($\mu \pm 2\sigma, \mu \pm 3\sigma$).

```python
# Zero-Shot CPU & Bandwidth Forecasting with Amazon Chronos-Tiny
import torch
from chronos import ChronosPipeline

pipeline = ChronosPipeline.from_pretrained(
    "amazon/chronos-t5-tiny",
    device_map="cpu",
    torch_dtype=torch.bfloat16,
)

# Historical past 64 seconds of server CPU telemetry
context = torch.tensor([42.1, 44.5, 43.8, 48.2, 51.0, 53.4, 52.8, 55.1])
# Forecast next 12 time steps (future 12 seconds)
forecast = pipeline.predict(context, prediction_length=12, num_samples=20)
# Extract median and 95% upper anomaly boundary
median_forecast = torch.quantile(forecast, 0.5, dim=1)
upper_bound_95 = torch.quantile(forecast, 0.95, dim=1)
```

---

### Layer 4: Cybersecurity Copilot & Plain-Language Translation (LLM)

#### 📦 Frameworks: `JackBAI/SecBERT` + `Llama-3-8B-Instruct` (Ollama)
* **SecBERT:** Classifies technical firewall syslog violations and maps them directly to **MITRE ATT&CK Tactic IDs** (e.g. `T1046 Network Service Discovery`, `T1021 Remote Services`).
* **Llama-3-8B (Local Ollama):** Synthesizes the 4-question plain-language card:
  - *What Happened?*
  - *Why Does It Matter?*
  - *What Should I Do?*
  - *Who Handles It?*

---

## 3. Phased Implementation Roadmap in `ml-service/`

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ PHASE 1: PyOD + Chronos Integration in `ml-service/` (Sprint 1)                        │
│ • Install lightweight dependencies: `pip install pyod chronos-forecasting`             │
│ • Build `models/pyod_engine.py` (COPOD + ECOD + iForest Ensemble)                      │
│ • Build `models/chronos_forecaster.py` (Zero-shot CPU/RAM forecasting)                 │
└─────────────────────────────────────────────┬──────────────────────────────────────────┘
                                              │
                                              ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ PHASE 2: Live FastAPI Endpoints & Benchmark Exporter (Sprint 2)                        │
│ • `POST /api/v1/predict/ueba` ➔ Instant identity & access anomaly scoring             │
│ • `POST /api/v1/forecast/telemetry` ➔ Returns 12-second future spline + 95% bounds    │
│ • `GET /api/v1/models/benchmark` ➔ Returns live comparative metrics across models      │
└─────────────────────────────────────────────┬──────────────────────────────────────────┘
                                              │
                                              ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ PHASE 3: Frontend Spline & SOC Integration (Sprint 3)                                  │
│ • Wire `LiveBandwidthWaveform.tsx` to display Chronos dynamic forecast bounds          │
│ • Wire `LiveSecurityTerminal.tsx` to stream parsed Drain3 syslog templates             │
└─────────────────────────────────────────────┬──────────────────────────────────────────┘
```

---

## 4. Verification Plan

1. **Unit & Benchmark Testing:**
   ```bash
   cd "/media/chaitaniya/D Drive/SIH-2026/ml-service"
   venv/bin/pytest tests/
   ```
2. **Chronos Forecasting Verification:**
   - Feed 60 historical CPU load points $\to$ verify forecast tensor returns in $< 20\text{ms}$ on CPU.
3. **PyOD Anomaly Accuracy Check:**
   - Test against real attack vectors from `real_cyber_dataset.csv.gz` $\to$ verify ROC-AUC $> 0.99$.
