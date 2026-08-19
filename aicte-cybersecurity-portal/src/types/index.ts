export type UserRole = 'Administrator' | 'Technician' | 'Security Analyst' | 'Auditor' | 'Viewer';

export type StatusType = 
  | 'Healthy' | 'Operational' | 'Active' | 'Connected' | 'Compliant' | 'Resolved' | 'Online'
  | 'Warning' | 'Attention Required' | 'Expiring Soon' | 'Investigating' | 'Pending' | 'Degraded'
  | 'Critical' | 'Failed' | 'Expired' | 'Non-Compliant' | 'Disconnected'
  | 'Informational' | 'In Progress';

export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low' | 'Resolved' | 'Info';

export interface ServerItem {
  id: string;
  name: string;
  ip: string;
  location: string;
  status: StatusType;
  cpu: number;
  ram: number;
  disk: number;
  network: string;
  os: string;
  lastMaintenance: string;
  assignedTechnician?: string;
  whatHappened?: string;
  impact?: string;
  recommendedAction?: string;
  assignedTeam?: string;
  processes?: Array<{ pid: number; name: string; cpu: number; memory: number; user: string }>;
  specs?: { cpuModel: string; cores: number; totalRamGb: number; storageTb: number };
}

export interface NetworkDeviceItem {
  id: string;
  name: string;
  type: 'Firewall' | 'Router' | 'Switch' | 'Gateway';
  ip: string;
  location: string;
  status: StatusType;
  lastChecked: string;
  firmware: string;
  managementPort: number;
}

export interface FirewallRule {
  id: string;
  source: string;
  destination: string;
  port: string;
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'ALL';
  action: 'Allow' | 'Deny';
  status: 'Healthy' | 'Warning' | 'Critical';
  lastModified: string;
  securityExplanation?: string;
}

export interface LoadBalancerItem {
  id: string;
  name: string;
  status: StatusType;
  traffic: string;
  connections: number;
  backendServersCount: number;
  health: number;
  algorithm: string;
  backends: Array<{ name: string; ip: string; status: StatusType; weight: number; latency: string }>;
}

export interface AssetItem {
  id: string;
  name: string;
  type: 'Server' | 'Firewall' | 'Switch' | 'Load Balancer' | 'Storage';
  model: string;
  location: string;
  warranty: string;
  maintenance: string;
  status: StatusType;
  serialNumber: string;
}

export interface AlertItem {
  id: string;
  source: string;
  severity: SeverityLevel;
  description: string;
  time: string;
  status: 'Active' | 'Investigating' | 'Resolved' | 'Acknowledged';
  whatHappened: string;
  impact: string;
  recommendedAction: string;
  assignedTeam: string;
  technicalDetails?: string;
}

export interface IncidentItem {
  id: string;
  issue: string;
  priority: 'Critical' | 'High' | 'Medium';
  assignedTeam: string;
  created: string;
  status: 'Open' | 'Investigating' | 'In Progress' | 'Resolved';
  rootCause?: string;
  resolvedAt?: string;
}

export interface AuditLogItem {
  id: string;
  time: string;
  user: string;
  action: string;
  resource: string;
  result: 'Successful' | 'Completed' | 'Failed';
  ipAddress: string;
}

export interface UserItem {
  id: string;
  name: string;
  role: UserRole;
  department: string;
  lastActive: string;
  status: 'Active' | 'Pending' | 'Suspended';
  email: string;
  permissions: string[];
}

export interface SoftwareLicenseItem {
  id: string;
  name: string;
  category: string;
  usedQuantity: number;
  totalQuantity: number;
  expiryDays: number;
  expiryDate: string;
  status: 'Active' | 'Expiring Soon' | 'Expired';
  vendor: string;
  costAnnual: string;
}

export interface ComplianceControlItem {
  name: string;
  status: 'Compliant' | 'Attention Required' | 'Non-Compliant';
  compliantCount: number;
  totalCount: number;
  description: string;
}

export interface ConnectedSystemItem {
  id: string;
  name: string;
  type: string;
  status: 'Connected' | 'Warning' | 'Disconnected';
  lastSync: string;
  dataType: string;
}

export interface WorkflowItem {
  id: string;
  name: string;
  trigger: string;
  actions: string[];
  status: 'Active' | 'Paused';
  executionsToday: number;
}

export interface APIItem {
  id: string;
  name: string;
  status: 'Connected' | 'Degraded';
  lastRequest: string;
  requestsToday: number;
  endpoint: string;
}

export interface NotificationItem {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  time: string;
  read: boolean;
  linkRoute?: string;
  targetId?: string;
}
