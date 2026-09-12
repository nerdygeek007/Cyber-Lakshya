# 🗄️ Cyber Lakshya — Database & Data Engineering Research and Implementation Report
### Smart India Hackathon 2026 | Problem Statement: CHA-39 (AICTE Cybersecurity Portal)
**Team:** Cyber Lakshya  
**Author:** Het Pansara — Database & Data Engineering Lead  

---

## 1. Executive Summary

**Cyber Lakshya** proposes a centralized cybersecurity and Data Center Infrastructure Management (DCIM) portal for the All India Council for Technical Education (AICTE). 

The database and data-engineering layer acts as the immutable **Single Source of Truth (SSOT)** for infrastructure assets, software licenses, real-time monitoring telemetry, security alerts, audit trails, and the relational topology linking these components.

The proposed architecture is built on **PostgreSQL 16**. The design applies:
- **Third Normal Form (3NF) relational modeling** for core entities with strict foreign keys and check constraints.
- **GIN-indexed JSONB columns** for device-specific, semi-structured configuration profiles.
- **Declarative time-based range partitioning** for high-volume metric and audit event tables.
- **Composite query-driven indexing** for sub-millisecond telemetry analytics.

The implementation follows an incremental pipeline:
$$\text{Requirements} \to \text{Entity Identification} \to \text{ER Model} \to \text{Relational Schema} \to \text{PostgreSQL Foundation} \to \text{Asset Inventory} \to \text{License Governance} \to \text{Telemetry Storage} \to \text{Optimization} \to \text{Audit/Security} \to \text{Go API Integration} \to \text{AI/ML \& UI Sync}$$

---

## 2. Problem Context & Data Engineering Solutions

| Problem Identified in SIH PS | Impact on AICTE Operations | Database & Data Engineering Response |
| :--- | :--- | :--- |
| **Fragmented Infrastructure** | Disparate tools for servers, switches, firewalls, and load balancers. | Centralized PostgreSQL data model with unified asset identifiers. |
| **Manual Inventory** | Spreadsheets and human logs lead to inconsistencies and errors. | Structured asset records with automated lifecycle states and API updates. |
| **Limited Visibility** | Difficulty tracking multi-region DC health and capacity. | Unified relational tables joining assets, metrics, alerts, and topology. |
| **License Non-Compliance** | Misuse of licenses, duplicate purchases, missed renewal dates. | 3-Tier license engine tracking software, entitlements, allocations, and expiries. |
| **Hardware Lifecycle** | Untracked warranties and delayed maintenance schedules. | Dedicated `warranties` and `maintenance_records` tables with countdown alerts. |
| **High Telemetry Volume** | Millions of daily metric points overwhelm standard DBs. | Composite B-tree indexing + declarative timestamp range partitioning. |
| **Auditability & Insider Threats** | Lack of tamper-evident records for administrative actions. | Append-only `audit_logs` table capturing `TG_OP` state diffs and SHA-256 hashes. |

---

## 3. Assigned Role & Responsibilities

**Role:** Het Pansara — Database & Data Engineering Lead  
**Objective:** Architect the PostgreSQL storage layer, optimize indexing strategies, and build high-throughput data contracts for the Go Backend (Jiya), AI/ML Anomaly Engine (Chaitanya), Security Core (Maharshi & Siddharth), and Frontend UI (Riddhi).

| Core Responsibility | Expected Technical Outcome |
| :--- | :--- |
| **PostgreSQL Architecture** | Scalable, consistent, ACID-compliant relational data layer with strict integrity. |
| **Software License Repository**| Real-time tracking of software products, license keys, core allocations, and renewal alerts. |
| **Hardware Asset Inventory** | Centralized inventory of servers, switches, firewalls, routers, and load balancers. |
| **Monitoring Telemetry Design** | High-ingestion storage for CPU, RAM, Disk, IOPS, and network throughput. |
| **AI/ML Feature Store** | Clean, timestamped feature views feeding Scikit-learn Isolation Forest. |
| **Go API Integration** | Connection pooling configurations, normalized query interfaces, and stored procedures. |

---

## 4. Research Foundations & Standards

### 4.1 Centralized Asset Inventory (NIST SP 800-53 CM-8)
- **NIST SP 800-53 Rev 5.1 (CM-8):** Requires an accurate, complete, and regularly updated inventory of all system components without duplicate accounting.
- **CISA Cybersecurity Performance Goals:** Mandates maintaining an asset inventory with IP mappings as a core security capability rather than just an IT administrative list.
- **Design Implication:** Every infrastructure device has a unique `asset_id` and standardized lifecycle state. Shared attributes reside in `assets`, while device-specific specs are stored in specialized tables and indexed JSONB.

### 4.2 Software Asset & License Management
- NIST continuous monitoring guidelines mandate separating software products from purchased entitlements and active installations.
- **Entity Model:**
  - `software`: Product identity, vendor, version, category.
  - `licenses`: Entitlement, purchased seats/cores, cost, purchase date, expiry date.
  - `license_assignments`: Maps a license to a specific server/user with allocation lifecycle tracking.
  - `compliance_status`: Derived query view indicating `COMPLIANT`, `EXPIRING_SOON` (< 30 days), `EXPIRED`, or `OVER_ALLOCATED`.

### 4.3 JSONB for Variable Device Configurations
- Different network vendors expose varying hardware attributes. PostgreSQL `JSONB` stores semi-structured device configurations while maintaining relational foreign key constraints.
- Optimized using **GIN (Generalized Inverted Index)** indexes for sub-millisecond JSON field searches.

### 4.4 Declarative Range Partitioning for Telemetry
- Telemetry tables (`monitoring_metrics`) partition data by month/week.
- Allows PostgreSQL query planners to execute **partition pruning**, scanning only relevant time slices during dashboard queries.

### 4.5 Blockchain Relevance & Pragmatic Hybrid Architecture
- The SIH domain is Blockchain & Cybersecurity. Replacing PostgreSQL entirely with blockchain introduces unnecessary query latency.
- **Recommended Hybrid Model:**
  - **PostgreSQL:** High-speed operational source of truth for assets, metrics, and firewall rules.
  - **Permissioned Ledger / Cryptographic Anchoring:** High-value events (license transfers, critical rule changes, admin audits) are anchored with SHA-256 state hashes, referencing NIST's 2026 **BloSS@M (Blockchain-Based Secure Software Assets Management - NIST IR 8500A)** framework.

---

## 5. System Data Architecture

```
                            [ CYBER LAKSHYA PORTAL ]
                                       │
                                       ▼
                             [ Go API / Gateway ]
                                       │
                                       ▼
                            [ PostgreSQL 16 SSOT ]
                                       │
       ┌───────────────────────────────┼───────────────────────────────┐
       ▼                               ▼                               ▼
[ Identity & RBAC ]           [ Asset Management ]            [ Software & Licenses ]
 • users                       • assets (Core Identity)        • software
 • roles / permissions         • servers (CPU/RAM/Disk)        • licenses
 • audit_logs (SHA-256)        • network_devices (FW/Switches) • license_assignments
                               • load_balancers                • compliance views
                               • locations & vendors
                                       │
                                       ▼
                              [ Operations Data ]
                               • monitoring_metrics (Partitioned)
                               • alerts & incidents
                                       │
                       ┌───────────────┴───────────────┐
                       ▼                               ▼
             [ AI/ML Feature Store ]         [ Executive Dashboard ]
             (Isolation Forest Ingest)       (Command Center UI)
```

---

## 6. Proposed Core Database Schema (DDL)

```sql
-- 1. Locations Hierarchy
CREATE TABLE locations (
    location_id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    datacenter_zone VARCHAR(64) NOT NULL,
    tier_rating VARCHAR(16) DEFAULT 'Tier-3',
    city VARCHAR(64) NOT NULL,
    address TEXT
);

-- 2. Hardware Asset Master Table
CREATE TABLE assets (
    asset_id VARCHAR(64) PRIMARY KEY,
    asset_type VARCHAR(32) NOT NULL, -- Server, Firewall, Switch, Router, Load_Balancer
    model VARCHAR(128) NOT NULL,
    serial_number VARCHAR(128) UNIQUE NOT NULL,
    location_id VARCHAR(32) NOT NULL REFERENCES locations(location_id),
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, MAINTENANCE, RETIRED
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Compute Server Specifications
CREATE TABLE servers (
    server_id VARCHAR(64) PRIMARY KEY REFERENCES assets(asset_id) ON DELETE CASCADE,
    hostname VARCHAR(128) NOT NULL,
    ip_address INET NOT NULL,
    os VARCHAR(64) NOT NULL,
    cpu_cores INT NOT NULL,
    ram_gb INT NOT NULL,
    storage_tb NUMERIC(6,2) NOT NULL,
    assigned_technician VARCHAR(128),
    hardware_specs JSONB -- Extended chassis attributes
);
CREATE INDEX idx_servers_specs_gin ON servers USING GIN (hardware_specs);

-- 4. Network Devices & Firewalls
CREATE TABLE network_devices (
    device_id VARCHAR(64) PRIMARY KEY REFERENCES assets(asset_id) ON DELETE CASCADE,
    device_name VARCHAR(128) NOT NULL,
    device_type VARCHAR(32) NOT NULL, -- FIREWALL, SWITCH, ROUTER, GATEWAY
    ip_address INET NOT NULL,
    management_port INT DEFAULT 443,
    firmware_version VARCHAR(64) NOT NULL,
    active_rules_count INT DEFAULT 0,
    config_state_hash VARCHAR(64) -- SHA-256 for Drift Detection
);

-- 5. Software & License Entitlement Repository
CREATE TABLE software (
    software_id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    vendor VARCHAR(128) NOT NULL,
    category VARCHAR(64) NOT NULL -- OS, Virtualization, Database, Productivity
);

CREATE TABLE licenses (
    license_id VARCHAR(64) PRIMARY KEY,
    software_id VARCHAR(64) NOT NULL REFERENCES software(software_id),
    license_key_hash VARCHAR(64) NOT NULL,
    total_quantity INT NOT NULL,
    used_quantity INT NOT NULL DEFAULT 0,
    cost_annual VARCHAR(32),
    purchase_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    status VARCHAR(32) NOT NULL -- ACTIVE, EXPIRING_SOON, EXPIRED
);

CREATE TABLE license_assignments (
    assignment_id VARCHAR(64) PRIMARY KEY,
    license_id VARCHAR(64) NOT NULL REFERENCES licenses(license_id),
    asset_id VARCHAR(64) REFERENCES assets(asset_id),
    user_id VARCHAR(64),
    assigned_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(32) DEFAULT 'ALLOCATED'
);

-- 6. High-Throughput Telemetry with Composite Indexing & Range Partitioning
CREATE TABLE monitoring_metrics (
    metric_id BIGSERIAL,
    asset_id VARCHAR(64) NOT NULL REFERENCES assets(asset_id),
    cpu_usage NUMERIC(5,2) NOT NULL,
    ram_usage NUMERIC(5,2) NOT NULL,
    disk_usage NUMERIC(5,2) NOT NULL,
    net_ingress_mbps NUMERIC(8,2) NOT NULL,
    net_egress_mbps NUMERIC(8,2) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (metric_id, timestamp)
) PARTITION BY RANGE (timestamp);

CREATE INDEX idx_monitoring_composite ON monitoring_metrics (asset_id, timestamp DESC);

-- 7. Normalized Firewall Rules Table
CREATE TABLE firewall_rules (
    rule_id VARCHAR(64) PRIMARY KEY,
    device_id VARCHAR(64) NOT NULL REFERENCES network_devices(device_id),
    source_cidr VARCHAR(64) NOT NULL,
    destination_cidr VARCHAR(64) NOT NULL,
    protocol VARCHAR(16) NOT NULL, -- TCP, UDP, ICMP, ANY
    port_range VARCHAR(32) NOT NULL,
    action VARCHAR(16) NOT NULL, -- ALLOW, DENY, DROP
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    risk_level VARCHAR(32) DEFAULT 'LOW',
    reason TEXT NOT NULL,
    last_modified TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. Alerts & Plain-Language AI Incidents Table
CREATE TABLE alerts (
    alert_id VARCHAR(64) PRIMARY KEY,
    asset_id VARCHAR(64) REFERENCES assets(asset_id),
    alert_type VARCHAR(64) NOT NULL,
    severity VARCHAR(32) NOT NULL, -- CRITICAL, HIGH, MEDIUM, LOW
    what_happened TEXT NOT NULL,
    operational_impact TEXT NOT NULL,
    recommended_action TEXT NOT NULL,
    assigned_role VARCHAR(64) NOT NULL,
    raw_payload JSONB,
    status VARCHAR(32) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9. Immutable Audit Trail Table with Trigger-Generated Diffs
CREATE TABLE audit_logs (
    audit_id BIGSERIAL PRIMARY KEY,
    actor_id VARCHAR(128) NOT NULL,
    role VARCHAR(64) NOT NULL,
    action VARCHAR(64) NOT NULL,
    resource VARCHAR(128) NOT NULL,
    prev_state JSONB,
    new_state JSONB,
    state_hash VARCHAR(64) NOT NULL, -- SHA-256(prev_hash + state)
    ip_address INET,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

---

## 7. Database Performance & Optimization Strategy

| Optimization Technique | Technical Rationale | Concrete Implementation |
| :--- | :--- | :--- |
| **Composite B-Tree Indexes** | Eliminates table scans on high-frequency queries. | `CREATE INDEX idx_monitoring_composite ON monitoring_metrics (asset_id, timestamp DESC);` |
| **Declarative Partitioning** | Limits sequential scans to recent time slices. | Partitioning `monitoring_metrics` by month/week with automatic partition drops. |
| **Connection Pooling** | Reuses database connections across thousands of concurrent API calls. | PgBouncer / Go `sql.DB` connection pool (`SetMaxOpenConns(50)`). |
| **Batch Ingestion** | Slashes per-row transaction overhead during telemetry streaming. | Multi-row `INSERT INTO ... VALUES (...)` batches of 500 rows per write cycle. |
| **Query Benchmarking** | Validates index effectiveness and execution plans. | Continuous profiling using `EXPLAIN (ANALYZE, BUFFERS)` to guarantee < 2ms queries. |

---

## 8. Data Contracts & Team Integration Matrix

```
┌─────────────────────────┬────────────────────────────────────────────────────────────────────────┐
│ Interfacing Teammate    │ PostgreSQL Data Contract & Schema Dependencies                         │
├─────────────────────────┼────────────────────────────────────────────────────────────────────────┤
│ Jiya Bhayani (Go API)   │ Provides CRUD endpoints, connection pool configuration, and DTO types. │
├─────────────────────────┼────────────────────────────────────────────────────────────────────────┤
│ Chaitanya (AI/ML & RBAC)│ Exposes monitoring views for Isolation Forest & Casbin policy tables.  │
├─────────────────────────┼────────────────────────────────────────────────────────────────────────┤
│ Siddharth (Firewalls)   │ Manages normalized `firewall_rules` and device `config_state_hash`.    │
├─────────────────────────┼────────────────────────────────────────────────────────────────────────┤
│ Maharshi (Security)     │ Integrates `audit_logs` triggers and Zero-Trust `clearance_level` tags.│
├─────────────────────────┼────────────────────────────────────────────────────────────────────────┤
│ Riddhi (UI/UX Cockpit)  │ Fast summary views: `dashboard_summary`, alert rollups, license meters.│
└─────────────────────────┴────────────────────────────────────────────────────────────────────────┘
```

---

## 9. Testing & Quality Assurance Plan

1. **Relational Integrity Tests:** Validates foreign key cascades, unique serial numbers, and check constraints (`used_quantity <= total_quantity`).
2. **License Logic Tests:** Validates automatic state transitions when expiry is within 30 days or allocations exceed capacity.
3. **High-Volume Telemetry Ingestion Tests:** Benchmarks bulk inserts of 50,000 synthetic records under 1.5 seconds.
4. **Security & Least-Privilege Role Tests:** Verifies that application database users cannot drop tables or bypass audit log triggers.
5. **Disaster Recovery Testing:** Verified database dump and point-in-time recovery (PITR) restore.

---

## 10. Phased Implementation Roadmap

- **Phase 1 (Requirements & ER Modeling):** Finalized entity catalog and 3NF relationships.
- **Phase 2 (PostgreSQL Foundation):** Built core tables, constraints, foreign keys, and indexes.
- **Phase 3 (Asset & License Modules):** Implemented hardware tracking and 3-tier license compliance.
- **Phase 4 (Monitoring & Partitions):** Implemented composite indexing and declarative time partitions.
- **Phase 5 (Audit & Security):** Created `audit_logs` table with automated `TG_OP` triggers.
- **Phase 6 (Integration & Testing):** Connected Go backend, ML feature pipelines, and frontend dashboards.

---

## 11. References & Standards

- **NIST SP 800-53 Rev 5.1 (CM-8 System Component Inventory):** [csrc.nist.gov/pubs/sp/800/53/r5/upd1/final](https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final)
- **NIST Software Asset Management: Continuous Monitoring:** [csrc.nist.gov/pubs/pd/2015/09/16/software-asset-management-continuous-monitoring/final](https://csrc.nist.gov/pubs/pd/2015/09/16/software-asset-management-continuous-monitoring/final)
- **NIST IR 8500A (BloSS@M Secure Software Asset Management):** [csrc.nist.gov/pubs/ir/8500/a/ipd](https://csrc.nist.gov/pubs/ir/8500/a/ipd)
- **CISA Cross-Sector Cybersecurity Performance Goals:** [cisa.gov/cross-sector-cybersecurity-performance-goals](https://www.cisa.gov/cross-sector-cybersecurity-performance-goals)
- **PostgreSQL 16 Documentation & Declarative Partitioning:** [postgresql.org/docs/current/ddl-partitioning.html](https://www.postgresql.org/docs/current/ddl-partitioning.html)
- **PostgreSQL JSONB & GIN Indexing:** [postgresql.org/docs/current/datatype-json.html](https://www.postgresql.org/docs/current/datatype-json.html)

---

## 12. Conclusion

Het Pansara's database architecture provides the solid, high-performance data foundation for **Cyber Lakshya**. By pairing **3NF relational normalization** for critical inventory and licenses with **GIN-indexed JSONB** and **declarative partitioning** for high-volume metrics, the system delivers enterprise reliability, audit compliance, and sub-millisecond query response for AICTE data center operations.
