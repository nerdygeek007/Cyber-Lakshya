import os
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException, Depends, Header, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from auth_jwt import (
    USER_DATABASE,
    verify_password,
    create_access_token,
    decode_access_token,
    hash_password
)
from enforcer import get_enforcer

app = FastAPI(
    title="SecurEdge IAM & Casbin RBAC Gateway",
    description="4-Tier Zero-Trust Role-Based Access Control and Identity API for AICTE DCIM (CHA-39)",
    version="1.0.0"
)

# Enable CORS for React frontend (Riddhi) and Go backend (Jiya)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request / Response Schemas
class LoginRequest(BaseModel):
    username: str = Field(..., example="admin_chaitanya")
    password: str = Field(..., example="Admin@AICTE2026")

class LoginResponse(BaseModel):
    token: str
    token_type: str = "Bearer"
    username: str
    full_name: str
    role: str
    permissions: List[Dict[str, str]]

class EnforceRequest(BaseModel):
    sub: str = Field(..., description="Subject / Username or Role", example="secops_jiya")
    obj: str = Field(..., description="Resource / Object", example="firewalls")
    act: str = Field(..., description="Action", example="update")

class EnforceResponse(BaseModel):
    sub: str
    obj: str
    act: str
    allowed: bool
    verdict: str

class AssignRoleRequest(BaseModel):
    username: str
    role: str

def get_current_user(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid Authorization header (Bearer token required)"
        )
    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired JWT token"
        )
    return payload

@app.get("/api/v1/auth/health", tags=["System"])
def health_check():
    return {
        "status": "healthy",
        "service": "SecurEdge IAM & Casbin RBAC Gateway",
        "engine": "Casbin PERM Metamodel v2"
    }

@app.post("/api/v1/auth/login", response_model=LoginResponse, tags=["Authentication"])
def login(req: LoginRequest):
    user = USER_DATABASE.get(req.username)
    if not user or not verify_password(req.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )

    enforcer = get_enforcer()
    permissions = enforcer.get_permissions_for_user(req.username)
    token = create_access_token(user["username"], user["role"])

    return {
        "token": token,
        "token_type": "Bearer",
        "username": user["username"],
        "full_name": user["full_name"],
        "role": user["role"],
        "permissions": permissions
    }

@app.get("/api/v1/auth/me", tags=["Authentication"])
def get_my_profile(current_user: Dict[str, Any] = Depends(get_current_user)):
    username = current_user["sub"]
    enforcer = get_enforcer()
    return {
        "username": username,
        "role": current_user.get("role"),
        "permissions": enforcer.get_permissions_for_user(username),
        "inherited_roles": enforcer.get_implicit_roles_for_user(username)
    }

@app.post("/api/v1/rbac/enforce", response_model=EnforceResponse, tags=["Authorization"])
def check_authorization(req: EnforceRequest):
    """
    Sub-millisecond authorization decision endpoint for API endpoints and Go middleware.
    """
    enforcer = get_enforcer()
    allowed = enforcer.enforce(req.sub, req.obj, req.act)
    return {
        "sub": req.sub,
        "obj": req.obj,
        "act": req.act,
        "allowed": allowed,
        "verdict": "ALLOW (Authorized)" if allowed else "DENY (Insufficient Permissions)"
    }

@app.get("/api/v1/rbac/matrix", tags=["Authorization"])
def get_rbac_matrix():
    """
    Returns the complete 4-tier AICTE DCIM policy and role matrix for frontend display.
    """
    enforcer = get_enforcer()
    return {
        "roles": ["SuperAdmin", "SecOps_Engineer", "DataCenter_Operator", "Auditor_Viewer"],
        "policies": enforcer.get_all_policies(),
        "users": [
            {
                "username": u["username"],
                "full_name": u["full_name"],
                "role": u["role"],
                "email": u["email"]
            }
            for u in USER_DATABASE.values()
        ]
    }

class CreateUserRequest(BaseModel):
    username: str = Field(..., example="zonal_ramesh")
    full_name: str = Field(..., example="Dr. Ramesh Kumar")
    email: str = Field(..., example="ramesh@aicte-india.org")
    password: str = Field(..., example="Ramesh@AICTE2026")
    role: str = Field(..., example="SecOps_Engineer")
    custom_permissions: Optional[List[Dict[str, str]]] = Field(None, description="Optional extra custom rules: [{'obj': 'firewalls', 'act': 'write'}]")

@app.post("/api/v1/rbac/create-user", tags=["Administration"])
def create_user(req: CreateUserRequest, current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    SuperAdmin Provisioning: Registers a new user identity, assigns role/permissions, and issues credentials.
    """
    if current_user.get("role") != "SuperAdmin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only SuperAdmin is authorized to provision new identities and credentials"
        )

    if req.username in USER_DATABASE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Username '{req.username}' already exists in institutional directory"
        )

    # 1. Hash password with PBKDF2
    pw_hash = hash_password(req.password)

    # 2. Register into user directory
    USER_DATABASE[req.username] = {
        "username": req.username,
        "full_name": req.full_name,
        "role": req.role,
        "email": req.email,
        "password_hash": pw_hash
    }

    # 3. Bind role in Casbin
    enforcer = get_enforcer()
    enforcer.add_role_for_user(req.username, req.role)

    # 4. Add any custom permission rules
    if req.custom_permissions:
        for p in req.custom_permissions:
            if "obj" in p and "act" in p:
                enforcer.add_policy_rule(req.username, p["obj"], p["act"])

    # 5. Issue initial JWT token
    token = create_access_token(req.username, req.role)

    return {
        "status": "success",
        "message": f"Successfully provisioned identity '{req.username}' with role '{req.role}'",
        "user": {
            "username": req.username,
            "full_name": req.full_name,
            "role": req.role,
            "email": req.email
        },
        "initial_jwt_token": token,
        "permissions": enforcer.get_permissions_for_user(req.username)
    }

@app.post("/api/v1/rbac/assign-role", tags=["Administration"])
def assign_role(req: AssignRoleRequest, current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Assigns a role to a user. Restricted to SuperAdmin only.
    """
    if current_user.get("role") != "SuperAdmin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only SuperAdmin can modify user role assignments"
        )
    
    enforcer = get_enforcer()
    success = enforcer.add_role_for_user(req.username, req.role)
    if req.username in USER_DATABASE:
        USER_DATABASE[req.username]["role"] = req.role

    return {
        "success": success,
        "username": req.username,
        "assigned_role": req.role,
        "message": f"Successfully assigned role '{req.role}' to user '{req.username}'"
    }

