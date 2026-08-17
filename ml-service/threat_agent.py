import datetime

class ThreatInvestigationAgent:
    """
    Autonomous AI Security Agent that transforms raw anomaly metrics into
    actionable, structured executive incident reports for SecurEdge / DCIM operators.
    """
    @staticmethod
    def generate_incident_report(event_id, target_entity, explanation_result, raw_event=None):
        timestamp_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S IST")
        score = explanation_result["anomaly_score"]
        severity = explanation_result["severity"]
        top_reason = explanation_result["top_reason"]
        contributions = explanation_result.get("top_contributing_features", [])

        # Categorize Attack Type based on top feature
        category = "Network / Infrastructure Behavioral Anomaly"
        remediations = []
        
        feature_names = [c["feature"] for c in contributions]
        
        if "num_failed_logins" in feature_names or "is_guest_login" in feature_names:
            category = "Identity Abuse: Brute-Force / Credential Stuffing Attempt"
            remediations = [
                "Temporarily lock account and trigger MFA re-challenge",
                "Add source IP to rate-limiting blocklist at edge firewall",
                "Audit recent successful access tokens for this subject"
            ]
        elif "diff_srv_rate" in feature_names or "srv_diff_host_rate" in feature_names:
            category = "Reconnaissance: Port / Service Discovery Sweep"
            remediations = [
                "Deploy honeypot port listener to trace actor signature",
                "Apply default-deny ingress policy on non-standard ports",
                "Notify Security Operations Center (SOC) lead"
            ]
        elif "src_bytes" in feature_names or "dst_bytes" in feature_names:
            category = "Data Exfiltration / Volumetric Traffic Surge"
            remediations = [
                "Throttle egress bandwidth on node interface",
                "Inspect active socket connections via eBPF kernel tracker",
                "Capture 60-second PCAP dump for forensic analysis"
            ]
        elif "root_shell" in feature_names or "su_attempted" in feature_names:
            category = "Critical Breach: Privilege Escalation / Unauthorized Root Access"
            remediations = [
                "Isolate server node from internal VPC network immediately",
                "Terminate active interactive shell processes via eBPF",
                "Initiate emergency incident response workflow"
            ]
        else:
            category = "Autonomic Anomaly: Statistical Baseline Deviation"
            remediations = [
                "Flag session for continuous telemetry monitoring",
                "Review user activity in audit log table",
                "Verify node configuration hash against baseline"
            ]

        # Format markdown report
        evidence_lines = []
        for c in contributions:
            evidence_lines.append(f"  • {c['description']} (Observed: {c['value']}, Baseline: {c['baseline_mean']}, Z-Score: +{c['z_score']}σ)")

        evidence_str = "\n".join(evidence_lines) if evidence_lines else "  • Multi-dimensional outlier across connection vectors"
        remediation_str = "\n".join([f"  [{i+1}] {r}" for i, r in enumerate(remediations)])

        report_md = f"""🚨 [INCIDENT #{event_id}] AUTONOMOUS AI THREAT INVESTIGATION
═════════════════════════════════════════════════════════════════════
Target Node / Entity : {target_entity}
Timestamp            : {timestamp_str}
Threat Severity      : {severity} (Anomaly Score: {score})
Threat Category      : {category}
─────────────────────────────────────────────────────────────────────
🔍 ROOT CAUSE EVIDENCE & DEVIATION:
{evidence_str}

⚡ RECOMMENDED AUTONOMOUS REMEDIATION ACTIONS:
{remediation_str}
═════════════════════════════════════════════════════════════════════"""

        return {
            "incident_id": event_id,
            "timestamp": timestamp_str,
            "target_entity": target_entity,
            "severity": severity,
            "category": category,
            "anomaly_score": score,
            "summary": top_reason,
            "remediation_actions": remediations,
            "markdown_report": report_md
        }
