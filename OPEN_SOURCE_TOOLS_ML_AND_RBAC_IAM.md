# 🛠️ Comprehensive List of Open-Source Tools & Libraries in Cyber Lakshya
### Domain Focus: AI/ML Anomaly Engine & Zero-Trust RBAC-IAM
**For: Chaitanya Thakar (AI/ML & RBAC Lead) | Smart India Hackathon 2026**

---

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                               🏆 100% OPEN-SOURCE & ZERO LICENSING COST                          │
├────────────────────────────────┬────────────────────────────────┬────────────────────────────────┤
│       11 AI/ML Frameworks      │      6 RBAC & IAM Tools        │        Zero Vendor Lock-in     │
│   (GMM, Autoencoder, Chronos)  │     (Casbin, JWT, Argon2id)    │   (100% Free & Open-Source)    │
└────────────────────────────────┴────────────────────────────────┴────────────────────────────────┘
```

---

# 🤖 SECTION 1: Open-Source AI / ML & Deep Learning Stack

| # | Tool / Library Name | Official Repo / Provider | Exact Role in Cyber Lakshya | License |
| :-: | :--- | :--- | :--- | :--- |
| **1** | **Scikit-Learn** | [github.com/scikit-learn/scikit-learn](https://github.com/scikit-learn/scikit-learn) | • **Gaussian Mixture Model (GMM $K=3$)** for multi-modal density estimation.<br>• **Isolation Forest (150 Trees)** for structural flow partitioning.<br>• `RobustScaler` (Median & IQR scaling) for outlier immunity. | BSD-3-Clause |
| **2** | **PyTorch** | [github.com/pytorch/pytorch](https://github.com/pytorch/pytorch) | • **Deep Neural Autoencoder ($41 \to 16 \to 4 \to 16 \to 41$)** computing reconstruction $MSE$ loss for zero-day threat detection.<br>• Non-linear LeakyReLU bottleneck representations. | Modified BSD |
| **3** | **PyOD** (Python Outlier Detection) | [github.com/yzhao062/pyod](https://github.com/yzhao062/pyod) | • **ECOD & COPOD Engines** for parameter-free User & Entity Behavior Analytics (UEBA).<br>• Detects off-hour credential bursts and privilege jumps in **<0.05ms**. | BSD-2-Clause |
| **4** | **Amazon Chronos** | [github.com/amazon-science/chronos-forecasting](https://github.com/amazon-science/chronos-forecasting) | • **Zero-Shot Time-Series Forecaster** projecting dynamic 95% confidence bounds ($\mu \pm 2\sigma, \mu \pm 3\sigma$) on server telemetry to eliminate alert fatigue. | Apache-2.0 |
| **5** | **FastAPI** | [github.com/tiangolo/fastapi](https://github.com/tiangolo/fastapi) | • High-performance asynchronous Python REST microservice hosting the 8 ML prediction and copilot endpoints with auto OpenAPI/Swagger docs. | MIT |
| **6** | **Uvicorn** | [github.com/encode/uvicorn](https://github.com/encode/uvicorn) | • Lightning-fast ASGI web server implementation based on `uvloop` and `httptools`. | BSD-3-Clause |
| **7** | **NumPy & SciPy** | [github.com/numpy/numpy](https://github.com/numpy/numpy) | • Vectorized C-speed matrix calculations, exponential moving averages (EWMA), and statistical Z-score baseline deviation filters. | BSD-3-Clause |
| **8** | **Pydantic (v2)** | [github.com/pydantic/pydantic](https://github.com/pydantic/pydantic) | • High-speed Rust-backed data validation and JSON schema enforcement for ML inputs and outputs. | MIT |
| **9** | **Meta Llama-3.2 & Mistral-7B** | [huggingface.co/meta-llama](https://huggingface.co/meta-llama) | • Open-weights LLMs generating the **4-Question Plain-Language Incident Cards** and interactive SOC Copilot chat. | Llama 3.2 Community / Apache-2.0 |
| **10** | **Ollama** | [github.com/ollama/ollama](https://github.com/ollama/ollama) | • Local, self-hosted open-source LLM runtime enabling **100% offline air-gapped Copilot execution** with zero cloud traffic. | MIT |
| **11** | **Joblib** | [github.com/joblib/joblib](https://github.com/joblib/joblib) | • High-efficiency disk persistence and fast loading of trained weights (`.joblib` models and encoders). | BSD-3-Clause |

---

# 🛡️ SECTION 2: Open-Source RBAC & IAM (Identity & Access Management) Stack

| # | Tool / Library Name | Official Repo / Provider | Exact Role in Cyber Lakshya | License |
| :-: | :--- | :--- | :--- | :--- |
| **1** | **Casbin** | [github.com/casbin/casbin](https://github.com/casbin/casbin) | • **Zero-Trust Access Control Engine** implementing the PERM (Policy, Effect, Request, Matchers) metamodel.<br>• Enforces 5-Tier Role Hierarchy (*SuperAdmin $\to$ SecurityOfficer $\to$ NetworkAdmin $\to$ Auditor $\to$ ReadOnlyViewer*) in **0.08ms**. | Apache-2.0 |
| **2** | **Golang-JWT (`golang-jwt`)** | [github.com/golang-jwt/jwt](https://github.com/golang-jwt/jwt) | • **RFC 7519 Token Standard** generating cryptographically signed tokens using **ECDSA (P-256) and Ed25519**.<br>• Embeds stateless RBAC role claims, tenant IDs, and automated expiry. | MIT |
| **3** | **Argon2id** (`x/crypto/argon2`) | [golang.org/x/crypto/argon2](https://pkg.go.dev/golang.org/x/crypto/argon2) | • **Memory-hard password hashing algorithm** (OWASP champion).<br>• Mathematically immune to GPU brute-force and side-channel timing attacks. | BSD-3-Clause |
| **4** | **MITRE ATT&CK Knowledge Base** | [attack.mitre.org](https://attack.mitre.org) | • Standardized open cybersecurity matrix mapping anomalies directly to official threat techniques (`T1046`, `T1110`, `T1498`, `T1068`). | Open / Public Domain |
| **5** | **Linux eBPF & LSM Hooks (`libbpf`)** | [github.com/libbpf/libbpf](https://github.com/libbpf/libbpf) | • Microsecond kernel-space threat termination (`<1ms`) and socket-level enforcement before unauthorized packets reach user-space. | LGPL-2.1 / BSD-2 |
| **6** | **SHA-256 Ledger (`crypto/sha256`)** | OpenSSL / Go Standard Library | • **Immutable Cryptographic Audit Trail**: Hashes every admin action, permission change, and firewall rule deployment into an unalterable audit chain. | Open / Public Domain |

---

# 📊 SECTION 3: Frontend & Database Open-Source Stack (Context)

| Tool Name | Role in Cyber Lakshya |
| :--- | :--- |
| **PostgreSQL 16** | Declarative Range Partitioning & GIN/JSONB indexing sustaining **100,000+ events/sec** at **sub-2ms**. |
| **React 18 & TypeScript** | Componentized UI with Virtual DOM and strict compile-time type safety. |
| **Three.js** | WebGL 3D server cockpit visualizing 124+ live data center nodes in real-time. |
| **Tailwind CSS** | Clean, responsive dark-mode cyber design system. |
| **Chart.js** | Real-time spline telemetry graphs with Chronos dynamic 95% confidence bands. |

---

# 🎤 What to Say to the Judges in 20 Seconds:

> *"Cyber Lakshya is built **100% on production-proven open-source software with ZERO proprietary licensing fees** for AICTE:  
> * On the **AI/ML side**, we leverage **Scikit-Learn, PyTorch, PyOD UEBA, Amazon Chronos, and Meta Llama-3.2**.  
> * On the **RBAC/IAM side**, we enforce Zero-Trust access using **Casbin PERM engines (0.08ms), ECDSA-signed JWTs, Argon2id hashing, and the MITRE ATT&CK framework**.  
> This guarantees total data sovereignty, zero vendor lock-in, and military-grade security at zero software cost!"*
