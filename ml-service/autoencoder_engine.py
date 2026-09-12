import numpy as np
from sklearn.preprocessing import RobustScaler
from sklearn.neural_network import MLPRegressor
import joblib
from typing import Dict, Any, List, Optional

class LightweightDeepAutoencoder:
    """
    Robust Deep Neural Autoencoder for Network & Telemetry Anomaly Detection.
    Uses RobustScaler + Multi-Layer Perceptron (MLP) bottleneck architecture (41 -> 16 -> 4 -> 16 -> 41).
    Computes Reconstruction Mean Squared Error (MSE) and per-feature error decomposition for XAI.
    """
    def __init__(self, input_dim: int = 41, latent_dim: int = 4, random_state: int = 42):
        self.input_dim = input_dim
        self.latent_dim = latent_dim
        self.random_state = random_state
        self.scaler = RobustScaler()
        self.mlp = MLPRegressor(
            hidden_layer_sizes=(16, self.latent_dim, 16),
            activation='relu',
            solver='adam',
            max_iter=30,
            batch_size=256,
            learning_rate_init=0.01,
            early_stopping=True,
            random_state=self.random_state
        )
        self.threshold = 0.05
        self.is_fitted = False

    def fit(self, X_train: np.ndarray, epochs: int = 30, batch_size: int = 256, contamination: float = 0.035):
        """Scale inputs and train autoencoder to reconstruct normal telemetry."""
        self.input_dim = X_train.shape[1]
        X_scaled = self.scaler.fit_transform(X_train)
        
        # Train MLP to reconstruct X_scaled from X_scaled
        self.mlp.fit(X_scaled, X_scaled)
        self.is_fitted = True
        
        # Calibrate reconstruction MSE threshold
        X_hat = self.mlp.predict(X_scaled)
        mse_errors = np.mean((X_scaled - X_hat) ** 2, axis=1)
        self.threshold = float(np.percentile(mse_errors, 100 * (1 - contamination)))
        print(f"[+] Deep Autoencoder fitted ({self.input_dim}->16->{self.latent_dim}->16->{self.input_dim}). Reconstruction MSE threshold: {self.threshold:.4f}")

    def _forward(self, X: np.ndarray) -> np.ndarray:
        """Internal forward pass returning reconstructed scaled vectors."""
        X_scaled = self.scaler.transform(X)
        X_hat_scaled = self.mlp.predict(X_scaled)
        return self.scaler.inverse_transform(X_hat_scaled)

    def score_event(self, x_vector: np.ndarray, feature_names: Optional[List[str]] = None) -> Dict[str, Any]:
        """Score single telemetry vector, computing total MSE and per-feature error breakdown."""
        x_2d = x_vector.reshape(1, -1)
        x_scaled = self.scaler.transform(x_2d)
        x_hat_scaled = self.mlp.predict(x_scaled)
        
        squared_errors = ((x_scaled - x_hat_scaled) ** 2)[0]
        mse = float(np.mean(squared_errors))
        is_anomaly = mse > self.threshold
        
        # Per-feature attribution
        total_error = float(np.sum(squared_errors)) + 1e-8
        feature_contributions = {}
        if feature_names and len(feature_names) == len(x_vector):
            for i, name in enumerate(feature_names):
                pct = float((squared_errors[i] / total_error) * 100.0)
                feature_contributions[name] = round(pct, 2)
            
            sorted_contributors = sorted(feature_contributions.items(), key=lambda item: item[1], reverse=True)
            top_feature, top_pct = sorted_contributors[0]
        else:
            top_feature, top_pct = "multi_metric_deviation", 50.0

        anomaly_score = min(1.0, mse / (self.threshold * 2.0 + 1e-6))

        return {
            "is_anomaly": bool(is_anomaly),
            "reconstruction_mse": mse,
            "threshold": self.threshold,
            "anomaly_score": float(anomaly_score),
            "top_feature": top_feature,
            "top_feature_pct": top_pct,
            "feature_contributions": feature_contributions
        }

    def save(self, filepath: str):
        state = {
            "scaler": self.scaler,
            "mlp": self.mlp,
            "threshold": self.threshold,
            "is_fitted": self.is_fitted,
            "input_dim": self.input_dim,
            "latent_dim": self.latent_dim
        }
        joblib.dump(state, filepath)

    @classmethod
    def load(cls, filepath: str) -> 'LightweightDeepAutoencoder':
        state = joblib.load(filepath)
        ae = cls(input_dim=state["input_dim"], latent_dim=state["latent_dim"])
        ae.scaler = state["scaler"]
        ae.mlp = state["mlp"]
        ae.threshold = state["threshold"]
        ae.is_fitted = state.get("is_fitted", True)
        return ae
