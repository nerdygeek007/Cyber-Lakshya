# 🛡️ SecurEdge IAM & Casbin RBAC Authorization Engine

> **AICTE DCIM Problem Statement `CHA-39` | Team Cyber Lakshya (`DEPSTAR-SIH-880700`)**  
> **Module:** Open-Source Role-Based Access Control (RBAC) & Identity and Access Management (IAM)

---

## 📌 Overview

The **SecurEdge RBAC & IAM Service** enforces **Continuous Zero-Trust Least-Privilege Access Control** across AICTE server and firewall infrastructure. Powered by the open-source **Casbin PERM Metamodel** and **JSON Web Tokens (JWT)**, it evaluates authorization requests in **`< 1 millisecond`**.

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

## 📋 Role Matrix & Permission Dictionary

| Role Tier | Resource Scopes | Permitted Actions | Security Boundary (Least Privilege) |
| :--- | :--- | :--- | :--- |
| **`SuperAdmin`** | `*` (All Resources) | `*` (All Actions) | Full unrestricted administrative control |
| **`SecOps_Engineer`** | `firewalls`, `anomalies`, `audit_logs`, `servers` | `read`, `write`, `remediate` | Cannot modify physical server/rack configurations |
| **`DataCenter_Operator`** | `servers`, `racks`, `assets`, `telemetry` | `read`, `write` | Cannot modify firewall rules or remediate security alerts |
| **`Auditor_Viewer`** | `audit_logs`, `compliance`, `licenses`, `telemetry` | `read` (Strictly Read-Only) | Zero write or deletion capabilities |

---

## 🚀 REST API Endpoints (FastAPI)

| Endpoint | Method | Description | Auth Required |
| :--- | :---: | :--- | :---: |
| `/api/v1/auth/login` | `POST` | Authenticate user, issue JWT token & permissions | ❌ No |
| `/api/v1/auth/me` | `GET` | Return authenticated profile and active roles | ✅ Bearer JWT |
| `/api/v1/rbac/enforce` | `POST` | Sub-millisecond decision: `(sub, obj, act) -> true/false` | ❌ Open/Internal |
| `/api/v1/rbac/matrix` | `GET` | Full 4-tier policy and user matrix for UI | ❌ Open |
| `/api/v1/rbac/assign-role` | `POST` | Dynamically assign role to user | ✅ SuperAdmin only |

---

## 💻 Go Backend Integration (for Jiya)

Drop [`go_integration/casbin_middleware.go`](file:///media/chaitaniya/D%20Drive/SIH-2026/rbac-iam-service/go_integration/casbin_middleware.go) into your Gin / Go HTTP router:

```go
package main

import (
    "github.com/casbin/casbin/v2"
    "github.com/gin-gonic/gin"
    "your_project/middleware"
)

func main() {
    // 1. Initialize Casbin Enforcer with model and policy
    e, err := casbin.NewEnforcer("rbac_model.conf", "policy.csv")
    if err != nil {
        panic(err)
    }

    r := gin.Default()

    // 2. Attach Casbin JWT Authorization Middleware
    jwtSecret := "SecurEdge_AICTE_DCIM_SuperSecretKey_2026_ZeroTrust"
    protected := r.Group("/api/v1")
    protected.Use(middleware.CasbinMiddleware(e, jwtSecret))
    {
        protected.GET("/servers", handleGetServers)       // Operator & Auditor
        protected.POST("/firewalls", handleUpdateFirewall) // SecOps & SuperAdmin only
        protected.POST("/anomalies/remediate", handleRemediate) // SecOps only
    }

    r.Run(":8080")
}
```

---

## 🧪 Automated Unit Test Verification

To execute the unit test suite:
```bash
python -m unittest tests/test_rbac_iam.py -v
```
* **Status:** 6/6 tests passing (SuperAdmin, SecOps, Operator, Auditor, JWT claims, PBKDF2 hashing).
