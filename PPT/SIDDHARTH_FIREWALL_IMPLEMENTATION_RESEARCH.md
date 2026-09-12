# 🛡️ CHA-39: Firewall Implementation – Research & Proposed Approach
### Smart India Hackathon 2026 | Problem Statement: CHA-39 (Cybersecurity Portal for Servers & Firewalls)
**Prepared by:** Siddharthsinh Raulji | Cybersecurity Researcher & Firewall Lead  
**Team:** Cyber Lakshya  

---

## 1. Executive Summary & Research Scope

I researched how the firewall management component of **CHA-39** can be implemented in a practical, enterprise-grade, and non-intrusive manner. 

Based on AICTE's operational requirements, **the core strategy is NOT to abruptly replace or rip-and-replace existing physical firewalls**. Instead, the system first ingests the existing legacy firewall configuration into **SECUREDGE**, normalizes and validates the rules against national and international cybersecurity standards, and manages all subsequent approved policy changes through the centralized portal with real-time drift detection.

---

## 2. Proposed Implementation Lifecycle

The complete firewall management lifecycle follows a controlled, 8-stage operational pipeline:

$$\text{Existing Firewall} \xrightarrow{\text{1. Import}} \text{2. Normalize} \xrightarrow{\text{3. Validate}} \text{4. Compliance} \xrightarrow{\text{5. Approve}} \text{6. Deploy} \xrightarrow{\text{7. Verify}} \text{8. Monitor}$$

```
┌──────────────────┐
│ Existing Firewall│ (Palo Alto / Fortinet / Cisco ASA / iptables)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 1. IMPORT        │ ──▶ Read-only configuration ingestion via Vendor API / SSH
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 2. NORMALIZE     │ ──▶ Map to common SECUREDGE schema (Src, Dst, Proto, Port, Action)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 3. VALIDATE      │ ──▶ Automated checks for broad access, shadow rules, & conflicts
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 4. COMPLIANCE    │ ──▶ Compare against NIST SP 800-53, CIS Control 12, & Indian guidelines
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 5. APPROVE       │ ──▶ Zero-Trust RBAC & multi-signature administrative sign-off
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 6. DEPLOY        │ ──▶ Push approved changes via Ansible playbooks / vendor connector
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 7. VERIFY        │ ──▶ Synthetic packet validation & connectivity verification
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 8. MONITOR       │ ──▶ Real-time configuration drift detection against approved baseline
└──────────────────┘
```

---

## 3. Step-by-Step Technical Execution

1. **Get the Existing Configuration:** Connect securely to the physical or virtual firewall using supported vendor APIs, SSH, or management interfaces to retrieve the active running configuration without altering live traffic.
2. **Import into SECUREDGE:** Ingest active rule sets into the portal's staging environment in a non-disruptive, read-only mode.
3. **Normalize the Rules:** Translate proprietary vendor syntax into the unified SECUREDGE data structure:
   - `Source CIDR / IP`
   - `Destination CIDR / IP`
   - `Protocol` (TCP, UDP, ICMP)
   - `Port / Port Range`
   - `Action` (`ALLOW`, `DENY`, `DROP`, `REJECT`)
   - `Priority / Sequence Number`
4. **Validate the Rules:** Execute automated static analysis to detect:
   - Overly broad access (e.g. `0.0.0.0/0` accessing administrative ports like SSH 22, RDP 3389).
   - Duplicate rules and redundant shadows.
   - Conflicting rules across multi-tier appliances.
5. **Compliance Checks:** Cross-reference rule bases against **NIST SP 800-53 Rev 5.1**, **CIS Controls v8.1 (Control 12)**, and CERT-In / Indian government cybersecurity directives.
6. **RBAC-Based Approval:** Route all high-impact policy alterations through the Zero-Trust approval workflow, requiring administrative and SecOps multi-party authorization.
7. **Controlled Deployment:** Use Ansible automation playbooks and vendor connectors to apply only verified, cryptographically signed changes.
8. **Verification:** Execute synthetic packet traversal checks to verify expected business traffic flows while blocking prohibited vectors.
9. **Continuous Baseline Monitoring & Drift Detection:** Periodically compare the live running appliance configuration with the approved PostgreSQL baseline. Instantly alert the SOC if an unauthorized manual change or policy drift is detected.

---

## 4. System Architecture & Component Flow

```
                      [ Admin / SOC Web Dashboard ]
                                    │
                                    ▼
                      [ Backend API + RBAC Gate ]
                                    │
                                    ▼
                      [ Firewall Management Module ]
                                    │
                                    ▼
                  [ Firewall Connector / Automation Layer ]
                                    │
                                    ▼
                       [ Physical / Legacy Firewall ]
                                    │
       ┌────────────────────────────┴────────────────────────────┐
       ▼                                                         ▼
[ Live Configuration State ]                             [ Logs & Telemetry ]
       │                                                         │
       ▼                                                         ▼
[ Compliance & Drift Detection ]                         [ Alerts & Incidents ]
       │                                                         │
       └────────────────────────────┬────────────────────────────┘
                                    ▼
                        [ Central Admin Dashboard ]
```

- **Frontend:** Displays active firewall status, rule lists, security findings, visual topology, and real-time alerts.
- **Backend:** Manages normalized rule databases, approval pipelines, configuration baseline state hashes, and immutable audit logs.
- **Connector Layer:** Communicates with physical hardware (Palo Alto PAN-OS, Fortinet FortiOS, Cisco ASA, Linux iptables/nftables) based on target data center specifications.

---

## 5. SECUREDGE Normalized Firewall Rule Schema

| Field | Example Value | Operational Purpose |
| :--- | :--- | :--- |
| **Source** | `10.10.10.0/24` | Defines the originating network, subnet, or external IP range. |
| **Destination** | `10.20.20.10` | Specifies target server, internal service, or load balancer IP. |
| **Protocol / Port**| `TCP / 443` | Identifies allowed communication channel (e.g. HTTPS, DNS, SSH). |
| **Action** | `ALLOW` | Enforces explicit traffic decision (`ALLOW`, `DENY`, `DROP`). |
| **Reason** | `HTTPS application access` | Plain-language business justification for why the rule exists. |
| **Status** | `Approved` | Lifecycle state (`Draft`, `Pending Approval`, `Approved`, `Active`). |

---

## 6. Core Security Principles Applied

1. **Default-Deny:** Block all ingress and egress network traffic by default unless an explicit, authorized rule exists.
2. **Principle of Least Privilege:** Restrict network traffic strictly to necessary sources, destinations, protocols, and ports.
3. **Multi-Tier Authorization:** High-impact rule changes (especially WAN exposures) must receive secondary cryptographic sign-off before hardware deployment.
4. **Immutable Audit Logging:** Every rule creation, modification, approval, and deployment is recorded with actor ID, timestamp, and SHA-256 state hash.
5. **Configuration Baseline:** The approved state is stored in PostgreSQL as the single golden source of truth.
6. **Configuration Drift Detection:** Active polling detects any out-of-band manual configuration changes on the physical device, flagging them immediately.

---

## 7. Open-Source Projects & Research References

| Project | Key Concepts & Value for SECUREDGE | Repository Reference |
| :--- | :--- | :--- |
| **NetBox** | Centralized network infrastructure source of truth, IPAM, and device inventory management. | [github.com/netbox-community/netbox](https://github.com/netbox-community/netbox) |
| **Ansible** | Declarative automation engine for deploying approved firewall configurations across heterogeneous hardware. | [github.com/ansible/ansible](https://github.com/ansible/ansible) |
| **Batfish** | Network configuration analysis tool that validates routing and security policies via Abstract Syntax Trees (AST) before deployment. | [github.com/batfish/batfish](https://github.com/batfish/batfish) |

---

## 8. Prioritized Implementation Recommendations

1. **Firewall Inventory & Connection Registry:** Maintain connection credentials, management IPs, and device types.
2. **Unified Rule Normalization Schema:** Standardize multi-vendor rule representations.
3. **Read-Only Configuration Ingestion:** Ingest running configurations safely without impacting live operations.
4. **Automated Security Policy Validation:** Identify dangerous rules (e.g., WAN Port 22 SSH, redundant rules) automatically.
5. **RBAC Multi-Party Approval Workflow:** Enforce strict sign-offs before applying configuration changes.
6. **Controlled Connector Automation:** Deploy verified rules through automated playbooks.
7. **Configuration Baseline & Drift Detection Engine:** Continuous comparison between running state and database baseline.
8. **Audit Trail & SOC Dashboard Integration:** Provide real-time operational visibility and forensic traceability.

---

## 9. Current Assumptions & Target Environment Adaptability

The project documentation highlights legacy firewall mapping as a primary concern without binding the architecture to a single proprietary vendor. 

Therefore, **SECUREDGE provides a modular, vendor-agnostic architecture**. The connector layer can interface seamlessly with:
- **Palo Alto Networks** (XML/REST API)
- **Fortinet FortiGate** (FortiOS REST API)
- **Cisco ASA / Firepower** (REST / SSH CLI)
- **Linux Netfilter** (iptables / nftables / eBPF)

---

## 10. Formal Research Standards & Citations

- **NIST SP 800-207:** *Zero Trust Architecture* — [csrc.nist.gov/pubs/sp/800/207/final](https://csrc.nist.gov/pubs/sp/800/207/final)
- **NIST SP 800-53 Rev 5.1:** *Security and Privacy Controls for Information Systems and Organizations* — [csrc.nist.gov/pubs/sp/800/53/r5/upd1/final](https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final)
- **CIS Controls v8.1:** *Center for Internet Security Critical Security Controls* — [cisecurity.org/controls/v8-1](https://www.cisecurity.org/controls/v8-1)
- **CIS Control 12:** *Network Infrastructure Management* — [cisecurity.org/controls/network-infrastructure-management](https://www.cisecurity.org/controls/network-infrastructure-management)
- **Batfish Network Modeling:** [github.com/batfish/batfish](https://github.com/batfish/batfish)
- **Ansible Automation Engine:** [github.com/ansible/ansible](https://github.com/ansible/ansible)
- **NetBox Infrastructure SSOT:** [github.com/netbox-community/netbox](https://github.com/netbox-community/netbox)

---

## 11. Conclusion

The safest, most practical, and enterprise-viable path for AICTE is to **retain existing firewall infrastructure as the operational foundation**, ingest configurations into **SECUREDGE**, validate and normalize them against NIST/CIS benchmarks, govern updates through Zero-Trust multi-signature approvals, and continuously alert on configuration drift.
