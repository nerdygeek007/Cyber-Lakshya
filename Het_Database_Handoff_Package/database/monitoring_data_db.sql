CREATE TABLE monitoring_metrics (
    metric_id BIGSERIAL PRIMARY KEY,
    asset_id INT NOT NULL REFERENCES assets(asset_id),
    recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    cpu_usage NUMERIC(5,2),
    memory_usage NUMERIC(5,2),
    disk_usage NUMERIC(5,2),

    network_in_mbps NUMERIC(10,2),
    network_out_mbps NUMERIC(10,2),

    temperature_c NUMERIC(5,2)
);

CREATE TABLE alerts (
    alert_id BIGSERIAL PRIMARY KEY,
    asset_id INT NOT NULL REFERENCES assets(asset_id),
    alert_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) DEFAULT 'OPEN'
);

INSERT INTO monitoring_metrics
(asset_id, recorded_at, cpu_usage, memory_usage, disk_usage,
 network_in_mbps, network_out_mbps, temperature_c)
VALUES
(1, CURRENT_TIMESTAMP, 42.50, 61.20, 55.00, 200.50, 180.30, 31.20),
(2, CURRENT_TIMESTAMP, 78.40, 72.10, 68.50, 450.20, 390.10, 36.80),
(1, CURRENT_TIMESTAMP - INTERVAL '5 minutes', 45.20, 63.00, 55.10, 210.00, 185.50, 31.50),
(2, CURRENT_TIMESTAMP - INTERVAL '5 minutes', 81.30, 75.40, 69.00, 470.10, 410.20, 37.40);

INSERT INTO alerts
(asset_id, alert_type, severity, message)
VALUES
(2, 'HIGH_CPU', 'WARNING',
 'CPU usage exceeded 80% threshold');

SELECT * FROM monitoring_metrics;
SELECT * FROM alerts;


SELECT
    a.asset_tag,
    s.hostname,
    m.recorded_at,
    m.cpu_usage,
    m.memory_usage,
    m.disk_usage,
    m.network_in_mbps,
    m.network_out_mbps,
    m.temperature_c
FROM monitoring_metrics m
JOIN assets a
    ON m.asset_id = a.asset_id
JOIN servers s
    ON a.asset_id = s.asset_id
ORDER BY m.recorded_at DESC;


SELECT
    a.asset_tag,
    s.hostname,
    m.recorded_at,
    m.cpu_usage,
    m.memory_usage
FROM monitoring_metrics m
JOIN assets a
    ON m.asset_id = a.asset_id
JOIN servers s
    ON a.asset_id = s.asset_id
WHERE m.cpu_usage >= 80
ORDER BY m.cpu_usage DESC;

SELECT
    a.asset_tag,
    m.temperature_c,
    m.recorded_at
FROM monitoring_metrics m
JOIN assets a
    ON m.asset_id = a.asset_id
WHERE m.temperature_c >= 35
ORDER BY m.temperature_c DESC;

