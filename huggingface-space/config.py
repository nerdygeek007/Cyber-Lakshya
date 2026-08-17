import os

# Base paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")
DATA_DIR = os.path.join(BASE_DIR, "data")
REPORTS_DIR = os.path.join(BASE_DIR, "reports")

os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(REPORTS_DIR, exist_ok=True)

MODEL_PATH = os.path.join(MODELS_DIR, "isolation_forest.joblib")
STATS_PATH = os.path.join(MODELS_DIR, "baseline_stats.json")
ENCODER_PATH = os.path.join(MODELS_DIR, "categorical_encoders.joblib")

# Model hyperparameters
ISOLATION_FOREST_CONFIG = {
    "n_estimators": 150,
    "contamination": 0.035,  # Estimated anomaly contamination in production
    "max_samples": "auto",
    "random_state": 42,
    "n_jobs": -1
}

# Severity Thresholds (based on Isolation Forest decision function score)
# decision_function: positive = normal, negative = anomaly
SEVERITY_THRESHOLDS = {
    "CRITICAL": -0.18,
    "HIGH": -0.10,
    "MEDIUM": -0.02,
    "LOW": 0.0
}
