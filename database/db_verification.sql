SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;


SELECT 'locations' AS table_name, COUNT(*) AS records FROM locations
UNION ALL
SELECT 'assets', COUNT(*) FROM assets
UNION ALL
SELECT 'servers', COUNT(*) FROM servers
UNION ALL
SELECT 'network_devices', COUNT(*) FROM network_devices
UNION ALL
SELECT 'warranties', COUNT(*) FROM warranties
UNION ALL
SELECT 'maintenance_records', COUNT(*) FROM maintenance_records
UNION ALL
SELECT 'vendors', COUNT(*) FROM vendors
UNION ALL
SELECT 'software', COUNT(*) FROM software
UNION ALL
SELECT 'licenses', COUNT(*) FROM licenses
UNION ALL
SELECT 'license_assignments', COUNT(*) FROM license_assignments
UNION ALL
SELECT 'monitoring_metrics', COUNT(*) FROM monitoring_metrics
UNION ALL
SELECT 'alerts', COUNT(*) FROM alerts
ORDER BY table_name;


----relationships of all tables---------

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


SELECT la.*
FROM license_assignments la
LEFT JOIN licenses l
ON la.license_id = l.license_id
WHERE l.license_id IS NULL;


SELECT m.*
FROM monitoring_metrics m
LEFT JOIN assets a
ON m.asset_id = a.asset_id
WHERE a.asset_id IS NULL;

SELECT
    tablename,
    indexname
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

EXPLAIN ANALYZE
SELECT *
FROM monitoring_metrics
WHERE asset_id = 1
ORDER BY recorded_at DESC;

SELECT
    a.asset_tag,
    a.asset_type,
    a.manufacturer,
    l.location_name,
    a.status
FROM assets a
JOIN locations l
ON a.location_id = l.location_id;

SELECT
    s.software_name,
    l.total_quantity,
    COUNT(la.assignment_id) FILTER (WHERE la.status = 'ACTIVE') AS used,
    l.total_quantity -
    COUNT(la.assignment_id) FILTER (WHERE la.status = 'ACTIVE') AS available
FROM licenses l
JOIN software s
ON l.software_id = s.software_id
LEFT JOIN license_assignments la
ON l.license_id = la.license_id
GROUP BY
    s.software_name,
    l.total_quantity;


SELECT
    a.asset_tag,
    m.recorded_at,
    m.cpu_usage,
    m.memory_usage,
    m.temperature_c
FROM monitoring_metrics m
JOIN assets a
ON m.asset_id = a.asset_id
ORDER BY m.recorded_at DESC;


CREATE OR REPLACE VIEW asset_overview AS
SELECT
    a.asset_id,
    a.asset_tag,
    a.asset_type,
    a.manufacturer,
    a.model,
    a.status,
    l.location_name,
    l.city
FROM assets a
LEFT JOIN locations l
ON a.location_id = l.location_id;

SELECT * FROM asset_overview;


CREATE OR REPLACE VIEW license_overview AS
SELECT
    l.license_id,
    s.software_name,
    v.vendor_name,
    l.license_type,
    l.total_quantity,
    COUNT(la.assignment_id) FILTER (WHERE la.status = 'ACTIVE') AS used_quantity,
    l.total_quantity -
    COUNT(la.assignment_id) FILTER (WHERE la.status = 'ACTIVE') AS available_quantity,
    l.purchase_date,
    l.expiry_date,
    CASE
        WHEN l.expiry_date < CURRENT_DATE THEN 'EXPIRED'
        WHEN l.expiry_date <= CURRENT_DATE + INTERVAL '30 days'
            THEN 'EXPIRING_SOON'
        WHEN COUNT(la.assignment_id) FILTER (WHERE la.status = 'ACTIVE') > l.total_quantity
            THEN 'OVER_ALLOCATED'
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
    l.license_type,
    l.total_quantity,
    l.purchase_date,
    l.expiry_date;

SELECT * FROM license_overview;