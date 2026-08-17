---
title: SecurEdge AI Anomaly Engine
emoji: 🛡️
colorFrom: blue
colorTo: red
sdk: gradio
sdk_version: 5.20.0
app_file: app.py
pinned: false
license: mit
short_description: Real-time Unsupervised AI Threat Engine for AICTE DCIM
---

# 🛡️ SecurEdge — AICTE Cybersecurity & DCIM Anomaly Engine
**Smart India Hackathon 2026 | Problem Statement CHA-39**  
**Team:** Cyber Lakshya (`DEPSTAR-SIH-880700`)

---

## 📌 Overview
SecurEdge AI Anomaly Engine is an unsupervised machine learning and Explainable AI (XAI) security pipeline trained on **100,655 real cybersecurity connections**. It provides real-time threat detection, anomaly scoring, and automated incident investigation reports for AICTE data center servers, firewalls, and user access nodes.

### 🏆 Benchmark Validation Metrics (KDD Ground-Truth Attacks):
* **ROC-AUC Score:** `0.9793` (~98%)
* **Detection Recall:** `0.99` (99% attack detection rate)
* **Precision:** `0.96`
* **F1-Score:** `0.97`
* **Real Attack Detection Rates:**
  * `neptune` (SYN Flood DDoS): **100%**
  * `smurf` (ICMP Flood): **100%**
  * `portsweep` (Port Scan): **100%**
  * `satan` (Vulnerability Probing): **100%**
  * `land` (IP Spoofing): **100%**
