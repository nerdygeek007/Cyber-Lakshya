import time
import jwt
from typing import Dict, Any, Optional

SECRET_KEY = "cyber_lakshya_aicte_cha39_super_secret_jwt_key_2026"
ALGORITHM = "HS256"
TOKEN_EXPIRY_SECONDS = 3600 * 8  # 8 hours

# Demo User Directory for Hackathon Evaluation
USER_DB = {
    "chaitanya": {"name": "Chaitanya Thakar", "role": "admin", "department": "AI & Security Lead"},
    "maharshi": {"name": "Maharshi Trivedi", "role": "secops", "department": "Systems & eBPF"},
    "siddharth": {"name": "Siddharthsinh Raulji", "role": "secops", "department": "Network & Firewall"},
    "het": {"name": "Het Pansara", "role": "admin", "department": "Database Architecture"},
    "jiya": {"name": "Jiya Bhayani", "role": "technician", "department": "Backend Engineering"},
    "riddhi": {"name": "Riddhi Odedra", "role": "viewer", "department": "UI/UX & Frontend"},
    "auditor_aicte": {"name": "AICTE Compliance Inspector", "role": "auditor", "department": "Governance & CERT-In Audit"}
}

def create_access_token(username: str, role: Optional[str] = None, expires_in: int = TOKEN_EXPIRY_SECONDS) -> str:
    """Generates an RFC 7519 compliant JSON Web Token with embedded RBAC claims."""
    user_info = USER_DB.get(username, {"name": username, "role": role or "viewer", "department": "General"})
    assigned_role = role or user_info.get("role", "viewer")

    payload = {
        "sub": f"user:{username}",
        "username": username,
        "name": user_info.get("name", username),
        "role": assigned_role,
        "department": user_info.get("department", "General"),
        "iat": int(time.time()),
        "exp": int(time.time()) + expires_in,
        "iss": "cyber-lakshya-iam-auth"
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str) -> Dict[str, Any]:
    """Decodes and cryptographically verifies an RFC 7519 JWT."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {"valid": True, "payload": payload}
    except jwt.ExpiredSignatureError:
        return {"valid": False, "error": "Token has expired"}
    except jwt.InvalidTokenError as e:
        return {"valid": False, "error": f"Invalid token: {str(e)}"}

def register_user(username: str, name: str, role: str, department: str = "General") -> Dict[str, Any]:
    """Registers or updates a user in the in-memory identity store."""
    uname = username.lower().strip()
    USER_DB[uname] = {
        "name": name,
        "role": role,
        "department": department
    }
    return USER_DB[uname]

