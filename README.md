# 🗄️ Cyber Lakshya (`SecurEdge`) — Centralized PostgreSQL Database Subsystem

<div align="center">

![SIH 2026](https://img.shields.io/badge/SIH--2026-Problem%20Statement%20CHA--39-blue?style=for-the-badge)
![Module](https://img.shields.io/badge/Module-PostgreSQL%20Data%20Storage-indigo?style=for-the-badge)
![Engine](https://img.shields.io/badge/Database-PostgreSQL%2016-emerald?style=for-the-badge)
![Integrity](https://img.shields.io/badge/Normalization-3NF%20%2B%20JSONB-cyan?style=for-the-badge)
![Compliance](https://img.shields.io/badge/Audit-NIST%20SP%20800--53-purple?style=for-the-badge)

**High-Throughput Relational Storage Engine, Asset Inventory, License Governance & Telemetry Store for AICTE DCIM**  
*Developed for AICTE by Team Cyber Lakshya (`DEPSTAR-SIH-880700`)*

</div>

---

## 📌 Executive Overview

The **Cyber Lakshya Database Subsystem** serves as the centralized single source of truth for AICTE’s data center infrastructure management (DCIM). Engineered with **PostgreSQL 16**, it seamlessly handles:

1. **High-Throughput Telemetry Ingestion:** BigSerial time-series storage for CPU, RAM, Disk, Temperature, and Network Mbps across thousands of distributed server nodes.
2. **Software License & Compliance Governance:** Centralized schema tracking license allocation, core-based entitlements, renewal countdowns, and over-allocation statuses.
3. **Hardware Asset Inventory:** Full DCIM lifecycle tracking for Servers, Firewalls, Switches, and Load Balancers with warranties and maintenance logs.
4. **Zero-Trust Security & Auditability:** JSONB-backed state auditing (`old_value` $\rightarrow$ `new_value`) with least-privilege database roles (`cyber_app` and `cyber_readonly`).

---

## 🏛️ Database Relational Architecture

```
                    ┌─────────────────────────┐
                    │        locations        │
                    └────────────┬────────────┘
                                 │ (1:N)
                                 ▼
┌───────────────────┐ (1:N) ┌─────────────────────────┐
│     software      │◄──────┤   license_assignments   │
└─────────┬─────────┘       └────────────┬────────────┘
          │ (1:N)                        │ (N:1)
          ▼                              ▼
┌───────────────────┐       ┌─────────────────────────┐ (1:1) ┌───────────────────┐
│     licenses      │       │         assets          ├──────►│      servers      │
└───────────────────┘       └────────────┬────────────┘       └───────────────────┘
                                         │ (1:N)              ┌───────────────────┐
                            ┌────────────┴────────────┐       │  network_devices  │
                            ▼                         ▼       └───────────────────┘
               ┌─────────────────────────┐ ┌─────────────────────────┐
               │   monitoring_metrics    │ │         alerts          │
               └─────────────────────────┘ └─────────────────────────┘
```

---

## 📋 4 Core Relational Domains

### 1. 🖥️ Hardware & DCIM Asset Inventory
* `locations`: Data center facilities, cities, and rack identifiers (`AICTE-DC-01`, `R01`).
* `assets`: Master asset tag registry (`SRV-001`, `FW-001`, `SW-001`, `LB-001`).
* `servers`: Host specs (OS, CPU cores, RAM GB, Storage GB, IP addresses).
* `network_devices`: Edge Firewalls (Fortinet/Palo Alto), Switches (Cisco), Load Balancers (F5).
* `warranties` & `maintenance_records`: Expiry dates and scheduled maintenance tasks.

### 2. 📑 Software License Management & Compliance
* `vendors`: Software publisher directory (Red Hat, Microsoft, Fortinet).
* `software`: Application catalog and version tracking.
* `licenses`: Key management, license types (`PER_CORE`, `SUBSCRIPTION`, `PERPETUAL`), total seats, purchase/renewal dates.
* `license_assignments`: Specific asset allocation tracking with unique constraints.

### 3. 📈 High-Throughput Real-Time Telemetry & AI Alerts
* `monitoring_metrics`: High-frequency metric stream (`cpu_usage`, `memory_usage`, `disk_usage`, `network_in_mbps`, `network_out_mbps`, `temperature_c`).
* `alerts`: Threat detection records linked to assets (`CRITICAL`, `HIGH`, `WARNING`).

### 4. 📜 Security Auditing & Access Control
* `audit_logs`: Immutable audit stream recording `action`, `resource_type`, `old_value JSONB`, `new_value JSONB`, `ip_address INET`.
* Least-privilege roles: `cyber_app` (CRUD for Go Backend) and `cyber_readonly` (Reporting & Analytics).

---

## ⚡ High-Performance Pre-Built Views

| View Name | Description | Target Consumers |
| :--- | :--- | :--- |
| **`asset_overview`** | Joins assets, locations, and status into a single clean DCIM view. | Riddhi (React UI) & Jiya (Go API) |
| **`license_overview`** | Auto-computes `used_quantity`, `available_quantity`, and dynamic compliance tags (`COMPLIANT`, `EXPIRING_SOON`, `OVER_ALLOCATED`, `EXPIRED`). | License Admin & Auditor Viewers |
| **`server_health`** | Uses PostgreSQL's high-speed `DISTINCT ON (asset_id)` to return the latest telemetry snapshot per server. | Chaitanya (AI/ML Anomaly Model) |
| **`dashboard_summary`** | Single-row aggregate summary of total assets, servers, network devices, open alerts, and expiring warranties. | Executive SOC Command Header |

---

## 📁 Repository Structure (DataBase Branch)

```
Cyber-Lakshya/ (Branch: DataBase)
├── README.md                                # This documentation file
├── .gitignore                               # Git ignore configuration
│
├── database/                                # SQL Scripts & Schema Definitions
│   ├── hardware_inventory_db.sql            # Hardware, locations, servers, network devices
│   ├── software_license_mng_db.sql          # Vendors, software, licenses, assignments
│   ├── monitoring_data_db.sql               # Real-time metrics & alerts tables
│   ├── audit_logging_db.sql                 # Security audit logging with JSONB
│   ├── mntr_indexes.sql                     # Performance B-Tree indexes
│   ├── db_security_assign.sql               # Role-based DB security (cyber_app, cyber_readonly)
│   ├── final_optimization_validation_db.sql # Analytical SQL views & check constraints
│   └── db_verification.sql                  # Automated database verification tests
│
├── diagrams/                                # Architecture & ER Diagrams
│   ├── cyber_lakshya_database_architecture.svg
│   └── database_er_diagram.md
│
└── documentation/                           # Technical Specifications & Data Dictionaries
    ├── data_dictionary.md                   # Column-by-column data dictionary
    ├── database_architecture.md             # Storage design & scalability notes
    └── team_handoff.md                      # Teammate integration instructions
```

---

## 🚀 Quickstart Setup

To initialize the complete database:
```bash
# 1. Connect to PostgreSQL
psql -U postgres -d cyber_lakshya

# 2. Run the schema scripts in order:
\i database/hardware_inventory_db.sql
\i database/software_license_mng_db.sql
\i database/monitoring_data_db.sql
\i database/audit_logging_db.sql
\i database/mntr_indexes.sql
\i database/final_optimization_validation_db.sql
\i database/db_security_assign.sql
```

---

*Team Cyber Lakshya | Smart India Hackathon 2026*
