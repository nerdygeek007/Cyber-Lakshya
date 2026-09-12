# 📊 Cyber Lakshya (`SecurEdge`) — System Architecture, Flowcharts & Benchmark Charts

> **Smart India Hackathon 2026 | Problem Statement `CHA-39`**  
> **Project:** Cyber Lakshya (`SecurEdge`) — AICTE DCIM & Firewall Management  
> **Team:** Cyber Lakshya (`DEPSTAR-SIH-880700`)  

---

## 1. 🏛️ End-to-End System Architecture Flowchart

```mermaid
flowchart TD
    subgraph INGESTION["1. Telemetry Ingestion Layer"]
        A1["AICTE Server Nodes (VMs & Bare-Metal)"]
        A2["Edge Firewalls (Palo Alto / Fortinet / Linux)"]
        A3["eBPF Host Kernel Probes"]
    end

    subgraph BACKEND["2. Backend Processing & Ingestion (Go)"]
        B1["Go REST API Gateway (Jiya)"]
        B2["Casbin Authorization Middleware (Zero-Trust)"]
        B3["Log Parser & Telemetry Normalizer"]
    end

    subgraph AI_ENGINE["3. AI Anomaly & Threat Engine (Chaitanya)"]
        C1["Unsupervised Isolation Forest (150 Trees)"]
        C2["Z-Score Explainability Distance Engine (XAI)"]
        C3["Autonomous AI Threat Investigation Agent"]
    end

    subgraph CONTAINMENT["4. Autonomous Remediation (The Muscle)"]
        D1["Dynamic Firewall IP Block (iptables)"]
        D2["JWT Session Token Blacklist (Redis/Casbin)"]
        D3["eBPF Malicious Process Termination"]
    end

    subgraph STORAGE["5. Data Persistence (Het)"]
        E1["PostgreSQL Database (alerts, audit_logs, users)"]
    end

    subgraph FRONTEND["6. Executive Command Center (Riddhi)"]
        F1["React SOC Dashboard & Alert Feed"]
        F2["GCP-Style IAM Permission Scope Assigner"]
        F3["Live Public Proactive Portal (Hugging Face)"]
    end

    A1 -->|Raw Syslog / NetFlow| B1
    A2 -->|Connection Logs| B1
    A3 -->|Kernel Syscall Events| B1
    
    B1 --> B2
    B2 --> B3
    B3 -->|POST /api/v1/predict| C1
    
    C1 --> C2
    C2 --> C3
    
    C3 -->|Threat Detected: JSON Remediation| B1
    B1 --> D1
    B1 --> D2
    B1 --> D3
    
    B1 -->|Write Incident Card| E1
    E1 -->|WebSockets / REST Feed| F1
    C1 -.->|Benchmark Verification| F3
```

---

## 2. 🧠 Autonomous Threat Remediation Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Attacker as Threat Actor / Rogue Connection
    participant FW as Edge Firewall / Node
    participant Go as Go Backend (Jiya)
    participant AI as AI Anomaly Engine (Chaitanya)
    participant Casbin as Casbin IAM Enforcer
    participant DB as PostgreSQL (Het)
    participant UI as React SOC UI (Riddhi)

    Attacker->>FW: SYN Flood / Port Scan / Root Shell Attempt
    FW->>Go: Forward Telemetry Packet (41 Features)
    Go->>AI: POST /api/v1/predict (Connection Payload)
    
    Note over AI: Isolation Forest Scores Event in 0.011 ms<br/>Z-Score Engine: diff_srv_rate = +8.18σ
    
    AI->>Go: Return Incident Card (CRITICAL Threat + 3 Actions)
    
    par Autonomous Remediation
        Go->>FW: Execute iptables DROP Rule on Attacker IP
        Go->>Casbin: Blacklist Compromised JWT Session Token
        Go->>FW: Trigger eBPF Kill on Malicious PID
    and Audit & Observability
        Go->>DB: INSERT INTO alerts & access_audit_logs
        Go->>UI: Real-Time WebSocket Push (Glowing Alert Badge)
    end

    UI-->>Attacker: 403 Forbidden / Connection Dropped
```

---

## 3. 🛡️ Casbin Zero-Trust 4-Tier Role Hierarchy Chart

```mermaid
graph TD
    subgraph TIER1["Tier 1: Master Control"]
        R1["👑 SuperAdmin (Chaitanya)<br/>Permitted: (*, *) Unrestricted Master Access"]
    end

    subgraph TIER2["Tier 2: Security Operations"]
        R2["🛡️ SecOps_Engineer (Jiya)<br/>Permitted: Firewalls (*), Anomalies (Remediate), Audit Logs (Read)"]
    end

    subgraph TIER3["Tier 3: Infrastructure Operations"]
        R3["🖥️ DataCenter_Operator (Het)<br/>Permitted: Servers (Read/Write), Racks (Read/Write), Assets (Read/Write)"]
    end

    subgraph TIER4["Tier 4: Governance & Compliance"]
        R4["👁️ Auditor_Viewer (Riddhi)<br/>Permitted: Strict Read-Only (Compliance, Logs, Licenses, Telemetry)"]
    end

    R1 -->|Inherits Permissions| R2
    R2 -->|Inherits Permissions| R4
    R3 -->|Inherits Permissions| R4

    style R1 fill:#7f1d1d,stroke:#ef4444,stroke-width:2px,color:#fff
    style R2 fill:#78350f,stroke:#f59e0b,stroke-width:2px,color:#fff
    style R3 fill:#0c4a6e,stroke:#38bdf8,stroke-width:2px,color:#fff
    style R4 fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#fff
```

---

## 4. 📊 AI Model Benchmark Comparison Chart

```
========================================================================================
🏆 SECUREDGE MODEL BENCHMARK PERFORMANCE (Tested on 100,655 Real DARPA Records)
========================================================================================

ROC-AUC Discriminator  [████████████████████████████████████████]  97.93% (Industry SOTA)
Malicious Recall Rate  [████████████████████████████████████████]  99.00% (Minimal Misses)
Detection Precision    [████████████████████████████████████    ]  96.00% (Low False Alarm)
Overall F1-Score       [█████████████████████████████████████   ]  97.40%
Inference Latency      [█                                       ]  0.011 ms / packet
```

### 🎯 Real Cyber Attack Family Detection Breakdown:
```
┌─────────────────┬───────────────────────────────┬──────────────┬───────────────┬─────────────────┐
│ Attack Family   │ Cyber Threat Classification   │ Tested Logs  │ Detected Logs │ Detection Rate  │
├─────────────────┼───────────────────────────────┼──────────────┼───────────────┼─────────────────┤
│ neptune         │ Denial of Service (SYN Flood) │     892      │      892      │ 100.00%  ██████ │
│ smurf           │ Volumetric ICMP Flood         │   2,412      │    2,412      │ 100.00%  ██████ │
│ portsweep       │ Port Scanning Reconnaissance  │       7      │        7      │ 100.00%  ██████ │
│ satan           │ Vulnerability Discovery Probe │      12      │       12      │ 100.00%  ██████ │
│ land            │ IP Spoofing Loopback Attack   │       1      │        1      │ 100.00%  ██████ │
│ teardrop        │ IP Fragment Offset Disruption │       5      │        2      │  40.00%  ██     │
│ ipsweep         │ Host Discovery Sweep          │       9      │        2      │  22.22%  █      │
└─────────────────┴───────────────────────────────┴──────────────┴───────────────┴─────────────────┘
```

---

## 5. 👥 Team Cyber Lakshya Work Breakdown Structure (WBS)

```mermaid
mindmap
  root((Cyber Lakshya<br/>CHA-39))
    Chaitanya
      Unsupervised AI Threat Engine
      100K+ Real Dataset Benchmark
      Z-Score Explainability Engine
      Casbin Zero-Trust RBAC & IAM
    Jiya
      Go REST API Gateway
      Casbin Middleware Adapter
      Real-Time Ingestion Pipeline
      Automated IP Drop Enforcer
    Het
      PostgreSQL Schema Design
      Incident Card Persistence
      Audit Logging Bus
      Relational Modeling
    Riddhi
      React SOC Command Center
      Live Glowing Threat Widget
      GCP IAM Scope UI
      Multi-Page Navigation
    Maharshi
      eBPF Kernel Probes
      Host Syscall Tracing
      Process Termination Hooks
    Siddharth
      Docker Containerization
      Nginx Reverse Proxy
      CI/CD Deployment
```

---

*Team Cyber Lakshya | Smart India Hackathon 2026*
