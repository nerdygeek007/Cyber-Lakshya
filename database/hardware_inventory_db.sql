CREATE TABLE locations (
    location_id SERIAL PRIMARY KEY,
    location_name VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    data_center VARCHAR(100),
    rack VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE assets (
    asset_id SERIAL PRIMARY KEY,
    asset_tag VARCHAR(50) UNIQUE NOT NULL,
    asset_type VARCHAR(50) NOT NULL,
    manufacturer VARCHAR(100),
    model VARCHAR(100),
    serial_number VARCHAR(100) UNIQUE,
    location_id INT REFERENCES locations(location_id),
    status VARCHAR(30) DEFAULT 'ACTIVE',
    purchase_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE servers (
    server_id SERIAL PRIMARY KEY,
    asset_id INT UNIQUE NOT NULL REFERENCES assets(asset_id),
    hostname VARCHAR(100) UNIQUE NOT NULL,
    ip_address VARCHAR(45) UNIQUE NOT NULL,
    operating_system VARCHAR(100),
    cpu VARCHAR(100),
    ram_gb INT,
    storage_gb INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE network_devices (
    device_id SERIAL PRIMARY KEY,
    asset_id INT UNIQUE NOT NULL REFERENCES assets(asset_id),
    device_type VARCHAR(50) NOT NULL,
    ip_address VARCHAR(45) UNIQUE NOT NULL,
    firmware_version VARCHAR(100),
    management_port INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE warranties (
    warranty_id SERIAL PRIMARY KEY,
    asset_id INT NOT NULL REFERENCES assets(asset_id),
    warranty_start DATE NOT NULL,
    warranty_end DATE NOT NULL,
    warranty_status VARCHAR(30) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE maintenance_records (
    maintenance_id SERIAL PRIMARY KEY,
    asset_id INT NOT NULL REFERENCES assets(asset_id),
    maintenance_type VARCHAR(100),
    scheduled_date DATE,
    completed_date DATE,
    status VARCHAR(30) DEFAULT 'SCHEDULED',
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO locations
(location_name, city, data_center, rack)
VALUES
('Ahmedabad DC', 'Ahmedabad', 'AICTE-DC-01', 'R01'),
('Delhi DC', 'Delhi', 'AICTE-DC-02', 'R05'),
('Mumbai DC', 'Mumbai', 'AICTE-DC-03', 'R10');

INSERT INTO assets
(asset_tag, asset_type, manufacturer, model, serial_number, location_id, status, purchase_date)
VALUES
('SRV-001', 'SERVER', 'Dell', 'PowerEdge R750', 'DL001', 1, 'ACTIVE', '2025-01-10'),
('SRV-002', 'SERVER', 'HP', 'ProLiant DL380', 'HP002', 2, 'ACTIVE', '2025-02-15'),
('FW-001', 'FIREWALL', 'Fortinet', 'FortiGate 200F', 'FG001', 1, 'ACTIVE', '2025-03-01'),
('SW-001', 'SWITCH', 'Cisco', 'Catalyst 9300', 'CS001', 3, 'ACTIVE', '2025-03-20'),
('LB-001', 'LOAD_BALANCER', 'F5', 'BIG-IP', 'F5001', 2, 'ACTIVE', '2025-04-05');

INSERT INTO servers
(asset_id, hostname, ip_address, operating_system, cpu, ram_gb, storage_gb)
VALUES
(1, 'AICTE-SRV-001', '10.10.1.10', 'Ubuntu 24.04', 'AMD EPYC 32-Core', 128, 2000),
(2, 'AICTE-SRV-002', '10.10.2.10', 'Windows Server 2022', 'Intel Xeon 24-Core', 64, 1000);

INSERT INTO network_devices
(asset_id, device_type, ip_address, firmware_version, management_port)
VALUES
(3, 'FIREWALL', '10.10.1.1', 'FortiOS 7.4', 443),
(4, 'SWITCH', '10.10.3.1', 'IOS-XE 17', 443),
(5, 'LOAD_BALANCER', '10.10.2.1', 'BIG-IP 17', 443);

INSERT INTO warranties
(asset_id, warranty_start, warranty_end, warranty_status)
VALUES
(1, '2025-01-10', '2028-01-10', 'ACTIVE'),
(2, '2025-02-15', '2028-02-15', 'ACTIVE'),
(3, '2025-03-01', '2027-03-01', 'ACTIVE'),
(4, '2025-03-20', '2028-03-20', 'ACTIVE'),
(5, '2025-04-05', '2027-04-05', 'ACTIVE');

INSERT INTO maintenance_records
(asset_id, maintenance_type, scheduled_date, status, remarks)
VALUES
(1, 'Preventive Maintenance', '2026-09-15', 'SCHEDULED', 'CPU and memory inspection'),
(2, 'OS Maintenance', '2026-09-20', 'SCHEDULED', 'Operating system patching'),
(3, 'Firewall Audit', '2026-09-10', 'SCHEDULED', 'Security rule review'),
(4, 'Network Maintenance', '2026-09-25', 'SCHEDULED', 'Port and firmware inspection'),
(5, 'Load Balancer Check', '2026-09-30', 'SCHEDULED', 'Traffic distribution test');


SELECT * FROM assets;
SELECT * FROM servers;
SELECT * FROM network_devices;
SELECT * FROM warranties;
SELECT * FROM maintenance_records;


SELECT
    a.asset_tag,
    a.asset_type,
    a.manufacturer,
    a.model,
    l.location_name,
    l.city,
    a.status
FROM assets a
JOIN locations l
ON a.location_id = l.location_id;

SELECT
    a.asset_tag,
    s.hostname,
    s.ip_address,
    s.operating_system,
    s.cpu,
    s.ram_gb,
    s.storage_gb,
    l.location_name
FROM servers s
JOIN assets a
ON s.asset_id = a.asset_id
JOIN locations l
ON a.location_id = l.location_id;

SELECT
    a.asset_tag,
    a.asset_type,
    w.warranty_start,
    w.warranty_end,
    w.warranty_status
FROM warranties w
JOIN assets a
ON w.asset_id = a.asset_id
ORDER BY w.warranty_end;

SELECT
    a.asset_tag,
    a.asset_type,
    w.warranty_end
FROM warranties w
JOIN assets a
ON w.asset_id = a.asset_id
WHERE w.warranty_end <= CURRENT_DATE + INTERVAL '90 days'
ORDER BY w.warranty_end;

SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
