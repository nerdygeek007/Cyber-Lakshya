import os
import pandas as pd
import numpy as np
from sklearn.datasets import fetch_kddcup99
from sklearn.preprocessing import LabelEncoder
import joblib
from config import DATA_DIR, ENCODER_PATH

CATEGORICAL_COLS = ["protocol_type", "service", "flag"]
NUMERICAL_COLS = [
    "duration", "src_bytes", "dst_bytes", "land", "wrong_fragment", "urgent", "hot",
    "num_failed_logins", "logged_in", "num_compromised", "root_shell", "su_attempted",
    "num_root", "num_file_creations", "num_shells", "num_access_files", "num_outbound_cmds",
    "is_host_login", "is_guest_login", "count", "srv_count", "serror_rate", "srv_serror_rate",
    "rerror_rate", "srv_rerror_rate", "same_srv_rate", "diff_srv_rate", "srv_diff_host_rate",
    "dst_host_count", "dst_host_srv_count", "dst_host_same_srv_rate", "dst_host_diff_srv_rate",
    "dst_host_same_src_port_rate", "dst_host_srv_diff_host_rate", "dst_host_serror_rate",
    "dst_host_srv_serror_rate", "dst_host_rerror_rate", "dst_host_srv_rerror_rate"
]

FEATURE_COLS = CATEGORICAL_COLS + NUMERICAL_COLS

def clean_bytes(val):
    if isinstance(val, bytes):
        return val.decode("utf-8", errors="ignore").rstrip(".")
    elif isinstance(val, str):
        return val.rstrip(".")
    return val

def load_and_preprocess_real_data():
    """
    Fetches the real KDD cybersecurity dataset (100,655 real network connections),
    cleans the bytes/strings, encodes categoricals, and splits into:
    - Clean Normal Baseline for unsupervised training (Normal traffic)
    - Evaluation Test Set with ground-truth attacks (DDoS, Probe, Privilege Escalation, R2L)
    """
    raw_cache_path = os.path.join(DATA_DIR, "real_cyber_dataset.csv.gz")
    
    if os.path.exists(raw_cache_path):
        print(f"[*] Loading cached real dataset from {raw_cache_path}...")
        df = pd.read_csv(raw_cache_path, compression="gzip")
    else:
        print("[*] Fetching real cybersecurity dataset (100,655 connections)...")
        kdd = fetch_kddcup99(subset="SA", percent10=True, as_frame=True)
        df = kdd.frame

        # Clean byte values
        for col in df.columns:
            df[col] = df[col].apply(clean_bytes)

        # Convert numeric columns
        for col in NUMERICAL_COLS:
            df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0)

        df.to_csv(raw_cache_path, compression="gzip", index=False)
        print(f"[+] Cached real dataset to {raw_cache_path} ({df.shape[0]} records).")

    # Fit categorical encoders
    encoders = {}
    df_encoded = df.copy()
    for col in CATEGORICAL_COLS:
        le = LabelEncoder()
        df_encoded[col] = le.fit_transform(df_encoded[col].astype(str))
        encoders[col] = le

    joblib.dump(encoders, ENCODER_PATH)

    # Separate normal baseline vs attacks
    # In KDD dataset, normal records are labeled as 'normal'
    is_normal = df["labels"].str.lower().str.contains("normal")
    df_normal = df_encoded[is_normal].copy()
    df_attacks = df_encoded[~is_normal].copy()

    print(f"[+] Total Real Records: {len(df_encoded)}")
    print(f"    - Clean Normal Baseline: {len(df_normal)}")
    print(f"    - Real Attack Incidents: {len(df_attacks)} (across {df_attacks['labels'].nunique()} attack types)")

    return df_encoded, df_normal, df_attacks, encoders
