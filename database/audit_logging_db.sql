CREATE TABLE audit_logs (
    audit_id BIGSERIAL PRIMARY KEY,

    user_id INT,

    action VARCHAR(50) NOT NULL,

    resource_type VARCHAR(100) NOT NULL,

    resource_id INT,

    old_value JSONB,

    new_value JSONB,

    ip_address INET,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_created_at
ON audit_logs(created_at DESC);

CREATE INDEX idx_audit_logs_resource
ON audit_logs(resource_type, resource_id);

INSERT INTO audit_logs
(
    user_id,
    action,
    resource_type,
    resource_id,
    old_value,
    new_value,
    ip_address
)
VALUES
(
    1,
    'UPDATE',
    'SERVER',
    1,
    '{"ip_address": "10.10.1.10", "ram_gb": 128}',
    '{"ip_address": "10.10.1.20", "ram_gb": 128}',
    '192.168.1.10'
);

INSERT INTO audit_logs
(
    user_id,
    action,
    resource_type,
    resource_id,
    old_value,
    new_value,
    ip_address
)
VALUES
(
    1,
    'ASSIGN',
    'LICENSE',
    1,
    NULL,
    '{"asset_id": 2, "status": "ACTIVE"}',
    '192.168.1.10'
);

SELECT * FROM audit_logs;

