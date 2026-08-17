# 🚀 1-Minute Gradio-Lite Deployment to Hugging Face (100% Free)

This is a **Static Space** powered by **WebAssembly (Pyodide)**, so it costs **$0 forever** with no PRO subscription needed!

---

## ⚡ Deployment Steps:

1. Go to [huggingface.co/new-space](https://huggingface.co/new-space).
2. Enter your Space settings:
   * **Space name:** `securedge-ai-threat-engine` *(or your choice)*
   * **Space SDK:** Select **`Static`** (the green icon)
   * **Template:** Select **`Gradio-Lite`** (or Blank)
   * **Visibility:** **Public**
3. Click **Create Space**.
4. In your new Space, click **Files** $\rightarrow$ **Add file** $\rightarrow$ **Upload files**.
5. Upload these files and folder from `huggingface-gradio-lite/`:
   ```
   ├── README.md
   ├── index.html
   └── models/
       ├── isolation_forest.joblib
       ├── baseline_stats.json
       └── categorical_encoders.joblib
   ```
6. Click **Commit changes to main**.
7. In ~15 seconds, your live Gradio-Lite app is online at `https://huggingface.co/spaces/<your-username>/securedge-ai-threat-engine`!
