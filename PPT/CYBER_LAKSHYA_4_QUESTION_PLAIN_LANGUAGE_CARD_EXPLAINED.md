# 📋 Cyber Lakshya (CHA-39) — The 4-Question Plain-Language Incident Card
### The Executive AI Translation Engine for Non-Technical Directors & Administrators

---

## 💡 What Is the 4-Question Plain-Language Card?

In government institutions and university data centers like AICTE, **directors, registrars, and top administrators are non-technical executives**.  
When a cyberattack happens, traditional security tools dump **500 lines of unreadable raw computer hex logs** like:

```text
[RAW TRADITIONAL LOG - CONFUSING TO BOSSES ❌]
2026-08-20T10:14:02Z AICTE-SRV-024 TCP SYN 192.168.1.45:5432 S0 count=280 diff_srv=0.95 
root_shell=0 su_attempted=0 flags=REJ err=0x80070005 ACCESS_DENIED CWE-307
```

Executives cannot make decisions from raw hex code.  
Cyber Lakshya’s AI Copilot automatically translates that raw forensic event in **0.1 milliseconds** into **The 4-Question Plain-Language Card**:

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                   🛡️ CYBER LAKSHYA — 4-QUESTION EXECUTIVE INCIDENT CARD                         │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. ❓ WHAT HAPPENED?                                                                             │
│    "Someone tried guessing administrator passwords on Server 024, failing 48 times in 60s."      │
│                                                                                                  │
│ 2. ⚠️ WHY DOES IT MATTER?                                                                        │
│    "If successful, the attacker gets full root access to AICTE's student scholarship database." │
│                                                                                                  │
│ 3. ⚡ WHAT SHOULD I DO?                                                                          │
│    "Click [QUARANTINE IP] to inject an immediate block rule on Edge Firewall SW-01."             │
│                                                                                                  │
│ 4. 👤 WHO HANDLES IT?                                                                            │
│    "Identity & Access Management (IAM) Team • Assigned to On-Call Security Lead"                 │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

# 🔍 The 4 Questions Explained in Detail

---

### Question 1: ❓ WHAT HAPPENED?
* **Purpose:** Explains the exact physical cyber event in simple, human terms without computer jargon.
* **What the AI answers:** Who did what, to which machine, and how fast.
* **Real-World Examples:**
  * *Attack 1 (Password Brute-Force):* *"Multiple rapid failed logins detected targeting SSH ports on Server AICTE-SRV-024 from an unknown external IP address."*
  * *Attack 2 (SYN Flood DDoS):* *"An abnormal flood of 280 incomplete connection requests per second is hitting the admission portal, trying to overwhelm its memory."*
  * *Attack 3 (Port Reconnaissance):* *"An outside scanner is rapidly knocking on 50 different server ports to find an unlocked doorway into the network."*

---

### Question 2: ⚠️ WHY DOES IT MATTER?
* **Purpose:** Explains the **business, financial, or institutional risk** so leadership understands the urgency.
* **What the AI answers:** What can the attacker steal, damage, or shut down if we don't act now?
* **Real-World Examples:**
  * *Example 1:* *"If breached, the attacker can tamper with national student scholarship disbursements or alter examination grades."*
  * *Example 2:* *"If the traffic flood continues, legitimate students across India will experience timeouts and won't be able to submit admission forms."*
  * *Example 3:* *"This reconnaissance indicates a hacker is preparing a targeted ransomware attack against the primary database blade."*

---

### Question 3: ⚡ WHAT SHOULD I DO?
* **Purpose:** Gives the executive a **1-click actionable recommendation** instead of asking them to write technical firewall scripts.
* **What the AI answers:** What exact button or command neutralizes the threat right now?
* **Real-World Examples:**
  * *Action 1:* *"Click **[QUARANTINE IP]** to deploy an instant drop rule on Edge Firewall SW-01."*
  * *Action 2:* *"Click **[ENABLE RATE LIMITING]** to throttle ingress bandwidth and protect server CPU."*
  * *Action 3:* *"Click **[ENFORCE MFA STEP-UP]** to immediately lock the compromised user session."*

---

### Question 4: 👤 WHO HANDLES IT?
* **Purpose:** Fixes ownership so alerts never get lost between departments.
* **What the AI answers:** Which specific team or engineer is accountable for closing this ticket?
* **Real-World Examples:**
  * *Example 1:* *"Network Security Operations Center (SOC) • Assigned to On-Call Technician"*
  * *Example 2:* *"Database Administration & Infrastructure Lead"*
  * *Example 3:* *"Identity & Access Management (IAM) Governance Desk"*

---

# 👥 The Dual-Persona Magic: How It Pleases Both Bosses AND Technicians

```
                                [ ANOMALY OCCURS ]
                                         │
        ┌────────────────────────────────┴────────────────────────────────┐
        ▼                                                                 ▼
[ 👔 NON-TECHNICAL DIRECTOR ]                                  [ 🛠️ TECHNICAL SOC ANALYST ]
• Sees the 4-Question Plain Card                               • Clicks "View Deep Forensics"
• Understands the threat in 5 seconds                         • Inspects live PID & socket tables
• Clicks [1-Click Approve Remediation]                        • Views exact Z-Scores (+13.65σ) & PCAP
```

* **The Director / Registrar:** Gets instant clarity, zero confusion, and approves emergency fixes in seconds.
* **The SOC Analyst / Technician:** Gets full deep-dive forensic data (Z-Scores, reconstruction MSE, TCP flags, process trees) by clicking *"Inspect Forensic Telemetry"*.

---

# 💻 Real API Response from Our Live Engine (`/api/v1/predict`)

When you test the ML service right now on `http://localhost:8000/ui`, this is the exact live JSON output generated:

```json
{
  "incident_id": "SEC-B800BBA2",
  "target_entity": "AICTE-SRV-002",
  "is_anomaly": true,
  "severity": "HIGH",
  "risk_score": 0.6746,
  "mitre_tactic": "[T1046] Network Service Discovery (Port Scan)",
  
  "plain_language_card": {
    "what_happened": "An outside scanning source is probing multiple server ports on AICTE-SRV-002 with 250 rapid connection attempts.",
    "why_it_matters": "The attacker is searching for unpatched software vulnerabilities to gain unauthorized entry into AICTE's internal network.",
    "what_to_do": "Click 'Quarantine IP' to inject an immediate drop rule on Edge Firewall SW-01.",
    "who_handles_it": "Network Security Operations Team",
    "mitre_tactic": "T1046: Network Service Discovery (Port Scan)",
    "urgency_level": "HIGH",
    "ai_provider": "Deterministic MITRE Grounded Engine (Sub-0.1ms Latency)"
  }
}
```

---

# 🎤 What to Say to the Judges in 20 Seconds:

> *"In traditional systems, when a cyberattack happens, the AICTE Chairman is handed a 500-line log of raw computer code that no non-technical boss can understand.  
> In Cyber Lakshya, our AI instantly translates that event into a **4-Question Plain Card**:  
> **1. What happened? 2. Why does it matter? 3. What should I do? 4. Who handles it?**  
> This allows non-technical leadership to approve 1-click firewall quarantines in seconds, while our technicians can drill down into the deep kernel telemetry with a single click!"*
