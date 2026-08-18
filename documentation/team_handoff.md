# Team Handoff

## Jiya — Backend / Go

### Main database tables
`assets`, `servers`, `network_devices`, `locations`, `warranties`, `maintenance_records`, `vendors`, `software`, `licenses`, `license_assignments`, `monitoring_metrics`, `alerts`, `audit_logs`.

### Suggested APIs
- `GET/POST/PUT/DELETE /api/assets`
- `GET/POST/PUT /api/servers`
- `GET/POST/PUT /api/network-devices`
- `GET/POST/PUT /api/licenses`
- `GET /api/licenses/compliance`
- `GET /api/licenses/expiring`
- `GET/POST /api/monitoring/:asset_id`
- `GET/PUT /api/alerts`
- `GET /api/dashboard/summary`

Use connection pooling and environment variables/secrets for DB credentials. Do not use the PostgreSQL superuser for the application.

## Chaitanya — AI/ML + RBAC

### ML input
From `monitoring_metrics`:
- `asset_id`
- `recorded_at`
- `cpu_usage`
- `memory_usage`
- `disk_usage`
- `network_in_mbps`
- `network_out_mbps`
- `temperature_c`

Flow:
PostgreSQL telemetry → Isolation Forest → anomaly → alert → dashboard.

Chaitanya owns application-level RBAC/JWT. The database stays behind the backend.

## Riddhi — Frontend

Dashboard sources:
- `dashboard_summary`
- `asset_overview`
- `license_overview`
- `server_health`
- `alerts`

Suggested screens:
1. Command center
2. Infrastructure inventory
3. Server health
4. Network devices
5. License management/compliance
6. Alerts
7. Audit history

## Maharshi — Cybersecurity

Relevant DB capabilities:
- least-privilege DB roles
- audit logs
- asset inventory
- telemetry
- alerts

Potential blockchain flow:
selected audit event → canonical payload → hash → blockchain anchor → verification.

## Siddharthsinh — Network/Compliance

Relevant tables:
`network_devices`, `assets`, `monitoring_metrics`, `alerts`, `audit_logs`.

These support centralized network-device inventory, monitoring, compliance evidence and investigation.
