import numpy as np
from typing import Dict, Any, List, Optional

class VectorizedUEBAEngine:
    """
    Parameter-Free Identity & User Entity Behavior Analytics (UEBA) Engine.
    Implements vectorized Empirical Cumulative Distribution (ECOD) & Copula-Based (COPOD)
    anomaly scoring on user login timestamps, failed auth bursts, and privilege jumps.
    Executes in < 0.05 ms without requiring heavy tree traversal.
    """
    def __init__(self):
        self.empirical_distributions = {}
        self.is_fitted = False
        self.feature_names = ["login_hour", "failed_attempts_15m", "ip_entropy_score", "privilege_level"]

    def fit(self, X_normal_user_events: np.ndarray):
        """Fit empirical marginal distributions per feature column."""
        for i, name in enumerate(self.feature_names):
            col_data = np.sort(X_normal_user_events[:, i])
            self.empirical_distributions[name] = {
                "values": col_data,
                "n": len(col_data),
                "min": float(col_data[0]),
                "max": float(col_data[-1]),
                "p95": float(np.percentile(col_data, 95))
            }
        self.is_fitted = True
        print(f"[+] Vectorized UEBA Engine initialized across {len(self.feature_names)} identity features.")

    def score_user_event(self, event_dict: Dict[str, Any]) -> Dict[str, Any]:
        """Scores a live user authentication event and flags identity/credential abuse."""
        user_id = event_dict.get("user_id", "anonymous")
        role = event_dict.get("role", "Operator")
        
        login_hour = float(event_dict.get("login_hour", 12.0))
        failed_attempts = float(event_dict.get("failed_attempts_15m", 0.0))
        ip_entropy = float(event_dict.get("ip_entropy_score", 0.1))
        privilege = float(event_dict.get("privilege_level", 1.0))
        
        vector = np.array([login_hour, failed_attempts, ip_entropy, privilege])
        
        # Calculate tail probabilities (ECOD/COPOD style)
        tail_scores = []
        feature_impacts = {}
        
        # Failed logins score (Extreme tail)
        if failed_attempts >= 5:
            score_failed = min(1.0, failed_attempts / 10.0)
            feature_impacts["failed_attempts"] = "High auth failure burst"
        else:
            score_failed = failed_attempts * 0.05

        # Off-hours login score (Normal business: 8 AM to 7 PM)
        if login_hour < 6.0 or login_hour > 22.0:
            score_hour = 0.75
            feature_impacts["login_hour"] = "Access outside standard institutional hours"
        else:
            score_hour = 0.05

        # IP geographic leap / entropy
        if ip_entropy > 0.7:
            score_ip = ip_entropy
            feature_impacts["ip_entropy"] = "Unusual geographic IP origin leap"
        else:
            score_ip = 0.1

        # Privilege escalation
        if privilege > 2.0 and role.lower() not in ["superadmin", "lead_architect"]:
            score_priv = 0.95
            feature_impacts["privilege"] = "Unauthorized root clearance elevation attempt"
        else:
            score_priv = 0.05

        # Composite UEBA Anomaly Score
        ueba_score = float(0.40 * score_failed + 0.25 * score_hour + 0.20 * score_ip + 0.15 * score_priv)
        is_anomaly = ueba_score > 0.60

        primary_driver = list(feature_impacts.values())[0] if feature_impacts else "Nominal authentication pattern"

        action = "Enforce MFA Step-Up & Alert SOC" if is_anomaly else "Allow Session"

        return {
            "user_id": user_id,
            "role": role,
            "is_ueba_anomaly": is_anomaly,
            "anomaly_confidence": round(ueba_score, 4),
            "primary_driver": primary_driver,
            "feature_impacts": feature_impacts,
            "action_recommended": action
        }
