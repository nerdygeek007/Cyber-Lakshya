import { 
  ServerItem, NetworkDeviceItem, FirewallRule, LoadBalancerItem, AssetItem, 
  AlertItem, IncidentItem, AuditLogItem, UserItem, SoftwareLicenseItem, 
  ComplianceControlItem, ConnectedSystemItem, WorkflowItem, APIItem, NotificationItem 
} from '../types';

export const mockStats = {
  infrastructureHealth: 96.4,
  securityScore: 87,
  systemsOnline: "124 / 128",
  activeAlertsCount: 8,
  criticalIssuesCount: 2,
  activeIncidentsCount: 3,
  resolvedTodayCount: 18,
  environmentalData: [
    { dc: "Data Center A (New Delhi)", temp: 22, humidity: 48, status: "Normal", pwrKwh: 342 },
    { dc: "Data Center B (Bengaluru)", temp: 28, humidity: 67, status: "Warning", pwrKwh: 418 }
  ]
};

export const mockServers: ServerItem[] = [
  {
    id: "SRV-024",
    name: "AICTE-PROD-SRV-024",
    ip: "10.10.1.24",
    location: "Data Center A",
    status: "Critical",
    cpu: 97,
    ram: 89,
    disk: 74,
    network: "840 Mbps",
    os: "Ubuntu 24.04 LTS Enterprise",
    lastMaintenance: "2026-07-20",
    assignedTechnician: "Vikram Patel",
    assignedTeam: "Infrastructure Team",
    whatHappened: "Server SRV-024 is experiencing unusually high CPU and RAM resource saturation.",
    impact: "Applications and student admission portals hosted on this node may become slow or unavailable.",
    recommendedAction: "Assign this issue to the Infrastructure Team to re-balance cluster workload.",
    specs: { cpuModel: "AMD EPYC 7763 64-Core", cores: 64, totalRamGb: 256, storageTb: 8.0 },
    processes: [
      { pid: 14209, name: "docker-containerd", cpu: 48.2, memory: 34.1, user: "root" },
      { pid: 14882, name: "telemetry-collector", cpu: 36.4, memory: 28.5, user: "app_service" },
      { pid: 1102, name: "postgres_worker", cpu: 11.2, memory: 22.0, user: "postgres" }
    ]
  },
  {
    id: "SRV-031",
    name: "AICTE-CORE-SRV-031",
    ip: "10.10.1.31",
    location: "Data Center B",
    status: "Warning",
    cpu: 78,
    ram: 82,
    disk: 88,
    network: "410 Mbps",
    os: "RHEL 9.4 Enterprise",
    lastMaintenance: "2026-06-15",
    assignedTechnician: "Rahul Joshi",
    assignedTeam: "Infrastructure Team",
    whatHappened: "Disk storage volume reached 88% threshold with steady log accumulation.",
    impact: "Automated snapshot generation may stall if free disk space drops below 10%.",
    recommendedAction: "Rotate archived system logs to long-term cold storage.",
    specs: { cpuModel: "Intel Xeon Platinum 8380", cores: 40, totalRamGb: 128, storageTb: 4.0 },
    processes: [
      { pid: 8841, name: "logstash-forwarder", cpu: 32.1, memory: 40.2, user: "logging" },
      { pid: 9021, name: "systemd-journald", cpu: 22.4, memory: 18.0, user: "root" }
    ]
  },
  {
    id: "SRV-001",
    name: "AICTE-GATEWAY-SRV-001",
    ip: "10.10.1.12",
    location: "Data Center A",
    status: "Online",
    cpu: 42,
    ram: 61,
    disk: 52,
    network: "220 Mbps",
    os: "Ubuntu 24.04 LTS",
    lastMaintenance: "2026-08-01",
    assignedTechnician: "Aarav Mehta",
    assignedTeam: "Infrastructure Team",
    whatHappened: "Server operating within nominal parameters.",
    impact: "No negative operational impact.",
    recommendedAction: "Continue standard monitoring schedule.",
    specs: { cpuModel: "AMD EPYC 7543 32-Core", cores: 32, totalRamGb: 128, storageTb: 4.0 },
    processes: [
      { pid: 4091, name: "nginx", cpu: 18.2, memory: 22.0, user: "www-data" },
      { pid: 4120, name: "fastapi-gateway", cpu: 14.1, memory: 28.0, user: "aicte_user" }
    ]
  },
  {
    id: "SRV-005",
    name: "AICTE-AUTH-SRV-005",
    ip: "10.10.1.15",
    location: "Data Center A",
    status: "Online",
    cpu: 31,
    ram: 45,
    disk: 38,
    network: "140 Mbps",
    os: "Ubuntu 22.04 LTS",
    lastMaintenance: "2026-07-28",
    assignedTechnician: "Riya Shah",
    assignedTeam: "Identity & RBAC Team",
    whatHappened: "Zero-Trust authorization engine running smoothly.",
    impact: "Sub-millisecond token evaluations across all portal requests.",
    recommendedAction: "Maintain scheduled policy audits.",
    specs: { cpuModel: "Intel Xeon Silver 4314", cores: 16, totalRamGb: 64, storageTb: 2.0 }
  }
];

export const mockNetworkDevices: NetworkDeviceItem[] = [
  {
    id: "FW-018",
    name: "AICTE-EDGE-FW-018",
    type: "Firewall",
    ip: "10.10.0.18",
    location: "Data Center B",
    status: "Warning",
    lastChecked: "2 min ago",
    firmware: "FortiOS 7.4.3",
    managementPort: 443
  },
  {
    id: "FW-001",
    name: "AICTE-PERIMETER-FW-001",
    type: "Firewall",
    ip: "10.10.0.1",
    location: "Data Center A",
    status: "Healthy",
    lastChecked: "1 min ago",
    firmware: "Palo Alto PAN-OS 11.1",
    managementPort: 443
  },
  {
    id: "RTR-001",
    name: "AICTE-CORE-ROUTER-01",
    type: "Router",
    ip: "10.10.0.254",
    location: "Data Center A",
    status: "Healthy",
    lastChecked: "Just now",
    firmware: "Cisco IOS-XR 7.9",
    managementPort: 22
  },
  {
    id: "SW-001",
    name: "AICTE-DIST-SWITCH-01",
    type: "Switch",
    ip: "10.10.3.1",
    location: "Data Center A",
    status: "Healthy",
    lastChecked: "3 min ago",
    firmware: "Cisco IOS-XE 17.12",
    managementPort: 443
  }
];

export const mockFirewallRules: FirewallRule[] = [
  {
    id: "R-102",
    source: "0.0.0.0/0",
    destination: "10.10.1.24",
    port: "22",
    protocol: "TCP",
    action: "Allow",
    status: "Warning",
    lastModified: "Today at 10:42 PM",
    securityExplanation: "This rule allows external WAN traffic to server management port 22. A security review is recommended to restrict source to internal bastion jump host."
  },
  {
    id: "R-101",
    source: "0.0.0.0/0",
    destination: "10.10.0.1",
    port: "443",
    protocol: "TCP",
    action: "Allow",
    status: "Healthy",
    lastModified: "2026-08-01",
    securityExplanation: "Standard HTTPS public gateway traffic rule."
  },
  {
    id: "R-108",
    source: "192.168.10.0/24",
    destination: "10.10.1.0/24",
    port: "5432",
    protocol: "TCP",
    action: "Allow",
    status: "Healthy",
    lastModified: "2026-08-10",
    securityExplanation: "Internal app subnet to PostgreSQL database cluster communication."
  },
  {
    id: "R-199",
    source: "198.51.100.0/24",
    destination: "ANY",
    port: "ANY",
    protocol: "ALL",
    action: "Deny",
    status: "Healthy",
    lastModified: "2026-08-14",
    securityExplanation: "Known malicious CIDR blacklist range drop rule."
  }
];

export const mockLoadBalancers: LoadBalancerItem[] = [
  {
    id: "LB-001",
    name: "AICTE-PORTAL-LB-001",
    status: "Healthy",
    traffic: "18,240 req/min",
    connections: 1240,
    backendServersCount: 4,
    health: 98,
    algorithm: "Weighted Least Connections",
    backends: [
      { name: "SRV-001", ip: "10.10.1.12", status: "Healthy", weight: 30, latency: "4.2 ms" },
      { name: "SRV-002", ip: "10.10.1.13", status: "Healthy", weight: 30, latency: "4.8 ms" },
      { name: "SRV-024", ip: "10.10.1.24", status: "Warning", weight: 20, latency: "48.6 ms" },
      { name: "SRV-025", ip: "10.10.1.25", status: "Healthy", weight: 20, latency: "5.1 ms" }
    ]
  },
  {
    id: "LB-002",
    name: "AICTE-API-LB-002",
    status: "Healthy",
    traffic: "9,650 req/min",
    connections: 680,
    backendServersCount: 2,
    health: 100,
    algorithm: "Round Robin",
    backends: [
      { name: "SRV-005", ip: "10.10.1.15", status: "Healthy", weight: 50, latency: "2.1 ms" },
      { name: "SRV-006", ip: "10.10.1.16", status: "Healthy", weight: 50, latency: "2.4 ms" }
    ]
  }
];

export const mockAssets: AssetItem[] = [
  { id: "SRV-024", name: "AICTE-PROD-SRV-024", type: "Server", model: "Dell PowerEdge R750", location: "Data Center A", warranty: "Valid (2028-01-10)", maintenance: "12 days ago", status: "Healthy", serialNumber: "DL-PE-9824" },
  { id: "FW-018", name: "AICTE-EDGE-FW-018", type: "Firewall", model: "Fortinet FortiGate 200F", location: "Data Center B", warranty: "Valid (2027-03-01)", maintenance: "34 days ago", status: "Warning", serialNumber: "FG-200F-189" },
  { id: "SW-001", name: "AICTE-DIST-SWITCH-01", type: "Switch", model: "Cisco Catalyst 9300", location: "Data Center A", warranty: "Valid (2028-03-20)", maintenance: "45 days ago", status: "Healthy", serialNumber: "CS-9300-881" },
  { id: "LB-001", name: "AICTE-PORTAL-LB-001", type: "Load Balancer", model: "F5 BIG-IP i4800", location: "Data Center A", warranty: "Valid (2027-04-05)", maintenance: "20 days ago", status: "Healthy", serialNumber: "F5-4800-019" },
  { id: "SRV-001", name: "AICTE-GATEWAY-SRV-001", type: "Server", model: "HP ProLiant DL380 Gen10", location: "Data Center A", warranty: "Valid (2028-02-15)", maintenance: "18 days ago", status: "Healthy", serialNumber: "HP-380-001" }
];

export const mockAlerts: AlertItem[] = [
  {
    id: "ALT-1042",
    source: "SRV-024",
    severity: "Critical",
    description: "High CPU and memory saturation (97% load)",
    time: "2 min ago",
    status: "Active",
    whatHappened: "Server SRV-024 sustained 97% CPU utilization across all 64 cores for over 180 seconds.",
    impact: "Applications and student admission portals hosted on this server may become slow or unavailable.",
    recommendedAction: "Assign this issue to the Infrastructure Team.",
    assignedTeam: "Infrastructure Team",
    technicalDetails: "Container 'admission-portal-v2' (PID 14209) executing un-indexed aggregation query."
  },
  {
    id: "ALT-1041",
    source: "FW-018",
    severity: "High",
    description: "External SSH access rule modified on edge firewall",
    time: "10 min ago",
    status: "Investigating",
    whatHappened: "Security rule R-102 was updated to allow universal source (0.0.0.0/0) to port 22.",
    impact: "Exposes server management shell to internet port scanners and automated brute-force attempts.",
    recommendedAction: "Ask a Security Analyst to review the change.",
    assignedTeam: "Cybersecurity SOC",
    technicalDetails: "Rule modified by admin session IP 192.168.1.10 without dual-approval."
  },
  {
    id: "ALT-1039",
    source: "VMware vSphere",
    severity: "Medium",
    description: "License expiration threshold reached (8 days remaining)",
    time: "1 hour ago",
    status: "Active",
    whatHappened: "VMware cluster license expires on 2026-08-26.",
    impact: "Host virtualization cluster will lose automated vMotion and enterprise management features.",
    recommendedAction: "Start the renewal process.",
    assignedTeam: "IT Asset & Licensing Team",
    technicalDetails: "License Key: VM-VSP-ENT-8841 (100 cores allocated out of 100)."
  },
  {
    id: "ALT-1020",
    source: "CMDB Sync",
    severity: "Resolved",
    description: "Automated topology synchronization complete",
    time: "4 hours ago",
    status: "Resolved",
    whatHappened: "Periodic discovery scan identified 124 servers and 118 network devices across 2 data centers.",
    impact: "CMDB and topology graphs updated with zero schema conflicts.",
    recommendedAction: "No action required.",
    assignedTeam: "Automation Engine"
  }
];

export const mockIncidents: IncidentItem[] = [
  {
    id: "INC-1042",
    issue: "Server Performance Degradation on Admission Portal",
    priority: "Critical",
    assignedTeam: "Infrastructure Team",
    created: "Today at 10:42 PM",
    status: "Open",
    rootCause: "Resource starvation on node SRV-024 due to runaway worker process."
  },
  {
    id: "INC-1041",
    issue: "Unauthorized Firewall Rule Modification (Port 22 WAN Exposure)",
    priority: "High",
    assignedTeam: "Cybersecurity SOC",
    created: "Today at 10:30 PM",
    status: "Investigating",
    rootCause: "Configuration change applied without required security sign-off."
  },
  {
    id: "INC-1033",
    issue: "High Ambient Temperature in Data Center B Server Rack 05",
    priority: "Medium",
    assignedTeam: "Facility & DC Operations",
    created: "Yesterday at 04:15 PM",
    status: "In Progress",
    rootCause: "Secondary HVAC chiller unit sensor calibration required."
  }
];

export const mockAuditLogs: AuditLogItem[] = [
  { id: "AUD-994", time: "10:42 PM", user: "Admin (Aarav Mehta)", action: "Modified firewall rule R-102", resource: "FW-018", result: "Successful", ipAddress: "192.168.1.10" },
  { id: "AUD-993", time: "10:38 PM", user: "Technician (Vikram Patel)", action: "Updated server configuration", resource: "SRV-024", result: "Successful", ipAddress: "192.168.1.45" },
  { id: "AUD-992", time: "10:31 PM", user: "Security Analyst (Riya Shah)", action: "Investigated alert ALT-1041", resource: "ALT-1041", result: "Completed", ipAddress: "192.168.1.22" },
  { id: "AUD-991", time: "10:15 PM", user: "Auditor (Neha Desai)", action: "Generated Monthly Compliance Report", resource: "NIST-800-53", result: "Successful", ipAddress: "192.168.1.80" },
  { id: "AUD-990", time: "09:50 PM", user: "System Automation", action: "Executed CMDB Node Discovery Scan", resource: "AICTE-DC-01", result: "Successful", ipAddress: "127.0.0.1" }
];

export const mockUsers: UserItem[] = [
  { id: "USR-01", name: "Aarav Mehta", role: "Administrator", department: "Infrastructure & Data Center", lastActive: "2 min ago", status: "Active", email: "aarav.mehta@aicte.gov.in", permissions: ["View Infrastructure", "Modify Servers", "Manage Firewalls", "View Alerts", "View Audit Logs", "Manage Users", "Generate Reports"] },
  { id: "USR-02", name: "Riya Shah", role: "Security Analyst", department: "Cybersecurity SOC", lastActive: "12 min ago", status: "Active", email: "riya.shah@aicte.gov.in", permissions: ["View Infrastructure", "Manage Firewalls", "View Alerts", "View Audit Logs", "Generate Reports"] },
  { id: "USR-03", name: "Vikram Patel", role: "Technician", department: "Network Operations", lastActive: "1 hour ago", status: "Active", email: "vikram.patel@aicte.gov.in", permissions: ["View Infrastructure", "Modify Servers", "View Alerts", "Generate Reports"] },
  { id: "USR-04", name: "Neha Desai", role: "Auditor", department: "Compliance", lastActive: "Yesterday", status: "Active", email: "neha.desai@aicte.gov.in", permissions: ["View Infrastructure", "View Alerts", "View Audit Logs", "Generate Reports"] },
  { id: "USR-05", name: "Rahul Joshi", role: "Technician", department: "Infrastructure", lastActive: "Pending Invite", status: "Pending", email: "rahul.joshi@aicte.gov.in", permissions: ["View Infrastructure", "Modify Servers"] }
];

export const mockPermissionMatrix = [
  { permission: "View Infrastructure", admin: true, technician: true, security: true, auditor: true, viewer: true },
  { permission: "Modify Servers", admin: true, technician: true, security: false, auditor: false, viewer: false },
  { permission: "Manage Firewalls", admin: true, technician: true, security: true, auditor: false, viewer: false },
  { permission: "View Alerts", admin: true, technician: true, security: true, auditor: true, viewer: true },
  { permission: "View Audit Logs", admin: true, technician: true, security: true, auditor: true, viewer: false },
  { permission: "Manage Users", admin: true, technician: false, security: false, auditor: false, viewer: false },
  { permission: "Generate Reports", admin: true, technician: true, security: true, auditor: true, viewer: true }
];

export const mockSoftwareLicenses: SoftwareLicenseItem[] = [
  { id: "LIC-001", name: "Windows Server", category: "Operating System", usedQuantity: 92, totalQuantity: 100, expiryDays: 42, expiryDate: "2026-09-30", status: "Active", vendor: "Microsoft", costAnnual: "₹ 4,80,000" },
  { id: "LIC-002", name: "VMware vSphere", category: "Virtualization", usedQuantity: 100, totalQuantity: 100, expiryDays: 8, expiryDate: "2026-08-26", status: "Expiring Soon", vendor: "VMware", costAnnual: "₹ 12,50,000" },
  { id: "LIC-003", name: "PostgreSQL Enterprise", category: "Database", usedQuantity: 45, totalQuantity: 50, expiryDays: 120, expiryDate: "2026-12-18", status: "Active", vendor: "EnterpriseDB", costAnnual: "₹ 6,20,000" },
  { id: "LIC-004", name: "Backup Suite", category: "Infrastructure", usedQuantity: 30, totalQuantity: 30, expiryDays: -5, expiryDate: "2026-08-13", status: "Expired", vendor: "Veeam", costAnnual: "₹ 3,40,000" },
  { id: "LIC-005", name: "Adobe Enterprise", category: "Productivity", usedQuantity: 38, totalQuantity: 50, expiryDays: 15, expiryDate: "2026-09-02", status: "Expiring Soon", vendor: "Adobe", costAnnual: "₹ 5,10,000" }
];

export const mockComplianceControls: ComplianceControlItem[] = [
  { name: "Access Control", status: "Compliant", compliantCount: 4, totalCount: 4, description: "Role-based least-privilege matrix enforced across all accounts." },
  { name: "Audit Logging", status: "Compliant", compliantCount: 4, totalCount: 4, description: "Configuration changes, firewall edits, and login events cryptographically recorded." },
  { name: "Firewall Policy", status: "Compliant", compliantCount: 4, totalCount: 4, description: "Default-deny inbound security policies active with scheduled change audits." },
  { name: "License Compliance", status: "Attention Required", compliantCount: 3, totalCount: 4, description: "3 software licenses expire within 30 days." },
  { name: "Patch Management", status: "Attention Required", compliantCount: 3, totalCount: 4, description: "2 infrastructure components require patching." }
];

export const mockConnectedSystems: ConnectedSystemItem[] = [
  { id: "SYS-01", name: "Ticketing System", type: "ITSM", status: "Connected", lastSync: "1 min ago", dataType: "Incidents & Dispatches" },
  { id: "SYS-02", name: "CMDB", type: "Configuration", status: "Connected", lastSync: "5 min ago", dataType: "Asset Specs & Topology" },
  { id: "SYS-03", name: "ITSM Platform", type: "ITSM", status: "Connected", lastSync: "2 min ago", dataType: "Service Requests" },
  { id: "SYS-04", name: "Monitoring System", type: "Telemetry", status: "Connected", lastSync: "Just now", dataType: "Live CPU, RAM, Network" }
];

export const mockWorkflows: WorkflowItem[] = [
  {
    id: "WF-01",
    name: "Server Failure Response",
    trigger: "Server becomes unavailable.",
    actions: ["1. Detect issue", "2. Create ticket", "3. Notify administrator", "4. Assign technician"],
    status: "Active",
    executionsToday: 6
  },
  {
    id: "WF-02",
    name: "Firewall Change Detection",
    trigger: "Firewall rule modified.",
    actions: ["1. Detect change", "2. Record audit event", "3. Notify Security Analyst", "4. Create review task"],
    status: "Active",
    executionsToday: 2
  },
  {
    id: "WF-03",
    name: "License Expiry Workflow",
    trigger: "License expires within 30 days.",
    actions: ["1. Generate warning", "2. Notify administrator", "3. Create renewal task"],
    status: "Active",
    executionsToday: 14
  }
];

export const mockAPIs: APIItem[] = [
  { id: "API-01", name: "Server Management API", status: "Connected", lastRequest: "3s ago", requestsToday: 42800, endpoint: "/api/v1/servers" },
  { id: "API-02", name: "Firewall API", status: "Connected", lastRequest: "12s ago", requestsToday: 18450, endpoint: "/api/v1/firewalls" },
  { id: "API-03", name: "CMDB API", status: "Connected", lastRequest: "1m ago", requestsToday: 6200, endpoint: "/api/v1/cmdb" },
  { id: "API-04", name: "ITSM API", status: "Connected", lastRequest: "45s ago", requestsToday: 3410, endpoint: "/api/v1/itsm" },
  { id: "API-05", name: "Monitoring API", status: "Connected", lastRequest: "1s ago", requestsToday: 245000, endpoint: "/api/v1/monitoring" }
];

export const mockNotifications: NotificationItem[] = [
  { id: "NOTIF-01", type: "critical", title: "Server SRV-024 requires attention.", message: "Server SRV-024 is experiencing unusually high resource usage.", time: "2 min ago", read: false, linkRoute: "/infrastructure", targetId: "SRV-024" },
  { id: "NOTIF-02", type: "warning", title: "VMware license expires in 8 days.", message: "VMware vSphere cluster license renewal is pending.", time: "1 hour ago", read: false, linkRoute: "/access-compliance", targetId: "LIC-002" },
  { id: "NOTIF-03", type: "info", title: "CMDB synchronization completed.", message: "124 servers and 118 network devices verified across data centers.", time: "4 hours ago", read: true, linkRoute: "/infrastructure" }
];
