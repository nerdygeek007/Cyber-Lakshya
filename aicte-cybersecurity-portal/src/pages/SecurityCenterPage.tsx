import React, { useState } from 'react';
import { 
  Shield, AlertTriangle, Flame, ShieldAlert, 
  CheckCircle2, Eye, UserCheck, Search, FileText, ArrowRight, Lock, Check,
  Crosshair, Play, Terminal
} from 'lucide-react';
import { Tabs } from '../components/common/Tabs';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { DataTable } from '../components/common/DataTable';
import { FilterBar } from '../components/common/FilterBar';
import { Drawer } from '../components/common/Drawer';
import { RadarThreatScanner } from '../components/cyber/RadarThreatScanner';
import { mockNetworkDevices, mockFirewallRules, mockAlerts, mockIncidents, mockAuditLogs } from '../data/mockData';
import { AlertItem, IncidentItem, AuditLogItem, NetworkDeviceItem, FirewallRule } from '../types';

interface SecurityCenterPageProps {
  onOpenAssignModal: (target: string, desc: string) => void;
}

export const SecurityCenterPage: React.FC<SecurityCenterPageProps> = ({ onOpenAssignModal }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [alertSeverityFilter, setAlertSeverityFilter] = useState('ALL');

  // Selected Drawers
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<IncidentItem | null>(null);
  const [selectedFirewall, setSelectedFirewall] = useState<NetworkDeviceItem | null>(null);
  const [reviewRequested, setReviewRequested] = useState(false);

  // Interactive Packet Tester Tool State
  const [testIp, setTestIp] = useState('198.51.100.24');
  const [testPort, setTestPort] = useState('22');
  const [testProtocol, setTestProtocol] = useState('TCP');
  const [testResult, setTestResult] = useState<{ verdict: string; matchedRule: string; reason: string } | null>(null);

  const handleTestPacket = (e: React.FormEvent) => {
    e.preventDefault();
    if (testPort === '22' && (testIp === '0.0.0.0/0' || testIp.startsWith('198.'))) {
      setTestResult({
        verdict: 'ALLOW (WITH WARNING)',
        matchedRule: 'Rule R-102 (Allow 0.0.0.0/0 -> 10.10.1.24:22)',
        reason: 'Packet permitted by perimeter SSH rule, but flag generated due to universal public CIDR.'
      });
    } else if (testIp.startsWith('198.51.')) {
      setTestResult({
        verdict: 'DENY / DROPPED',
        matchedRule: 'Rule R-199 (Blacklist CIDR Range Drop)',
        reason: 'Source IP matched threat intelligence blacklist. Packet dropped at edge.'
      });
    } else {
      setTestResult({
        verdict: 'ALLOW (CLEAN)',
        matchedRule: 'Rule R-101 (Standard HTTPS Ingress)',
        reason: 'Nominal authorized transit packet.'
      });
    }
  };

  const securityTabs = [
    { id: 'overview', label: 'Security Overview & Radar', icon: <Shield className="w-4 h-4" /> },
    { id: 'firewalls', label: 'Firewalls & Policies', count: 38, icon: <Lock className="w-4 h-4" /> },
    { id: 'tester', label: 'Interactive Packet Tester', icon: <Crosshair className="w-4 h-4" /> },
    { id: 'alerts', label: 'Active Alerts', count: 4, icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'incidents', label: 'Incidents', count: 3, icon: <Flame className="w-4 h-4" /> },
    { id: 'audit-logs', label: 'Audit Logs', count: 5, icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Security Operations Center (SOC)</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time threat monitoring, perimeter radar scanning, firewall rule governance, and tamper-proof audit trails.
          </p>
        </div>
      </div>

      <Tabs tabs={securityTabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* ========================================================================= */}
      {/* 1. SECURITY OVERVIEW & RADAR */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          {/* Top Threat Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="p-4 rounded-xl glass-panel border-cyan-500/30">
              <span className="text-xs text-slate-400 uppercase font-semibold">Security Score</span>
              <p className="text-2xl font-bold text-cyan-400 mt-1">87 / 100</p>
              <span className="text-[11px] text-emerald-400">NIST SP 800-53 Compliant</span>
            </div>
            <div className="p-4 rounded-xl glass-panel border-rose-500/30">
              <span className="text-xs text-slate-400 uppercase font-semibold">Critical Threats</span>
              <p className="text-2xl font-bold text-rose-400 mt-1">2</p>
              <span className="text-[11px] text-rose-400/80">Immediate Action Required</span>
            </div>
            <div className="p-4 rounded-xl glass-panel border-amber-500/30">
              <span className="text-xs text-slate-400 uppercase font-semibold">High Priority</span>
              <p className="text-2xl font-bold text-amber-400 mt-1">4</p>
              <span className="text-[11px] text-amber-400/80">Security Review Pending</span>
            </div>
            <div className="p-4 rounded-xl glass-panel border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold">Medium Alerts</span>
              <p className="text-2xl font-bold text-blue-400 mt-1">8</p>
              <span className="text-[11px] text-slate-400">Automated Triage</span>
            </div>
            <div className="p-4 rounded-xl glass-panel border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold">Resolved Today</span>
              <p className="text-2xl font-bold text-emerald-400 mt-1">18</p>
              <span className="text-[11px] text-emerald-400/80">Avg MTTR: 14 Mins</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Rotating Radar Scanner (1 Col) */}
            <RadarThreatScanner onSelectThreat={(t) => {
              const alert = mockAlerts.find(a => a.source.includes(t));
              if (alert) setSelectedAlert(alert);
            }} />

            {/* Threat Distribution Bar Chart & Events (2 Cols) */}
            <div className="lg:col-span-2 space-y-6">
              <GlassCard className="space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white">Threat Vector Distribution</h3>
                  <p className="text-xs text-slate-400">Classified telemetry anomalies & firewall rule events</p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 font-medium">External WAN Port Scans (Firewall Drop)</span>
                      <span className="text-cyan-400 font-mono font-bold">64%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-cyan-400 h-full w-[64%]"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 font-medium">Un-Authorized SSH/Management Access Attempts</span>
                      <span className="text-rose-400 font-mono font-bold">22%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-full w-[22%]"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 font-medium">Resource Saturation & Anomalous Bursts</span>
                      <span className="text-amber-400 font-mono font-bold">14%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full w-[14%]"></div>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Recent Security Events */}
              <GlassCard className="space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white">Recent Security Events</h3>
                  <p className="text-xs text-slate-400">Latest SOC triggers across data center perimeters</p>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 shrink-0">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white">Suspicious firewall rule modification</h5>
                      <p className="text-[11px] text-slate-400 mt-0.5">Rule R-102 enabled WAN SSH ingress on FW-018.</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white">Multiple failed login attempts</h5>
                      <p className="text-[11px] text-slate-400 mt-0.5">14 failed attempts on bastion gateway IP 10.10.1.10.</p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. FIREWALLS TAB */}
      {/* ========================================================================= */}
      {activeTab === 'firewalls' && (
        <div className="space-y-6 animate-fade-in">
          <DataTable<NetworkDeviceItem>
            data={mockNetworkDevices.filter(d => d.type === 'Firewall')}
            keyExtractor={(f) => f.id}
            columns={[
              {
                header: 'Firewall Device',
                accessor: (f) => (
                  <div>
                    <span className="font-bold text-white">{f.id}</span>
                    <span className="text-xs text-slate-400 block">{f.name}</span>
                  </div>
                ),
              },
              { header: 'IP Address', accessor: (f) => <span className="font-mono text-xs">{f.ip}</span> },
              { header: 'DC Location', accessor: 'location' },
              { header: 'Status', accessor: (f) => <StatusBadge status={f.status} /> },
              { header: 'Active Rules', accessor: () => <span className="font-mono text-xs">4 Active Rules</span> },
              { header: 'Traffic Load', accessor: () => <span className="text-cyan-300 font-mono text-xs">2.4 Gbps Clean</span> },
              {
                header: 'Actions',
                accessor: (f) => (
                  <Button variant="outline" size="sm" onClick={() => setSelectedFirewall(f)} icon={<Eye className="w-3.5 h-3.5" />}>
                    View Rules & Policies
                  </Button>
                ),
              },
            ]}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE PACKET TESTER TOOL */}
      {/* ========================================================================= */}
      {activeTab === 'tester' && (
        <div className="space-y-6 animate-fade-in max-w-3xl">
          <GlassCard className="p-6 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-1.5">
                <Crosshair className="w-3.5 h-3.5" /> Interactive Security Policy Sandbox
              </span>
              <h3 className="text-base font-bold text-white mt-1">Simulate Packet Traversal Against Perimeter Rules</h3>
              <p className="text-xs text-slate-400">Test whether simulated ingress packets would be permitted or quarantined</p>
            </div>

            <form onSubmit={handleTestPacket} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Source IP / CIDR</label>
                  <input
                    type="text"
                    value={testIp}
                    onChange={(e) => setTestIp(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Destination Port</label>
                  <input
                    type="text"
                    value={testPort}
                    onChange={(e) => setTestPort(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Protocol</label>
                  <select
                    value={testProtocol}
                    onChange={(e) => setTestProtocol(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="TCP">TCP</option>
                    <option value="UDP">UDP</option>
                    <option value="ICMP">ICMP</option>
                  </select>
                </div>
              </div>

              <Button type="submit" variant="primary" size="sm" icon={<Play className="w-3.5 h-3.5" />}>
                Execute Packet Simulation
              </Button>
            </form>

            {testResult && (
              <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-2 animate-fade-in font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold uppercase font-sans">Simulation Verdict:</span>
                  <span className={`px-2.5 py-0.5 rounded font-bold ${
                    testResult.verdict.includes('DENY') ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  }`}>
                    {testResult.verdict}
                  </span>
                </div>
                <p className="text-cyan-300 font-semibold">{testResult.matchedRule}</p>
                <p className="text-slate-400 text-[11px] font-sans">{testResult.reason}</p>
              </div>
            )}
          </GlassCard>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. ALERTS TAB */}
      {/* ========================================================================= */}
      {activeTab === 'alerts' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <FilterBar
              selectedValue={alertSeverityFilter}
              onSelect={setAlertSeverityFilter}
              options={[
                { label: 'All Alerts', value: 'ALL' },
                { label: 'Critical', value: 'Critical' },
                { label: 'High', value: 'High' },
                { label: 'Medium', value: 'Medium' },
                { label: 'Resolved', value: 'Resolved' },
              ]}
            />
          </div>

          <DataTable<AlertItem>
            data={mockAlerts.filter(a => alertSeverityFilter === 'ALL' || a.severity === alertSeverityFilter)}
            keyExtractor={(a) => a.id}
            columns={[
              { header: 'Alert ID', accessor: (a) => <span className="font-mono font-bold text-white">{a.id}</span> },
              { header: 'Source Entity', accessor: (a) => <span className="font-semibold text-cyan-300">{a.source}</span> },
              { header: 'Severity', accessor: (a) => <StatusBadge status={a.severity} /> },
              { header: 'Description', accessor: 'description' },
              { header: 'Time', accessor: (a) => <span className="text-xs text-slate-400 font-mono">{a.time}</span> },
              { header: 'Status', accessor: (a) => <StatusBadge status={a.status} /> },
              {
                header: 'Action',
                accessor: (a) => (
                  <Button variant="outline" size="sm" onClick={() => setSelectedAlert(a)} icon={<Eye className="w-3.5 h-3.5" />}>
                    Investigate
                  </Button>
                ),
              },
            ]}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. INCIDENTS TAB */}
      {/* ========================================================================= */}
      {activeTab === 'incidents' && (
        <div className="space-y-6 animate-fade-in">
          <DataTable<IncidentItem>
            data={mockIncidents}
            keyExtractor={(inc) => inc.id}
            columns={[
              { header: 'Incident ID', accessor: (i) => <span className="font-mono font-bold text-white">{i.id}</span> },
              { header: 'Issue Summary', accessor: 'issue' },
              { header: 'Priority', accessor: (i) => <StatusBadge status={i.priority} /> },
              { header: 'Assigned Team', accessor: 'assignedTeam' },
              { header: 'Created', accessor: 'created' },
              { header: 'Status', accessor: (i) => <StatusBadge status={i.status} /> },
              {
                header: 'Action',
                accessor: (i) => (
                  <Button variant="outline" size="sm" onClick={() => setSelectedIncident(i)} icon={<Eye className="w-3.5 h-3.5" />}>
                    View
                  </Button>
                ),
              },
            ]}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. AUDIT LOGS TAB */}
      {/* ========================================================================= */}
      {activeTab === 'audit-logs' && (
        <div className="space-y-6 animate-fade-in">
          <DataTable<AuditLogItem>
            data={mockAuditLogs}
            keyExtractor={(log) => log.id}
            columns={[
              { header: 'Timestamp', accessor: (l) => <span className="font-mono text-xs">{l.time}</span> },
              { header: 'User / Identity', accessor: 'user' },
              { header: 'Action Executed', accessor: (l) => <span className="font-semibold text-white">{l.action}</span> },
              { header: 'Target Resource', accessor: (l) => <span className="font-mono text-cyan-400">{l.resource}</span> },
              { header: 'Result', accessor: (l) => <StatusBadge status={l.result === 'Successful' || l.result === 'Completed' ? 'Healthy' : 'Critical'} /> },
              { header: 'IP Address', accessor: (l) => <span className="font-mono text-xs text-slate-400">{l.ipAddress}</span> },
            ]}
          />
        </div>
      )}

      {/* FIREWALL RULES DRAWER WITH EXPLANATIONS */}
      {selectedFirewall && (
        <Drawer
          isOpen={!!selectedFirewall}
          onClose={() => {
            setSelectedFirewall(null);
            setReviewRequested(false);
          }}
          title={`Firewall Rules — ${selectedFirewall.id}`}
          subtitle={`${selectedFirewall.name} • Location: ${selectedFirewall.location}`}
          width="max-w-3xl"
        >
          <div className="space-y-6">
            {/* Security Explanation Box */}
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                Security Policy Advisory
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Rule <span className="text-amber-300 font-mono font-bold">R-102</span> allows universal source (0.0.0.0/0) access to SSH port 22 on Server SRV-024. A security review is recommended to restrict exposure to internal VPN jump hosts.
              </p>
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  disabled={reviewRequested}
                  onClick={() => setReviewRequested(true)}
                  icon={reviewRequested ? <Check className="w-4 h-4 text-emerald-400" /> : <Shield className="w-4 h-4" />}
                >
                  {reviewRequested ? 'Security Review Requested!' : 'Request Peer Review'}
                </Button>
              </div>
            </div>

            {/* Rules Table */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Active Security Rules</h4>
              <div className="rounded-xl border border-slate-800 overflow-hidden text-xs">
                <table className="w-full text-left font-mono">
                  <thead className="bg-slate-900 text-[10px] text-slate-400 uppercase">
                    <tr>
                      <th className="px-3 py-2">Rule ID</th>
                      <th className="px-3 py-2">Source</th>
                      <th className="px-3 py-2">Destination</th>
                      <th className="px-3 py-2">Port</th>
                      <th className="px-3 py-2">Action</th>
                      <th className="px-3 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-950">
                    {mockFirewallRules.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-900/60">
                        <td className="px-3 py-2 font-bold text-cyan-400">{r.id}</td>
                        <td className="px-3 py-2 text-slate-300">{r.source}</td>
                        <td className="px-3 py-2 text-slate-300">{r.destination}</td>
                        <td className="px-3 py-2 text-white font-bold">{r.port} ({r.protocol})</td>
                        <td className="px-3 py-2">
                          <span className={`font-bold ${r.action === 'Allow' ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {r.action}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <StatusBadge status={r.status} size="sm" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Drawer>
      )}

      {/* ALERT INVESTIGATION DRAWER */}
      {selectedAlert && (
        <Drawer
          isOpen={!!selectedAlert}
          onClose={() => setSelectedAlert(null)}
          title={`Alert Investigation — ${selectedAlert.id}`}
          subtitle={`Source: ${selectedAlert.source} • Time: ${selectedAlert.time}`}
          footer={
            <div className="flex items-center gap-2 w-full justify-between">
              <Button
                variant="primary"
                size="sm"
                onClick={() => onOpenAssignModal(selectedAlert.source, selectedAlert.description)}
                icon={<UserCheck className="w-4 h-4" />}
              >
                Assign
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setSelectedAlert(null)}>
                Acknowledge Alert
              </Button>
            </div>
          }
        >
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400 block mb-0.5">
                  What happened?
                </span>
                <p className="text-xs text-slate-200">{selectedAlert.whatHappened}</p>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-0.5">
                  Operational Impact
                </span>
                <p className="text-xs text-slate-400">{selectedAlert.impact}</p>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block mb-0.5">
                  Recommended Action
                </span>
                <p className="text-xs text-cyan-200 font-medium">{selectedAlert.recommendedAction}</p>
              </div>
            </div>

            {selectedAlert.technicalDetails && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
                <p className="text-[11px] text-slate-400 font-sans font-semibold mb-1">Technical Forensic Evidence:</p>
                <p className="text-slate-300">{selectedAlert.technicalDetails}</p>
              </div>
            )}
          </div>
        </Drawer>
      )}

      {/* INCIDENT DRAWER */}
      {selectedIncident && (
        <Drawer
          isOpen={!!selectedIncident}
          onClose={() => setSelectedIncident(null)}
          title={`Incident Card — ${selectedIncident.id}`}
          subtitle={`Priority: ${selectedIncident.priority} • Assigned: ${selectedIncident.assignedTeam}`}
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <h4 className="text-sm font-bold text-white">{selectedIncident.issue}</h4>
              <p className="text-xs text-slate-400">Created: {selectedIncident.created}</p>
            </div>
            {selectedIncident.rootCause && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-cyan-400 uppercase">Root Cause Analysis</span>
                <p className="text-xs text-slate-300">{selectedIncident.rootCause}</p>
              </div>
            )}
          </div>
        </Drawer>
      )}
    </div>
  );
};
