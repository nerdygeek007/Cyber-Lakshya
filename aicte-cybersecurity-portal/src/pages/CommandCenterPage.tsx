import React, { useState } from 'react';
import { 
  Activity, ShieldCheck, Server, AlertTriangle, 
  Flame, CheckCircle2, ArrowRight, UserCheck, Eye, 
  Thermometer, Droplets, Zap, ChevronRight, Globe, Shield, Router, SlidersHorizontal,
  RotateCcw, AlertOctagon, Terminal
} from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';
import { ActivityTimeline } from '../components/common/ActivityTimeline';
import { Drawer } from '../components/common/Drawer';
import { LiveBandwidthWaveform } from '../components/cyber/LiveBandwidthWaveform';
import { ComputeHoneycombGrid } from '../components/cyber/ComputeHoneycombGrid';
import { LiveSecurityTerminal } from '../components/cyber/LiveSecurityTerminal';
import { ThreeDataCenterGlobe } from '../components/cyber/ThreeDataCenterGlobe';
import { mockStats, mockAlerts, mockServers, mockNetworkDevices } from '../data/mockData';

interface CommandCenterPageProps {
  navigate: (route: string) => void;
  onOpenAssignModal: (target: string, desc: string) => void;
}

export const CommandCenterPage: React.FC<CommandCenterPageProps> = ({
  navigate,
  onOpenAssignModal,
}) => {
  const [selectedNode, setSelectedNode] = useState<{ name: string; type: string; status: string; ip: string; health: string; desc: string } | null>(null);
  
  // Interactive Simulation State
  const [attackActive, setAttackActive] = useState(false);
  const [simulationToast, setSimulationToast] = useState<string | null>(null);

  const triggerAttackSimulation = () => {
    setAttackActive(true);
    setSimulationToast("⚠️ SYN Flood Anomaly Simulated! AI Isolation Forest scored Z-Score +4.12 on SRV-024.");
    setTimeout(() => setSimulationToast(null), 4000);
  };

  const resetAttackSimulation = () => {
    setAttackActive(false);
    setSimulationToast("🟢 Perimeter rules reset to nominal baseline state.");
    setTimeout(() => setSimulationToast(null), 3000);
  };

  const topologyNodes = [
    { name: "Public WAN", type: "Internet", status: "Healthy", ip: "0.0.0.0/0", health: "100%", desc: "External traffic gateway passing through DDOS scrubbers.", icon: Globe },
    { name: "AICTE-EDGE-FW-01", type: "Firewall", status: attackActive ? "Critical" : "Warning", ip: "10.10.0.18", health: attackActive ? "78%" : "92%", desc: "Perimeter NextGen firewall with active deep packet inspection.", icon: Shield },
    { name: "AICTE-CORE-RTR-01", type: "Router", status: "Healthy", ip: "10.10.0.254", health: "99%", desc: "Core BGP routing engine connecting DC A & DC B.", icon: Router },
    { name: "AICTE-DIST-SW-01", type: "Switch", status: "Healthy", ip: "10.10.3.1", health: "100%", desc: "High-throughput 100GbE fiber distribution switch.", icon: SlidersHorizontal },
    { name: "AICTE-PORTAL-LB-01", type: "Load Balancer", status: "Healthy", ip: "10.10.1.1", health: "98%", desc: "F5 BIG-IP cluster distributing 18,240 req/min.", icon: Activity },
    { name: "AICTE-COMPUTE-CLUSTER", type: "Servers (124 Nodes)", status: attackActive ? "Critical" : "Critical", ip: "10.10.1.0/24", health: attackActive ? "82.4%" : "94.2%", desc: "124 host servers (SRV-024 requires technician attention).", icon: Server },
  ];

  const recentActivities = [
    { id: '1', time: '10:42 PM', title: 'Firewall rule modified', description: 'Rule R-102 modified on FW-018 by Admin.', type: 'security' as const, author: 'Aarav Mehta' },
    { id: '2', time: '10:41 PM', title: 'Server performance alert generated', description: 'SRV-024 exceeded 95% CPU threshold.', type: 'alert' as const, author: 'AI Engine' },
    { id: '3', time: '10:39 PM', title: 'CMDB synchronization completed', description: '124 servers & 118 devices indexed.', type: 'system' as const, author: 'Automation Core' },
    { id: '4', time: '10:37 PM', title: 'Technician task assigned', description: 'Task #TSK-401 dispatched to Vikram Patel.', type: 'task' as const, author: 'Aarav Mehta' },
  ];

  return (
    <div className="space-y-6">
      {/* Interactive Simulation Notification Toast */}
      {simulationToast && (
        <div className="p-3.5 rounded-xl bg-cyan-500/20 border border-cyan-500/50 text-cyan-200 text-xs font-mono flex items-center justify-between animate-fade-in shadow-xl">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{simulationToast}</span>
          </div>
          <button onClick={() => setSimulationToast(null)} className="text-cyan-400 hover:text-white font-bold ml-2">×</button>
        </div>
      )}

      {/* Top Defense Cockpit Banner with Interactive Attack Simulator Trigger */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950/60 border border-cyan-500/30 backdrop-blur-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold tracking-widest font-mono flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> AICTE DCIM DEFENSE COCKPIT
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border ${
              attackActive ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            }`}>
              {attackActive ? 'DEFCON 1 • UNDER ACTIVE ATTACK' : 'DEFCON 2 • ELEVATED DEFENSE POSTURE'}
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
            Data Center Infrastructure & Cybersecurity Command Center
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Real-time telemetry streams, Zero-Trust firewall enforcement, and AI-driven automated technician dispatches.
          </p>
        </div>

        {/* Interactive Simulation Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 relative z-10">
          {!attackActive ? (
            <Button
              variant="danger"
              size="sm"
              onClick={triggerAttackSimulation}
              icon={<AlertOctagon className="w-4 h-4" />}
            >
              Simulate SYN Flood Attack
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={resetAttackSimulation}
              icon={<RotateCcw className="w-4 h-4" />}
            >
              Revert Attack / Reset Baseline
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/infrastructure')}
            icon={<Server className="w-4 h-4" />}
          >
            Explore DCIM
          </Button>
        </div>
      </div>

      {/* TOP 3D DATA CENTER GLOBE (THREE.JS WEBGL) */}
      <ThreeDataCenterGlobe onNodeClick={() => navigate('/infrastructure')} />

      {/* TOP STATISTICS GRID (6 GLASS CARDS) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="Infra Health"
          value={attackActive ? "82.4%" : `${mockStats.infrastructureHealth}%`}
          subValue="Optimal"
          statusColor={attackActive ? "rose" : "emerald"}
          icon={<Activity className="w-5 h-5 text-emerald-400" />}
          trend={{ value: attackActive ? "-14.0% load surge" : "+0.4% vs last week", positive: !attackActive }}
          onClick={() => navigate('/infrastructure')}
        />
        <StatCard
          title="Security Score"
          value={attackActive ? "68/100" : `${mockStats.securityScore}/100`}
          subValue="Good"
          statusColor={attackActive ? "rose" : "cyan"}
          icon={<ShieldCheck className="w-5 h-5 text-cyan-400" />}
          trend={{ value: "NIST SP-800-53", positive: true }}
          onClick={() => navigate('/security-center')}
        />
        <StatCard
          title="Systems Online"
          value={mockStats.systemsOnline}
          subValue="4 in Maintenance"
          statusColor="indigo"
          icon={<Server className="w-5 h-5 text-indigo-400" />}
          onClick={() => navigate('/infrastructure')}
        />
        <StatCard
          title="Active Alerts"
          value={attackActive ? 14 : mockStats.activeAlertsCount}
          subValue="2 Needs Review"
          statusColor="amber"
          icon={<AlertTriangle className="w-5 h-5 text-amber-400" />}
          onClick={() => navigate('/security-center')}
        />
        <StatCard
          title="Critical Issues"
          value={attackActive ? 5 : mockStats.criticalIssuesCount}
          subValue="1 Server, 1 FW"
          statusColor="rose"
          icon={<Flame className="w-5 h-5 text-rose-400" />}
          onClick={() => navigate('/security-center')}
        />
        <StatCard
          title="Active Incidents"
          value={mockStats.activeIncidentsCount}
          subValue="18 Resolved"
          statusColor="cyan"
          icon={<CheckCircle2 className="w-5 h-5 text-cyan-400" />}
          onClick={() => navigate('/security-center')}
        />
      </div>

      {/* LIVE BANDWIDTH WAVEFORM & COMPUTE HONEYCOMB GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LiveBandwidthWaveform />
        <ComputeHoneycombGrid onSelectNode={() => navigate('/infrastructure')} />
      </div>

      {/* INFRASTRUCTURE TOPOLOGY PIPELINE & ENVIRONMENTAL SENSORS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topology Pipeline Overview */}
        <GlassCard className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-white">Infrastructure Pipeline Overview</h2>
              <p className="text-xs text-slate-400">Click any tier node to inspect live bandwidth & specifications</p>
            </div>
            <button
              onClick={() => navigate('/infrastructure')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 group"
            >
              Full Network Topology <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Clickable Pipeline Flow */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 pt-2">
            {topologyNodes.map((node) => {
              const Icon = node.icon;
              const isWarning = node.status === 'Warning';
              const isCritical = node.status === 'Critical';
              return (
                <div
                  key={node.name}
                  onClick={() => setSelectedNode(node)}
                  className={`p-3 rounded-xl border text-center cursor-pointer transition-all duration-200 hover:scale-[1.02] flex flex-col items-center justify-between ${
                    isCritical
                      ? 'bg-rose-950/20 border-rose-500/40 hover:border-rose-400'
                      : isWarning
                      ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-400'
                      : 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/40'
                  }`}
                >
                  <div className={`p-2 rounded-lg mb-2 ${
                    isCritical ? 'bg-rose-500/20 text-rose-400' : isWarning ? 'bg-amber-500/20 text-amber-400' : 'bg-cyan-500/10 text-cyan-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-white truncate w-full">{node.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5">{node.type}</span>
                  <div className="mt-2 w-full pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Health:</span>
                    <span className={`font-bold ${isCritical ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {node.health}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Environmental Monitoring Sensors */}
        <GlassCard className="space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-cyan-400" /> Environmental Conditions
            </h2>
            <p className="text-xs text-slate-400">Physical ambient telemetry from server racks</p>
          </div>

          <div className="space-y-3">
            {mockStats.environmentalData.map((env) => (
              <div key={env.dc} className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">{env.dc}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    env.status === 'Normal' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}>
                    {env.status}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center pt-1 text-xs">
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
                    <span className="text-[10px] text-slate-400 block flex items-center justify-center gap-1">
                      <Thermometer className="w-3 h-3 text-cyan-400" /> Temp
                    </span>
                    <span className={`font-bold text-sm ${env.temp > 25 ? 'text-amber-400' : 'text-slate-100'}`}>
                      {env.temp}°C
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
                    <span className="text-[10px] text-slate-400 block flex items-center justify-center gap-1">
                      <Droplets className="w-3 h-3 text-blue-400" /> Humidity
                    </span>
                    <span className="font-bold text-sm text-slate-100">{env.humidity}%</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
                    <span className="text-[10px] text-slate-400 block flex items-center justify-center gap-1">
                      <Zap className="w-3 h-3 text-amber-400" /> Power
                    </span>
                    <span className="font-bold text-sm text-slate-100">{env.pwrKwh} kW</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* REQUIRES ATTENTION (NON-TECHNICAL TRANSLATION CARDS) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" /> Requires Attention
            </h2>
            <p className="text-xs text-slate-400">Plain-language explanations and recommended operational actions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Server SRV-024 */}
          <GlassCard className="border-rose-500/30 bg-gradient-to-b from-rose-950/15 to-slate-900/80 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
                  🔴 Server SRV-024
                </span>
                <span className="text-[11px] text-slate-400 font-mono">CPU: 97%</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-2">High Resource Utilization</h4>
              
              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-bold text-slate-300 block">What happened?</span>
                  <p className="text-slate-400">Server SRV-024 is experiencing unusually high resource usage across CPU and memory.</p>
                </div>
                <div>
                  <span className="font-bold text-slate-300 block">Why does it matter?</span>
                  <p className="text-slate-400">Applications running on this server may become slow or unavailable to students.</p>
                </div>
                <div>
                  <span className="font-bold text-slate-300 block">Recommended Action:</span>
                  <p className="text-cyan-300 font-medium">Assign this issue to the Infrastructure Team to rebalance node workloads.</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                className="flex-1"
                onClick={() => onOpenAssignModal('Server SRV-024', 'High CPU & Memory Saturation (97%)')}
                icon={<UserCheck className="w-3.5 h-3.5" />}
              >
                Assign Technician
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/infrastructure')}
                icon={<Eye className="w-3.5 h-3.5" />}
              >
                Investigate
              </Button>
            </div>
          </GlassCard>

          {/* Card 2: Firewall FW-018 */}
          <GlassCard className="border-amber-500/30 bg-gradient-to-b from-amber-950/15 to-slate-900/80 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  🟠 Firewall FW-018
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Port 22 WAN</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-2">Security Rule Modified</h4>
              
              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-bold text-slate-300 block">What happened?</span>
                  <p className="text-slate-400">A firewall rule was recently modified allowing external traffic to a management port.</p>
                </div>
                <div>
                  <span className="font-bold text-slate-300 block">Why does it matter?</span>
                  <p className="text-slate-400">Exposes the management shell to potential external brute-force threats.</p>
                </div>
                <div>
                  <span className="font-bold text-slate-300 block">Recommended Action:</span>
                  <p className="text-amber-300 font-medium">Ask a Security Analyst to review the firewall rule change.</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                className="flex-1"
                onClick={() => onOpenAssignModal('Firewall FW-018', 'Review External SSH Rule R-102')}
                icon={<UserCheck className="w-3.5 h-3.5" />}
              >
                Assign Security Team
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/security-center')}
                icon={<Eye className="w-3.5 h-3.5" />}
              >
                Review Rule
              </Button>
            </div>
          </GlassCard>

          {/* Card 3: VMware License */}
          <GlassCard className="border-cyan-500/30 bg-gradient-to-b from-blue-950/15 to-slate-900/80 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  🟡 VMware License
                </span>
                <span className="text-[11px] text-amber-400 font-mono">8 Days Left</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-2">License Renewal Pending</h4>
              
              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-bold text-slate-300 block">What happened?</span>
                  <p className="text-slate-400">A virtualization cluster software license is entering its 8-day expiration threshold.</p>
                </div>
                <div>
                  <span className="font-bold text-slate-300 block">Why does it matter?</span>
                  <p className="text-slate-400">Live migration and support coverage will expire without renewal.</p>
                </div>
                <div>
                  <span className="font-bold text-slate-300 block">Recommended Action:</span>
                  <p className="text-cyan-300 font-medium">Start the renewal process with the licensing desk.</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() => navigate('/access-compliance')}
                icon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Review License & Renew
              </Button>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* RECOMMENDED ACTIONS + LIVE ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Actions: "What Should I Do?" */}
        <GlassCard className="lg:col-span-2 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white">What Should I Do? (Priority Recommendations)</h2>
            <p className="text-xs text-slate-400">Intelligent system guidance tailored for administrators</p>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-rose-400 uppercase tracking-wider">High Load Alert</p>
                <h4 className="text-sm font-bold text-white mt-0.5">Server SRV-024 is under high resource load.</h4>
                <p className="text-xs text-slate-400 mt-1">Recommended: Assign this issue to the Infrastructure Team.</p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onOpenAssignModal('Server SRV-024', 'High Load Remediation')}
                icon={<UserCheck className="w-3.5 h-3.5" />}
              >
                Assign Technician
              </Button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Perimeter Security</p>
                <h4 className="text-sm font-bold text-white mt-0.5">A firewall rule was recently modified.</h4>
                <p className="text-xs text-slate-400 mt-1">Recommended: Ask a Security Analyst to review the change.</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onOpenAssignModal('Firewall FW-018', 'Security Rule Policy Review')}
                icon={<ShieldCheck className="w-3.5 h-3.5" />}
              >
                Assign Security Team
              </Button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">License Management</p>
                <h4 className="text-sm font-bold text-white mt-0.5">A software license expires soon.</h4>
                <p className="text-xs text-slate-400 mt-1">Recommended: Start the renewal process.</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/access-compliance')}
                icon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Review License
              </Button>
            </div>
          </div>
        </GlassCard>

        {/* Live Activity Timeline */}
        <GlassCard className="space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Live Activity</h2>
              <p className="text-xs text-slate-400">Real-time audit & operational feed</p>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              STREAMING
            </span>
          </div>

          <ActivityTimeline activities={recentActivities} />
        </GlassCard>
      </div>

      {/* LIVE SECURITY TERMINAL */}
      <LiveSecurityTerminal />

      {/* TOPOLOGY NODE DETAIL DRAWER */}
      {selectedNode && (
        <Drawer
          isOpen={!!selectedNode}
          onClose={() => setSelectedNode(null)}
          title={selectedNode.name}
          subtitle={`Type: ${selectedNode.type} • IP: ${selectedNode.ip}`}
          footer={
            <Button variant="primary" size="sm" onClick={() => navigate('/infrastructure')}>
              Open in Infrastructure Manager
            </Button>
          }
        >
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold uppercase">Operational Status</span>
                <span className={`text-xs font-bold ${selectedNode.status === 'Critical' ? 'text-rose-400' : selectedNode.status === 'Warning' ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {selectedNode.status} ({selectedNode.health} Health)
                </span>
              </div>
              <p className="text-xs text-slate-300">{selectedNode.desc}</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">What is happening?</h4>
              <p className="text-xs text-slate-300">
                {selectedNode.status === 'Critical'
                  ? 'High resource utilization detected on child services. Automatic failover ready.'
                  : 'Operating under standard threshold parameters with encrypted data channels.'}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Network & IP Specification</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">IP / Subnet</span>
                  <span className="text-white font-mono">{selectedNode.ip}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Location</span>
                  <span className="text-white">AICTE Data Center A</span>
                </div>
              </div>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
};
