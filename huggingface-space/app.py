import os
import json
import uuid
import datetime
import gradio as gr
import numpy as np
import pandas as pd
import joblib

from config import MODEL_PATH, ENCODER_PATH, STATS_PATH, SEVERITY_THRESHOLDS
from explainability import AnomalyExplainer
from threat_agent import ThreatInvestigationAgent

# Load model, encoders, and baseline statistics
print("[*] Initializing SecurEdge AI Engine on Hugging Face Spaces...")
model = joblib.load(MODEL_PATH)
encoders = joblib.load(ENCODER_PATH)
explainer = AnomalyExplainer(STATS_PATH)
print("[+] Model loaded successfully.")

FEATURE_COLS = [
    "protocol_type", "service", "flag", "duration", "src_bytes", "dst_bytes",
    "land", "wrong_fragment", "urgent", "hot", "num_failed_logins", "logged_in",
    "num_compromised", "root_shell", "su_attempted", "num_root", "num_file_creations",
    "num_shells", "num_access_files", "num_outbound_cmds", "is_host_login", "is_guest_login",
    "count", "srv_count", "serror_rate", "srv_serror_rate", "rerror_rate", "srv_rerror_rate",
    "same_srv_rate", "diff_srv_rate", "srv_diff_host_rate", "dst_host_count", "dst_host_srv_count",
    "dst_host_same_srv_rate", "dst_host_diff_srv_rate", "dst_host_same_src_port_rate",
    "dst_host_srv_diff_host_rate", "dst_host_serror_rate", "dst_host_srv_serror_rate",
    "dst_host_rerror_rate", "dst_host_srv_rerror_rate"
]

CATEGORICAL_COLS = ["protocol_type", "service", "flag"]

PRESETS = {
    "🟢 Normal Web Traffic (Standard HTTP)": {
        "target_entity": "Web-Server-AICTE-01",
        "protocol_type": "tcp",
        "service": "http",
        "flag": "SF",
        "src_bytes": 215,
        "dst_bytes": 1024,
        "count": 2,
        "srv_count": 2,
        "diff_srv_rate": 0.0,
        "num_failed_logins": 0,
        "root_shell": 0,
        "su_attempted": 0,
        "num_file_creations": 0
    },
    "🔴 Port Scan Attack (Reconnaissance Sweep)": {
        "target_entity": "Edge-Firewall-Node-02",
        "protocol_type": "tcp",
        "service": "private",
        "flag": "S0",
        "src_bytes": 0,
        "dst_bytes": 0,
        "count": 180,
        "srv_count": 1,
        "diff_srv_rate": 0.92,
        "num_failed_logins": 0,
        "root_shell": 0,
        "su_attempted": 0,
        "num_file_creations": 0
    },
    "🔴 Brute-Force Authentication Attempt": {
        "target_entity": "IAM-Auth-Gateway-01",
        "protocol_type": "tcp",
        "service": "telnet",
        "flag": "SF",
        "src_bytes": 120,
        "dst_bytes": 240,
        "count": 35,
        "srv_count": 1,
        "diff_srv_rate": 0.0,
        "num_failed_logins": 9,
        "root_shell": 0,
        "su_attempted": 0,
        "num_file_creations": 0
    },
    "🔴 Privilege Escalation & Root Shell Compromise": {
        "target_entity": "Core-Database-Node-01",
        "protocol_type": "tcp",
        "service": "ftp",
        "flag": "SF",
        "src_bytes": 340,
        "dst_bytes": 4500,
        "count": 4,
        "srv_count": 2,
        "diff_srv_rate": 0.0,
        "num_failed_logins": 0,
        "root_shell": 1,
        "su_attempted": 1,
        "num_file_creations": 6
    },
    "🔴 SYN Flood DDoS (Neptune Attack)": {
        "target_entity": "Load-Balancer-Primary",
        "protocol_type": "tcp",
        "service": "private",
        "flag": "S0",
        "src_bytes": 0,
        "dst_bytes": 0,
        "count": 512,
        "srv_count": 512,
        "diff_srv_rate": 0.0,
        "num_failed_logins": 0,
        "root_shell": 0,
        "su_attempted": 0,
        "num_file_creations": 0
    }
}

def analyze_event(target_entity, protocol_type, service, flag, src_bytes, dst_bytes, count, srv_count, diff_srv_rate, num_failed_logins, root_shell, su_attempted, num_file_creations):
    event_dict = {
        "protocol_type": protocol_type,
        "service": service,
        "flag": flag,
        "src_bytes": src_bytes,
        "dst_bytes": dst_bytes,
        "count": count,
        "srv_count": srv_count,
        "diff_srv_rate": diff_srv_rate,
        "num_failed_logins": num_failed_logins,
        "root_shell": root_shell,
        "su_attempted": su_attempted,
        "num_file_creations": num_file_creations
    }

    # Encode features
    row = {}
    for col in CATEGORICAL_COLS:
        raw_val = str(event_dict.get(col, "unknown"))
        le = encoders.get(col)
        if le and raw_val in le.classes_:
            row[col] = le.transform([raw_val])[0]
        else:
            row[col] = 0

    for col in FEATURE_COLS:
        if col not in row:
            row[col] = float(event_dict.get(col, 0.0))

    X = np.array([[row[col] for col in FEATURE_COLS]])
    score = float(model.decision_function(X)[0])
    
    explanation = explainer.explain(event_dict, score)
    incident_id = f"SEC-{uuid.uuid4().hex[:8].upper()}"
    
    report = ThreatInvestigationAgent.generate_incident_report(
        event_id=incident_id,
        target_entity=target_entity,
        explanation_result=explanation,
        raw_event=event_dict
    )

    # UI Formatting
    status_header = "### 🔴 THREAT DETECTED" if explanation["is_anomaly"] else "### 🟢 NORMAL OPERATION"
    badge_color = "red" if explanation["is_anomaly"] else "green"
    
    deviation_rows = []
    for d in explanation["top_contributing_features"]:
        deviation_rows.append([d["feature"], str(d["value"]), f"+{d['z_score']}σ", d["description"]])

    df_deviations = pd.DataFrame(deviation_rows, columns=["Feature", "Observed Value", "Z-Score Divergence", "Threat Indicator"])

    return (
        f"{status_header}\n**Severity:** `{explanation['severity']}` | **Score:** `{explanation['anomaly_score']:.4f}`",
        report["markdown_report"],
        df_deviations
    )

def load_preset(preset_name):
    p = PRESETS.get(preset_name, PRESETS["🟢 Normal Web Traffic (Standard HTTP)"])
    return (
        p["target_entity"], p["protocol_type"], p["service"], p["flag"],
        p["src_bytes"], p["dst_bytes"], p["count"], p["srv_count"],
        p["diff_srv_rate"], p["num_failed_logins"], p["root_shell"],
        p["su_attempted"], p["num_file_creations"]
    )

# --- Gradio UI Layout ---
with gr.Blocks(theme=gr.themes.Soft(primary_hue="red", neutral_hue="slate"), title="SecurEdge AI Threat Engine") as demo:
    gr.Markdown("# 🛡️ SecurEdge — Real-Time Cybersecurity & DCIM Anomaly Engine")
    gr.Markdown("### Smart India Hackathon 2026 (CHA-39) | Team Cyber Lakshya (`DEPSTAR-SIH-880700`)")
    gr.Markdown("An unsupervised **Isolation Forest + Explainable AI (XAI)** anomaly engine trained on **100,655 real cybersecurity connections** with sub-30ms detection.")

    with gr.Tabs():
        with gr.TabItem("🔍 Live Anomaly Inspector"):
            with gr.Row():
                with gr.Column(scale=1):
                    gr.Markdown("#### ⚡ Quick Attack & Normal Presets")
                    preset_dropdown = gr.Dropdown(
                        choices=list(PRESETS.keys()),
                        value="🟢 Normal Web Traffic (Standard HTTP)",
                        label="Select Simulation Scenario"
                    )

                    target_entity = gr.Textbox(value="Web-Server-AICTE-01", label="Target Node / Server")
                    protocol_type = gr.Dropdown(["tcp", "udp", "icmp"], value="tcp", label="Protocol")
                    service = gr.Textbox(value="http", label="Service (http, private, telnet, ftp)")
                    flag = gr.Dropdown(["SF", "S0", "REJ", "RSTO", "SH"], value="SF", label="Connection Flag")
                    
                    with gr.Row():
                        src_bytes = gr.Number(value=215, label="Source Bytes")
                        dst_bytes = gr.Number(value=1024, label="Dest Bytes")

                    with gr.Row():
                        count = gr.Slider(0, 500, value=2, step=1, label="Host Connection Velocity (count)")
                        srv_count = gr.Slider(0, 500, value=2, step=1, label="Service Connection Velocity (srv_count)")

                    diff_srv_rate = gr.Slider(0.0, 1.0, value=0.0, step=0.01, label="Diff Service Rate (Port Scan Indicator)")
                    num_failed_logins = gr.Slider(0, 20, value=0, step=1, label="Failed Logins Count (Brute Force)")
                    
                    with gr.Row():
                        root_shell = gr.Radio([0, 1], value=0, label="Root Shell Obtained?")
                        su_attempted = gr.Radio([0, 1], value=0, label="Superuser (su) Attempted?")
                    
                    num_file_creations = gr.Slider(0, 20, value=0, step=1, label="Rapid File Creations")

                    btn_analyze = gr.Button("🛡️ Analyze Connection Telemetry", variant="primary")

                with gr.Column(scale=1):
                    gr.Markdown("#### 📊 Autonomous AI Security Analysis & Investigation")
                    out_status = gr.Markdown("Click 'Analyze Connection Telemetry' to begin inspection.")
                    
                    gr.Markdown("##### 🔍 Feature Z-Score Deviations (Explainable AI)")
                    out_table = gr.DataFrame(headers=["Feature", "Observed Value", "Z-Score Divergence", "Threat Indicator"])

                    gr.Markdown("##### 🚨 Autonomous AI Incident Investigation Report")
                    out_report = gr.Code(language="markdown", label="Executive SOC Incident Card", lines=15)

            preset_dropdown.change(
                load_preset,
                inputs=[preset_dropdown],
                outputs=[target_entity, protocol_type, service, flag, src_bytes, dst_bytes, count, srv_count, diff_srv_rate, num_failed_logins, root_shell, su_attempted, num_file_creations]
            )

            btn_analyze.click(
                analyze_event,
                inputs=[target_entity, protocol_type, service, flag, src_bytes, dst_bytes, count, srv_count, diff_srv_rate, num_failed_logins, root_shell, su_attempted, num_file_creations],
                outputs=[out_status, out_report, out_table]
            )

        with gr.TabItem("📈 Benchmark Evaluation Metrics"):
            gr.Markdown("""
            ### 🏆 Real Cybersecurity Ground-Truth Evaluation
            Evaluated on **8,377 real test connections** from the standard KDD network intrusion benchmark.
            
            | Metric | Score | Industry Standard Baseline |
            | :--- | :---: | :---: |
            | **ROC-AUC Score** | **`0.9793` (~98%)** | > 0.90 |
            | **Attack Recall Rate** | **`0.99` (99%)** | > 0.85 |
            | **Precision** | **`0.96` (96%)** | > 0.90 |
            | **F1-Score** | **`0.97`** | > 0.88 |

            #### 🎯 Detection Rates on Real Attack Types:
            * **`neptune` (SYN Flood DDoS):** `100.00%` (892/892)
            * **`smurf` (ICMP Volumetric Flood):** `100.00%` (2412/2412)
            * **`portsweep` (Port Scan Reconnaissance):** `100.00%` (7/7)
            * **`satan` (Vulnerability Probe):** `100.00%` (12/12)
            * **`land` (IP Spoofing):** `100.00%` (1/1)
            """)

        with gr.TabItem("🌐 REST API Integration"):
            gr.Markdown("""
            ### 🔌 Programmatic Cloud REST API for Go Backend & React Dashboard
            
            When deployed on Hugging Face Spaces, you can query this API over HTTPS:
            
            ```bash
            # Example API Call from Go / Python / cURL:
            curl -X POST "https://your-hf-space-name.hf.space/api/predict" \\
                 -H "Content-Type: application/json" \\
                 -d '{"data": ["Web-Server-01", "tcp", "http", "SF", 215, 1024, 2, 2, 0.0, 0, 0, 0, 0]}'
            ```
            """)

if __name__ == "__main__":
    demo.launch()
