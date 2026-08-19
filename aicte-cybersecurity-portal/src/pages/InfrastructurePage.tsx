import React, { useState } from 'react';
import { 
  Server, Shield, SlidersHorizontal, Activity, 
  Search, Eye, UserCheck, ChevronDown, ChevronUp, Cpu, HardDrive, 
  Network, ArrowUpRight, CheckCircle2, AlertTriangle, Flame, Globe, Layers, Box 
} from 'lucide-react';
import { Tabs } from '../components/common/Tabs';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { DataTable } from '../components/common/DataTable';
import { SearchBar } from '../components/common/SearchBar';
import { FilterBar } from '../components/common/FilterBar';
import { Drawer } from '../components/common/Drawer';
import { ThreeServerRackHolo } from '../components/cyber/ThreeServerRackHolo';
import { mockServers, mockNetworkDevices, mockLoadBalancers, mockAssets } from '../data/mockData';
import { ServerItem, NetworkDeviceItem, LoadBalancerItem, AssetItem } from '../types';

interface InfrastructurePageProps {
  onOpenAssignModal: (target: string, desc: string) => void;
}

export const InfrastructurePage: React.FC<InfrastructurePageProps> = ({ onOpenAssignModal }) => {
  const [activeTab, setActiveTab] = useState('servers');
  const [networkSubTab, setNetworkSubTab] = useState<'topology' | 'list'>('topology');
  const [serverViewMode, setServerViewMode] = useState<'table' | '3d-rack'>('3d-rack');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [assetTypeFilter, setAssetTypeFilter] = useState('ALL');

  // Drawer States
  const [selectedServer, setSelectedServer] = useState<ServerItem | null>(null);
  const [showTechDetails, setShowTechDetails] = useState(false);
  const [selectedNetworkDevice, setSelectedNetworkDevice] = useState<NetworkDeviceItem | null>(null);
  const [selectedLb, setSelectedLb] = useState<LoadBalancerItem | null>(null);

  const mainTabs = [
    { id: 'servers', label: 'Servers & 3D Racks', count: 124, icon: <Server className="w-4 h-4" /> },
    { id: 'network', label: 'Network & Firewalls', count: 118, icon: <Shield className="w-4 h-4" /> },
    { id: 'load-balancers', label: 'Load Balancers', count: 2, icon: <Activity className="w-4 h-4" /> },
    { id: 'assets', label: 'Hardware Assets', count: 324, icon: <SlidersHorizontal className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Infrastructure Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Centralized DCIM control across compute servers, perimeter firewalls, routers, and interactive 3D server racks.
          </p>
        </div>
      </div>

      <Tabs tabs={mainTabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* ========================================================================= */}
      {/* 1. SERVERS TAB */}
      {/* ========================================================================= */}
      {activeTab === 'servers' && (
        <div className="space-y-6 animate-fade-in">
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl glass-panel border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold">Total Servers</span>
              <p className="text-2xl font-bold text-white mt-1">124</p>
              <span className="text-[11px] text-cyan-400">Multi-DC Nodes</span>
            </div>
            <div className="p-4 rounded-xl glass-panel border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold">Online / Healthy</span>
              <p className="text-2xl font-bold text-emerald-400 mt-1">118</p>
              <span className="text-[11px] text-emerald-400/80">95.2% Uptime</span>
            </div>
            <div className="p-4 rounded-xl glass-panel border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold">Warning</span>
              <p className="text-2xl font-bold text-amber-400 mt-1">4</p>
              <span className="text-[11px] text-amber-400/80">High Memory / Disk</span>
            </div>
            <div className="p-4 rounded-xl glass-panel border-rose-500/40">
              <span className="text-xs text-slate-400 uppercase font-semibold">Critical</span>
              <p className="text-2xl font-bold text-rose-400 mt-1">2</p>
              <span className="text-[11px] text-rose-400/80">SRV-024 (97% CPU)</span>
            </div>
          </div>

          {/* View Toggle (3D WebGL Holo-Chassis vs Table) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search servers by name, tag, or IP..."
              className="w-full sm:w-72"
            />

            <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setServerViewMode('3d-rack')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  serverViewMode === '3d-rack' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Box className="w-3.5 h-3.5" /> 3D WebGL Server Model
              </button>
              <button
                onClick={() => setServerViewMode('table')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  serverViewMode === 'table' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                Table View
              </button>
            </div>
          </div>

          {serverViewMode === '3d-rack' ? (
            <ThreeServerRackHolo
              onSelectBlade={(bladeId) => {
                const found = mockServers.find(s => s.id === bladeId);
                if (found) setSelectedServer(found);
              }}
            />
          ) : (
            <DataTable<ServerItem>
              data={mockServers.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.id.toLowerCase().includes(searchQuery.toLowerCase()) || s.ip.includes(searchQuery))}
              keyExtractor={(s) => s.id}
              columns={[
                {
                  header: 'Server Tag / Host',
                  accessor: (s) => (
                    <div>
                      <span className="font-bold text-white flex items-center gap-1.5">{s.id}</span>
                      <span className="text-xs text-slate-400 block">{s.name}</span>
                    </div>
                  ),
                },
                { header: 'IP Address', accessor: (s) => <span className="font-mono text-xs text-slate-300">{s.ip}</span> },
                { header: 'Location', accessor: 'location' },
                { header: 'Status', accessor: (s) => <StatusBadge status={s.status} /> },
                {
                  header: 'CPU Usage',
                  accessor: (s) => (
                    <div className="w-28 space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span>{s.cpu}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${s.cpu > 90 ? 'bg-rose-500' : s.cpu > 70 ? 'bg-amber-500' : 'bg-cyan-400'}`}
                          style={{ width: `${s.cpu}%` }}
                        />
                      </div>
                    </div>
                  ),
                },
                {
                  header: 'RAM Usage',
                  accessor: (s) => (
                    <div className="w-28 space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span>{s.ram}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${s.ram > 85 ? 'bg-amber-500' : 'bg-blue-400'}`}
                          style={{ width: `${s.ram}%` }}
                        />
                      </div>
                    </div>
                  ),
                },
                {
                  header: 'Actions',
                  accessor: (s) => (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedServer(s);
                        setShowTechDetails(false);
                      }}
                      icon={<Eye className="w-3.5 h-3.5" />}
                    >
                      View
                    </Button>
                  ),
                },
              ]}
            />
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. NETWORK & FIREWALLS TAB */}
      {/* ========================================================================= */}
      {activeTab === 'network' && (
        <div className="space-y-6 animate-fade-in">
          {/* Sub Tabs: Topology vs List */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setNetworkSubTab('topology')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                  networkSubTab === 'topology'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Topology View (Visual Graph)
              </button>
              <button
                onClick={() => setNetworkSubTab('list')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                  networkSubTab === 'list'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                List View (Devices)
              </button>
            </div>
            <span className="text-xs text-slate-400">118 Active Network Nodes</span>
          </div>

          {networkSubTab === 'topology' ? (
            <GlassCard className="p-8 space-y-6">
              <div className="text-center max-w-md mx-auto space-y-1 mb-8">
                <h3 className="text-base font-bold text-white">Interactive Network DCIM Topology</h3>
                <p className="text-xs text-slate-400">Click any tier to view traffic routes and device inspection parameters</p>
              </div>

              {/* Visual Multi-Tier Flow */}
              <div className="flex flex-col items-center space-y-4 max-w-2xl mx-auto">
                {/* 1. Internet */}
                <div
                  onClick={() => setSelectedNetworkDevice(mockNetworkDevices[1])}
                  className="w-64 p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-center cursor-pointer hover:border-cyan-400 transition-all shadow-md hover:scale-105"
                >
                  <Globe className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                  <span className="text-xs font-bold text-white block">Public Internet WAN</span>
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center justify-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    10 Gbps Ingress
                  </span>
                </div>

                <div className="h-6 w-0.5 bg-gradient-to-b from-cyan-400 to-amber-400 animate-pulse"></div>

                {/* 2. Firewall */}
                <div
                  onClick={() => setSelectedNetworkDevice(mockNetworkDevices[0])}
                  className="w-72 p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/40 text-center cursor-pointer hover:border-amber-400 transition-all shadow-lg hover:scale-105"
                >
                  <Shield className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                  <span className="text-xs font-bold text-white block">Edge Firewall (FW-018)</span>
                  <span className="text-[10px] text-amber-300 font-mono flex items-center justify-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                    Rule R-102 External SSH Warning
                  </span>
                </div>

                <div className="h-6 w-0.5 bg-gradient-to-b from-amber-400 to-cyan-400 animate-pulse"></div>

                {/* 3. Router */}
                <div
                  onClick={() => setSelectedNetworkDevice(mockNetworkDevices[2])}
                  className="w-64 p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-center cursor-pointer hover:border-cyan-400 transition-all hover:scale-105"
                >
                  <span className="text-xs font-bold text-white block">Core BGP Router (RTR-001)</span>
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center justify-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    0.2ms Subnet Latency
                  </span>
                </div>

                <div className="h-6 w-0.5 bg-cyan-500/50"></div>

                {/* 4. Switch */}
                <div
                  onClick={() => setSelectedNetworkDevice(mockNetworkDevices[3])}
                  className="w-64 p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-center cursor-pointer hover:border-cyan-400 transition-all hover:scale-105"
                >
                  <span className="text-xs font-bold text-white block">Distribution Switch (SW-001)</span>
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center justify-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    48 x 100GbE Ports Active
                  </span>
                </div>

                <div className="h-6 w-0.5 bg-cyan-500/50"></div>

                {/* 5. Load Balancer */}
                <div
                  onClick={() => setSelectedLb(mockLoadBalancers[0])}
                  className="w-72 p-3.5 rounded-xl bg-slate-900 border border-cyan-500/40 text-center cursor-pointer hover:border-cyan-300 transition-all shadow-lg hover:scale-105"
                >
                  <Activity className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                  <span className="text-xs font-bold text-white block">Portal Load Balancer (LB-001)</span>
                  <span className="text-[10px] text-cyan-300 font-mono flex items-center justify-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    18,240 req/min (4 Backends)
                  </span>
                </div>

                <div className="h-6 w-0.5 bg-cyan-500/50"></div>

                {/* 6. Compute Cluster */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
                  {mockServers.map((srv) => (
                    <div
                      key={srv.id}
                      onClick={() => setSelectedServer(srv)}
                      className={`p-3 rounded-xl border text-center cursor-pointer transition-all hover:scale-[1.03] ${
                        srv.status === 'Critical' ? 'bg-rose-950/30 border-rose-500/50 shadow-[0_0_12px_rgba(244,63,94,0.25)]' : 'bg-slate-900 border-slate-800'
                      }`}
                    >
                      <Server className={`w-4 h-4 mx-auto mb-1 ${srv.status === 'Critical' ? 'text-rose-400' : 'text-cyan-400'}`} />
                      <span className="text-[11px] font-bold text-white block">{srv.id}</span>
                      <span className={`text-[10px] font-mono font-bold ${srv.status === 'Critical' ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {srv.cpu}% CPU
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          ) : (
            <DataTable<NetworkDeviceItem>
              data={mockNetworkDevices}
              keyExtractor={(d) => d.id}
              columns={[
                {
                  header: 'Device Tag',
                  accessor: (d) => (
                    <div>
                      <span className="font-bold text-white">{d.id}</span>
                      <span className="text-xs text-slate-400 block">{d.name}</span>
                    </div>
                  ),
                },
                { header: 'Device Type', accessor: 'type' },
                { header: 'IP Address', accessor: (d) => <span className="font-mono text-xs">{d.ip}</span> },
                { header: 'Location', accessor: 'location' },
                { header: 'Firmware', accessor: 'firmware' },
                { header: 'Status', accessor: (d) => <StatusBadge status={d.status} /> },
                { header: 'Last Checked', accessor: 'lastChecked' },
                {
                  header: 'Action',
                  accessor: (d) => (
                    <Button variant="outline" size="sm" onClick={() => setSelectedNetworkDevice(d)} icon={<Eye className="w-3.5 h-3.5" />}>
                      View
                    </Button>
                  ),
                },
              ]}
            />
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. LOAD BALANCERS TAB */}
      {/* ========================================================================= */}
      {activeTab === 'load-balancers' && (
        <div className="space-y-6 animate-fade-in">
          <DataTable<LoadBalancerItem>
            data={mockLoadBalancers}
            keyExtractor={(lb) => lb.id}
            columns={[
              {
                header: 'Load Balancer',
                accessor: (lb) => (
                  <div>
                    <span className="font-bold text-white">{lb.id}</span>
                    <span className="text-xs text-slate-400 block">{lb.name}</span>
                  </div>
                ),
              },
              { header: 'Status', accessor: (lb) => <StatusBadge status={lb.status} /> },
              { header: 'Traffic Rate', accessor: (lb) => <span className="font-mono text-cyan-300 font-semibold">{lb.traffic}</span> },
              { header: 'Active Connections', accessor: (lb) => <span className="font-mono">{lb.connections.toLocaleString()}</span> },
              { header: 'Backend Pool', accessor: (lb) => <span>{lb.backendServersCount} Nodes</span> },
              { header: 'Health Index', accessor: (lb) => <span className="font-bold text-emerald-400">{lb.health}%</span> },
              {
                header: 'Action',
                accessor: (lb) => (
                  <Button variant="outline" size="sm" onClick={() => setSelectedLb(lb)} icon={<Eye className="w-3.5 h-3.5" />}>
                    View
                  </Button>
                ),
              },
            ]}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. ASSETS TAB (HARDWARE INVENTORY) */}
      {/* ========================================================================= */}
      {activeTab === 'assets' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            <div className="p-3.5 rounded-xl glass-panel border-slate-800">
              <span className="text-xs text-slate-400 block">Total Assets</span>
              <span className="text-xl font-bold text-white mt-1 block">324</span>
            </div>
            <div className="p-3.5 rounded-xl glass-panel border-slate-800">
              <span className="text-xs text-slate-400 block">Servers</span>
              <span className="text-xl font-bold text-cyan-400 mt-1 block">124</span>
            </div>
            <div className="p-3.5 rounded-xl glass-panel border-slate-800">
              <span className="text-xs text-slate-400 block">Network Devices</span>
              <span className="text-xl font-bold text-indigo-400 mt-1 block">118</span>
            </div>
            <div className="p-3.5 rounded-xl glass-panel border-slate-800">
              <span className="text-xs text-slate-400 block">Firewalls</span>
              <span className="text-xl font-bold text-amber-400 mt-1 block">38</span>
            </div>
            <div className="p-3.5 rounded-xl glass-panel border-slate-800">
              <span className="text-xs text-slate-400 block">Load Balancers</span>
              <span className="text-xl font-bold text-emerald-400 mt-1 block">44</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <FilterBar
              selectedValue={assetTypeFilter}
              onSelect={setAssetTypeFilter}
              options={[
                { label: 'All Assets', value: 'ALL' },
                { label: 'Servers', value: 'Server' },
                { label: 'Firewalls', value: 'Firewall' },
                { label: 'Switches', value: 'Switch' },
                { label: 'Load Balancers', value: 'Load Balancer' },
              ]}
            />
          </div>

          <DataTable<AssetItem>
            data={mockAssets.filter(a => assetTypeFilter === 'ALL' || a.type === assetTypeFilter)}
            keyExtractor={(a) => a.id}
            columns={[
              { header: 'Asset ID', accessor: (a) => <span className="font-bold text-white">{a.id}</span> },
              { header: 'Asset Type', accessor: 'type' },
              { header: 'Hardware Model', accessor: 'model' },
              { header: 'DC Location', accessor: 'location' },
              { header: 'Warranty Status', accessor: (a) => <span className="text-emerald-400 text-xs font-semibold">{a.warranty}</span> },
              { header: 'Last Maintenance', accessor: 'maintenance' },
              { header: 'Status', accessor: (a) => <StatusBadge status={a.status} /> },
            ]}
          />
        </div>
      )}

      {/* SERVER DETAIL DRAWER */}
      {selectedServer && (
        <Drawer
          isOpen={!!selectedServer}
          onClose={() => setSelectedServer(null)}
          title={`Server Details — ${selectedServer.id}`}
          subtitle={`${selectedServer.name} • ${selectedServer.ip}`}
          footer={
            <div className="flex items-center gap-2 w-full justify-between">
              <Button
                variant="primary"
                size="sm"
                onClick={() => onOpenAssignModal(selectedServer.id, selectedServer.whatHappened || 'Server Investigation')}
                icon={<UserCheck className="w-4 h-4" />}
              >
                Assign Technician
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setSelectedServer(null)}>
                Close
              </Button>
            </div>
          }
        >
          <div className="space-y-6">
            <div className={`p-4 rounded-xl border ${
              selectedServer.status === 'Critical' ? 'bg-rose-950/20 border-rose-500/40' : 'bg-slate-900 border-slate-800'
            }`}>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400 block mb-1">
                What is happening?
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {selectedServer.whatHappened || 'Server is operating nominally within standard baseline limits.'}
              </p>

              {selectedServer.impact && (
                <div className="mt-3 pt-3 border-t border-slate-800/80">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-0.5">
                    Operational Impact
                  </span>
                  <p className="text-xs text-slate-400">{selectedServer.impact}</p>
                </div>
              )}

              {selectedServer.recommendedAction && (
                <div className="mt-3 pt-3 border-t border-slate-800/80">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block mb-0.5">
                    Recommended Action
                  </span>
                  <p className="text-xs text-cyan-200 font-medium">{selectedServer.recommendedAction}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase block">CPU Load</span>
                <span className={`text-lg font-bold ${selectedServer.cpu > 90 ? 'text-rose-400' : 'text-slate-100'}`}>
                  {selectedServer.cpu}%
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase block">RAM Usage</span>
                <span className="text-lg font-bold text-slate-100">{selectedServer.ram}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase block">Disk Vol</span>
                <span className="text-lg font-bold text-slate-100">{selectedServer.disk}%</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Node Properties</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Operating System</span>
                  <span className="text-slate-200 font-medium">{selectedServer.os}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Location</span>
                  <span className="text-slate-200 font-medium">{selectedServer.location}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Assigned Technician</span>
                  <span className="text-cyan-400 font-medium">{selectedServer.assignedTechnician || 'Unassigned'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Last Maintenance</span>
                  <span className="text-slate-200 font-mono">{selectedServer.lastMaintenance}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowTechDetails(!showTechDetails)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 text-xs font-bold text-cyan-400 transition-colors"
              >
                <span>{showTechDetails ? 'Hide Technical Details' : 'View Technical Details (Processes, Hardware Specs, eBPF)'}</span>
                {showTechDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showTechDetails && (
                <div className="mt-3 space-y-4 animate-fade-in">
                  {selectedServer.specs && (
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs font-mono">
                      <p className="text-slate-400 text-[11px] font-sans font-semibold">Hardware Configuration:</p>
                      <p className="text-slate-300">CPU: {selectedServer.specs.cpuModel} ({selectedServer.specs.cores} Cores)</p>
                      <p className="text-slate-300">Memory: {selectedServer.specs.totalRamGb} GB ECC DDR4</p>
                      <p className="text-slate-300">Storage: {selectedServer.specs.storageTb} TB NVMe RAID-10</p>
                    </div>
                  )}

                  {selectedServer.processes && (
                    <div>
                      <p className="text-xs font-semibold text-slate-400 mb-2">Top Active Processes:</p>
                      <div className="rounded-lg border border-slate-800 overflow-hidden text-xs">
                        <table className="w-full text-left font-mono">
                          <thead className="bg-slate-900 text-[10px] text-slate-400 uppercase">
                            <tr>
                              <th className="px-3 py-1.5">PID</th>
                              <th className="px-3 py-1.5">Command</th>
                              <th className="px-3 py-1.5">% CPU</th>
                              <th className="px-3 py-1.5">% Mem</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60 bg-slate-950/60">
                            {selectedServer.processes.map((proc) => (
                              <tr key={proc.pid} className="hover:bg-slate-900">
                                <td className="px-3 py-1.5 text-cyan-400">{proc.pid}</td>
                                <td className="px-3 py-1.5 text-slate-200">{proc.name}</td>
                                <td className={`px-3 py-1.5 font-bold ${proc.cpu > 30 ? 'text-rose-400' : 'text-slate-300'}`}>
                                  {proc.cpu}%
                                </td>
                                <td className="px-3 py-1.5 text-slate-400">{proc.memory}%</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Drawer>
      )}

      {/* LOAD BALANCER DETAIL DRAWER */}
      {selectedLb && (
        <Drawer
          isOpen={!!selectedLb}
          onClose={() => setSelectedLb(null)}
          title={`Load Balancer — ${selectedLb.id}`}
          subtitle={`${selectedLb.name} • Algorithm: ${selectedLb.algorithm}`}
        >
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold uppercase">Cluster Availability</span>
                <span className="text-emerald-400 font-bold text-xs">{selectedLb.health}% Healthy</span>
              </div>
              <p className="text-xs text-slate-300">
                Distributing ingress HTTP/S traffic across {selectedLb.backends.length} backend server nodes with active health checks.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Backend Server Pool</h4>
              <div className="space-y-2">
                {selectedLb.backends.map((b) => (
                  <div key={b.name} className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white block">{b.name}</span>
                      <span className="text-slate-400 font-mono text-[10px]">{b.ip}</span>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={b.status} size="sm" />
                      <span className="text-[10px] text-slate-400 block font-mono mt-0.5">{b.latency}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Drawer>
      )}

      {/* NETWORK DEVICE DRAWER */}
      {selectedNetworkDevice && (
        <Drawer
          isOpen={!!selectedNetworkDevice}
          onClose={() => setSelectedNetworkDevice(null)}
          title={`Device Details — ${selectedNetworkDevice.id}`}
          subtitle={`${selectedNetworkDevice.name} • ${selectedNetworkDevice.ip}`}
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold uppercase">Device Type</span>
                <StatusBadge status={selectedNetworkDevice.status} />
              </div>
              <p className="text-xs text-slate-300">{selectedNetworkDevice.type} located at {selectedNetworkDevice.location}.</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Firmware Version</span>
                <span className="text-slate-200 font-mono">{selectedNetworkDevice.firmware}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Management Port</span>
                <span className="text-cyan-400 font-mono">{selectedNetworkDevice.managementPort}</span>
              </div>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
};
