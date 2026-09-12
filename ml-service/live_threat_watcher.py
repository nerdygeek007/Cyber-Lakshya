import os
import json
import uuid
import time
import pandas as pd
import numpy as np
import joblib

from config import MODEL_PATH, GMM_MODEL_PATH, AE_MODEL_PATH, ENCODER_PATH, STATS_PATH, REPORTS_DIR
from real_dataset_pipeline import FEATURE_COLS, CATEGORICAL_COLS, NUMERICAL_COLS
from explainability import AnomalyExplainer
from threat_agent import ThreatInvestigationAgent
from gmm_engine import GMMAnomalyDetector
from autoencoder_engine import LightweightDeepAutoencoder
from llm_soc_copilot import copilot_agent

class LiveThreatWatcher:
    """
    Tri-Guard Hybrid ML/DL Threat Watcher for Cyber Lakshya (CHA-39).
    Combines Isolation Forest (Structural), GMM (Probabilistic Density), and Deep Autoencoder (Reconstruction MSE).
    Integrates with Explainable AI (XAI) and Dual-Mode LLM Copilot.
    """
    def __init__(self):
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Trained model not found at {MODEL_PATH}. Please run train_tri_guard_ensemble.py first.")
        
        print("[*] Loading Tri-Guard Hybrid Models (Isolation Forest, GMM, Deep Autoencoder)...")
        self.iforest = joblib.load(MODEL_PATH)
        self.encoders = joblib.load(ENCODER_PATH)
        self.explainer = AnomalyExplainer(STATS_PATH)
        
        # Load GMM if exists, else fallback
        if os.path.exists(GMM_MODEL_PATH):
            self.gmm = GMMAnomalyDetector.load(GMM_MODEL_PATH)
        else:
            self.gmm = None

        # Load Autoencoder if exists, else fallback
        if os.path.exists(AE_MODEL_PATH):
            self.autoencoder = LightweightDeepAutoencoder.load(AE_MODEL_PATH)
        else:
            self.autoencoder = None

        print("[+] Tri-Guard LiveThreatWatcher initialized with multi-model scoring.")

    def score_event(self, event_dict, target_entity="AICTE-SRV-001"):
        """
        Scores a single incoming connection or telemetry frame using the Tri-Guard Hybrid Ensemble.
        Computes composite score: 0.40 * GMM + 0.35 * Autoencoder + 0.25 * iForest.
        Returns severity, plain-language 4-question explanation, and forensic telemetry.
        """
        # Prepare feature vector
        row = {}
        for col in CATEGORICAL_COLS:
            raw_val = str(event_dict.get(col, "unknown"))
            le = self.encoders.get(col)
            if le and raw_val in le.classes_:
                row[col] = le.transform([raw_val])[0]
            else:
                row[col] = 0

        for col in NUMERICAL_COLS:
            try:
                row[col] = float(event_dict.get(col, 0))
            except (ValueError, TypeError):
                row[col] = 0.0

        # Vectorize
        X_vec = np.array([row[col] for col in FEATURE_COLS])
        X_2d = X_vec.reshape(1, -1)

        # 1. Isolation Forest score
        if_raw = float(self.iforest.decision_function(X_2d)[0])
        # Convert decision function to anomaly score in [0, 1]
        if_score = max(0.0, min(1.0, 0.5 - (if_raw * 2.0)))

        # 2. GMM score
        if self.gmm:
            gmm_res = self.gmm.score_event(X_vec)
            gmm_score = gmm_res["anomaly_score"]
            gmm_cluster = gmm_res["dominant_cluster"]
            gmm_log_prob = gmm_res["log_prob"]
        else:
            gmm_score = if_score
            gmm_cluster = 0
            gmm_log_prob = -15.0

        # 3. Deep Autoencoder score
        if self.autoencoder:
            ae_res = self.autoencoder.score_event(X_vec, feature_names=FEATURE_COLS)
            ae_score = ae_res["anomaly_score"]
            ae_mse = ae_res["reconstruction_mse"]
            ae_top_feat = ae_res["top_feature"]
        else:
            ae_score = if_score
            ae_mse = 0.01
            ae_top_feat = "connection_metrics"

        # 4. Tri-Guard Unified Fusion
        composite_risk = float(0.40 * gmm_score + 0.35 * ae_score + 0.25 * if_score)
        is_anomaly = composite_risk > 0.48

        # 5. Severity mapping
        if composite_risk >= 0.80:
            severity = "CRITICAL"
        elif composite_risk >= 0.65:
            severity = "HIGH"
        elif composite_risk >= 0.48:
            severity = "MEDIUM"
        else:
            severity = "NORMAL"

        # 6. Explainability & MITRE ATT&CK Mapping
        explanation = self.explainer.explain(event_dict, if_raw)
        
        # Match MITRE Tactic
        top_reason = explanation.get("top_reason", "Statistical anomaly detected")
        if "login" in top_reason.lower() or event_dict.get("num_failed_logins", 0) > 3:
            mitre_id = "T1110.001"
            mitre_title = "Brute Force: Password Guessing"
        elif "root" in top_reason.lower() or event_dict.get("root_shell", 0) == 1:
            mitre_id = "T1068"
            mitre_title = "Exploitation for Privilege Escalation"
        elif "service" in top_reason.lower() or event_dict.get("diff_srv_rate", 0) > 0.5:
            mitre_id = "T1046"
            mitre_title = "Network Service Discovery (Port Scan)"
        else:
            mitre_id = "T1498"
            mitre_title = "Network Denial of Service (Traffic Volumetric Spike)"

        # 7. Dual-Mode LLM Copilot Plain-Language Generation
        copilot_ctx = {
            "target_entity": target_entity,
            "mitre_id": mitre_id,
            "mitre_title": mitre_title,
            "top_feature": top_reason,
            "anomaly_score": round(composite_risk, 4),
            "severity": severity
        }
        plain_language_card = copilot_agent.explain_anomaly_plain_language(copilot_ctx)

        # 8. Threat Report
        incident_id = f"SEC-{uuid.uuid4().hex[:8].upper()}"
        threat_report = ThreatInvestigationAgent.generate_incident_report(
            event_id=incident_id,
            target_entity=target_entity,
            explanation_result=explanation,
            raw_event=event_dict
        )

        return {
            "incident_id": incident_id,
            "target_entity": target_entity,
            "is_anomaly": is_anomaly,
            "severity": severity,
            "risk_score": round(composite_risk, 4),
            "anomaly_score": round(composite_risk, 4),
            "model_breakdown": {
                "tri_guard_composite": round(composite_risk, 4),
                "gmm_probabilistic": round(gmm_score, 4),
                "autoencoder_mse": round(ae_score, 4),
                "isolation_forest": round(if_score, 4),
                "gmm_cluster": gmm_cluster,
                "reconstruction_mse": round(ae_mse, 6)
            },
            "top_reason": top_reason,
            "top_features": explanation.get("top_contributing_features", []),
            "mitre_tactic": f"[{mitre_id}] {mitre_title}",
            "plain_language_card": plain_language_card,
            "threat_report": threat_report
        }

    def run_stream_simulation(self, sample_events, output_json=True):
        """Processes a stream of sample events, printing real-time detection telemetry."""
        print("\n" + "=" * 70)
        print("⚡ TRI-GUARD HYBRID ML/DL REAL-TIME TELEMETRY INGESTION")
        print("=" * 70)

        alerts = []
        for i, ev in enumerate(sample_events):
            t0 = time.time()
            res = self.score_event(ev, target_entity=ev.get("target_node", f"AICTE-SRV-{i%5 + 1:02d}"))
            latency_ms = (time.time() - t0) * 1000

            status_icon = "🔴 [ALERT]" if res["is_anomaly"] else "🟢 [NORMAL]"
            print(f"{status_icon} Entity: {res['target_entity']:<15} | Score: {res['risk_score']:>6.4f} | Severity: {res['severity']:<8} | Latency: {latency_ms:.2f}ms")
            
            if res["is_anomaly"]:
                print(f"    ↳ MITRE: {res['mitre_tactic']}")
                print(f"    ↳ Plain Summary: {res['plain_language_card'].get('what_happened', '')[:70]}...")
                alerts.append(res)

        if output_json:
            out_file = os.path.join(REPORTS_DIR, "live_stream_alerts.json")
            with open(out_file, "w") as f:
                json.dump(alerts, f, indent=2)
            print(f"\n[+] Flagged {len(alerts)} anomalies out of {len(sample_events)} events. Exported to {out_file}")

        return alerts

if __name__ == "__main__":
    watcher = LiveThreatWatcher()
    test_stream = [
        {"protocol_type": "tcp", "service": "http", "flag": "SF", "src_bytes": 215, "dst_bytes": 1024, "count": 2, "srv_count": 2, "target_node": "Web-Server-01"},
        {"protocol_type": "tcp", "service": "private", "flag": "S0", "src_bytes": 0, "dst_bytes": 0, "count": 180, "srv_count": 1, "diff_srv_rate": 0.85, "target_node": "Firewall-Node-01"},
        {"protocol_type": "tcp", "service": "telnet", "flag": "SF", "src_bytes": 120, "dst_bytes": 240, "num_failed_logins": 7, "count": 12, "target_node": "Auth-Gateway-01"},
        {"protocol_type": "tcp", "service": "ftp", "flag": "SF", "src_bytes": 350, "dst_bytes": 4500, "root_shell": 1, "su_attempted": 1, "num_file_creations": 4, "target_node": "Core-DB-01"}
    ]
    watcher.run_stream_simulation(test_stream)
