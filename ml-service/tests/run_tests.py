import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import (
    health_check,
    predict_single,
    predict_user_access_anomaly,
    forecast_telemetry_spline,
    explain_incident_plain_language,
    copilot_chat,
    get_benchmark_metrics,
    ConnectionEvent,
    UEBAEventRequest,
    TelemetryForecastRequest,
    CopilotExplainRequest,
    CopilotChatRequest
)

def run_all_tests():
    print("=" * 65)
    print("🧪 RUNNING DIRECT UNIT & INTEGRATION TESTS ON CYBER LAKSHYA ML API")
    print("=" * 65)

    # 1. Health
    print("[1/8] Testing health_check()...")
    data = health_check()
    assert data["status"] == "healthy"
    print(f"  ✓ Passed! Service: {data['service']}, Provider: {data['ai_provider']}")

    # 2. Predict Normal
    print("\n[2/8] Testing predict_single() (Normal Traffic)...")
    event = ConnectionEvent(
        target_entity="AICTE-SRV-001",
        protocol_type="tcp",
        service="http",
        flag="SF",
        src_bytes=215.0,
        count=2.0
    )
    data = predict_single(event)
    assert data["is_anomaly"] is False
    print(f"  ✓ Passed! Anomaly: {data['is_anomaly']}, Composite Risk Score: {data['risk_score']}")

    # 3. Predict Attack
    print("\n[3/8] Testing predict_single() (Real Cyber Attack)...")
    attack_event = ConnectionEvent(
        target_entity="AICTE-SRV-002",
        protocol_type="tcp",
        service="private",
        flag="S0",
        src_bytes=0.0,
        count=250.0,
        diff_srv_rate=0.95
    )
    data = predict_single(attack_event)
    assert data["is_anomaly"] is True
    print(f"  ✓ Passed! Attack Flagged: {data['is_anomaly']}, Severity: {data['severity']}, MITRE: {data['mitre_tactic']}")

    # 4. UEBA
    print("\n[4/8] Testing predict_user_access_anomaly() (Identity Abuse)...")
    ueba_req = UEBAEventRequest(
        user_id="usr-admin-04",
        role="Operator",
        login_hour=2.5,
        failed_attempts_15m=7.0,
        ip_entropy_score=0.85,
        privilege_level=3.0
    )
    data = predict_user_access_anomaly(ueba_req)
    assert data["is_ueba_anomaly"] is True
    print(f"  ✓ Passed! UEBA Flagged: {data['is_ueba_anomaly']}, Driver: {data['primary_driver']}, Action: {data['action_recommended']}")

    # 5. Telemetry Forecast
    print("\n[5/8] Testing forecast_telemetry_spline() (Time-Series Spline)...")
    fc_req = TelemetryForecastRequest(
        metric_name="cpu_utilization_pct",
        history=[40.0, 42.0, 45.0, 48.0, 52.0, 55.0],
        prediction_horizon=6
    )
    data = forecast_telemetry_spline(fc_req)
    assert len(data["median_forecast"]) == 6
    print(f"  ✓ Passed! 6-Step Forecast: {data['median_forecast']}, Upper 95%: {data['upper_bound_95']}")

    # 6. Copilot Explain
    print("\n[6/8] Testing explain_incident_plain_language() (4-Question Translator)...")
    explain_req = CopilotExplainRequest(
        target_entity="AICTE-SRV-024",
        mitre_id="T1498",
        mitre_title="Network Denial of Service (SYN Flood)",
        top_feature="High SYN packet flood",
        anomaly_score=0.92,
        severity="CRITICAL"
    )
    data = explain_incident_plain_language(explain_req)
    assert "what_happened" in data
    assert "why_it_matters" in data
    assert "what_to_do" in data
    assert "who_handles_it" in data
    print(f"  ✓ Passed! Generated 4-Question Plain Card via: {data.get('ai_provider', 'Engine')}")

    # 7. Copilot Chat
    print("\n[7/8] Testing copilot_chat() (Interactive SOC Assistant)...")
    chat_req = CopilotChatRequest(
        query="What is the CPU status of Server SRV-024?",
        conversation_history=[]
    )
    data = copilot_chat(chat_req)
    assert "response" in data
    print(f"  ✓ Passed! Response: {data['response'][:65]}...")

    # 8. Benchmark Metrics
    print("\n[8/12] Testing get_benchmark_metrics() (Comparative Models Report)...")
    data = get_benchmark_metrics()
    assert "models_benchmarked" in data
    print(f"  ✓ Passed! Verified {len(data['models_benchmarked'])} models on {data['dataset'][:35]}...")

    # 9. IAM Health
    print("\n[9/12] Testing IAM Health & Casbin Status...")
    from app import iam_health, login_user, verify_access, benchmark_rbac, IAMLoginRequest, IAMAccessCheckRequest
    iam_h = iam_health()
    assert iam_h["status"] == "healthy"
    assert iam_h["casbin_enforcer_loaded"] is True
    print(f"  ✓ Passed! Casbin Engine: Loaded, Roles: {iam_h['supported_roles']}")

    # 10. IAM Login & JWT Creation
    print("\n[10/12] Testing IAM User Login (chaitanya -> admin)...")
    login_res = login_user(IAMLoginRequest(username="chaitanya"))
    assert login_res["success"] is True
    assert "token" in login_res
    assert login_res["user"]["role"] == "admin"
    print(f"  ✓ Passed! Token Generated (RFC 7519), Role: {login_res['user']['role']}")

    # 11. Casbin Zero-Trust Permission Enforcement
    print("\n[11/12] Testing Casbin Authorization (SuperAdmin vs Viewer Least Privilege)...")
    admin_check = verify_access(IAMAccessCheckRequest(subject="chaitanya", resource="infra:servers", action="restart"))
    assert admin_check["decision"] == "ALLOW"
    print("  ✓ SuperAdmin server restart: ALLOW (Passed)")

    viewer_check = verify_access(IAMAccessCheckRequest(subject="riddhi", resource="infra:servers", action="restart"))
    assert viewer_check["decision"] == "DENY"
    print("  ✓ Viewer server restart: DENY (Least-Privilege Enforced!)")

    # 12. Casbin 1,000-Request Benchmark
    print("\n[12/12] Testing Casbin Real-Time Latency Benchmark (1,000 requests)...")
    bench = benchmark_rbac()
    assert bench["avg_latency_ms"] < 0.20
    print(f"  ✓ Passed! Casbin Speed: {bench['avg_latency_ms']} ms/request ({bench['requests_per_sec']:,} req/s)")

    print("\n" + "=" * 65)
    print("🎉 ALL 12 UNIFIED AI/ML & CASBIN RBAC TESTS PASSED (100% GREEN)!")
    print("=" * 65)

if __name__ == "__main__":
    run_all_tests()

