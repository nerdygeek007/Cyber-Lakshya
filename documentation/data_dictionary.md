# Data Dictionary

| Table | Purpose |
|---|---|
| `locations` | Data-center and rack locations |
| `assets` | Master infrastructure inventory |
| `servers` | Server-specific information |
| `network_devices` | Firewall/switch/router/load-balancer data |
| `warranties` | Warranty lifecycle |
| `maintenance_records` | Maintenance scheduling/history |
| `vendors` | Software vendors |
| `software` | Software catalog |
| `licenses` | Purchased license records |
| `license_assignments` | License-to-asset allocation |
| `monitoring_metrics` | High-volume telemetry |
| `alerts` | Detected infrastructure issues |
| `audit_logs` | Security/audit trail |
| `security_controls` | Database security controls |

## Key relationships
- `assets.location_id → locations.location_id`
- `servers.asset_id → assets.asset_id`
- `network_devices.asset_id → assets.asset_id`
- `warranties.asset_id → assets.asset_id`
- `maintenance_records.asset_id → assets.asset_id`
- `software.vendor_id → vendors.vendor_id`
- `licenses.software_id → software.software_id`
- `license_assignments.license_id → licenses.license_id`
- `license_assignments.asset_id → assets.asset_id`
- `monitoring_metrics.asset_id → assets.asset_id`
- `alerts.asset_id → assets.asset_id`
