import os
import json
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.metrics import classification_report, roc_auc_score, confusion_matrix
import joblib

from config import MODEL_PATH, STATS_PATH, ISOLATION_FOREST_CONFIG, REPORTS_DIR
from real_dataset_pipeline import (
    load_and_preprocess_real_data,
    FEATURE_COLS,
    NUMERICAL_COLS
)

def train_and_evaluate():
    print("=" * 60)
    print("🛡️ TRAINING ISOLATION FOREST ON REAL CYBERSECURITY DATASET")
    print("=" * 60)

    # 1. Load preprocessed real data
    df_all, df_normal, df_attacks, encoders = load_and_preprocess_real_data()

    # 2. Extract Training Features (Unsupervised on Normal Baseline)
    X_train = df_normal[FEATURE_COLS].values
    print(f"[*] Training on {X_train.shape[0]} clean baseline connections across {X_train.shape[1]} features...")

    # 3. Train Isolation Forest
    model = IsolationForest(**ISOLATION_FOREST_CONFIG)
    model.fit(X_train)
    print("[+] Model training completed successfully!")

    # 4. Compute and save Baseline Feature Distributions for Explainability (XAI)
    baseline_stats = {}
    for col in NUMERICAL_COLS:
        mean_val = float(df_normal[col].mean())
        std_val = float(df_normal[col].std())
        # Prevent division by zero
        if std_val == 0:
            std_val = 1e-6
        baseline_stats[col] = {
            "mean": mean_val,
            "std": std_val,
            "min": float(df_normal[col].min()),
            "max": float(df_normal[col].max()),
            "p95": float(df_normal[col].quantile(0.95))
        }

    with open(STATS_PATH, "w") as f:
        json.dump(baseline_stats, f, indent=2)
    print(f"[+] Saved baseline feature statistics for XAI to {STATS_PATH}")

    # 5. Save Model Artifact
    joblib.dump(model, MODEL_PATH)
    print(f"[+] Saved trained model artifact to {MODEL_PATH}")

    # 6. Evaluation against Ground-Truth Real Attacks
    print("\n" + "=" * 60)
    print("📊 BENCHMARK EVALUATION AGAINST REAL ATTACKS")
    print("=" * 60)

    # Create balanced evaluation test set
    test_normal = df_normal.sample(n=min(5000, len(df_normal)), random_state=42)
    test_attacks = df_attacks.copy()

    test_df = pd.concat([test_normal, test_attacks]).sample(frac=1.0, random_state=42)
    X_test = test_df[FEATURE_COLS].values
    
    # Ground truth: 1 for anomaly (attack), 0 for normal
    y_true = (~test_df["labels"].str.lower().str.contains("normal")).astype(int).values

    # Predict with Isolation Forest
    # IsolationForest outputs: -1 for anomaly, 1 for normal
    raw_preds = model.predict(X_test)
    y_pred = (raw_preds == -1).astype(int)

    # Anomaly scores: lower = more anomalous (flip sign for ROC-AUC)
    scores = -model.decision_function(X_test)
    roc_auc = roc_auc_score(y_true, scores)

    print(f"Test Set Size: {len(test_df)} (Normal: {len(test_normal)}, Real Attacks: {len(test_attacks)})")
    print(f"ROC-AUC Score: {roc_auc:.4f}\n")

    report_str = classification_report(y_true, y_pred, target_names=["Normal Traffic", "Cyber Attack"])
    print(report_str)

    cm = confusion_matrix(y_true, y_pred)
    print("Confusion Matrix:")
    print(f"  True Negatives (Normal detected as Normal): {cm[0][0]}")
    print(f"  False Positives (Normal flagged as Attack): {cm[0][1]}")
    print(f"  False Negatives (Attack missed):            {cm[1][0]}")
    print(f"  True Positives (Attack correctly detected): {cm[1][1]}")

    # Attack-by-attack detection rate
    print("\n" + "-" * 60)
    print("🎯 DETECTION RATE BY REAL ATTACK CATEGORY:")
    print("-" * 60)
    attack_breakdown = []
    for attack_name, group in df_attacks.groupby("labels"):
        X_grp = group[FEATURE_COLS].values
        preds_grp = (model.predict(X_grp) == -1).astype(int)
        det_rate = (preds_grp.sum() / len(preds_grp)) * 100
        print(f"  • {attack_name:<18} : {preds_grp.sum():>4}/{len(preds_grp):<4} detected ({det_rate:6.2f}%)")
        attack_breakdown.append({
            "attack_type": attack_name,
            "total_incidents": len(preds_grp),
            "detected": int(preds_grp.sum()),
            "detection_rate_pct": round(det_rate, 2)
        })

    # Save benchmark summary report
    benchmark_report = {
        "dataset": "KDD Real Cybersecurity Dataset (100,655 connections)",
        "model": "Isolation Forest (Unsupervised)",
        "training_samples": len(df_normal),
        "test_samples": len(test_df),
        "roc_auc_score": round(roc_auc, 4),
        "attack_breakdown": attack_breakdown
    }

    report_file = os.path.join(REPORTS_DIR, "real_benchmark_summary.json")
    with open(report_file, "w") as f:
        json.dump(benchmark_report, f, indent=2)
    print(f"\n[+] Full evaluation metrics exported to {report_file}")

if __name__ == "__main__":
    train_and_evaluate()
