SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

SELECT
    tablename,
    indexname
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;


ALTER TABLE monitoring_metrics
ADD CONSTRAINT chk_cpu_usage
CHECK (cpu_usage IS NULL OR cpu_usage >= 0);

ALTER TABLE monitoring_metrics
ADD CONSTRAINT chk_memory_usage
CHECK (memory_usage IS NULL OR memory_usage >= 0);

ALTER TABLE monitoring_metrics
ADD CONSTRAINT chk_disk_usage
CHECK (disk_usage IS NULL OR disk_usage >= 0);

ALTER TABLE monitoring_metrics
ADD CONSTRAINT chk_temperature
CHECK (temperature_c IS NULL OR temperature_c >= -50);


CREATE OR REPLACE VIEW asset_overview AS
SELECT
    a.asset_id,
    a.asset_tag,
    a.asset_type,
    a.manufacturer,
    a.model,
    a.serial_number,
    a.status,
    l.location_name,
    l.city,
    l.data_center,
    l.rack,
    a.purchase_date
FROM assets a
LEFT JOIN locations l
    ON a.location_id = l.location_id;

SELECT * FROM asset_overview;

CREATE OR REPLACE VIEW license_overview AS
SELECT
    l.license_id,
    s.software_name,
    v.vendor_name,
    s.version,
    l.license_type,
    l.total_quantity,

    COUNT(la.assignment_id)
        FILTER (WHERE la.status = 'ACTIVE') AS used_quantity,

    l.total_quantity -
    COUNT(la.assignment_id)
        FILTER (WHERE la.status = 'ACTIVE') AS available_quantity,

    l.purchase_date,
    l.expiry_date,

    CASE
        WHEN l.expiry_date < CURRENT_DATE
            THEN 'EXPIRED'

        WHEN COUNT(la.assignment_id)
             FILTER (WHERE la.status = 'ACTIVE')
             > l.total_quantity
            THEN 'OVER_ALLOCATED'

        WHEN l.expiry_date <= CURRENT_DATE + INTERVAL '30 days'
            THEN 'EXPIRING_SOON'

        ELSE 'COMPLIANT'
    END AS compliance_status

FROM licenses l

JOIN software s
    ON l.software_id = s.software_id

LEFT JOIN vendors v
    ON s.vendor_id = v.vendor_id

LEFT JOIN license_assignments la
    ON l.license_id = la.license_id

GROUP BY
    l.license_id,
    s.software_name,
    v.vendor_name,
    s.version,
    l.license_type,
    l.total_quantity,
    l.purchase_date,
    l.expiry_date;

SELECT * FROM license_overview;

CREATE OR REPLACE VIEW server_health AS
SELECT DISTINCT ON (a.asset_id)
    a.asset_id,
    a.asset_tag,
    s.hostname,
    s.ip_address,
    m.recorded_at,
    m.cpu_usage,
    m.memory_usage,
    m.disk_usage,
    m.network_in_mbps,
    m.network_out_mbps,
    m.temperature_c
FROM assets a

JOIN servers s
    ON a.asset_id = s.asset_id

LEFT JOIN monitoring_metrics m
    ON a.asset_id = m.asset_id

ORDER BY
    a.asset_id,
    m.recorded_at DESC;


SELECT * FROM server_health;

CREATE OR REPLACE VIEW dashboard_summary AS
SELECT
    (SELECT COUNT(*) FROM assets) AS total_assets,

    (SELECT COUNT(*)
     FROM assets
     WHERE asset_type = 'SERVER') AS total_servers,

    (SELECT COUNT(*)
     FROM assets
     WHERE asset_type IN
     ('FIREWALL', 'SWITCH', 'ROUTER', 'LOAD_BALANCER'))
     AS total_network_devices,

    (SELECT COUNT(*)
     FROM licenses) AS total_license_products,

    (SELECT COUNT(*)
     FROM alerts
     WHERE status = 'OPEN') AS open_alerts,

    (SELECT COUNT(*)
     FROM warranties
     WHERE warranty_end <= CURRENT_DATE + INTERVAL '90 days')
     AS warranties_expiring_90_days;


SELECT * FROM dashboard_summary;

SELECT *
FROM server_health
WHERE asset_tag = 'SRV-001';

SELECT *
FROM license_overview;

SELECT *
FROM audit_logs
WHERE resource_type = 'SERVER'
ORDER BY created_at DESC;


SELECT
    rolname,
    rolcanlogin
FROM pg_roles
WHERE rolname IN
(
    'cyber_app',
    'cyber_readonly'
);


SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS referenced_table,
    ccu.column_name AS referenced_column
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_schema = 'public'
ORDER BY tc.table_name;