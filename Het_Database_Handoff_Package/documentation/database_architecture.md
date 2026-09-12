# Database Architecture

## Purpose
`cyber_lakshya` is the centralized PostgreSQL data layer for the Cyber Lakshya AICTE DCIM/cybersecurity portal.

## Main domains

### Infrastructure
`locations` → `assets` → `servers` / `network_devices`

Assets also connect to:
- `warranties`
- `maintenance_records`

### Licensing
`vendors` → `software` → `licenses` → `license_assignments` → `assets`

This supports license usage, availability, compliance, allocation and expiry tracking.

### Monitoring
`assets` → `monitoring_metrics` → `alerts`

Telemetry stores CPU, memory, disk, network and temperature data.

### Security
`audit_logs` records important actions. Database access uses dedicated roles rather than the PostgreSQL superuser for application access.

## Important views
- `asset_overview`
- `license_overview`
- `server_health`
- `dashboard_summary`

## Scalability
Telemetry is high-volume. The design uses BIGSERIAL identifiers, indexes, and a time-oriented access pattern. Future production scaling can use time-based partitioning and retention policies.

## Application architecture
Frontend → HTTPS → Go API → RBAC → PostgreSQL

The browser must never connect directly to PostgreSQL.

## Blockchain
PostgreSQL remains the operational database. Selected high-value audit events can be hashed/anchored to a blockchain ledger for tamper-evident verification. The full operational database should not be placed on-chain.
