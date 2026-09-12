"""
SecurEdge AI Anomaly Engine — PostgreSQL Database Connector
Integrates Chaitanya's AI/ML Threat Engine & Zero-Trust RBAC with Het's Database Schema (cyber_lakshya)
Smart India Hackathon 2026 | Problem Statement CHA-39 (AICTE DCIM)
"""

import os
import json
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime

logger = logging.getLogger("SecurEdgeDB")
logging.basicConfig(level=logging.INFO)

# Database Connection Parameters (Configurable via Environment Variables)
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", "5432"))
DB_NAME = os.getenv("DB_NAME", "cyber_lakshya")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres")

class DatabaseConnector:
    """
    Unified PostgreSQL Connector integrating AI/ML Anomaly Detection & Zero-Trust RBAC
    with Het's centralized 'cyber_lakshya' PostgreSQL database.
    """

    def __init__(self):
        self.is_connected = False
        self.conn = None
        self._memory_alerts: List[Dict[str, Any]] = []
        self._memory_audit_logs: List[Dict[str, Any]] = []
        self._try_connect()

    def _try_connect(self):
        """Attempts to establish real connection to PostgreSQL database."""
        try:
            import psycopg2
            from psycopg2.extras import RealDictCursor
            self.conn = psycopg2.connect(
                host=DB_HOST,
                port=DB_PORT,
                dbname=DB_NAME,
                user=DB_USER,
                password=DB_PASSWORD,
                cursor_factory=RealDictCursor,
                connect_timeout=3
            )
            self.conn.autocommit = True
            self.is_connected = True
            logger.info(f"[+] Successfully connected to PostgreSQL database '{DB_NAME}' on {DB_HOST}:{DB_PORT}")
        except Exception as e:
            self.is_connected = False
            logger.warning(f"[!] PostgreSQL not reachable ({e}). Operating in Local Memory Buffer Mode.")

    def persist_ai_alert(self, incident: Dict[str, Any], asset_id: int = 1) -> Dict[str, Any]:
        """
        Persists an AI-generated forensic incident card into Het's 'alerts' table.
        """
        incident_id = incident.get("incident_id", f"SEC-{os.urandom(4).hex().upper()}")
        target = incident.get("target_entity", "AICTE-SRV-001")
        severity = incident.get("severity", "CRITICAL")
        threat_report = incident.get("threat_report", {})
        category = threat_report.get("category", "Unsupervised Telemetry Anomaly")
        remediation_actions = threat_report.get("remediation_actions", [])
        evidence = incident.get("explainability", {}).get("top_anomalous_features", [])

        message = f"AI Threat Detected on {target}: {category} (Severity: {severity})"

        if self.is_connected and self.conn:
            try:
                with self.conn.cursor() as cur:
                    query = """
                    INSERT INTO alerts 
                    (asset_id, alert_type, severity, message, status)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING alert_id, detected_at;
                    """
                    cur.execute(query, (asset_id, category, severity, message, "OPEN"))
                    row = cur.fetchone()
                    logger.info(f"[+] AI Incident '{incident_id}' persisted to PostgreSQL 'alerts' (Alert ID: {row['alert_id']})")
                    return {
                        "persisted_to": "PostgreSQL",
                        "db_alert_id": row["alert_id"],
                        "detected_at": str(row["detected_at"]),
                        "incident_id": incident_id,
                        "status": "OPEN"
                    }
            except Exception as e:
                logger.error(f"[!] Error inserting into PostgreSQL alerts: {e}")

        # Fallback in-memory persistence
        fallback_record = {
            "alert_id": len(self._memory_alerts) + 1,
            "incident_id": incident_id,
            "asset_id": asset_id,
            "target_entity": target,
            "alert_type": category,
            "severity": severity,
            "message": message,
            "status": "OPEN",
            "detected_at": datetime.utcnow().isoformat(),
            "root_cause_evidence": evidence,
            "remediation_actions": remediation_actions,
            "persisted_to": "MemoryBuffer"
        }
        self._memory_alerts.insert(0, fallback_record)
        return fallback_record

    def fetch_all_alerts(self, limit: int = 50) -> List[Dict[str, Any]]:
        """
        Retrieves all active alerts from PostgreSQL 'alerts' table or memory buffer.
        """
        if self.is_connected and self.conn:
            try:
                with self.conn.cursor() as cur:
                    cur.execute("SELECT * FROM alerts ORDER BY detected_at DESC LIMIT %s;", (limit,))
                    rows = cur.fetchall()
                    return [dict(r) for r in rows]
            except Exception as e:
                logger.error(f"[!] Error querying PostgreSQL alerts: {e}")
        
        return self._memory_alerts[:limit]

    def fetch_server_health(self) -> List[Dict[str, Any]]:
        """
        Queries Het's high-performance 'server_health' view (latest telemetry per node).
        """
        if self.is_connected and self.conn:
            try:
                with self.conn.cursor() as cur:
                    cur.execute("SELECT * FROM server_health;")
                    return [dict(r) for r in cur.fetchall()]
            except Exception as e:
                logger.error(f"[!] Error querying view server_health: {e}")

        # Mock baseline health matching Het's schema
        return [
            {
                "asset_id": 1,
                "asset_tag": "SRV-001",
                "hostname": "AICTE-SRV-001",
                "ip_address": "10.10.1.10",
                "cpu_usage": 44.50,
                "memory_usage": 62.10,
                "disk_usage": 55.00,
                "network_in_mbps": 215.40,
                "network_out_mbps": 190.20,
                "temperature_c": 31.40
            },
            {
                "asset_id": 2,
                "asset_tag": "SRV-002",
                "hostname": "AICTE-SRV-002",
                "ip_address": "10.10.2.10",
                "cpu_usage": 84.10,
                "memory_usage": 76.80,
                "disk_usage": 69.50,
                "network_in_mbps": 490.20,
                "network_out_mbps": 425.60,
                "temperature_c": 38.10
            }
        ]

    def fetch_dashboard_summary(self) -> Dict[str, Any]:
        """
        Queries Het's 'dashboard_summary' aggregate view.
        """
        if self.is_connected and self.conn:
            try:
                with self.conn.cursor() as cur:
                    cur.execute("SELECT * FROM dashboard_summary;")
                    row = cur.fetchone()
                    if row:
                        return dict(row)
            except Exception as e:
                logger.error(f"[!] Error querying view dashboard_summary: {e}")

        return {
            "total_assets": 5,
            "total_servers": 2,
            "total_network_devices": 3,
            "total_license_products": 3,
            "open_alerts": len([a for a in self._memory_alerts if a.get("status") == "OPEN"]),
            "warranties_expiring_90_days": 1
        }

    def log_audit_event(
        self,
        username: str,
        action: str,
        resource_type: str,
        resource_id: Optional[int] = None,
        old_value: Optional[Dict[str, Any]] = None,
        new_value: Optional[Dict[str, Any]] = None,
        ip_address: str = "127.0.0.1"
    ) -> bool:
        """
        Logs a Zero-Trust access check or configuration change into Het's 'audit_logs' table.
        """
        if self.is_connected and self.conn:
            try:
                with self.conn.cursor() as cur:
                    query = """
                    INSERT INTO audit_logs
                    (user_id, action, resource_type, resource_id, old_value, new_value, ip_address)
                    VALUES (%s, %s, %s, %s, %s, %s, %s);
                    """
                    cur.execute(query, (
                        1,
                        action,
                        resource_type,
                        resource_id,
                        json.dumps(old_value) if old_value else None,
                        json.dumps(new_value) if new_value else None,
                        ip_address
                    ))
                    return True
            except Exception as e:
                logger.error(f"[!] Error inserting into audit_logs: {e}")

        # In-memory audit log
        self._memory_audit_logs.insert(0, {
            "username": username,
            "action": action,
            "resource_type": resource_type,
            "resource_id": resource_id,
            "old_value": old_value,
            "new_value": new_value,
            "ip_address": ip_address,
            "created_at": datetime.utcnow().isoformat()
        })
        return True

# Singleton instance
db_connector = DatabaseConnector()
