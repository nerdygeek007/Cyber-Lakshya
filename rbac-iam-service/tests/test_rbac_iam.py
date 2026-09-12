import sys
import os
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import app
from enforcer import rbac_enforcer

client = TestClient(app)

def test_iam_health():
    res = client.get("/api/v1/iam/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["casbin_enforcer_loaded"] is True
    print("  ✓ [1/8] IAM Health Check Passed")

def test_iam_login_success():
    res = client.post("/api/v1/iam/login", json={"username": "chaitanya"})
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "token" in data
    assert data["user"]["role"] == "admin"
    print("  ✓ [2/8] RFC 7519 JWT Login Passed")

def test_iam_login_invalid_user():
    res = client.post("/api/v1/iam/login", json={"username": "hacker_unknown"})
    assert res.status_code == 401
    print("  ✓ [3/8] Unauthorized User Rejection Passed")

def test_admin_full_access():
    res = client.post("/api/v1/iam/verify-access", json={
        "subject": "chaitanya",
        "resource": "infra:servers",
        "action": "restart"
    })
    assert res.status_code == 200
    assert res.json()["decision"] == "ALLOW"
    print("  ✓ [4/8] SuperAdmin Full Server Privilege Passed")

def test_viewer_restricted_access():
    # Viewer can read server
    res1 = client.post("/api/v1/iam/verify-access", json={
        "subject": "riddhi",
        "resource": "infra:servers",
        "action": "read"
    })
    assert res1.status_code == 200
    assert res1.json()["decision"] == "ALLOW"

    # Viewer CANNOT restart server
    res2 = client.post("/api/v1/iam/verify-access", json={
        "subject": "riddhi",
        "resource": "infra:servers",
        "action": "restart"
    })
    assert res2.status_code == 200
    assert res2.json()["decision"] == "DENY"
    print("  ✓ [5/8] Least-Privilege Viewer Restriction (DENY) Passed")

def test_secops_firewall_access():
    res = client.post("/api/v1/iam/verify-access", json={
        "subject": "maharshi",
        "resource": "security:firewalls",
        "action": "quarantine"
    })
    assert res.status_code == 200
    assert res.json()["decision"] == "ALLOW"
    print("  ✓ [6/8] SecOps Emergency Firewall Quarantine Privilege Passed")

def test_auditor_compliance_access():
    res = client.post("/api/v1/iam/verify-access", json={
        "subject": "auditor_aicte",
        "resource": "compliance:audit_logs",
        "action": "export"
    })
    assert res.status_code == 200
    assert res.json()["decision"] == "ALLOW"
    print("  ✓ [7/8] Auditor Compliance Export Access Passed")

def test_rbac_benchmark_latency():
    res = client.get("/api/v1/iam/benchmark")
    assert res.status_code == 200
    data = res.json()
    assert data["avg_latency_ms"] < 0.20
    assert data["total_iterations"] == 1000
    print(f"  ✓ [8/8] Casbin 1,000-Request Benchmark: {data['avg_latency_ms']} ms/request ({data['requests_per_sec']:,} req/s)")

def run_all():
    print("=" * 65)
    print("🛡️ RUNNING CASBIN ZERO-TRUST RBAC & IAM AUTOMATED TEST SUITE")
    print("=" * 65)
    test_iam_health()
    test_iam_login_success()
    test_iam_login_invalid_user()
    test_admin_full_access()
    test_viewer_restricted_access()
    test_secops_firewall_access()
    test_auditor_compliance_access()
    test_rbac_benchmark_latency()
    print("=" * 65)
    print("🎉 ALL 8 CASBIN ZERO-TRUST RBAC TESTS PASSED WITH 100% SUCCESS!")
    print("=" * 65)

if __name__ == "__main__":
    run_all()
