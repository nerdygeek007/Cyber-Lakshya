# 🚀 2-Minute Deployment Guide to Hugging Face Spaces

You have the complete, self-contained Hugging Face Space package ready in the `huggingface-space/` folder.

---

## ⚡ Method 1: Web UI Upload (Easiest — 2 Minutes)

1. Go to [huggingface.co/new-space](https://huggingface.co/new-space).
2. Enter Space details:
   * **Space name:** `securedge-ai-anomaly-engine` (or any name you prefer)
   * **License:** `mit`
   * **Space SDK:** Select **Gradio**
   * **Space hardware:** Select **CPU basic (2 vCPU, 16 GB RAM) — FREE**
   * **Visibility:** **Public** (or Private)
3. Click **Create Space**.
4. In your new Space, click **Files** $\rightarrow$ **Add file** $\rightarrow$ **Upload files**.
5. Drag and drop all files from your local folder `huggingface-space/`:
   ```
   ├── README.md
   ├── requirements.txt
   ├── app.py
   ├── config.py
   ├── explainability.py
   ├── threat_agent.py
   └── models/
       ├── isolation_forest.joblib
       ├── baseline_stats.json
       └── categorical_encoders.joblib
   ```
6. Click **Commit changes to main**.
7. Hugging Face will automatically build and launch your live app in ~30 seconds!

---

## ⚡ Method 2: Git Push via Terminal (For Developers)

```bash
# 1. Clone your empty Hugging Face space
git clone https://huggingface.co/spaces/<YOUR_USERNAME>/securedge-ai-anomaly-engine

# 2. Copy the files into the cloned repository
cp -r /media/chaitaniya/D\ Drive/SIH-2026/huggingface-space/* ./securedge-ai-anomaly-engine/

# 3. Commit and push
cd securedge-ai-anomaly-engine
git add .
git commit -m "Deploy SecurEdge AICTE Anomaly Engine"
git push
```

---

## 🌟 What You Get on Hugging Face:
1. **Interactive Demo UI:** A live web page where judges can test attack scenarios (Port Scans, SYN Floods, Brute-Force, Privilege Escalation) and see real-time AI Threat Reports.
2. **Public HTTPS Cloud Endpoint:** A free REST API for Jiya's Go Backend and Riddhi's React Frontend to query from anywhere in the world!
