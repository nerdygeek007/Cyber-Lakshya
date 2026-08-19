# 🛡️ AICTE Cybersecurity Portal — Comprehensive UI/UX Blueprint & Engineering Specification
### Smart India Hackathon 2026 | Problem Statement: CHA-39
**Team:** Cyber Lakshya  
**UI/UX Lead:** Riddhi Odedra  
**Architecture & Integration:** Chaitanya Thakar, Het Pansara, Siddharthsinh Raulji, Jiya Bhayani, Maharshi Trivedi  

---

## 1. Executive Summary & Purpose

This document provides the definitive architectural blueprint, information architecture, design tokens, component specifications, and user experience flows for the **AICTE Cybersecurity Portal** frontend prototype.

The portal provides centralized visibility, monitoring, Zero-Trust security governance, and automated operational management across the All India Council for Technical Education's multi-region data center infrastructure.

```
                              [ AICTE COMMAND ECOSYSTEM ]
                                           │
         ┌─────────────────────────────────┼─────────────────────────────────┐
         ▼                                 ▼                                 ▼
1. 🏢 Executive Non-Tech Cockpit   2. 🔧 Technician Workbay         3. 🛡️ SOC Security Sandbox
• Plain-Language Translations       • 42U Physical Server Rack       • 360° Threat Radar Scanner
• 1-Click Task Dispatches           • eBPF Kernel Traces             • Interactive Packet Tester
• 3D Multi-Region DC Globe          • Top Active Process Tables      • Drift Detection Baselines
```

---

## 2. Core UX Principle: Plain-Language Translation Engine

A fundamental challenge of enterprise data center infrastructure management is that **decision-making administrators are often non-technical officials**, while technicians, security analysts, and auditors require deep forensic telemetry.

To bridge this gap, every alert, incident, and system anomaly across the portal is translated into **4 Plain-Language Actionable Questions**:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               PLAIN-LANGUAGE TRANSLATION                               │
├──────────────────────────┬─────────────────────────────────────────────────────────────┤
│ 1. WHAT HAPPENED?        │ Plain-English explanation of the event with zero jargon.    │
│                          │ e.g. "Server SRV-024 is experiencing high resource load."   │
├──────────────────────────┼─────────────────────────────────────────────────────────────┤
│ 2. WHY DOES IT MATTER?   │ Direct real-world operational & academic impact.            │
│                          │ e.g. "Applications & student portals may become slow/down." │
├──────────────────────────┼─────────────────────────────────────────────────────────────┤
│ 3. WHAT SHOULD I DO?     │ Clear, prioritized administrative recommendation.           │
│                          │ e.g. "Assign issue to Infrastructure Team to rebalance."    │
├──────────────────────────┼─────────────────────────────────────────────────────────────┤
│ 4. WHO SHOULD HANDLE IT? │ Immediate action button dispatching tasks to technicians.   │
│                          │ [Assign Technician] / [Assign Security Team]                │
├──────────────────────────┴─────────────────────────────────────────────────────────────┤
│                                 TECHNICAL EXPANSION                                    │
│ [View Technical Details] ──▶ Expands CPU/RAM PID tables, eBPF logs, & hardware specs  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Design System & Dark Glassmorphism Tokens

The UI follows a **Defense-Grade Dark Glassmorphism** design system engineered for high legibility, professional government authority, and modern visual depth.

### 3.1 Color Palette Tokens

| Semantic Role | Hex Code | Tailwind Token | Applied Usage |
| :--- | :--- | :--- | :--- |
| **Primary Background** | `#020617` / `#030712` | `bg-slate-950` | Full-screen viewport & matrix canvas |
| **Surface Glass** | `rgba(15, 23, 42, 0.75)` | `glass-panel` | Translucent cards & metric containers |
| **Glow Glass** | `rgba(15, 23, 42, 0.90)` | `glass-panel-glow`| Active modals, drawers, and focused HUDs |
| **Primary Accent** | `#00f2fe` / `#38bdf8` | `text-cyan-400` | Highlights, active navigation, 3D arcs |
| **Secondary Accent** | `#6366f1` / `#818cf8` | `text-indigo-400` | Roles, network nodes, load balancers |
| **Status: Healthy** | `#10b981` | `text-emerald-400` | Operational nodes, 99.98% uptime, resolved |
| **Status: Warning** | `#f59e0b` | `text-amber-400` | High load, 8-day license expiry, review |
| **Status: Critical** | `#f43f5e` | `text-rose-400` | SRV-024 97% CPU, WAN SSH rule, attack |
| **Status: Info** | `#38bdf8` | `text-sky-400` | Automation tasks, CMDB sync, in-progress |

### 3.2 Typography & Glass Principles
- **Headings & Body:** *Plus Jakarta Sans* / *Inter* with strict tracking and line-height hierarchy.
- **Data & Telemetry:** *JetBrains Mono* for IP addresses, timestamps, CPU metrics, and rule IDs.
- **Glassmorphism Rule:** Glass is reserved for structural cards, sidebars, and modals with backdrop-blur (`20px`). Tables and form inputs maintain solid contrasting backgrounds for maximum accessibility and readability.

---

## 4. Reusable Component Architecture

To guarantee unified consistency, the portal is constructed from 18 reusable components:

```
aicte-cybersecurity-portal/src/components/
├── common/
│   ├── GlassCard.tsx            # Specular border translucent card with hover elevation
│   ├── StatCard.tsx             # Metric card with icon, status glow, and percentage trend
│   ├── StatusBadge.tsx          # Accessible color-coded status pill with text labels
│   ├── DataTable.tsx            # Sortable, responsive table with customizable accessors
│   ├── SearchBar.tsx            # Real-time search filter with search icon & clear button
│   ├── FilterBar.tsx            # Interactive category pill switchers
│   ├── Tabs.tsx                 # Tab navigation with animated active underline & badge counts
│   ├── Modal.tsx                # Glassmorphic modal dialog with backdrop dismissal
│   ├── Drawer.tsx               # Slide-out right inspection drawer with smooth transitions
│   ├── PageHeader.tsx           # Standard page title, subtitle, and breadcrumb header
│   ├── Button.tsx               # Primary, secondary, outline, and danger button states
│   ├── EmptyState.tsx           # Clean empty placeholder with iconography
│   ├── LoadingState.tsx         # Telemetry loading indicator with pulse animation
│   ├── ConfirmationDialog.tsx   # Action confirmation modal for destructive tasks
│   └── ActivityTimeline.tsx     # Chronological audit & activity feed with type icons
│
├── layout/
│   ├── Sidebar.tsx              # Collapsible navigation with live Data Center indicators
│   ├── Topbar.tsx               # Breadcrumbs, Global Search shortcut, Notifications bell
│   ├── AppLayout.tsx            # Master layout wrapper managing drawer & modal states
│   ├── GlobalSearchModal.tsx    # Ctrl+K global search across servers, firewalls, and users
│   └── AssignTaskModal.tsx      # Technician dispatch workflow modal
│
└── cyber/ (Three.js 3D WebGL & Advanced Telemetry)
    ├── ThreeDataCenterGlobe.tsx # 3D WebGL Multi-Region DC Hologram Globe with sync arcs
    ├── ThreeServerRackHolo.tsx  # 3D 42U Server Rack Model with heat particle streams
    ├── ThreeCyberDefenseShield.tsx # 3D Rotating AICTE Defense Crystal & Torus Rings
    ├── LiveBandwidthWaveform.tsx # Real-time spline oscilloscope showing live WAN Mbps
    ├── ComputeHoneycombGrid.tsx # 24-Node Compute Cluster Matrix with LED status beacons
    ├── RadarThreatScanner.tsx   # 360° Rotating Perimeter Radar Threat Scanner
    └── LiveSecurityTerminal.tsx # Live streaming eBPF network packet & Casbin audit terminal
```

---

## 5. Route-by-Route Deep Specification

```
                                  [ PORTAL ROUTE MAP ]
                                            │
       ┌──────────────┬──────────────┬──────┴───────┬──────────────┬──────────────┐
       ▼              ▼              ▼              ▼              ▼              ▼
1. /login      2. /command-   3. /infra-     4. /security-  5. /access-    6. /integration-
   (SSO Gate)     center         structure      center         compliance     automation
                  (3D Globe)     (42U Rack)     (360° Radar)   (RBAC Matrix)  (Workflows)
                                                                                  │
                                                            ┌─────────────────────┴───────────┐
                                                            ▼                                 ▼
                                                     7. /reports-analytics              8. /settings
                                                        (PDF/CSV Exports)                  (Governance)
```

---

### Page 1: Login Gateway (`/login`)
* **Layout:** Two-column split layout.
* **Left Column:**
  - AICTE emblem, official government title, and tagline: *"Secure Infrastructure. Centralized Control."*
  - Interactive **Three.js 3D Cyber Defense Shield** rotating with multi-axis torus rings and specular highlights.
  - 3 Core capability pillars: Full DCIM Observability, Zero-Trust Firewalls, and Automated ITSM Workflows.
* **Right Column:**
  - Glass sign-in card with User ID, password toggle, Remember Me, and FIPS 140-3 cryptography badge.
  - **1-Click Hackathon Demo Role Logins:** Instant switchers for *Admin (Aarav)*, *SecOps (Riya)*, and *Technician (Vikram)*.
  - Simulated authentication with loading spinner and smooth redirect to `/command-center`.

---

### Page 2: Command Center (`/command-center`)
* **Purpose:** Holistic operational cockpit answering: *"What is happening? Is anything dangerous? What should I do?"*
* **Key Sections:**
  1. **Top Defense Cockpit Banner:** Live DEFCON status dial with interactive **"Simulate SYN Flood Attack"** and **"Revert Baseline"** simulation triggers.
  2. **Three.js 3D Multi-Region DC Globe:** Interactive WebGL globe displaying New Delhi (DC A) and Bengaluru (DC B) connected by live telemetry sync arcs.
  3. **6 Top Statistic Cards:** Infrastructure Health (96.4%), Security Score (87/100), Systems Online (124/128), Active Alerts (8), Critical Issues (2), Active Incidents (3).
  4. **Live Bandwidth Waveform:** Real-time spline oscilloscope showing live WAN ingress/egress Mbps.
  5. **24-Node Compute Cluster Matrix:** Honeycomb blade grid with live status beacons (SRV-024 pulsing critical red).
  6. **Infrastructure Pipeline Preview:** Clickable multi-tier topology (Internet $\rightarrow$ FW $\rightarrow$ Router $\rightarrow$ Switch $\rightarrow$ LB $\rightarrow$ Servers).
  7. **Environmental Sensor Monitoring:** Physical ambient rack temperature, humidity, and power for DC A (22°C / 48%) and DC B (28°C / 67% Warning).
  8. **Requires Attention Cards (Non-Tech Translation):** Plain-language breakdown of SRV-024, FW-018, and VMware license with `[Assign]` and `[Investigate]` buttons.
  9. **Recommended Actions ("What Should I Do?"):** Prioritized guidance list for administrators.
  10. **Live Activity Feed & eBPF Security Terminal:** Streaming log ticker displaying real-time Casbin RBAC evaluations and anomaly detections.

---

### Page 3: Infrastructure Manager (`/infrastructure`)
* **Tabs:** `[ Servers & 3D Racks ]`, `[ Network & Firewalls ]`, `[ Load Balancers ]`, `[ Hardware Assets ]`.
* **Servers Tab:**
  - Dual View Toggle: **3D WebGL Server Model (Three.js 42U Holo-Rack)** vs **Table View**.
  - Server metrics table (Host Tag, IP, Location, Status, CPU bar, RAM bar, Actions).
  - **Server Detail Drawer:** Non-technical summary + expandable technical details (Processes PID table, hardware specifications, kernel specs, assigned technician).
* **Network Tab:**
  - Sub-Tabs: `[ Topology View ]` (Visual multi-tier diagram with pulsing wire animations) and `[ List View ]` (118 devices: Firewalls, Routers, Switches, Gateways).
* **Load Balancers Tab:**
  - Cluster table (LB-001, 18,240 req/min, 1,240 connections, 4 backend nodes, 98% health index) with backend pool inspection drawer.
* **Assets Tab (Hardware Inventory):**
  - Summary counters: 324 Total Assets (124 Servers, 118 Network Devices, 38 Firewalls, 44 Load Balancers).
  - Filterable inventory table with Warranty Status and Last Maintenance records.

---

### Page 4: Security Operations Center (`/security-center`)
* **Tabs:** `[ Security Overview & Radar ]`, `[ Firewalls & Policies ]`, `[ Interactive Packet Tester ]`, `[ Active Alerts ]`, `[ Incidents ]`, `[ Audit Logs ]`.
* **Security Overview:**
  - **360° Rotating Perimeter Radar Threat Scanner** with targeted threat blips and DEFCON indicators.
  - Threat vector distribution bars (WAN Port Scans 64%, SSH Brute Force 22%, Anomaly Bursts 14%).
* **Firewalls Tab:**
  - Table of active firewalls (FW-001, FW-018) with active rule counts.
  - **Firewall Rules Drawer:** Normalized rule table (`R-101`, `R-102`, `R-103`, `R-199`) + Plain-Language Security Policy Advisory on WAN Port 22 + `[Request Peer Review]` button.
* **Interactive Packet Tester Tab:**
  - Live sandbox where admins input Source IP, Destination Port, and Protocol to simulate whether edge firewalls will `ALLOW` or `DENY` the packet with matched rule explanations.
* **Active Alerts Tab:**
  - Severity filters (`All`, `Critical`, `High`, `Medium`, `Resolved`) with detailed forensic investigation drawers.
* **Incidents & Audit Logs Tabs:**
  - Incident triage cards (`INC-1042`, `INC-1041`) and immutable audit logs with SHA-256 state tracking.

---

### Page 5: Access, Licensing & Compliance (`/access-compliance`)
* **Tabs:** `[ Users & Roles (RBAC) ]`, `[ Software Licenses ]`, `[ Compliance & Governance ]`.
* **Users & Roles Tab:**
  - Summary: 42 Users, 38 Active, 4 Pending, 5 Defined Roles.
  - User table with role badges and department mappings.
  - **Permission Matrix Modal:** Interactive 5x7 matrix comparing permissions across *Admin*, *Technician*, *Security Analyst*, *Auditor*, and *Viewer*.
* **Software Licenses Tab:**
  - Summary: 248 Total Licenses, 221 Active, 12 Expiring Soon, 3 Expired.
  - License seat & core utilization meters (Windows Server 92%, VMware 100% Full, PostgreSQL 90%, Adobe 76%).
  - Table with countdown timers (`Expires in 8 days`) and `[Start Renewal]` requisitions.
* **Compliance Tab:**
  - Overall Compliance Score: **92% (18/20 Controls Met)**.
  - Category status cards (Access Control, Audit Logging, Firewall Policy, License Compliance, Patch Management).
  - Recommended compliance remediation actions and chronological compliance activity timeline.

---

### Page 6: Integration & Automation (`/integration-automation`)
* **Tabs:** `[ Connected Systems ]`, `[ Automation Workflows ]`, `[ Enterprise APIs ]`, `[ Automation Logs ]`.
* **Connected Systems Tab:**
  - Status cards for Ticketing System, CMDB, ITSM Platform, and Monitoring System with last sync timestamps and data types.
* **Automation Workflows Tab:**
  - Interactive cards for *Server Failure Response*, *Firewall Change Detection*, and *License Expiry Workflow* with interactive **Enable/Disable toggle switches** and multi-step action flows.
* **APIs Tab:**
  - REST API endpoint cards with interactive **"View Documentation" modal** displaying HTTP endpoints, headers, and sample JSON payloads.
* **Automation Logs Tab:**
  - Chronological execution feed of automated incident dispatches.

---

### Page 7: Reports & Telemetry Analytics (`/reports-analytics`)
* **Tabs:** `[ Executive Overview ]`, `[ Infrastructure Analytics ]`, `[ Security Analytics ]`, `[ Exportable Reports ]`.
* **Overview & Analytics:**
  - Trend charts for Infrastructure Availability (99.94%), CPU load distributions, and WAN bandwidth throughput.
* **Exportable Reports Tab:**
  - 6 Standard Report Cards: *Monthly Infrastructure Report*, *SOC Security Incident Report*, *License Compliance Audit*, *Hardware Inventory Report*, *Zero-Trust Audit Log*, and *Thermal Efficiency Report*.
  - Interactive `[Preview Report]` modal and simulated **`[Export PDF]`** / **`[Export CSV]`** download triggers.

---

### Page 8: System Settings & Governance (`/settings`)
* **Tabs:** `[ General ]`, `[ Notifications ]`, `[ Security & Auth ]`, `[ System Information ]`.
* **Features:**
  - Portal name, IST time zone, email/SMS notification channel toggles, session timeout policies, MFA enforcement status, and environment runtime metadata.

---

## 6. Global Features & Overlays

1. **Global Search Modal (`Ctrl + K` / `Cmd + K`):**
   - Instant search across all servers (`SRV-024`), firewalls (`FW-018`), software licenses, users, alerts, and incidents with 1-click navigation.
2. **Technician Task Dispatch Modal (`AssignTaskModal`):**
   - One-click task assignment modal pre-filling target entity and issue description, allowing dispatch to Infrastructure, Security, or Compliance teams with priority tags.
3. **Notification Bell Dropdown:**
   - Sticky header notification dropdown with unread badges, filter-by-read status, and direct-route click-through links.

---

## 7. How to Run and Test the Prototype

The frontend application is completely built and tested in the project workspace:

```bash
cd "/media/chaitaniya/D Drive/SIH-2026/aicte-cybersecurity-portal"
./start_portal.sh
# Or run: npm run dev
```

🌐 **Local URL:** `http://localhost:3000`  
🧪 **Build Verification:** `npm run build` completed with **0 errors**.

---

## 8. Summary of Alignment with Team Deliverables

| Teammate | Focus Area | How the UI Directly Showcases Their Work |
| :--- | :--- | :--- |
| **Riddhi Odedra** | Frontend & UI/UX | 8 connected routes, Dark Glassmorphism, 18 reusable components, responsive layout. |
| **Chaitaniya Thakar** | AI/ML & RBAC | 24-node cluster matrix, live eBPF console, 5-tier Casbin Permission Matrix, attack simulation. |
| **Het Pansara** | Database & Data Eng. | DCIM asset tables, monitoring metrics, 3NF software license allocation, audit log views. |
| **Siddharthsinh Raulji** | Firewall Modernization | Normalized rules table, WAN Port 22 advisory, 360° radar, interactive packet sandbox. |
| **Jiya Bhayani** | Go API & Integration | Connected systems (ITSM/CMDB), interactive workflow triggers, API documentation modals. |
| **Maharshi Trivedi** | Security Architecture | NIST SP 800-53 compliance gauges, FIPS 140-3 cryptography badges, tamper-evident audit trails. |
