import os
import json
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from live_threat_watcher import LiveThreatWatcher
from config import REPORTS_DIR

app = FastAPI(
    title="SecurEdge AI Anomaly Engine",
    description="Real-time Unsupervised Anomaly Detection & AI Threat Investigation API for AICTE DCIM (CHA-39)",
    version="1.0.0"
)

# Enable CORS for frontend dashboard (Riddhi) and Go backend (Jiya)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lazy initialize watcher
watcher: Optional[LiveThreatWatcher] = None

@app.on_event("startup")
def startup_event():
    global watcher
    try:
        watcher = LiveThreatWatcher()
        print("[+] SecurEdge AI Anomaly Engine initialized.")
    except Exception as e:
        print(f"[!] Warning: Model not loaded on startup: {e}")

class ConnectionEvent(BaseModel):
    target_entity: Optional[str] = Field(default="DCIM-Node-01", description="Identifier of the target server/firewall/node")
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

@app.get("/api/v1/health", tags=["System"])
def health_check():
    return {
        "status": "healthy",
        "service": "SecurEdge AI Anomaly Engine",
        "model_loaded": watcher is not None
    }

@app.post("/api/v1/predict", tags=["Inference"])
def predict_single(event: ConnectionEvent):
    global watcher
    if watcher is None:
        watcher = LiveThreatWatcher()

    event_dict = event.dict()
    target_entity = event_dict.pop("target_entity", "DCIM-Node-01")
    
    result = watcher.score_event(event_dict, target_entity=target_entity)
    return result

@app.post("/api/v1/predict/batch", tags=["Inference"])
def predict_batch(batch: BatchEventRequest):
    global watcher
    if watcher is None:
        watcher = LiveThreatWatcher()

    results = []
    for ev in batch.events:
        event_dict = ev.dict()
        target_entity = event_dict.pop("target_entity", "DCIM-Node-01")
        res = watcher.score_event(event_dict, target_entity=target_entity)
        results.append(res)

    anomalies_count = sum(1 for r in results if r["is_anomaly"])
    return {
        "total_processed": len(results),
        "anomalies_detected": anomalies_count,
        "results": results
    }

@app.get("/api/v1/alerts", tags=["Alerts"])
def get_recent_alerts():
    alerts_file = os.path.join(REPORTS_DIR, "live_stream_alerts.json")
    if os.path.exists(alerts_file):
        with open(alerts_file, "r") as f:
            return json.load(f)
    return []

@app.get("/api/v1/metrics", tags=["Benchmark"])
def get_benchmark_metrics():
    metrics_file = os.path.join(REPORTS_DIR, "real_benchmark_summary.json")
    if os.path.exists(metrics_file):
        with open(metrics_file, "r") as f:
            return json.load(f)
    raise HTTPException(status_code=404, detail="Benchmark metrics file not found. Train model first.")
