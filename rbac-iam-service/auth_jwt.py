import os
import time
import hashlib
import jwt
from typing import Optional, Dict, Any

JWT_SECRET = os.getenv("JWT_SECRET", "SecurEdge_AICTE_DCIM_SuperSecretKey_2026_ZeroTrust")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_SECONDS = 3600 * 8  # 8 hours

# Password hashing with PBKDF2 SHA-256
def hash_password(password: str, salt: Optional[str] = None) -> str:
    if not salt:
        salt = os.urandom(16).hex()
    key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
    return f"{salt}${key.hex()}"

def verify_password(password: str, stored_hash: str) -> bool:
    try:
        salt, key_hex = stored_hash.split('$')
        computed = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
        return computed.hex() == key_hex
    except Exception:
        return False

# In-memory demo user registry (can sync with PostgreSQL)
USER_DATABASE: Dict[str, Dict[str, Any]] = {
    "admin_chaitanya": {
        "username": "admin_chaitanya",
        "full_name": "Chaitanya (AICTE SuperAdmin)",
        "role": "SuperAdmin",
        "email": "chaitanya.admin@aicte-india.org",
        "password_hash": hash_password("Admin@AICTE2026", "salt_chaitanya_01")
    },
    "secops_jiya": {
        "username": "secops_jiya",
        "full_name": "Jiya (Lead SecOps Engineer)",
        "role": "SecOps_Engineer",
        "email": "jiya.secops@aicte-india.org",
        "password_hash": hash_password("SecOps@AICTE2026", "salt_jiya_02")
    },
    "dc_het": {
        "username": "dc_het",
        "full_name": "Het (Data Center Operations Lead)",
        "role": "DataCenter_Operator",
        "email": "het.dc@aicte-india.org",
        "password_hash": hash_password("DCOps@AICTE2026", "salt_het_03")
    },
    "auditor_riddhi": {
        "username": "auditor_riddhi",
        "full_name": "Riddhi (Compliance & Audit Officer)",
        "role": "Auditor_Viewer",
        "email": "riddhi.audit@aicte-india.org",
        "password_hash": hash_password("Audit@AICTE2026", "salt_riddhi_04")
    }
}

def create_access_token(username: str, role: str, extra_claims: Optional[Dict[str, Any]] = None) -> str:
    payload = {
        "sub": username,
        "role": role,
        "iat": int(time.time()),
        "exp": int(time.time()) + JWT_EXPIRATION_SECONDS,
        "iss": "SecurEdge-IAM-AICTE"
    }
    if extra_claims:
        payload.update(extra_claims)
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM], issuer="SecurEdge-IAM-AICTE")
        return payload
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None
