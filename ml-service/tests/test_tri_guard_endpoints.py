import pytest
from fastapi.testclient import TestClient
import sys
import os

# Add ml-service to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "models_loaded" in data

def test_predict_single_normal():
    payload = {
        "target_entity": "AICTE-SRV-001",
        "protocol_type": "tcp",
        "service": "http",
        "flag": "SF",
        "src_bytes": 215.0,
        "dst_bytes": 1024.0,
        "count": 2.0,
        "srv_count": 2.0
    }
    response = client.post("/api/v1/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "is_anomaly" in data
    assert "risk_score" in data
    assert "model_breakdown" in data
    assert "mitre_tactic" in data

def test_predict_single_attack():
    payload = {
        "target_entity": "AICTE-SRV-002",
        "protocol_type": "tcp",
        "service": "private",
        "flag": "S0",
        "src_bytes": 0.0,
        "dst_bytes": 0.0,
        "count": 250.0,
        "srv_count": 1.0,
        "diff_srv_rate": 0.95
    }
    response = client.post("/api/v1/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["is_anomaly"] is True
    assert data["risk_score"] > 0.50

def test_predict_ueba():
    payload = {
        "user_id": "usr-admin-04",
        "role": "Operator",
        "login_hour": 2.5,
        "failed_attempts_15m": 7.0,
        "ip_entropy_score": 0.85,
        "privilege_level": 3.0
    }
    response = client.post("/api/v1/predict/ueba", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["is_ueba_anomaly"] is True
    assert data["anomaly_confidence"] > 0.60
    assert "Enforce MFA" in data["action_recommended"]

def test_forecast_telemetry():
    payload = {
        "metric_name": "cpu_utilization_pct",
        "history": [40.0, 42.0, 45.0, 48.0, 52.0, 55.0],
        "prediction_horizon": 6
    }
    response = client.post("/api/v1/forecast/telemetry", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data["median_forecast"]) == 6
    assert len(data["upper_bound_95"]) == 6
    assert len(data["lower_bound_95"]) == 6

def test_copilot_explain():
    payload = {
        "target_entity": "AICTE-SRV-024",
        "mitre_id": "T1498",
        "mitre_title": "Network Denial of Service (SYN Flood)",
        "top_feature": "High SYN packet burst",
        "anomaly_score": 0.92,
        "severity": "CRITICAL"
    }
    response = client.post("/api/v1/copilot/explain", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "what_happened" in data
    assert "why_it_matters" in data
    assert "what_to_do" in data
    assert "who_handles_it" in data

def test_copilot_chat():
    payload = {
        "query": "What happened to server SRV-024?",
        "conversation_history": []
    }
    response = client.post("/api/v1/copilot/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert len(data["suggested_actions"]) > 0

def test_benchmark_endpoint():
    response = client.get("/api/v1/models/benchmark")
    assert response.status_code == 200
    data = response.json()
    assert "models_benchmarked" in data
    assert len(data["models_benchmarked"]) >= 3
