import os
import json
import uuid
import time
import pandas as pd
import numpy as np
import joblib

from config import MODEL_PATH, ENCODER_PATH, STATS_PATH, REPORTS_DIR
from real_dataset_pipeline import FEATURE_COLS, CATEGORICAL_COLS, NUMERICAL_COLS
from explainability import AnomalyExplainer
from threat_agent import ThreatInvestigationAgent

class LiveThreatWatcher:
    def __init__(self):
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Trained model not found at {MODEL_PATH}. Please run train_isolation_forest.py first.")
        
        print("[*] Loading Isolation Forest model and categorical encoders...")
        self.model = joblib.load(MODEL_PATH)
        self.encoders = joblib.load(ENCODER_PATH)
        self.explainer = AnomalyExplainer(STATS_PATH)
        print("[+] LiveThreatWatcher initialized and ready for streaming telemetry.")

    def score_event(self, event_dict, target_entity="DCIM-Node-01"):
        """
        Scores a single incoming network connection or access log event in real time (< 1ms).
        Returns classification, score, explainability reasons, and full AI Threat Report.
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
        X = np.array([[row[col] for col in FEATURE_COLS]])

        # Decision score from Isolation Forest
        score = float(self.model.decision_function(X)[0])
        
        # Explainability & Severity
        explanation = self.explainer.explain(event_dict, score)
        
        # Autonomous AI Threat Report
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
            "is_anomaly": explanation["is_anomaly"],
            "severity": explanation["severity"],
            "anomaly_score": explanation["anomaly_score"],
            "top_reason": explanation["top_reason"],
            "top_features": explanation["top_contributing_features"],
            "threat_report": threat_report
        }

    def run_stream_simulation(self, sample_events, output_json=True):
        """
        Processes a stream of sample events, printing real-time detection telemetry.
        """
        print("\n" + "=" * 70)
        print("⚡ STREAMING REAL-TIME CYBER TELEMETRY INGESTION & ANOMALY DETECTION")
        print("=" * 70)

        alerts = []
        for i, ev in enumerate(sample_events):
            t0 = time.time()
            res = self.score_event(ev, target_entity=ev.get("target_node", f"Node-AICTE-{i%5 + 1:02d}"))
            latency_ms = (time.time() - t0) * 1000

            status_icon = "🔴 [ALERT]" if res["is_anomaly"] else "🟢 [NORMAL]"
            print(f"{status_icon} Entity: {res['target_entity']:<15} | Score: {res['anomaly_score']:>7.4f} | Severity: {res['severity']:<8} | Latency: {latency_ms:.2f}ms")
            
            if res["is_anomaly"]:
                print(f"    ↳ Reason: {res['top_reason']}")
                alerts.append(res)

        if output_json:
            out_file = os.path.join(REPORTS_DIR, "live_stream_alerts.json")
            with open(out_file, "w") as f:
                json.dump(alerts, f, indent=2)
            print(f"\n[+] Flagged {len(alerts)} anomalies out of {len(sample_events)} events. Exported to {out_file}")

        return alerts

if __name__ == "__main__":
    watcher = LiveThreatWatcher()
    
    # Test on real attack signatures
    print("\n[*] Testing live watcher on sample events...")
    test_stream = [
        # Normal web traffic
        {"protocol_type": "tcp", "service": "http", "flag": "SF", "src_bytes": 215, "dst_bytes": 1024, "count": 2, "srv_count": 2, "target_node": "Web-Server-01"},
        # Port Scanning attack
        {"protocol_type": "tcp", "service": "private", "flag": "S0", "src_bytes": 0, "dst_bytes": 0, "count": 150, "srv_count": 1, "diff_srv_rate": 0.85, "target_node": "Firewall-Node-01"},
        # Brute Force Authentication attack
        {"protocol_type": "tcp", "service": "telnet", "flag": "SF", "src_bytes": 120, "dst_bytes": 240, "num_failed_logins": 7, "count": 12, "target_node": "Auth-Gateway-01"},
        # Privilege Escalation attempt
        {"protocol_type": "tcp", "service": "ftp", "flag": "SF", "src_bytes": 350, "dst_bytes": 4500, "root_shell": 1, "su_attempted": 1, "num_file_creations": 4, "target_node": "Core-DB-01"}
    ]
    
    watcher.run_stream_simulation(test_stream)
