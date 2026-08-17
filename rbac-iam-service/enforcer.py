import os
import casbin
from typing import List, Dict, Any, Tuple

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(CURRENT_DIR, "rbac_model.conf")
POLICY_PATH = os.path.join(CURRENT_DIR, "policy.csv")

class CasbinRBACEnforcer:
    """
    Production-grade Casbin RBAC Engine for SecurEdge / AICTE DCIM.
    Supports 4-tier role hierarchy, inheritance, and real-time sub-millisecond evaluation.
    """
    def __init__(self, model_path: str = MODEL_PATH, policy_path: str = POLICY_PATH):
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Casbin model file not found at {model_path}")
        if not os.path.exists(policy_path):
            raise FileNotFoundError(f"Casbin policy file not found at {policy_path}")
        
        self.enforcer = casbin.Enforcer(model_path, policy_path)
        print(f"[+] Casbin RBAC Engine initialized with model: {os.path.basename(model_path)}")

    def enforce(self, sub: str, obj: str, act: str) -> bool:
        """
        Evaluates whether subject 'sub' is authorized to perform action 'act' on object 'obj'.
        Returns True if ALLOWED, False if DENIED (Least Privilege).
        """
        return bool(self.enforcer.enforce(sub, obj, act))

    def get_roles_for_user(self, username: str) -> List[str]:
        """
        Returns direct roles assigned to the user.
        """
        return self.enforcer.get_roles_for_user(username)

    def get_implicit_roles_for_user(self, username: str) -> List[str]:
        """
        Returns all direct and inherited roles for the user.
        """
        return self.enforcer.get_implicit_roles_for_user(username)

    def get_permissions_for_user(self, username: str) -> List[Dict[str, str]]:
        """
        Returns all permissions (explicit and inherited) accessible by the user.
        """
        perms = self.enforcer.get_implicit_permissions_for_user(username)
        return [{"role": p[0], "resource": p[1], "action": p[2]} for p in perms]

    def get_all_named_roles(self) -> List[str]:
        """
        Returns all distinct roles defined in the policy.
        """
        roles = set()
        for p in self.enforcer.get_policy():
            roles.add(p[0])
        return sorted(list(roles))

    def get_all_policies(self) -> List[Dict[str, str]]:
        """
        Returns the entire active policy matrix.
        """
        return [{"role": p[0], "resource": p[1], "action": p[2]} for p in self.enforcer.get_policy()]

    def add_role_for_user(self, username: str, role: str) -> bool:
        """
        Binds a role to a user dynamically.
        """
        return self.enforcer.add_role_for_user(username, role)

    def delete_role_for_user(self, username: str, role: str) -> bool:
        """
        Removes a role from a user.
        """
        return self.enforcer.delete_role_for_user(username, role)

    def add_policy_rule(self, role: str, obj: str, act: str) -> bool:
        """
        Dynamically adds an authorization rule.
        """
        return self.enforcer.add_policy(role, obj, act)

# Global Singleton instance
_rbac_instance = None

def get_enforcer() -> CasbinRBACEnforcer:
    global _rbac_instance
    if _rbac_instance is None:
        _rbac_instance = CasbinRBACEnforcer()
    return _rbac_instance
