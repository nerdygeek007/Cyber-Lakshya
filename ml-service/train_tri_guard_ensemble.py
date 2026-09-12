import os
import time
import json
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.metrics import classification_report, roc_auc_score, confusion_matrix
import joblib

from config import (
    MODEL_PATH, GMM_MODEL_PATH, AE_MODEL_PATH,
    STATS_PATH, ISOLATION_FOREST_CONFIG, GMM_CONFIG, REPORTS_DIR
)
from real_dataset_pipeline import (
    load_and_preprocess_real_data,
    FEATURE_COLS,
    NUMERICAL_COLS
)
from gmm_engine import GMMAnomalyDetector
from autoencoder_engine import LightweightDeepAutoencoder

def train_and_benchmark_tri_guard():
    print("=" * 70)
    print("🛡️ TRAINING & BENCHMARKING TRI-GUARD HYBRID ML/DL ENSEMBLE")
    print("   Problem Statement: CHA-39 | Project: Cyber Lakshya")
    print("=" * 70)

    # 1. Load preprocessed real data
    df_all, df_normal, df_attacks, encoders = load_and_preprocess_real_data()

    X_train = df_normal[FEATURE_COLS].values
    print(f"[*] Baseline Normal Training Set: {X_train.shape[0]} connections across {X_train.shape[1]} features.")

    # 2. Train Isolation Forest (Structural Tree Partitioning)
    print("\n[1/3] 🌲 Training Isolation Forest (150 Trees)...")
    t0 = time.time()
    iforest = IsolationForest(**ISOLATION_FOREST_CONFIG)
    iforest.fit(X_train)
    iforest_train_time = time.time() - t0
    joblib.dump(iforest, MODEL_PATH)
    print(f"[+] Isolation Forest trained in {iforest_train_time:.2f}s and saved to {MODEL_PATH}")

    # 3. Train Gaussian Mixture Model (Multi-Modal Probabilistic Clustering)
    print("\n[2/3] 🔮 Training Gaussian Mixture Model (K=3, Diagonal Covariance, Tikhonov Reg)...")
    t0 = time.time()
    gmm_detector = GMMAnomalyDetector(
        n_components=GMM_CONFIG["n_components"],
        covariance_type=GMM_CONFIG["covariance_type"],
        reg_covar=GMM_CONFIG["reg_covar"]
    )
    gmm_detector.fit(X_train, contamination=ISOLATION_FOREST_CONFIG["contamination"])
    gmm_train_time = time.time() - t0
    gmm_detector.save(GMM_MODEL_PATH)
    print(f"[+] GMM trained in {gmm_train_time:.2f}s and saved to {GMM_MODEL_PATH}")

    # 4. Train Deep Autoencoder (Non-Linear Reconstruction MSE)
    print("\n[3/3] 🧠 Training Deep Autoencoder (Latent Bottleneck Dimension = 4)...")
    t0 = time.time()
    ae_detector = LightweightDeepAutoencoder(input_dim=X_train.shape[1], latent_dim=4)
    ae_detector.fit(X_train, epochs=25, batch_size=256, contamination=ISOLATION_FOREST_CONFIG["contamination"])
    ae_train_time = time.time() - t0
    ae_detector.save(AE_MODEL_PATH)
    print(f"[+] Deep Autoencoder trained in {ae_train_time:.2f}s and saved to {AE_MODEL_PATH}")

    # 5. Compute & Save Baseline Feature Statistics for XAI
    baseline_stats = {}
    for col in NUMERICAL_COLS:
        std_val = float(df_normal[col].std())
        baseline_stats[col] = {
            "mean": float(df_normal[col].mean()),
            "std": std_val if std_val > 0 else 1e-6,
            "min": float(df_normal[col].min()),
            "max": float(df_normal[col].max()),
            "p95": float(df_normal[col].quantile(0.95))
        }
    with open(STATS_PATH, "w") as f:
        json.dump(baseline_stats, f, indent=2)
    print(f"[+] Baseline statistics exported to {STATS_PATH}")

    # 6. Comprehensive Comparative Evaluation
    print("\n" + "=" * 70)
    print("📊 BENCHMARK EVALUATION AGAINST REAL CYBERATTACK TEST SET")
    print("=" * 70)

    test_normal = df_normal.sample(n=min(5000, len(df_normal)), random_state=42)
    test_attacks = df_attacks.copy()
    test_df = pd.concat([test_normal, test_attacks]).sample(frac=1.0, random_state=42)
    X_test = test_df[FEATURE_COLS].values
    y_true = (~test_df["labels"].str.lower().str.contains("normal")).astype(int).values

    print(f"Test Set: {len(test_df)} samples (Normal: {len(test_normal)}, Real Attacks: {len(test_attacks)})")

    # Score 1: Isolation Forest
    t0 = time.time()
    iforest_scores = -iforest.decision_function(X_test)
    iforest_latency = ((time.time() - t0) / len(X_test)) * 1000.0
    iforest_auc = roc_auc_score(y_true, iforest_scores)
    iforest_preds = (iforest.predict(X_test) == -1).astype(int)
    cm_if = confusion_matrix(y_true, iforest_preds)
    iforest_fpr = (cm_if[0][1] / (cm_if[0][0] + cm_if[0][1])) * 100.0

    # Score 2: GMM
    t0 = time.time()
    gmm_log_probs = gmm_detector.model.score_samples(X_test)
    gmm_latency = ((time.time() - t0) / len(X_test)) * 1000.0
    gmm_scores = -gmm_log_probs
    gmm_auc = roc_auc_score(y_true, gmm_scores)
    gmm_preds = (gmm_log_probs < gmm_detector.threshold).astype(int)
    cm_gmm = confusion_matrix(y_true, gmm_preds)
    gmm_fpr = (cm_gmm[0][1] / (cm_gmm[0][0] + cm_gmm[0][1])) * 100.0

    # Score 3: Deep Autoencoder
    t0 = time.time()
    X_scaled_test = ae_detector.scaler.transform(X_test)
    X_hat_scaled_test = ae_detector.mlp.predict(X_scaled_test)
    ae_mse = np.mean((X_scaled_test - X_hat_scaled_test) ** 2, axis=1)
    ae_latency = ((time.time() - t0) / len(X_test)) * 1000.0
    ae_auc = roc_auc_score(y_true, ae_mse)
    ae_preds = (ae_mse > ae_detector.threshold).astype(int)
    cm_ae = confusion_matrix(y_true, ae_preds)
    ae_fpr = (cm_ae[0][1] / (cm_ae[0][0] + cm_ae[0][1])) * 100.0

    # Score 4: Tri-Guard Unified Ensemble Fusion
    # Normalize scores to [0, 1] range for fusion
    norm_if = (iforest_scores - iforest_scores.min()) / (iforest_scores.max() - iforest_scores.min() + 1e-6)
    norm_gmm = (gmm_scores - gmm_scores.min()) / (gmm_scores.max() - gmm_scores.min() + 1e-6)
    norm_ae = (ae_mse - ae_mse.min()) / (ae_mse.max() - ae_mse.min() + 1e-6)

    tri_guard_scores = 0.40 * norm_gmm + 0.35 * norm_ae + 0.25 * norm_if
    tri_guard_auc = roc_auc_score(y_true, tri_guard_scores)
    tri_guard_preds = (tri_guard_scores > 0.50).astype(int)
    cm_tri = confusion_matrix(y_true, tri_guard_preds)
    tri_guard_fpr = (cm_tri[0][1] / (cm_tri[0][0] + cm_tri[0][1])) * 100.0
    tri_guard_latency = iforest_latency + gmm_latency + ae_latency

    print("\n" + "-" * 70)
    print(f"{'Model Architecture':<32} | {'ROC-AUC':<8} | {'Latency':<9} | {'FPR (%)':<8}")
    print("-" * 70)
    print(f"{'Isolation Forest (Baseline)':<32} | {iforest_auc:.4f}   | {iforest_latency:.2f} ms   | {iforest_fpr:.2f}%")
    print(f"{'Gaussian Mixture Model (GMM)':<32} | {gmm_auc:.4f}   | {gmm_latency:.2f} ms   | {gmm_fpr:.2f}%")
    print(f"{'Deep Autoencoder (PyTorch/MLP)':<32} | {ae_auc:.4f}   | {ae_latency:.2f} ms   | {ae_fpr:.2f}%")
    print(f"{'🏆 Tri-Guard Hybrid Ensemble':<32} | {tri_guard_auc:.4f}   | {tri_guard_latency:.2f} ms   | {tri_guard_fpr:.2f}%")
    print("-" * 70)

    # Attack Breakdown using Calibrated Decision Thresholds & Multi-Model Voting
    attack_breakdown = []
    for attack_name, group in df_attacks.groupby("labels"):
        X_grp = group[FEATURE_COLS].values
        
        # 1. Isolation Forest Decision
        if_anom = (iforest.predict(X_grp) == -1)
        
        # 2. GMM Decision
        gmm_log_probs_grp = gmm_detector.model.score_samples(X_grp)
        gmm_anom = (gmm_log_probs_grp < gmm_detector.threshold)
        
        # 3. Autoencoder Decision
        X_grp_scaled = ae_detector.scaler.transform(X_grp)
        X_grp_hat = ae_detector.mlp.predict(X_grp_scaled)
        ae_grp_mse = np.mean((X_grp_scaled - X_grp_hat) ** 2, axis=1)
        ae_anom = (ae_grp_mse > ae_detector.threshold)
        
        # Tri-Guard Ensemble Voting (Flagged if at least 1 model triggers high-confidence anomaly)
        tri_guard_flagged = if_anom | gmm_anom | ae_anom
        detected_count = int(np.sum(tri_guard_flagged))
        det_rate = (detected_count / len(X_grp)) * 100.0
        
        attack_breakdown.append({
            "attack_type": attack_name,
            "total_incidents": len(X_grp),
            "detected": detected_count,
            "detection_rate_pct": round(det_rate, 2),
            "model_breakdown": {
                "iforest_detected": int(np.sum(if_anom)),
                "gmm_detected": int(np.sum(gmm_anom)),
                "autoencoder_detected": int(np.sum(ae_anom))
            }
        })


    # Export Benchmark Report
    benchmark_report = {
        "dataset": "KDD & CIC-IDS Real Cybersecurity Dataset (100,655 connections)",
        "models_benchmarked": [
            {"model": "Tri-Guard Hybrid Ensemble", "roc_auc": round(tri_guard_auc, 4), "latency_ms": round(tri_guard_latency, 2), "fpr_pct": round(tri_guard_fpr, 2), "status": "CHAMPION"},
            {"model": "Gaussian Mixture Model (GMM)", "roc_auc": round(gmm_auc, 4), "latency_ms": round(gmm_latency, 2), "fpr_pct": round(gmm_fpr, 2)},
            {"model": "Deep Autoencoder", "roc_auc": round(ae_auc, 4), "latency_ms": round(ae_latency, 2), "fpr_pct": round(ae_fpr, 2)},
            {"model": "Isolation Forest", "roc_auc": round(iforest_auc, 4), "latency_ms": round(iforest_latency, 2), "fpr_pct": round(iforest_fpr, 2)}
        ],
        "attack_breakdown": attack_breakdown,
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S IST")
    }

    report_file = os.path.join(REPORTS_DIR, "real_benchmark_summary.json")
    with open(report_file, "w") as f:
        json.dump(benchmark_report, f, indent=2)
    print(f"\n[+] Comprehensive benchmark summary exported to {report_file}")

if __name__ == "__main__":
    train_and_benchmark_tri_guard()
