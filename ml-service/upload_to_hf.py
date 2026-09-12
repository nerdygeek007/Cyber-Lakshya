import os
import sys
import tempfile
import shutil
from huggingface_hub import HfApi

def deploy_space(repo_id: str, token: str = None):
    print("=" * 70)
    print("🚀 HUGGING FACE SPACE DIRECT API DEPLOYMENT")
    print(f"[*] Target Space Repository: {repo_id}")
    print("=" * 70)

    token = token or os.getenv("HF_TOKEN")
    if not token:
        print("\n[!] Please provide your Hugging Face WRITE token (starts with hf_...).")
        print("👉 You can generate one in 20s at: https://huggingface.co/settings/tokens")
        token = input("Enter Hugging Face Token: ").strip()

    if not token:
        print("[!] No token provided. Exiting.")
        sys.exit(1)

    api = HfApi(token=token)

    # 1. Create a clean deployment folder staging
    with tempfile.TemporaryDirectory() as staging_dir:
        print(f"[*] Staging files into {staging_dir}...")
        
        base_files = [
            "app.py", "config.py", "database_connector.py", "gmm_engine.py",
            "autoencoder_engine.py", "pyod_ueba_engine.py", "chronos_forecaster.py",
            "llm_soc_copilot.py", "threat_agent.py", "explainability.py",
            "real_dataset_pipeline.py", "Dockerfile", "requirements.txt", "README.md"
        ]

        current_dir = os.path.dirname(os.path.abspath(__file__))

        for f in base_files:
            src = os.path.join(current_dir, f)
            if os.path.exists(src):
                shutil.copy(src, os.path.join(staging_dir, f))

        # Copy models and reports
        shutil.copytree(os.path.join(current_dir, "models"), os.path.join(staging_dir, "models"))
        shutil.copytree(os.path.join(current_dir, "reports"), os.path.join(staging_dir, "reports"))

        print(f"[*] Uploading complete FastAPI service and pre-trained models to Space {repo_id}...")
        api.upload_folder(
            folder_path=staging_dir,
            repo_id=repo_id,
            repo_type="space",
            commit_message="Deploy Cyber Lakshya Tri-Guard ML/DL Engine & FastAPI Backend"
        )

    print("\n" + "=" * 70)
    print("🎉 DEPLOYMENT SUCCESSFUL!")
    print(f"👉 Live Space: https://huggingface.co/spaces/{repo_id}")
    clean_name = repo_id.replace("/", "-")
    print(f"👉 Live API Docs: https://{clean_name}.hf.space/docs")
    print(f"👉 Health Check: https://{clean_name}.hf.space/api/v1/health")
    print("=" * 70)

if __name__ == "__main__":
    target_repo = sys.argv[1] if len(sys.argv) > 1 else "drdoom20/Securedge-ai-anomaly-engine"
    token_arg = sys.argv[2] if len(sys.argv) > 2 else None
    deploy_space(target_repo, token_arg)
