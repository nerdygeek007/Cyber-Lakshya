CREATE INDEX idx_assets_status
ON assets(status);

CREATE INDEX idx_assets_type
ON assets(asset_type);

CREATE INDEX idx_servers_hostname
ON servers(hostname);

CREATE INDEX idx_servers_ip
ON servers(ip_address);

CREATE INDEX idx_license_expiry
ON licenses(expiry_date);

CREATE INDEX idx_monitoring_asset_time
ON monitoring_metrics(asset_id, recorded_at DESC);