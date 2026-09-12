import numpy as np
from sklearn.mixture import GaussianMixture
import joblib
from typing import Dict, Any, Optional

class GMMAnomalyDetector:
    """
    Gaussian Mixture Model (GMM) Anomaly Detector for Multi-Modal DCIM Telemetry.
    Models normal data center operations as K=3 Gaussian clusters (Idle, Daytime, Backup).
    Uses Diagonal Covariance and Tikhonov Regularization (reg_covar=1e-6) to prevent matrix singularities.
    """
    def __init__(self, n_components: int = 3, covariance_type: str = "diag", reg_covar: float = 1e-6, random_state: int = 42):
        self.n_components = n_components
        self.covariance_type = covariance_type
        self.reg_covar = reg_covar
        self.random_state = random_state
        self.model = GaussianMixture(
            n_components=self.n_components,
            covariance_type=self.covariance_type,
            reg_covar=self.reg_covar,
            random_state=self.random_state
        )
        self.threshold = -25.0
        self.is_fitted = False

    def fit(self, X_train: np.ndarray, contamination: float = 0.035):
        """Fit GMM on baseline normal telemetry and calibrate dynamic threshold."""
        self.model.fit(X_train)
        self.is_fitted = True
        
        # Calibrate threshold at percentile of training log-likelihoods
        log_probs = self.model.score_samples(X_train)
        self.threshold = float(np.percentile(log_probs, 100 * contamination))
        print(f"[+] GMM fitted ({self.n_components} clusters). Anomaly Log-Likelihood threshold: {self.threshold:.3f}")

    def score_event(self, x_vector: np.ndarray) -> Dict[str, Any]:
        """Score a single telemetry feature vector."""
        if not self.is_fitted:
            return {"is_anomaly": False, "log_prob": 0.0, "anomaly_score": 0.0, "cluster": 0}

        x_2d = x_vector.reshape(1, -1)
        log_prob = float(self.model.score_samples(x_2d)[0])
        cluster_probs = self.model.predict_proba(x_2d)[0]
        dominant_cluster = int(np.argmax(cluster_probs))
        
        is_anomaly = log_prob < self.threshold
        
        # Normalize anomaly score to [0, 1] range
        # Lower log_prob -> higher anomaly score
        if log_prob >= self.threshold:
            anomaly_score = max(0.0, (self.threshold - log_prob) / (abs(self.threshold) + 1e-5) + 0.5)
            anomaly_score = min(0.49, anomaly_score)
        else:
            anomaly_score = min(1.0, 0.5 + abs(log_prob - self.threshold) / (abs(self.threshold) * 2 + 1e-5))

        return {
            "is_anomaly": bool(is_anomaly),
            "log_prob": log_prob,
            "threshold": self.threshold,
            "dominant_cluster": dominant_cluster,
            "cluster_confidence": float(np.max(cluster_probs)),
            "anomaly_score": float(anomaly_score)
        }

    def save(self, filepath: str):
        joblib.dump({"model": self.model, "threshold": self.threshold, "is_fitted": self.is_fitted}, filepath)

    @classmethod
    def load(cls, filepath: str) -> 'GMMAnomalyDetector':
        detector = cls()
        data = joblib.load(filepath)
        detector.model = data["model"]
        detector.threshold = data["threshold"]
        detector.is_fitted = data.get("is_fitted", True)
        return detector
