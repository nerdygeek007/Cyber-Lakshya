import React, { useState } from 'react';
import { 
  Workflow, Cpu, Network, CheckCircle2, 
  ArrowRight, ToggleLeft, ToggleRight, Eye, Code2, RefreshCw, FileCode, Check 
} from 'lucide-react';
import { Tabs } from '../components/common/Tabs';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { Drawer } from '../components/common/Drawer';
import { Modal } from '../components/common/Modal';
import { ActivityTimeline } from '../components/common/ActivityTimeline';
import { mockConnectedSystems, mockWorkflows, mockAPIs } from '../data/mockData';
import { WorkflowItem, ConnectedSystemItem, APIItem } from '../types';

export const IntegrationAutomationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('systems');
  const [workflows, setWorkflows] = useState(mockWorkflows);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowItem | null>(null);
  const [selectedApi, setSelectedApi] = useState<APIItem | null>(null);
  const [selectedSystem, setSelectedSystem] = useState<ConnectedSystemItem | null>(null);

  const integrationTabs = [
    { id: 'systems', label: 'Connected Systems', count: 4, icon: <Network className="w-4 h-4" /> },
    { id: 'workflows', label: 'Automation Workflows', count: 3, icon: <Workflow className="w-4 h-4" /> },
    { id: 'apis', label: 'Enterprise APIs', count: 5, icon: <Code2 className="w-4 h-4" /> },
    { id: 'activity', label: 'Automation Logs', count: 5, icon: <RefreshCw className="w-4 h-4" /> },
  ];

  const automationLogs = [
    { id: '1', time: '10:46 PM', title: 'Issue acknowledged by technician', description: 'Technician Vikram Patel accepted task dispatch.', type: 'task' as const, author: 'ITSM Engine' },
    { id: '2', time: '10:44 PM', title: 'Technician assigned automatically', description: 'Matched on-call infrastructure rotation.', type: 'system' as const, author: 'Workflow Core' },
    { id: '3', time: '10:43 PM', title: 'Administrator notified via SMS/Email', description: 'Dispatch event sent to lead admin.', type: 'system' as const, author: 'Notification Gateway' },
    { id: '4', time: '10:42 PM', title: 'ITSM Ticket #INC-1042 created', description: 'Incident payload generated with telemetry snapshot.', type: 'system' as const, author: 'CMDB Connector' },
    { id: '5', time: '10:42 PM', title: 'Autonomous alert detected', description: 'Server SRV-024 resource threshold crossed.', type: 'alert' as const, author: 'Prometheus eBPF' },
  ];

  const toggleWorkflowStatus = (id: string) => {
    setWorkflows(prev => prev.map(w => w.id === id ? { ...w, status: w.status === 'Active' ? 'Paused' : 'Active' } : w));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Integration & Automation Engine</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Zero-code incident triggers, automated ITSM ticket routing, CMDB discovery synchronization, and developer APIs.
          </p>
        </div>
      </div>

      <Tabs tabs={integrationTabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* ========================================================================= */}
      {/* 1. CONNECTED SYSTEMS TAB */}
      {/* ========================================================================= */}
      {activeTab === 'systems' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {mockConnectedSystems.map((sys) => (
              <GlassCard key={sys.id} className="space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">{sys.type}</span>
                    <StatusBadge status={sys.status} size="sm" />
                  </div>
                  <h3 className="text-base font-bold text-white">{sys.name}</h3>
                  <div className="mt-3 space-y-1.5 text-xs text-slate-300">
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-500">Payload Type:</span>
                      <span className="font-medium text-slate-200">{sys.dataType}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-500">Last Synchronized:</span>
                      <span className="font-mono text-emerald-400">{sys.lastSync}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedSystem(sys)}>
                    View Metrics
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => setSelectedSystem(sys)}>
                    Configure Integration
                  </Button>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. WORKFLOWS TAB */}
      {/* ========================================================================= */}
      {activeTab === 'workflows' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {workflows.map((wf) => (
              <GlassCard key={wf.id} className="space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-cyan-400 font-bold">{wf.id}</span>
                    <button
                      onClick={() => toggleWorkflowStatus(wf.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                        wf.status === 'Active'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {wf.status === 'Active' ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4" />}
                      <span>{wf.status}</span>
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-2">{wf.name}</h3>

                  <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs mb-3">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Trigger Condition</span>
                    <span className="text-slate-300">{wf.trigger}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1.5">Executed Actions</span>
                    <div className="space-y-1">
                      {wf.actions.map((act, i) => (
                        <div key={i} className="text-xs text-slate-300 flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>{act}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Executions Today: <b className="text-white font-mono">{wf.executionsToday}</b></span>
                  <Button variant="outline" size="sm" onClick={() => setSelectedWorkflow(wf)}>
                    View Workflow
                  </Button>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. APIS TAB */}
      {/* ========================================================================= */}
      {activeTab === 'apis' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {mockAPIs.map((api) => (
              <GlassCard key={api.id} className="space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-cyan-400 font-bold">{api.id}</span>
                    <StatusBadge status={api.status} size="sm" />
                  </div>
                  <h3 className="text-sm font-bold text-white">{api.name}</h3>
                  <p className="text-xs text-slate-400 font-mono mt-1 bg-slate-950 p-2 rounded border border-slate-800">
                    {api.endpoint}
                  </p>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-300">
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Requests Today</span>
                      <span className="font-mono font-bold text-white">{api.requestsToday.toLocaleString()}</span>
                    </div>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Last Request</span>
                      <span className="font-mono text-emerald-400">{api.lastRequest}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setSelectedApi(api)}
                    icon={<FileCode className="w-3.5 h-3.5" />}
                  >
                    View Documentation
                  </Button>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. ACTIVITY LOGS TAB */}
      {/* ========================================================================= */}
      {activeTab === 'activity' && (
        <div className="space-y-6 animate-fade-in">
          <GlassCard className="space-y-4">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Automated Pipeline Execution History</h3>
                <p className="text-xs text-slate-400">Chronological execution trail of automated system responses</p>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-semibold">100% Success Rate</span>
            </div>

            <ActivityTimeline activities={automationLogs} />
          </GlassCard>
        </div>
      )}

      {/* API DOCS MODAL */}
      {selectedApi && (
        <Modal
          isOpen={!!selectedApi}
          onClose={() => setSelectedApi(null)}
          title={`API Reference — ${selectedApi.name}`}
          subtitle={`Endpoint: ${selectedApi.endpoint} • Protocol: HTTPS / REST / JSON`}
          maxWidth="max-w-2xl"
          footer={
            <Button variant="secondary" size="sm" onClick={() => setSelectedApi(null)}>
              Close
            </Button>
          }
        >
          <div className="space-y-4 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <p className="text-cyan-400 font-bold">GET {selectedApi.endpoint}</p>
              <p className="text-slate-400 font-sans">Authorization: Bearer &lt;AICTE_JWT_TOKEN&gt;</p>
              <p className="text-slate-400 font-sans">Header: X-Role: Administrator</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-sans font-semibold block">Sample JSON Response:</span>
              <pre className="text-emerald-300 text-[11px] overflow-x-auto">
{`{
  "status": "success",
  "data_center": "AICTE-DC-01",
  "total_records": 124,
  "timestamp": "2026-08-18T21:40:00Z"
}`}
              </pre>
            </div>
          </div>
        </Modal>
      )}

      {/* WORKFLOW DETAIL DRAWER */}
      {selectedWorkflow && (
        <Drawer
          isOpen={!!selectedWorkflow}
          onClose={() => setSelectedWorkflow(null)}
          title={selectedWorkflow.name}
          subtitle={`Status: ${selectedWorkflow.status} • Total Runs: ${selectedWorkflow.executionsToday}`}
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-cyan-400 uppercase">Trigger</span>
              <p className="text-xs text-slate-200">{selectedWorkflow.trigger}</p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Workflow Steps</h4>
              <div className="space-y-2">
                {selectedWorkflow.actions.map((act, i) => (
                  <div key={i} className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold font-mono text-[10px]">
                      {i + 1}
                    </span>
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
};
