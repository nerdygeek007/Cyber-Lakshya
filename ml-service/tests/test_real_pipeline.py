import unittest
import os
import numpy as np
import joblib

from config import MODEL_PATH, STATS_PATH, ENCODER_PATH
from explainability import AnomalyExplainer
from threat_agent import ThreatInvestigationAgent
from live_threat_watcher import LiveThreatWatcher

class TestAnomalyDetectionPipeline(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.watcher = LiveThreatWatcher()
        cls.explainer = AnomalyExplainer(STATS_PATH)

    def test_model_files_exist(self):
        self.assertTrue(os.path.exists(MODEL_PATH), "Model artifact should exist")
        self.assertTrue(os.path.exists(STATS_PATH), "Baseline stats should exist")
        self.assertTrue(os.path.exists(ENCODER_PATH), "Categorical encoders should exist")

    def test_normal_traffic_scoring(self):
        normal_event = {
            "protocol_type": "tcp",
            "service": "http",
            "flag": "SF",
            "src_bytes": 215,
            "dst_bytes": 1024,
            "count": 2,
            "srv_count": 2,
            "num_failed_logins": 0
        }
        res = self.watcher.score_event(normal_event, target_entity="Server-Node-01")
        self.assertFalse(res["is_anomaly"], "Normal traffic should not be flagged as anomaly")
        self.assertEqual(res["severity"], "LOW")
        self.assertGreater(res["anomaly_score"], 0.0)

    def test_brute_force_attack_scoring(self):
        attack_event = {
            "protocol_type": "tcp",
            "service": "telnet",
            "flag": "SF",
            "src_bytes": 100,
            "dst_bytes": 200,
            "num_failed_logins": 8,
            "count": 25
        }
        res = self.watcher.score_event(attack_event, target_entity="Auth-Server-01")
        self.assertTrue(res["is_anomaly"], "Brute-force login event should be flagged as anomaly")
        self.assertIn("failure", res["top_reason"].lower())

    def test_privilege_escalation_detection(self):
        priv_event = {
            "protocol_type": "tcp",
            "service": "ftp",
            "flag": "SF",
            "root_shell": 1,
            "su_attempted": 1,
            "num_file_creations": 5
        }
        res = self.watcher.score_event(priv_event, target_entity="DB-Master-01")
        self.assertTrue(res["is_anomaly"])
        self.assertEqual(res["severity"], "CRITICAL")
        self.assertIn("Root Shell", res["top_reason"])

    def test_threat_report_generation(self):
        priv_event = {
            "protocol_type": "tcp",
            "service": "ftp",
            "flag": "SF",
            "root_shell": 1,
            "su_attempted": 1
        }
        res = self.watcher.score_event(priv_event, target_entity="DB-Master-01")
        report = res["threat_report"]
        self.assertIn("incident_id", report)
        self.assertIn("markdown_report", report)
        self.assertTrue(len(report["remediation_actions"]) > 0)

if __name__ == "__main__":
    unittest.main()
