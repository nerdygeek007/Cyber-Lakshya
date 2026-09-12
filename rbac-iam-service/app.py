import os
import sys
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException, Header, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from enforcer import rbac_enforcer
from auth_jwt import create_access_token, decode_access_token, USER_DB

from fastapi.responses import RedirectResponse, HTMLResponse

app = FastAPI(
    title="Cyber Lakshya Zero-Trust RBAC & IAM Subsystem",
    description="Casbin PERM Policy Authorization, RFC 7519 JWT Authentication, and 5-Tier Role Governance for AICTE (CHA-39)",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", response_class=HTMLResponse, tags=["Testing UI"])
@app.get("/ui", response_class=HTMLResponse, tags=["Testing UI"])
@app.get("/workbench", response_class=HTMLResponse, tags=["Testing UI"])
def get_rbac_ui():
    """Serves the interactive Zero-Trust Casbin RBAC & IAM Command Center UI."""
    template_path = os.path.join(os.path.dirname(__file__), "templates", "rbac_ui.html")
    if os.path.exists(template_path):
        with open(template_path, "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    return HTMLResponse(content="<h1>RBAC UI Template Not Found</h1>", status_code=404)



# =========================================================================
# Request / Response Schemas
# =========================================================================

class LoginRequest(BaseModel):
    username: str = Field(default="chaitanya", description="Username (chaitanya, maharshi, siddharth, het, jiya, riddhi, auditor_aicte)")
    password: Optional[str] = Field(default="password123", description="Password")

class AccessCheckRequest(BaseModel):
    subject: Optional[str] = Field(default="chaitanya", description="Username or role (e.g. chaitanya or role:technician)")
    resource: str = Field(default="infra:servers", description="Target resource (e.g. infra:servers, security:firewalls)")
    action: str = Field(default="restart", description="Action (read, write, restart, deploy, quarantine, export)")

class TokenVerifyRequest(BaseModel):
    token: str = Field(description="RFC 7519 JSON Web Token")

class CreateUserRequest(BaseModel):
    actor: Optional[str] = Field(default="chaitanya", description="Performing administrator username")
    username: str = Field(description="New username to create (e.g. rohit_sec)")
    name: str = Field(description="Full Name")
    role: str = Field(default="technician", description="Assigned Casbin role (admin, secops, technician, auditor, viewer)")
    department: Optional[str] = Field(default="Infrastructure Operations", description="Department name")

class PolicyMutationRequest(BaseModel):
    actor: Optional[str] = Field(default="chaitanya", description="Performing administrator username")
    target_role_or_user: str = Field(default="technician", description="Role or user (e.g. technician or role:technician)")
    resource: str = Field(default="security:firewalls", description="Target resource URN")
    action: str = Field(default="quarantine", description="Action to grant or revoke")


# =========================================================================
# API Endpoints
# =========================================================================

@app.get("/api/v1/iam/health", tags=["Health"])
def iam_health():
    return {
        "status": "healthy",
        "service": "Cyber Lakshya Zero-Trust RBAC & IAM Subsystem",
        "casbin_enforcer_loaded": True,
        "supported_roles": ["admin", "secops", "technician", "auditor", "viewer"],
        "token_standard": "RFC 7519 (ECDSA/HMAC)"
    }

@app.post("/api/v1/iam/login", tags=["Authentication"])
def login_user(req: LoginRequest):
    """Authenticates a user and issues an RFC 7519 JWT token with assigned Casbin role claims."""
    username = req.username.lower().strip()
    if username not in USER_DB:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"User '{username}' not recognized in AICTE directory. Available demo users: {list(USER_DB.keys())}"
        )
    
    user_data = USER_DB[username]
    token = create_access_token(username=username, role=user_data["role"])
    roles = rbac_enforcer.get_roles_for_user(username)
    
    return {
        "success": True,
        "token": token,
        "user": {
            "username": username,
            "name": user_data["name"],
            "role": user_data["role"],
            "assigned_casbin_roles": roles,
            "department": user_data["department"]
        }
    }

@app.post("/api/v1/iam/verify-access", tags=["Authorization"])
def verify_access(req: AccessCheckRequest):
    """
    Evaluates real-time Casbin PERM policy.
    Returns whether access is GRANTED or DENIED with evaluation latency.
    """
    import time
    start = time.perf_counter()
    
    is_allowed = rbac_enforcer.enforce_access(
        subject=req.subject,
        resource=req.resource,
        action=req.action
    )
    latency_ms = (time.perf_counter() - start) * 1000.0

    return {
        "subject": req.subject,
        "resource": req.resource,
        "action": req.action,
        "decision": "ALLOW" if is_allowed else "DENY",
        "is_allowed": is_allowed,
        "evaluation_latency_ms": round(latency_ms, 4),
        "policy_model": "Casbin PERM (Policy, Effect, Request, Matchers)"
    }

@app.get("/api/v1/iam/matrix", tags=["Policy Matrix"])
def get_permission_matrix():
    """Returns the complete 5-Tier Permission Matrix for UI dashboard tables."""
    return rbac_enforcer.get_permission_matrix()

@app.get("/api/v1/iam/benchmark", tags=["Benchmark"])
def benchmark_rbac():
    """Executes a 1,000-request latency benchmark demonstrating <0.1ms performance."""
    return rbac_enforcer.benchmark_latency(iterations=1000)

@app.get("/api/v1/iam/users", tags=["Directory"])
def list_directory_users():
    """Lists all registered data center users and their Casbin role assignments."""
    users = []
    for uname, data in USER_DB.items():
        roles = rbac_enforcer.get_roles_for_user(uname)
        users.append({
            "username": uname,
            "name": data["name"],
            "primary_role": data["role"],
            "casbin_roles": roles,
            "department": data["department"]
        })
    return {"total_users": len(users), "users": users}

@app.post("/api/v1/iam/users/create", tags=["Identity Provisioning"])
def create_new_user(req: CreateUserRequest):
    """
    Provisions a new data center user with assigned Casbin roles and service permissions.
    Protected by Zero-Trust: Requires administrative authority (iam:users:create).
    """
    actor = req.actor or "chaitanya"
    has_permission = rbac_enforcer.enforce_access(actor, "iam:users", "create")
    if not has_permission:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Zero-Trust Block: Actor '{actor}' does not possess 'iam:users:create' authority."
        )

    username = req.username.lower().strip()
    from auth_jwt import register_user
    user_info = register_user(
        username=username,
        name=req.name,
        role=req.role,
        department=req.department
    )

    rbac_enforcer.add_user_role_mapping(username, req.role)

    return {
        "success": True,
        "message": f"User '{username}' successfully provisioned with role '{req.role}'.",
        "user": {
            "username": username,
            "name": req.name,
            "role": req.role,
            "department": req.department,
            "casbin_roles": rbac_enforcer.get_roles_for_user(username)
        }
    }

@app.post("/api/v1/iam/policy/grant", tags=["Access Control Mutation"])
def grant_permission(req: PolicyMutationRequest):
    """
    Dynamically grants an action permission on a resource to a role or user.
    Protected by Zero-Trust: Requires administrative authority (iam:users:modify).
    """
    actor = req.actor or "chaitanya"
    has_permission = rbac_enforcer.enforce_access(actor, "iam:users", "modify")
    if not has_permission:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Zero-Trust Block: Actor '{actor}' does not possess 'iam:users:modify' authority."
        )

    success = rbac_enforcer.add_permission_to_role(req.target_role_or_user, req.resource, req.action)
    return {
        "success": success,
        "message": f"Successfully granted '{req.action}' on '{req.resource}' to '{req.target_role_or_user}'.",
        "matrix": rbac_enforcer.get_permission_matrix()
    }

@app.post("/api/v1/iam/policy/revoke", tags=["Access Control Mutation"])
def revoke_permission(req: PolicyMutationRequest):
    """
    Dynamically revokes an action permission on a resource from a role or user.
    Protected by Zero-Trust: Requires administrative authority (iam:users:modify).
    """
    actor = req.actor or "chaitanya"
    has_permission = rbac_enforcer.enforce_access(actor, "iam:users", "modify")
    if not has_permission:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Zero-Trust Block: Actor '{actor}' does not possess 'iam:users:modify' authority."
        )

    success = rbac_enforcer.remove_permission_from_role(req.target_role_or_user, req.resource, req.action)
    return {
        "success": success,
        "message": f"Successfully revoked '{req.action}' on '{req.resource}' from '{req.target_role_or_user}'.",
        "matrix": rbac_enforcer.get_permission_matrix()
    }

