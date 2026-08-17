import json
import os
import numpy as np
from config import STATS_PATH, SEVERITY_THRESHOLDS

FEATURE_DESCRIPTIONS = {
    "num_failed_logins": "Authentication Failure Spike (Possible Brute-Force / Credential Stuffing)",
    "src_bytes": "Abnormal Outbound Data Payload Volume",
    "dst_bytes": "Unusually High Inbound Data Ingestion",
    "count": "High-Velocity Connection Spike to Single Host",
    "srv_count": "Connection Surge to Specific Network Service / Port",
    "diff_srv_rate": "Port Scanning / Service Reconnaissance Sweep",
    "same_srv_rate": "Monolithic Protocol Flood (Possible DoS Attempt)",
    "serror_rate": "High Rate of SYN / Connection Request Errors",
    "rerror_rate": "High Rate of Connection Rejection Errors",
    "root_shell": "Root Shell Execution / Elevation of Privilege",
    "su_attempted": "Superuser (su) Escalation Attempt",
    "num_compromised": "Compromised System State Flags Triggered",
    "num_file_creations": "Rapid File Creation Activity",
    "num_access_files": "Access to Sensitive System / Auth Configuration Files",
    "duration": "Unusually Long Persistent Session Duration",
    "hot": "High Number of 'Hot' Indicators (Executable Transfer/Sensitive Directory Access)"
}

class AnomalyExplainer:
    def __init__(self, stats_path=STATS_PATH):
        if not os.path.exists(stats_path):
            raise FileNotFoundError(f"Baseline statistics not found at {stats_path}. Please train the model first.")
        
        with open(stats_path, "r") as f:
            self.stats = json.load(f)

    def explain(self, event_dict, anomaly_score):
        """
        Calculates feature z-scores against clean baseline distributions and returns
        top contributing root causes, human-readable explanations, and severity level.
        """
        deviations = []

        for col, stat in self.stats.items():
            if col in event_dict:
                try:
                    val = float(event_dict[col])
                    mean = stat["mean"]
                    std = stat["std"]
                    z_score = (val - mean) / std

                    # We are interested in significant positive deviations from normal
                    if z_score > 1.5 or (col in ["root_shell", "su_attempted"] and val > 0) or (col == "num_failed_logins" and val > 0):
                        desc = FEATURE_DESCRIPTIONS.get(col, f"Abnormal metric deviation in '{col}'")
                        deviations.append({
                            "feature": col,
                            "value": val,
                            "baseline_mean": round(mean, 2),
                            "z_score": round(z_score, 2),
                            "description": desc
                        })
                except (ValueError, TypeError):
                    continue

        # Sort by highest z-score deviation
        deviations.sort(key=lambda x: x["z_score"], reverse=True)
        top_deviations = deviations[:3]

        # Determine severity based on score & critical flags
        severity = "LOW"
        is_anomaly = bool(anomaly_score < 0.0)

        # Critical security domain overrides
        critical_deviations = [
            d for d in top_deviations 
            if d["feature"] in ["num_failed_logins", "root_shell", "su_attempted", "num_compromised", "diff_srv_rate"] 
            and (d["z_score"] > 2.0 or d["value"] > 0)
        ]
        
        if critical_deviations:
            is_anomaly = True
            if any(d["feature"] in ["root_shell", "su_attempted"] and d["value"] > 0 for d in critical_deviations):
                severity = "CRITICAL"
            elif any(d["feature"] == "num_failed_logins" and d["value"] >= 3 for d in critical_deviations):
                severity = "HIGH"
            elif severity == "LOW":
                severity = "MEDIUM"

        if anomaly_score <= SEVERITY_THRESHOLDS["CRITICAL"]:
            severity = "CRITICAL"
        elif anomaly_score <= SEVERITY_THRESHOLDS["HIGH"] and severity != "CRITICAL":
            severity = "HIGH"
        elif anomaly_score <= SEVERITY_THRESHOLDS["MEDIUM"] and severity not in ["CRITICAL", "HIGH"]:
            severity = "MEDIUM"

        # Generate top concise reason
        if top_deviations:
            top_reason = f"{top_deviations[0]['description']} (val: {top_deviations[0]['value']}, Z: +{top_deviations[0]['z_score']}σ)"
            if len(top_deviations) > 1:
                top_reason += f" and {top_deviations[1]['description'].lower()} (val: {top_deviations[1]['value']})"
        else:
            top_reason = "Multi-feature aggregate statistical distance deviation from baseline profile"

        return {
            "is_anomaly": is_anomaly,
            "severity": severity,
            "anomaly_score": round(float(anomaly_score), 4),
            "top_reason": top_reason,
            "top_contributing_features": top_deviations
        }
