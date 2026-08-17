# 🛡️ Cyber Lakshya (`SecurEdge`) — Zero-Trust RBAC & IAM Subsystem

<div align="center">

![SIH 2026](https://img.shields.io/badge/SIH--2026-Problem%20Statement%20CHA--39-blue?style=for-the-badge)
![Module](https://img.shields.io/badge/Module-Zero--Trust%20RBAC%20%26%20IAM-indigo?style=for-the-badge)
![Engine](https://img.shields.io/badge/Engine-Casbin%20PERM%20Metamodel-emerald?style=for-the-badge)
![Decision Latency](https://img.shields.io/badge/Latency-%3C%200.40ms-cyan?style=for-the-badge)
![Compliance](https://img.shields.io/badge/Compliance-NIST%20SP%20800--53-purple?style=for-the-badge)

**Continuous Behavioral Zero-Trust Role-Based Access Control & Identity Governance for AICTE DCIM**  
*Developed for AICTE by Team Cyber Lakshya (`DEPSTAR-SIH-880700`)*

</div>

---

## 📌 Executive Overview

The **SecurEdge IAM & RBAC Service** provides continuous, sub-millisecond Zero-Trust identity and access governance for AICTE’s data center infrastructure. Powered by the open-source **Casbin PERM Metamodel** (`r = sub, obj, act`) and signed **JSON Web Tokens (JWT)** with PBKDF2 password hashing, it guarantees that every operator, engineer, and administrator operates strictly within their least-privilege boundary.

---

## 🏛️ AICTE 4-Tier Role & Privilege Hierarchy

```
                            ┌────────────────────────┐
                            │      SuperAdmin        │ (*, *)
                            └───────────┬────────────┘
                                        │ (Inherits)
                                        ▼
                            ┌────────────────────────┐
                            │    SecOps_Engineer     │ (Firewalls, Anomalies)
                            └───────────┬────────────┘
                                        │ (Inherits)
                                        ▼
    ┌────────────────────────┐          │
    │  DataCenter_Operator   ├──────────┤
    │  (Servers, Racks)      │          │
    └───────────┬────────────┘          │
                │ (Inherits)            │
                ▼                       ▼
    ┌────────────────────────────────────────────────┐
    │                Auditor_Viewer                  │ (Strict Read-Only)
    └────────────────────────────────────────────────┘
```

---

## 📋 4-Tier Least-Privilege Security Matrix

| Role Tier | Resource Scopes | Permitted Actions | Security Boundary (Least Privilege) |
| :--- | :--- | :--- | :--- |
| **`SuperAdmin`** | `*` (All Resources) | `*` (All Actions) | Unrestricted master access & user provisioning |
| **`SecOps_Engineer`** | `firewalls`, `anomalies`, `audit_logs`, `servers` | `read`, `write`, `remediate` | Cannot modify physical server/rack configurations |
| **`DataCenter_Operator`** | `servers`, `racks`, `assets`, `telemetry` | `read`, `write` | Cannot modify firewall rules or remediate security alerts |
| **`Auditor_Viewer`** | `audit_logs`, `compliance`, `licenses`, `telemetry` | `read` (Strictly Read-Only) | Zero write, modify, or deletion capabilities |

---

## ☁️ GCP-Style Interactive IAM Permission Builder

SuperAdmins can provision new staff accounts and grant granular service scopes using the GCP IAM model:
1. **Select DCIM Service:** `firewalls`, `anomalies`, `servers`, `racks`, `audit_logs`, `compliance`, `licenses`.
2. **Select Access Level:** `Viewer (read)`, `Editor (write)`, `Remediator (remediate)`, `Admin (delete)`, `Owner (*)`.
3. **Interactive Chip Tags:** Generates dynamic, removable permission chips with instant Casbin rule compilation.

---

## 📁 Repository Structure (RBAC-IAM Branch)

```
Cyber-Lakshya/
├── README.md                            # This documentation file
├── .gitignore                           # Git ignore rules
│
└── rbac-iam-service/                    # Core RBAC & IAM Subsystem
    ├── index.html                       # Multi-page interactive Command Center UI
    ├── rbac_model.conf                  # Casbin PERM authorization metamodel
    ├── policy.csv                       # AICTE 4-tier policy rules & inheritance
    ├── auth_jwt.py                      # PBKDF2 hashing & JWT token issuance/verification
    ├── enforcer.py                      # Sub-millisecond Casbin policy enforcer
    ├── app.py                           # FastAPI REST API Gateway (Port 8001 / Swagger /docs)
    ├── README.md                        # Service documentation
    ├── go_integration/
    │   └── casbin_middleware.go         # Drop-in Go middleware for Jiya's Gin/Go Backend
    └── tests/
        └── test_rbac_iam.py             # Automated unit test suite (6/6 passing)
```

---

## ⚡ REST API Endpoints (FastAPI — Port 8001)

| Endpoint | Method | Purpose | Auth Scope |
| :--- | :---: | :--- | :---: |
| `/api/v1/auth/health` | `GET` | Service & Casbin engine health verification | Open |
| `/api/v1/auth/login` | `POST` | Authenticate credentials & issue signed Bearer JWT | Open |
| `/api/v1/auth/me` | `GET` | Return decoded claims and active permission rules | Bearer JWT |
| `/api/v1/rbac/enforce` | `POST` | Sub-millisecond decision: `(sub, obj, act) -> true/false` | Internal/Open |
| `/api/v1/rbac/matrix` | `GET` | Return full 4-tier policy and user matrix | Open |
| `/api/v1/rbac/create-user`| `POST` | SuperAdmin identity provisioning & credential issuance | SuperAdmin |
| `/api/v1/rbac/assign-role`| `POST` | Dynamically assign role to user | SuperAdmin |

---

## 💻 Go Backend Integration (for Jiya)

Drop [`rbac-iam-service/go_integration/casbin_middleware.go`](file:///media/chaitaniya/D%20Drive/SIH-2026/rbac-iam-service/go_integration/casbin_middleware.go) into your Gin / Go HTTP router:

```go
package main

import (
    "github.com/casbin/casbin/v2"
    "github.com/gin-gonic/gin"
    "your_project/middleware"
)

func main() {
    e, _ := casbin.NewEnforcer("rbac_model.conf", "policy.csv")
    r := gin.Default()

    jwtSecret := "SecurEdge_AICTE_DCIM_SuperSecretKey_2026_ZeroTrust"
    protected := r.Group("/api/v1")
    protected.Use(middleware.CasbinMiddleware(e, jwtSecret))
    {
        protected.GET("/servers", handleGetServers)
        protected.POST("/firewalls", handleUpdateFirewall)
        protected.POST("/anomalies/remediate", handleRemediate)
    }

    r.Run(":8080")
}
```

---

## 🧪 Automated Unit Test Verification

To execute all 6 automated tests:
```bash
python -m unittest rbac-iam-service/tests/test_rbac_iam.py -v
```
* **Status:** 6/6 tests passing (SuperAdmin, SecOps, Operator, Auditor, JWT claims, PBKDF2 hashing in `0.49s`).
