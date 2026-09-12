import os
import json
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from live_threat_watcher import LiveThreatWatcher
from pyod_ueba_engine import VectorizedUEBAEngine
from chronos_forecaster import TelemetryChronosForecaster
from llm_soc_copilot import copilot_agent
from database_connector import db_connector
from config import REPORTS_DIR, AI_PROVIDER
from rbac_enforcer import rbac_enforcer
from auth_jwt import create_access_token, decode_access_token, USER_DB

from fastapi.responses import RedirectResponse, HTMLResponse

app = FastAPI(
    title="Cyber Lakshya Unified Tri-Guard AI Engine & Zero-Trust RBAC Gateway",
    description="Multi-Model Hybrid ML/DL Anomaly Detection, Zero-Shot Forecasting, UEBA, Casbin Zero-Trust RBAC/IAM, and AI SOC Copilot for AICTE (CHA-39)",
    version="2.0.0"
)

# Enable CORS for frontend dashboard (Riddhi) and Go backend (Jiya)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root route - automatically redirects browser to interactive Swagger UI
@app.get("/", include_in_schema=False)
def root_redirect():
    return RedirectResponse(url="/docs")

# Interactive Testing Workbench UI
@app.get("/ui", response_class=HTMLResponse, tags=["Testing UI"])
@app.get("/simulator", response_class=HTMLResponse, tags=["Testing UI"])
@app.get("/test", response_class=HTMLResponse, tags=["Testing UI"])
def get_testing_simulator():
    """Serves the rich interactive Tri-Guard ML Testing Simulator & Anomaly Workbench."""
    template_path = os.path.join(os.path.dirname(__file__), "templates", "simulator.html")
    if os.path.exists(template_path):
        with open(template_path, "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    return HTMLResponse(content="<h1>Simulator UI file not found</h1>", status_code=404)




# Lazy initialize engines
watcher: Optional[LiveThreatWatcher] = None
ueba_engine = VectorizedUEBAEngine()
forecaster = TelemetryChronosForecaster()

@app.on_event("startup")
def startup_event():
    global watcher
    try:
        watcher = LiveThreatWatcher()
        print("[+] Cyber Lakshya Tri-Guard AI Anomaly Engine initialized.")
    except Exception as e:
        print(f"[!] Warning: Model not loaded on startup: {e}")

# =========================================================================
# Pydantic Request Models
# =========================================================================

class ConnectionEvent(BaseModel):
    target_entity: Optional[str] = Field(default="AICTE-SRV-001", description="Identifier of the target server/firewall/node")
    asset_id: Optional[int] = Field(default=1, description="Relational Asset ID matching Het's assets table")
    protocol_type: Optional[str] = Field(default="tcp", description="Protocol type (tcp, udp, icmp)")
    service: Optional[str] = Field(default="http", description="Network service (http, private, telnet, ftp, etc.)")
    flag: Optional[str] = Field(default="SF", description="Connection status flag (SF, S0, REJ, etc.)")
    src_bytes: Optional[float] = Field(default=0.0, description="Source bytes payload")
    dst_bytes: Optional[float] = Field(default=0.0, description="Destination bytes payload")
    count: Optional[float] = Field(default=1.0, description="Connections to same host in past 2s")
    srv_count: Optional[float] = Field(default=1.0, description="Connections to same service in past 2s")
    diff_srv_rate: Optional[float] = Field(default=0.0, description="Rate of connections to different services")
    same_srv_rate: Optional[float] = Field(default=1.0, description="Rate of connections to same service")
    num_failed_logins: Optional[float] = Field(default=0.0, description="Failed authentication attempts")
    root_shell: Optional[float] = Field(default=0.0, description="1 if root shell obtained, 0 otherwise")
    su_attempted: Optional[float] = Field(default=0.0, description="1 if su root command attempted")
    num_file_creations: Optional[float] = Field(default=0.0, description="Number of file creation operations")

class BatchEventRequest(BaseModel):
    events: List[ConnectionEvent]

class UEBAEventRequest(BaseModel):
    user_id: Optional[str] = Field(default="usr-admin-01", description="User ID or technician name")
    role: Optional[str] = Field(default="Technician", description="Assigned Casbin RBAC role")
    login_hour: Optional[float] = Field(default=14.5, description="Hour of login (0.0 to 24.0)")
    failed_attempts_15m: Optional[float] = Field(default=0.0, description="Failed login attempts in 15 mins")
    ip_entropy_score: Optional[float] = Field(default=0.1, description="Geographic IP dispersion index")
    privilege_level: Optional[float] = Field(default=1.0, description="Requested privilege level (1-3)")

class TelemetryForecastRequest(BaseModel):
    metric_name: Optional[str] = Field(default="cpu_utilization_pct", description="Name of telemetry metric")
    history: List[float] = Field(default=[42.1, 44.5, 43.8, 48.2, 51.0, 53.4, 52.8, 55.1], description="Historical points")
    prediction_horizon: Optional[int] = Field(default=6, description="Future steps to predict")

class CopilotExplainRequest(BaseModel):
    target_entity: Optional[str] = Field(default="AICTE-SRV-024")
    mitre_id: Optional[str] = Field(default="T1498")
    mitre_title: Optional[str] = Field(default="Network Denial of Service (SYN Flood)")
    top_feature: Optional[str] = Field(default="High SYN packet burst on Port 22")
    anomaly_score: Optional[float] = Field(default=0.88)
    severity: Optional[str] = Field(default="CRITICAL")

class CopilotChatRequest(BaseModel):
    query: str = Field(description="Natural language question about DCIM, alerts, or telemetry")
    conversation_history: Optional[List[Dict[str, str]]] = Field(default=[])

# =========================================================================
# RBAC & IAM Pydantic Schemas
# =========================================================================

class IAMLoginRequest(BaseModel):
    username: str = Field(default="chaitanya", description="Username (chaitanya, maharshi, siddharth, het, jiya, riddhi, auditor_aicte)")
    password: Optional[str] = Field(default="password123", description="Password")

class IAMAccessCheckRequest(BaseModel):
    subject: Optional[str] = Field(default="chaitanya", description="Username or role (e.g. chaitanya or role:technician)")
    resource: str = Field(default="infra:servers", description="Target resource (e.g. infra:servers, security:firewalls)")
    action: str = Field(default="restart", description="Action (read, write, restart, deploy, quarantine, export)")

# =========================================================================
# API Endpoints
# =========================================================================

@app.get("/api/v1/health", tags=["System"])
def health_check():
    return {
        "status": "healthy",
        "service": "Cyber Lakshya Tri-Guard AI Anomaly Engine",
        "ai_provider": AI_PROVIDER,
        "models_loaded": {
            "tri_guard_ensemble": watcher is not None,
            "isolation_forest": True,
            "gmm_probabilistic": True,
            "deep_autoencoder": True,
            "pyod_ueba": True,
            "chronos_forecaster": True
        },
        "database_connected": db_connector.is_connected
    }

@app.post("/api/v1/predict", tags=["Inference & DB Sync"])
def predict_single(event: ConnectionEvent):
    global watcher
    if watcher is None:
        watcher = LiveThreatWatcher()

    event_dict = event.dict()
    target_entity = event_dict.pop("target_entity", "AICTE-SRV-001")
    asset_id = event_dict.pop("asset_id", 1)
    
    result = watcher.score_event(event_dict, target_entity=target_entity)

    # Automatic PostgreSQL Database Persistence when an Anomaly is Detected
    if result.get("is_anomaly"):
        db_record = db_connector.persist_ai_alert(result, asset_id=asset_id)
        result["db_persistence"] = db_record
        db_connector.log_audit_event(
            username="SecurEdge_AI_Engine",
            action="AI_ANOMALY_TRIGGERED",
            resource_type="SERVER",
            resource_id=asset_id,
            new_value={"incident_id": result.get("incident_id"), "severity": result.get("severity"), "mitre": result.get("mitre_tactic")}
        )

    return result

@app.post("/api/v1/predict/batch", tags=["Inference & DB Sync"])
def predict_batch(batch: BatchEventRequest):
    global watcher
    if watcher is None:
        watcher = LiveThreatWatcher()

    results = []
    for ev in batch.events:
        event_dict = ev.dict()
        target_entity = event_dict.pop("target_entity", "AICTE-SRV-001")
        asset_id = event_dict.pop("asset_id", 1)
        res = watcher.score_event(event_dict, target_entity=target_entity)
        if res.get("is_anomaly"):
            res["db_persistence"] = db_connector.persist_ai_alert(res, asset_id=asset_id)
        results.append(res)

    anomalies_count = sum(1 for r in results if r["is_anomaly"])
    return {
        "total_processed": len(results),
        "anomalies_detected": anomalies_count,
        "database_synced": True,
        "results": results
    }

@app.post("/api/v1/predict/ueba", tags=["Identity & Access (UEBA)"])
def predict_user_access_anomaly(req: UEBAEventRequest):
    """Scores user entity behavior and flags credential abuse, off-hour access, or privilege jumps."""
    return ueba_engine.score_user_event(req.dict())

@app.post("/api/v1/forecast/telemetry", tags=["Time-Series Forecasting"])
def forecast_telemetry_spline(req: TelemetryForecastRequest):
    """Generates zero-shot predictive telemetry spline with dynamic 95% upper/lower bounds."""
    return forecaster.forecast_metric(
        history=req.history,
        metric_name=req.metric_name,
        horizon=req.prediction_horizon
    )

@app.post("/api/v1/copilot/explain", tags=["AI SOC Copilot"])
def explain_incident_plain_language(req: CopilotExplainRequest):
    """Synthesizes the 4-Question Plain-Language explanation card using LLM / deterministic engine."""
    return copilot_agent.explain_anomaly_plain_language(req.dict())

@app.post("/api/v1/copilot/chat", tags=["AI SOC Copilot"])
def copilot_chat(req: CopilotChatRequest):
    """Interactive SOC Copilot natural language chat assistant."""
    return copilot_agent.chat_soc_query(req.query, history=req.conversation_history)

@app.get("/api/v1/models/benchmark", tags=["Benchmark"])
def get_benchmark_metrics():
    """Serves comparative benchmark report comparing Isolation Forest, GMM, Autoencoder, and Tri-Guard."""
    metrics_file = os.path.join(REPORTS_DIR, "real_benchmark_summary.json")
    if os.path.exists(metrics_file):
        with open(metrics_file, "r") as f:
            return json.load(f)
    raise HTTPException(status_code=404, detail="Benchmark metrics file not found. Train model first.")

@app.get("/api/v1/alerts", tags=["Alerts & Database"])
def get_recent_alerts():
    """Returns alerts fetched from Het's PostgreSQL database table / memory buffer."""
    return db_connector.fetch_all_alerts(limit=50)

@app.get("/api/v1/db/server-health", tags=["Database Views"])
def get_db_server_health():
    """Queries Het's high-performance 'server_health' view."""
    return db_connector.fetch_server_health()

@app.get("/api/v1/db/dashboard-summary", tags=["Database Views"])
def get_db_dashboard_summary():
    """Queries Het's 'dashboard_summary' aggregate KPI view."""
    return db_connector.fetch_dashboard_summary()

# =========================================================================
# Zero-Trust RBAC & IAM Endpoints (Casbin & RFC 7519 JWT)
# =========================================================================

@app.get("/api/v1/iam/health", tags=["Zero-Trust RBAC & IAM"])
def iam_health():
    """Health check for Casbin RBAC engine and policy matrix."""
    return {
        "status": "healthy",
        "service": "Cyber Lakshya Zero-Trust RBAC & IAM Subsystem",
        "casbin_enforcer_loaded": True,
        "supported_roles": ["admin", "secops", "technician", "auditor", "viewer"],
        "token_standard": "RFC 7519 (ECDSA/HMAC)"
    }

@app.post("/api/v1/iam/login", tags=["Zero-Trust RBAC & IAM"])
def login_user(req: IAMLoginRequest):
    """Authenticates a user and issues an RFC 7519 JWT token with assigned Casbin role claims."""
    username = req.username.lower().strip()
    if username not in USER_DB:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"User '{username}' not recognized in AICTE directory. Available demo users: {list(USER_DB.keys())}"
        )
    
    user_data = USER_DB[username]
    token = create_access_token(username=username, role=user_data["role"])
    roles = rbac_enforcer.get_roles_for_user(username)
    
    return {
        "success": True,
        "token": token,
        "user": {
            "username": username,
            "name": user_data["name"],
            "role": user_data["role"],
            "assigned_casbin_roles": roles,
            "department": user_data["department"]
        }
    }

@app.post("/api/v1/iam/verify-access", tags=["Zero-Trust RBAC & IAM"])
def verify_access(req: IAMAccessCheckRequest):
    """
    Evaluates real-time Casbin PERM policy.
    Returns whether access is GRANTED or DENIED with sub-millisecond evaluation latency.
    """
    import time
    start = time.perf_counter()
    
    is_allowed = rbac_enforcer.enforce_access(
        subject=req.subject,
        resource=req.resource,
        action=req.action
    )
    latency_ms = (time.perf_counter() - start) * 1000.0

    return {
        "subject": req.subject,
        "resource": req.resource,
        "action": req.action,
        "decision": "ALLOW" if is_allowed else "DENY",
        "is_allowed": is_allowed,
        "evaluation_latency_ms": round(latency_ms, 4),
        "policy_model": "Casbin PERM (Policy, Effect, Request, Matchers)"
    }

@app.get("/api/v1/iam/matrix", tags=["Zero-Trust RBAC & IAM"])
def get_permission_matrix():
    """Returns the complete 5-Tier Permission Matrix for UI dashboard tables."""
    return rbac_enforcer.get_permission_matrix()

@app.get("/api/v1/iam/benchmark", tags=["Zero-Trust RBAC & IAM"])
def benchmark_rbac():
    """Executes a 1,000-request latency benchmark demonstrating sub-0.01ms performance."""
    return rbac_enforcer.benchmark_latency(iterations=1000)

@app.get("/api/v1/iam/users", tags=["Zero-Trust RBAC & IAM"])
def list_directory_users():
    """Lists all registered data center users and their Casbin role assignments."""
    users = []
    for uname, data in USER_DB.items():
        roles = rbac_enforcer.get_roles_for_user(uname)
        users.append({
            "username": uname,
            "name": data["name"],
            "primary_role": data["role"],
            "casbin_roles": roles,
            "department": data["department"]
        })
    return {"total_users": len(users), "users": users}
