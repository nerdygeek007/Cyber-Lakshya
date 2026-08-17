import os
import unittest
import sys

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from enforcer import CasbinRBACEnforcer
from auth_jwt import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
    USER_DATABASE
)

class TestCasbinRBACandIAM(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.rbac = CasbinRBACEnforcer()

    def test_superadmin_full_access(self):
        """SuperAdmin must have unrestricted root access across all resources and actions"""
        self.assertTrue(self.rbac.enforce("admin_chaitanya", "servers", "write"))
        self.assertTrue(self.rbac.enforce("admin_chaitanya", "firewalls", "delete"))
        self.assertTrue(self.rbac.enforce("admin_chaitanya", "anomalies", "remediate"))
        self.assertTrue(self.rbac.enforce("admin_chaitanya", "custom_secret_resource", "admin"))

    def test_secops_engineer_permissions(self):
        """SecOps_Engineer can manage firewalls & remediate anomalies, but cannot write to racks"""
        # Allowed
        self.assertTrue(self.rbac.enforce("secops_jiya", "firewalls", "update"))
        self.assertTrue(self.rbac.enforce("secops_jiya", "anomalies", "remediate"))
        self.assertTrue(self.rbac.enforce("secops_jiya", "audit_logs", "read"))
        
        # Denied (Least Privilege)
        self.assertFalse(self.rbac.enforce("secops_jiya", "racks", "write"))
        self.assertFalse(self.rbac.enforce("secops_jiya", "assets", "delete"))

    def test_datacenter_operator_permissions(self):
        """DataCenter_Operator can manage servers & racks, but cannot modify firewall rules"""
        # Allowed
        self.assertTrue(self.rbac.enforce("dc_het", "servers", "write"))
        self.assertTrue(self.rbac.enforce("dc_het", "racks", "write"))
        self.assertTrue(self.rbac.enforce("dc_het", "assets", "read"))
        
        # Denied
        self.assertFalse(self.rbac.enforce("dc_het", "firewalls", "write"))
        self.assertFalse(self.rbac.enforce("dc_het", "anomalies", "remediate"))

    def test_auditor_viewer_read_only(self):
        """Auditor_Viewer must have strict read-only access and no write/delete capabilities"""
        # Allowed (Read-only)
        self.assertTrue(self.rbac.enforce("auditor_riddhi", "audit_logs", "read"))
        self.assertTrue(self.rbac.enforce("auditor_riddhi", "compliance", "read"))
        self.assertTrue(self.rbac.enforce("auditor_riddhi", "licenses", "read"))
        
        # Denied (Writes / Modifications)
        self.assertFalse(self.rbac.enforce("auditor_riddhi", "servers", "write"))
        self.assertFalse(self.rbac.enforce("auditor_riddhi", "firewalls", "delete"))
        self.assertFalse(self.rbac.enforce("auditor_riddhi", "anomalies", "remediate"))

    def test_jwt_issuance_and_verification(self):
        """JWT tokens must encode claims and be verified correctly"""
        token = create_access_token("admin_chaitanya", "SuperAdmin")
        self.assertIsInstance(token, str)
        
        payload = decode_access_token(token)
        self.assertIsNotNone(payload)
        self.assertEqual(payload["sub"], "admin_chaitanya")
        self.assertEqual(payload["role"], "SuperAdmin")

    def test_password_hashing(self):
        """Passwords must be hashed with PBKDF2 salt and match on verification"""
        raw_pw = "SecurePassword@2026"
        hashed = hash_password(raw_pw)
        self.assertTrue(verify_password(raw_pw, hashed))
        self.assertFalse(verify_password("WrongPassword", hashed))

if __name__ == "__main__":
    unittest.main()
