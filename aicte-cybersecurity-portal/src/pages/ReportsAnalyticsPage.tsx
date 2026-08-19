import React, { useState } from 'react';
import { 
  BarChart3, FileText, Download, Eye, 
  RefreshCw, CheckCircle2, TrendingUp, ShieldAlert, Server, Activity 
} from 'lucide-react';
import { Tabs } from '../components/common/Tabs';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';

export const ReportsAnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [previewReport, setPreviewReport] = useState<string | null>(null);
  const [exportNotification, setExportNotification] = useState<string | null>(null);

  const reportTabs = [
    { id: 'overview', label: 'Executive Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'infrastructure', label: 'Infrastructure Analytics', icon: <Server className="w-4 h-4" /> },
    { id: 'security', label: 'Security Analytics', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'reports', label: 'Exportable Reports', count: 6, icon: <FileText className="w-4 h-4" /> },
  ];

  const reportsList = [
    { id: 'rep-1', title: 'Monthly Infrastructure Health Report', desc: 'Aggregated compute uptime, CPU/RAM quantiles, storage projections, and hardware maintenance logs.', lastGen: '2026-08-01', format: 'PDF & CSV' },
    { id: 'rep-2', title: 'SOC Security Incident Forensic Report', desc: 'Comprehensive incident timelines, firewall drop statistics, WAN exposure alerts, and MTTR records.', lastGen: 'Today at 08:00 AM', format: 'PDF' },
    { id: 'rep-3', title: 'Enterprise License Compliance Audit', desc: 'Detailed license seat utilization, expiration countdowns, and renewal requisition estimates.', lastGen: 'Yesterday', format: 'PDF & CSV' },
    { id: 'rep-4', title: 'Hardware Asset Inventory & Warranty Report', desc: 'Full DCIM asset tags, warranty expiration schedules, and scheduled maintenance checklists.', lastGen: '3 days ago', format: 'CSV' },
    { id: 'rep-5', title: 'Zero-Trust Audit Log & Access Trail', desc: 'Cryptographically timestamped user actions, firewall rule changes, and authentication logs.', lastGen: 'Today at 10:00 AM', format: 'CSV' },
    { id: 'rep-6', title: 'Data Center Power & Thermal Efficiency', desc: 'Rack temperature heatmaps, PUE measurements, and HVAC chiller telemetry.', lastGen: '1 week ago', format: 'PDF' },
  ];

  const handleExport = (title: string, format: string) => {
    setExportNotification(`Generating and downloading ${title} (${format})...`);
    setTimeout(() => {
      setExportNotification(null);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Reports & Telemetry Analytics</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Holistic data center analytics, threat vector trending, and automated compliance report generation.
          </p>
        </div>
      </div>

      <Tabs tabs={reportTabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Export Toast Notification */}
      {exportNotification && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{exportNotification}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. OVERVIEW CHARTS TAB */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Chart 1: Infrastructure Availability */}
            <GlassCard className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Infrastructure Availability</span>
                <span className="text-emerald-400 font-mono text-xs font-bold">99.94%</span>
              </div>
              <p className="text-[11px] text-slate-400">30-day continuous cluster availability SLA</p>
              <div className="flex items-end gap-1.5 h-24 pt-4">
                {[99.9, 99.8, 100, 99.7, 99.9, 100, 99.8, 99.9, 100, 99.9].map((val, i) => (
                  <div key={i} className="flex-1 bg-emerald-500/30 hover:bg-emerald-400 transition-colors rounded-t h-full flex items-end">
                    <div className="w-full bg-emerald-400 rounded-t" style={{ height: `${(val - 98) * 50}%` }} />
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Chart 2: Average CPU Load */}
            <GlassCard className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">CPU Utilization Trend</span>
                <span className="text-cyan-400 font-mono text-xs font-bold">Avg: 54.2%</span>
              </div>
              <p className="text-[11px] text-slate-400">Mean load across 124 compute nodes</p>
              <div className="flex items-end gap-1.5 h-24 pt-4">
                {[42, 48, 55, 68, 52, 49, 78, 62, 54, 84].map((val, i) => (
                  <div key={i} className="flex-1 bg-slate-800 rounded-t h-full flex items-end">
                    <div
                      className={`w-full rounded-t ${val > 75 ? 'bg-rose-500' : val > 60 ? 'bg-amber-400' : 'bg-cyan-400'}`}
                      style={{ height: `${val}%` }}
                    />
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Chart 3: Network Throughput */}
            <GlassCard className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Ingress & Egress Traffic</span>
                <span className="text-blue-400 font-mono text-xs font-bold">2.4 Gbps Peak</span>
              </div>
              <p className="text-[11px] text-slate-400">Aggregated WAN edge firewall bandwidth</p>
              <div className="flex items-end gap-1.5 h-24 pt-4">
                {[1.2, 1.4, 1.8, 2.1, 1.9, 2.4, 2.0, 1.7, 1.9, 2.2].map((val, i) => (
                  <div key={i} className="flex-1 bg-blue-500/20 rounded-t h-full flex items-end">
                    <div className="w-full bg-blue-400 rounded-t" style={{ height: `${(val / 2.5) * 100}%` }} />
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. INFRASTRUCTURE ANALYTICS */}
      {/* ========================================================================= */}
      {activeTab === 'infrastructure' && (
        <div className="space-y-6 animate-fade-in">
          <GlassCard className="p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Compute & Network Uptime Statistics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block mb-1">Server Cluster Uptime</span>
                <span className="text-2xl font-bold text-emerald-400 font-mono">99.98%</span>
                <p className="text-[11px] text-slate-500 mt-1">Zero unscheduled outages this month</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block mb-1">Mean Time to Remediate (MTTR)</span>
                <span className="text-2xl font-bold text-cyan-400 font-mono">14.2 Mins</span>
                <p className="text-[11px] text-slate-500 mt-1">Automated technician dispatch routing</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block mb-1">Storage Free Capacity</span>
                <span className="text-2xl font-bold text-indigo-400 font-mono">42.8 TB</span>
                <p className="text-[11px] text-slate-500 mt-1">Across 8 DCIM storage pools</p>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SECURITY ANALYTICS */}
      {/* ========================================================================= */}
      {activeTab === 'security' && (
        <div className="space-y-6 animate-fade-in">
          <GlassCard className="p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Perimeter Security & Incident Trends</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block mb-1">Firewall Blocked Probes</span>
                <span className="text-2xl font-bold text-cyan-400 font-mono">1.2M+</span>
                <p className="text-[11px] text-slate-500 mt-1">Dropped via automated perimeter ACLs</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block mb-1">Zero-Trust Auth Success</span>
                <span className="text-2xl font-bold text-emerald-400 font-mono">99.8%</span>
                <p className="text-[11px] text-slate-500 mt-1">Casbin token validation pass rate</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block mb-1">Active Threat Containment</span>
                <span className="text-2xl font-bold text-amber-400 font-mono">100%</span>
                <p className="text-[11px] text-slate-500 mt-1">All anomalies quarantined in &lt; 30s</p>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. REPORTS TAB */}
      {/* ========================================================================= */}
      {activeTab === 'reports' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {reportsList.map((rep) => (
              <GlassCard key={rep.id} className="space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-cyan-400 font-bold uppercase">{rep.format}</span>
                    <span className="text-[10px] text-slate-500 font-mono">Last Generated: {rep.lastGen}</span>
                  </div>
                  <h3 className="text-base font-bold text-white">{rep.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{rep.desc}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPreviewReport(rep.title)} icon={<Eye className="w-3.5 h-3.5" />}>
                    Preview
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" onClick={() => handleExport(rep.title, 'CSV')} icon={<Download className="w-3.5 h-3.5" />}>
                      Export CSV
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => handleExport(rep.title, 'PDF')} icon={<Download className="w-3.5 h-3.5" />}>
                      Export PDF
                    </Button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* PREVIEW REPORT MODAL */}
      {previewReport && (
        <Modal
          isOpen={!!previewReport}
          onClose={() => setPreviewReport(null)}
          title={`Report Preview — ${previewReport}`}
          subtitle="AICTE Data Center Infrastructure Management Standard Format"
          maxWidth="max-w-3xl"
          footer={
            <Button variant="secondary" size="sm" onClick={() => setPreviewReport(null)}>
              Close Preview
            </Button>
          }
        >
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4 font-sans text-xs">
            <div className="border-b border-slate-800 pb-3 flex justify-between">
              <div>
                <h4 className="font-bold text-white text-sm">All India Council for Technical Education</h4>
                <p className="text-slate-400">Data Center Management Division • Report Date: August 2026</p>
              </div>
              <span className="text-xs font-mono text-cyan-400 font-bold">CONFIDENTIAL</span>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-white uppercase text-[11px]">1. Executive Summary</h5>
              <p className="text-slate-300 leading-relaxed">
                During the current reporting cycle, AICTE data center nodes across New Delhi (DC A) and Bengaluru (DC B) maintained an aggregated 99.98% infrastructure availability index. Automated anomaly isolation responded to 18 potential threat vectors with zero data leakage.
              </p>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-white uppercase text-[11px]">2. Key Telemetry Indicators</h5>
              <div className="grid grid-cols-3 gap-2 font-mono">
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Total Nodes</span>
                  <span className="text-white font-bold">124 Servers</span>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Compliance</span>
                  <span className="text-emerald-400 font-bold">92% Met</span>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Mean MTTR</span>
                  <span className="text-cyan-400 font-bold">14.2 Mins</span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
