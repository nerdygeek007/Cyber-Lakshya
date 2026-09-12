# 🛡️ Cyber Lakshya — Cybersecurity Lead & Systems Architect Technical Report
### Smart India Hackathon 2026 | Problem Statement: CHA-39 (AICTE DCIM & Cybersecurity Command Portal)
**Lead Architect:** Maharshi Trivedi (Cybersecurity Lead & Systems Architect)  
**Collaborators:** Chaitanya Thakar (AI/ML & RBAC), Het Pansara (Database), Siddharthsinh Raulji (Firewalls), Jiya Bhayani (Go Backend), Riddhi Odedra (UI/UX)

---

## 1. Executive Summary & Architectural Vision

This document details the research, technical specifications, execution pipeline, and implementation blueprints for the **"Fortress" System Architecture** of **Cyber Lakshya**. 

As Systems Architect & Cybersecurity Lead, Maharshi's mandate is to:
1. Eliminate flat network vulnerabilities through a multi-layered **"Shell Model"**.
2. Enforce **Zero-Trust default-deny policies** and stateless JWT access control.
3. Deploy **kernel-level eBPF mitigation shields** with synchronous process termination.
4. Architect an **end-to-end telemetry and observability pipeline** spanning terminal CLI/TUI utilities, distributed Go agents, eBPF probes, and real-time WebSocket web streaming.
5. Govern **Load Balancer Management** (L4/L7 HAProxy/Nginx), dynamic traffic distribution algorithms, active circuit breaking, and atomic multi-signature state pipelines.

```
                              [ THE "FORTRESS" SHELL MODEL ]
                                            │
       ┌────────────────────────────────────┼────────────────────────────────────┐
       ▼                                    ▼                                    ▼
1. 🌐 Outer Shell (Ingress)         2. 🔐 Middle Shell (ZTA/IAM)         3. ⚡ Inner Kernel Core (eBPF)
• Go High-Throughput API Gateway   • Stateless RFC 7519 JWT             • LSM Hooks + kprobe `execve`
• Nginx / HAProxy Load Balancer    • `clearance_level` Verification    • In-Kernel Noise Pre-Filter
• Hardware "Flow Mapping" Engine   • Default "PENDING" Zero Access     • Synchronous `SIGKILL` (Sig 9)
• Redis Pub/Sub WebSocket Stream   • Multi-Sig Approval Pipelines       • Real-Time Drift Detection
```

---

## 2. Terminal-Level Observability (CLI / TUI Utilities)

In enterprise data center environments like AICTE, administrators and technicians access individual server nodes directly or via an SSH bastion jump host to monitor system health, socket states, and network perimeters using specialized terminal utilities:

### A. Host & System Resource Monitoring
- **`btop` / `htop`:** Modern, highly visual terminal monitors for per-core CPU utilization, RAM usage, process trees, disk I/O, and baseline system load.
- **`glances`:** Python/C-based terminal dashboard capable of running in client/server mode to monitor multiple remote server nodes over an authenticated socket.

### B. Network Traffic & Socket State Inspection
- **`nethogs`:** Breaks down real-time network bandwidth usage per process and PID, immediately exposing which binary or daemon is saturating network interfaces.
- **`iftop`:** Displays real-time bandwidth consumption per active IP pair and connection stream.
- **`ss -tulpn`:** Inspects all active listening TCP and UDP sockets, connected remote endpoints, and associated process IDs without the overhead of legacy netstat.

### C. Firewall Status & Packet Filtering
- **`ufw status verbose` / `iptables -L -n -v`:** Displays active firewall filter tables, allowed/denied ports, and hit-counters (packets and bytes matched per rule).
- **`tcpdump -i any -nn "not port 22"`:** Raw packet capture utility for inspecting live ingress/egress Ethernet frames while excluding administrative SSH management traffic.

---

## 3. Distributed Telemetry Gathering Across Heterogeneous Nodes

To gather telemetry from variable numbers of servers and firewalls without overloading compute resources, Cyber Lakshya employs a **Hybrid Agent + Telemetry Collector Model**:

```
 [ Monitored Server 1 ]       [ Monitored Server 2 ]       [ Hardware Firewall / Router ]
 ┌─────────────────────┐      ┌─────────────────────┐      ┌────────────────────────────┐
 │ • Custom Go Agent   │      │ • Custom Go Agent   │      │ • Syslog Forwarder (UDP)   │
 │ • eBPF Socket Tracer│      │ • eBPF Socket Tracer│      │ • SNMP / NetFlow Engine    │
 └──────────┬──────────┘      └──────────┬──────────┘      └─────────────┬──────────────┘
            │ (TLS 1.3 / gRPC)           │ (TLS 1.3 / gRPC)              │ (Syslog RFC 5424)
            └────────────────────────────┼───────────────────────────────┘
                                         ▼
                       ┌───────────────────────────────────┐
                       │  Go Central API & Ingestion Engine│
                       │  (Stateless JWT / Default-Deny)   │
                       └─────────────────┬─────────────────┘
                                         │
                    ┌────────────────────┴────────────────────┐
                    ▼                                         ▼
     ┌─────────────────────────────┐           ┌─────────────────────────────┐
     │  PostgreSQL 15/16 (Storage) │           │  Redis (Pub/Sub Cache)      │
     │  - Partitioned Metrics/Logs │           │  - Live State & Fast Feeds  │
     └─────────────────────────────┘           └──────────────┬──────────────┘
                                                              │ (WebSockets / SSE)
                                                              ▼
                                               ┌─────────────────────────────┐
                                               │   Live Command Dashboard    │
                                               │ (Single-Pane Observability) │
                                               └─────────────────────────────┘
```

### A. Host Metrics (Agent-Based Collection)
- **Metrics Collected:** CPU core load, memory saturation, disk I/O latency, network Tx/Rx bytes, packet drop rates, and service uptime.
- **Ingestion Method:** Lightweight background daemon written in Go (or Telegraf/Node Exporter) that polls `/proc/stat`, `/proc/net/dev`, and system cgroups, batching JSON payloads every 1–5 seconds over TLS 1.3.

### B. Network Sockets & Security Events (eBPF Kernel Probes)
- **Metrics Collected:** Process-to-socket bindings, dropped connection attempts, unexpected binary spawns, and unauthorized `execve` syscalls.
- **Ingestion Method:** Custom eBPF programs attached to Linux Security Module (LSM) hooks and kprobes intercepting events at wire-speed with zero user-space context switching overhead.

### C. Firewall Logs & External Appliances (Agentless Ingestion)
- **Metrics Collected:** Dropped packets, rule violations, SYN flood triggers, NAT state tables, and connection rate anomalies.
- **Ingestion Method:** Local firewalls (iptables/nftables) and physical enterprise appliances (Palo Alto, Fortinet, Cisco ASA) stream logs via Syslog (RFC 5424) or SNMP traps to a centralized UDP/TCP ingestion listener.

---

## 4. End-to-End Real-Time Streaming Architecture

To project all gathered metrics onto a responsive web console in real-time without polling lag, the architecture implements 4 distinct processing stages:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ STEP 1: INGESTION & API GATEWAY (Go Microservice)                                      │
│  - Centralized high-throughput HTTP/gRPC endpoint in Go (Fiber / Gin / net/http)       │
│  - Zero-Trust IAM: Every reporting node authenticates via pre-shared key or JWT       │
│  - Default-Deny: Unregistered or unauthorized data sources are dropped at ingress      │
└─────────────────────────────────────────────┬──────────────────────────────────────────┘
                                              │
                                              ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ STEP 2: STORAGE & FAST IN-MEMORY CACHING LAYER                                         │
│  - Persistent Store: PostgreSQL 15/16 with declarative timestamp range partitioning    │
│    (created_at) for sub-millisecond querying across millions of historical log rows    │
│  - Real-Time Buffer: Pushes latest server state deltas into Redis for O(1) retrieval   │
└─────────────────────────────────────────────┬──────────────────────────────────────────┘
                                              │
                                              ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ STEP 3: REAL-TIME WEB PUB/SUB LAYER                                                    │
│  - Eliminates expensive HTTP polling via persistent WebSockets (ws:// / wss://)        │
│  - Go backend publishes ingested server updates to Redis Pub/Sub channels               │
│  - Redis pushes delta frames through WebSocket hubs to active browser sessions         │
└─────────────────────────────────────────────┬──────────────────────────────────────────┘
                                              │
                                              ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ STEP 4: SINGLE-PANE-OF-GLASS WEB VISUALIZATION                                         │
│  - Fleet Overview Grid: Server status cards (Host, IP, OS, Status, Uptime)            │
│  - Live Telemetry Waveforms: Real-time streaming graphs (CPU, RAM, WAN Bandwidth)      │
│  - Interactive Network Topology: Visual flow mapping of server-to-firewall traffic     │
│  - Live Security Audit Stream: Streaming terminal displaying kernel block events       │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Prototype Implementation Checklist

| Subsystem Component | Recommended Production Tooling | Operational Purpose |
| :--- | :--- | :--- |
| **Server Agent** | Lightweight Go Daemon / eBPF | Extracts CPU, memory, socket mappings, and firewall drop logs. |
| **Ingestion Engine** | Go API Gateway (Fiber / Gin) | Authenticates node requests, normalizes data, and routes payloads. |
| **Live Queue / Cache** | Redis Pub/Sub | Distributes real-time telemetry frames with sub-millisecond latency. |
| **Relational Database** | PostgreSQL 15 / 16 | Scalable 3NF relational storage for audit logs, metrics, and inventories. |
| **Streaming Channel** | WebSockets (`gorilla/websocket`) | Delivers bidirectional, zero-latency metric streaming to the browser. |
| **Dashboard UI** | React / Svelte / HTMX + Tailwind | Visualizes server nodes, interactive topology, and live threat telemetry. |

---

## 6. High-Performance Frontend Rendering Alternatives

To preserve low latency and high rendering throughput for high-frequency WebSocket streams without virtual DOM overhead, the architecture supports three alternative frontend paradigms:

1. **Svelte / SvelteKit:** Compiles down to tiny, frameworkless vanilla JavaScript at build time. Updates DOM nodes surgically with near-zero runtime memory overhead, ideal for 60fps streaming telemetry charts.
2. **Go Templates + HTMX + Alpine.js (Hypermedia-Driven):** Unifies the entire technology stack in Go. The backend renders server-side HTML fragments over WebSockets/SSE, eliminating client-side build pipeline complexity.
3. **Vanilla JavaScript + Web Components:** Completely dependency-free. Uses native Custom Elements and WebSockets to bind incoming telemetry directly to canvas/SVG graphing engines (like Chart.js or uPlot).

---

## 7. Load Balancer Management & Dynamic Traffic Distribution

In the CHA-39 mandate, **Load Balancer Management** is explicitly required to eliminate bottlenecks, distribute WAN ingress traffic, and maintain high availability across multi-region clusters:

```
                          [ INGRESS INTERNET TRAFFIC ]
                                       │
                                       ▼
                       ┌───────────────────────────────┐
                       │   High-Availability Layer     │
                       │   (HAProxy / Nginx Ingress)   │
                       └───────────────┬───────────────┘
                                       │
            ┌──────────────────────────┼──────────────────────────┐
            ▼                          ▼                          ▼
 ┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
 │  Server Node 1      │    │  Server Node 2      │    │  Server Node 3      │
 │  (Internal Core)    │    │  (Internal Core)    │    │  (Internal Core)    │
 └─────────────────────┘    └─────────────────────┘    └─────────────────────┘
            ▲                          ▲                          ▲
            └──────────────────────────┼──────────────────────────┘
                                       │ (Health Heartbeats & State Telemetry)
                       ┌───────────────┴───────────────┐
                       │   Central DCIM Go Controller  │
                       │   & Load Balancer Manager     │
                       └───────────────────────────────┘
```

### A. Load Balancing Placement & Layer Modes
- **Layer 4 (L4 / Transport-Level):** Employs HAProxy or Linux IPVS (IP Virtual Server) for raw TCP/UDP stream routing with minimal CPU overhead, forwarding packets without inspecting application payloads.
- **Layer 7 (L7 / Application-Level):** Employs Nginx or HAProxy to inspect HTTP/HTTPS request paths, TLS certificates, and JWT identity headers to route requests to specific service pools.

### B. Dynamic Load Balancing Routing Algorithms
- **Weighted Least Connections (`leastconn`):** Routes traffic to the server handling the fewest active connections, factoring in hardware CPU core and RAM capacity weights.
- **IP Hash / Consistent Hashing:** Keeps client sessions bound to the same backend node while distributing distinct IP addresses evenly.
- **Adaptive / Telemetry-Aware Routing:** The central Go ingestion engine feeds real-time CPU/RAM load metrics into the load balancer configuration to throttle traffic away from degraded nodes before memory or thermal limits trip.

### C. Active Health Checking & Automatic Circuit Breaking
- **TCP / HTTP Health Probes:** The load balancer continuously polls `/healthz` on each server node every 1–2 seconds.
- **Automatic Circuit Breaking:** If an agent reports a kernel panic, eBPF block event, or fails 3 consecutive health checks, the balancer automatically evicts that node from the active upstream pool in under **500 milliseconds** without dropping active client connections.

---

## 8. Revised End-to-End Technology Stack & Task Alignment

| Layer | Technology Choice | Purpose & Architectural Responsibility |
| :--- | :--- | :--- |
| **Backend & Ingestion** | Go (Golang) | API Gateway, WebSocket hub, JWT/RBAC validation, and load balancer coordinator. |
| **Load Balancing** | HAProxy / Nginx | Ingress traffic distribution, L4/L7 routing, and dynamic failover. |
| **Kernel Observability**| eBPF + Go Daemon | Kernel-level process monitoring, bandwidth extraction, and node health reporting. |
| **Database & Cache** | PostgreSQL 15/16 + Redis | Partitioned historical telemetry logs and fast in-memory Pub/Sub for live state. |
| **Frontend Web App** | React / Svelte / HTMX + Tailwind | Lightweight, high-fps telemetry dashboard with interactive topology mapping. |

---

## 9. Phased 4-Week Strategic Execution Roadmap

```
Week 1 (Foundations)      Week 2 (Core Logic)       Week 3 (Concurrency)      Week 4 (Enforcement)
┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│ • Go API Gateway     │  │ • Multi-Sig State M/C│  │ • Full Rule APIs     │  │ • Arm eBPF SIGKILL   │
│ • Shell Boundaries   │  │ • eBPF Tracing Probe │  │ • Lock-free Load Test│  │ • 90-Sec Click-Path  │
│ • UUIDv4 Key Gen     │  │ • Safe Node Testing  │  │ • Latency Profiling  │  │ • End-to-End Demo    │
│ • Stateless JWT IAM  │  │ • JSONB Trigger Hook │  │ • Schema Lock Test   │  │ • Live Mitigation    │
└──────────────────────┘  └──────────────────────┘  └──────────────────────┘  └──────────────────────┘
```

---

## 10. Live 90-Second Demonstration Click-Path (Grand Finale Ready)

1. **Step 1 (0–20s):** Administrator logs in with Zero-Trust credentials on `/login` and views the **3D Multi-Region DC Globe** and top health metrics on `/command-center`.
2. **Step 2 (20–45s):** Simulated threat trigger generates an alert on `SRV-024` (CPU 97% anomaly scored by Isolation Forest) and `FW-018` (unauthorized WAN Port 22 SSH modification).
3. **Step 3 (45–65s):** The administrator reviews the plain-language card (*"What Happened? Why Does It Matter? What Should I Do?"*) and clicks **[Assign Technician]** to dispatch a task.
4. **Step 4 (65–90s):** The **Kernel-Level eBPF Engine** detects the unauthorized shell spawning on `SRV-024` and automatically executes `bpf_send_signal(SIGKILL 9)` in < 1ms, returning the live eBPF console and bandwidth waveform to nominal green baseline!
