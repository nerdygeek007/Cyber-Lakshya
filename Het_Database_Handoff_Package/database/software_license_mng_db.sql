CREATE TABLE vendors (
    vendor_id SERIAL PRIMARY KEY,
    vendor_name VARCHAR(100) NOT NULL UNIQUE,
    contact_email VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE software (
    software_id SERIAL PRIMARY KEY,
    software_name VARCHAR(150) NOT NULL,
    vendor_id INT REFERENCES vendors(vendor_id),
    version VARCHAR(50),
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE licenses (
    license_id SERIAL PRIMARY KEY,
    software_id INT NOT NULL REFERENCES software(software_id),
    license_type VARCHAR(50) NOT NULL,
    license_key_reference VARCHAR(100),
    total_quantity INT NOT NULL CHECK (total_quantity >= 0),
    purchase_date DATE,
    expiry_date DATE,
    status VARCHAR(30) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE license_assignments (
    assignment_id SERIAL PRIMARY KEY,
    license_id INT NOT NULL REFERENCES licenses(license_id),
    asset_id INT NOT NULL REFERENCES assets(asset_id),
    assigned_date DATE NOT NULL DEFAULT CURRENT_DATE,
    release_date DATE,
    status VARCHAR(30) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO vendors
(vendor_name, contact_email)
VALUES
('Microsoft', 'licensing@microsoft.example'),
('Oracle', 'licensing@oracle.example'),
('VMware', 'licensing@vmware.example'),
('Red Hat', 'licensing@redhat.example');

INSERT INTO software
(software_name, vendor_id, version, category)
VALUES
('Windows Server', 1, '2022', 'Operating System'),
('Oracle Database', 2, '19c', 'Database'),
('VMware vSphere', 3, '8.0', 'Virtualization'),
('Red Hat Enterprise Linux', 4, '9', 'Operating System');

INSERT INTO licenses
(software_id, license_type, license_key_reference, total_quantity, purchase_date, expiry_date, status)
VALUES
(1, 'Volume', 'MS-WIN-REF-001', 500, '2025-01-01', '2026-12-30', 'ACTIVE'),
(2, 'Enterprise', 'ORA-DB-REF-001', 100, '2025-02-01', '2026-09-15', 'ACTIVE'),
(3, 'Subscription', 'VM-VSP-REF-001', 200, '2025-03-01', '2027-03-01', 'ACTIVE'),
(4, 'Subscription', 'RH-RHEL-REF-001', 300, '2025-04-01', '2026-10-15', 'ACTIVE');

INSERT INTO license_assignments
(license_id, asset_id, assigned_date, status)
VALUES
(1, 1, '2026-01-10', 'ACTIVE'),
(1, 2, '2026-01-10', 'ACTIVE'),
(2, 1, '2026-02-15', 'ACTIVE'),
(3, 1, '2026-03-10', 'ACTIVE'),
(4, 2, '2026-04-10', 'ACTIVE');

SELECT * FROM vendors;
SELECT * FROM software;
SELECT * FROM licenses;
SELECT * FROM license_assignments;

SELECT
    s.software_name,
    l.total_quantity AS total_licenses,
    COUNT(la.assignment_id) FILTER (WHERE la.status = 'ACTIVE') AS used_licenses,
    l.total_quantity -
    COUNT(la.assignment_id) FILTER (WHERE la.status = 'ACTIVE') AS available_licenses,
    l.expiry_date
FROM licenses l
JOIN software s
ON l.software_id = s.software_id
LEFT JOIN license_assignments la
ON l.license_id = la.license_id
GROUP BY
    s.software_name,
    l.total_quantity,
    l.expiry_date
ORDER BY s.software_name;

SELECT
    s.software_name,
    l.total_quantity,
    COUNT(la.assignment_id) FILTER (WHERE la.status = 'ACTIVE') AS used_licenses,
    CASE
        WHEN COUNT(la.assignment_id) FILTER (WHERE la.status = 'ACTIVE') > l.total_quantity
        THEN 'OVER-ALLOCATED'
        ELSE 'COMPLIANT'
    END AS compliance_status
FROM licenses l
JOIN software s
ON l.software_id = s.software_id
LEFT JOIN license_assignments la
ON l.license_id = la.license_id
GROUP BY
    s.software_name,
    l.total_quantity;

INSERT INTO licenses
(software_id, license_type, license_key_reference, total_quantity, purchase_date, expiry_date, status)
VALUES
(1, 'Test', 'TEST-LICENSE-001', 2, CURRENT_DATE, CURRENT_DATE + INTERVAL '1 year', 'ACTIVE');

INSERT INTO license_assignments
(license_id, asset_id, status)
VALUES
(5, 1, 'ACTIVE'),
(5, 2, 'ACTIVE'),
(5, 3, 'ACTIVE');

SELECT
    s.software_name,
    l.expiry_date,
    l.total_quantity,
    CASE
        WHEN l.expiry_date < CURRENT_DATE
            THEN 'EXPIRED'
        WHEN l.expiry_date <= CURRENT_DATE + INTERVAL '30 days'
            THEN 'EXPIRING WITHIN 30 DAYS'
        WHEN l.expiry_date <= CURRENT_DATE + INTERVAL '90 days'
            THEN 'EXPIRING WITHIN 90 DAYS'
        ELSE 'ACTIVE'
    END AS expiry_status
FROM licenses l
JOIN software s
ON l.software_id = s.software_id
ORDER BY l.expiry_date;

SELECT
    COUNT(*) AS total_license_products,
    SUM(total_quantity) AS total_licenses,
    SUM(
        CASE
            WHEN expiry_date < CURRENT_DATE THEN 1
            ELSE 0
        END
    ) AS expired_license_products,
    SUM(
        CASE
            WHEN expiry_date >= CURRENT_DATE
             AND expiry_date <= CURRENT_DATE + INTERVAL '30 days'
            THEN 1
            ELSE 0
        END
    ) AS expiring_within_30_days
FROM licenses;