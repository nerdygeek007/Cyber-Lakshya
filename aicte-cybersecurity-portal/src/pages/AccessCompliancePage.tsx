import React, { useState } from 'react';
import { 
  Users, ShieldCheck, FileText, CheckCircle2, 
  AlertTriangle, Eye, ArrowRight, Check, X, Shield, Lock, Clock, UserCheck 
} from 'lucide-react';
import { Tabs } from '../components/common/Tabs';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { DataTable } from '../components/common/DataTable';
import { Drawer } from '../components/common/Drawer';
import { Modal } from '../components/common/Modal';
import { ActivityTimeline } from '../components/common/ActivityTimeline';
import { mockUsers, mockSoftwareLicenses, mockComplianceControls, mockPermissionMatrix } from '../data/mockData';
import { UserItem, SoftwareLicenseItem } from '../types';

interface AccessCompliancePageProps {
  onOpenAssignModal: (target: string, desc: string) => void;
}

export const AccessCompliancePage: React.FC<AccessCompliancePageProps> = ({ onOpenAssignModal }) => {
  const [activeTab, setActiveTab] = useState('users');
  const [showMatrixModal, setShowMatrixModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [selectedLicense, setSelectedLicense] = useState<SoftwareLicenseItem | null>(null);

  const complianceTabs = [
    { id: 'users', label: 'Users & Roles (RBAC)', count: 42, icon: <Users className="w-4 h-4" /> },
    { id: 'licenses', label: 'Software Licenses', count: 248, icon: <FileText className="w-4 h-4" /> },
    { id: 'compliance', label: 'Compliance & Governance', count: 20, icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  const complianceTimeline = [
    { id: '1', time: 'Today', title: 'Access Control (RBAC) reviewed', description: 'Zero-Trust matrix verified with zero policy drift.', type: 'security' as const, author: 'Aarav Mehta' },
    { id: '2', time: 'Today', title: 'Audit Logging integrity verified', description: 'SHA-256 state logs validated against tampering.', type: 'task' as const, author: 'Neha Desai' },
    { id: '3', time: 'Yesterday', title: 'License compliance requires attention', description: 'VMware vSphere entered 8-day expiration threshold.', type: 'alert' as const, author: 'Licensing Desk' },
    { id: '4', time: 'Yesterday', title: 'Firewall perimeter policy verified', description: 'Palo Alto and Fortinet rulesets cross-checked.', type: 'system' as const, author: 'SOC Engine' },
    { id: '5', time: '2 days ago', title: 'Patch management review required', description: '2 Linux nodes queued for preventive kernel patching.', type: 'alert' as const, author: 'Vikram Patel' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Access, Licensing & Compliance Governance</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Role-Based Access Control (RBAC), software license entitlements, and NIST SP 800-53 security compliance tracking.
          </p>
        </div>
      </div>

      <Tabs tabs={complianceTabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* ========================================================================= */}
      {/* 1. USERS & ROLES TAB */}
      {/* ========================================================================= */}
      {activeTab === 'users' && (
        <div className="space-y-6 animate-fade-in">
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl glass-panel border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold">Total Users</span>
              <p className="text-2xl font-bold text-white mt-1">42</p>
              <span className="text-[11px] text-cyan-400">AICTE Enterprise Directory</span>
            </div>
            <div className="p-4 rounded-xl glass-panel border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold">Active Sessions</span>
              <p className="text-2xl font-bold text-emerald-400 mt-1">38</p>
              <span className="text-[11px] text-emerald-400/80">MFA Enforced</span>
            </div>
            <div className="p-4 rounded-xl glass-panel border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold">Pending Invitations</span>
              <p className="text-2xl font-bold text-amber-400 mt-1">4</p>
              <span className="text-[11px] text-amber-400/80">Awaiting DCIM Signoff</span>
            </div>
            <div className="p-4 rounded-xl glass-panel border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold">Defined Roles</span>
              <p className="text-2xl font-bold text-indigo-400 mt-1">5 Roles</p>
              <span className="text-[11px] text-indigo-400/80">Least-Privilege Model</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Authorized Operational Personnel</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMatrixModal(true)}
              icon={<Shield className="w-4 h-4" />}
            >
              View Permission Matrix
            </Button>
          </div>

          <DataTable<UserItem>
            data={mockUsers}
            keyExtractor={(u) => u.id}
            columns={[
              {
                header: 'User Name / Email',
                accessor: (u) => (
                  <div>
                    <span className="font-bold text-white block">{u.name}</span>
                    <span className="text-xs text-slate-400">{u.email}</span>
                  </div>
                ),
              },
              {
                header: 'Assigned Role',
                accessor: (u) => (
                  <span className="font-semibold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 text-xs">
                    {u.role}
                  </span>
                ),
              },
              { header: 'Department', accessor: 'department' },
              { header: 'Last Active', accessor: (u) => <span className="font-mono text-xs">{u.lastActive}</span> },
              { header: 'Status', accessor: (u) => <StatusBadge status={u.status === 'Active' ? 'Healthy' : 'Pending'} /> },
              {
                header: 'Actions',
                accessor: (u) => (
                  <Button variant="outline" size="sm" onClick={() => setSelectedUser(u)} icon={<Eye className="w-3.5 h-3.5" />}>
                    View
                  </Button>
                ),
              },
            ]}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SOFTWARE LICENSES TAB */}
      {/* ========================================================================= */}
      {activeTab === 'licenses' && (
        <div className="space-y-6 animate-fade-in">
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl glass-panel border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold">Total Licenses</span>
              <p className="text-2xl font-bold text-white mt-1">248</p>
              <span className="text-[11px] text-cyan-400">Enterprise Software</span>
            </div>
            <div className="p-4 rounded-xl glass-panel border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold">Active & Compliant</span>
              <p className="text-2xl font-bold text-emerald-400 mt-1">221</p>
              <span className="text-[11px] text-emerald-400/80">89.1% Compliance</span>
            </div>
            <div className="p-4 rounded-xl glass-panel border-amber-500/30">
              <span className="text-xs text-slate-400 uppercase font-semibold">Expiring Soon</span>
              <p className="text-2xl font-bold text-amber-400 mt-1">12</p>
              <span className="text-[11px] text-amber-400/80">&lt; 30 Days Left</span>
            </div>
            <div className="p-4 rounded-xl glass-panel border-rose-500/30">
              <span className="text-xs text-slate-400 uppercase font-semibold">Expired</span>
              <p className="text-2xl font-bold text-rose-400 mt-1">3</p>
              <span className="text-[11px] text-rose-400/80">Action Required</span>
            </div>
          </div>

          {/* License Utilization Progress Bars */}
          <GlassCard className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">License Seat & Core Utilization</h3>
              <p className="text-xs text-slate-400">Active server allocations against purchased seat quotas</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-semibold">Windows Server Standard (92 / 100 Cores)</span>
                  <span className="text-cyan-400 font-mono font-bold">92%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-cyan-400 h-full w-[92%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-semibold">VMware vSphere Enterprise (100 / 100 Cores)</span>
                  <span className="text-amber-400 font-mono font-bold">100% (Full)</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full w-[100%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-semibold">PostgreSQL EnterpriseDB (45 / 50 Instances)</span>
                  <span className="text-emerald-400 font-mono font-bold">90%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full w-[90%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-semibold">Adobe Creative Cloud Enterprise (38 / 50 Seats)</span>
                  <span className="text-blue-400 font-mono font-bold">76%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-400 h-full w-[76%]"></div>
                </div>
              </div>
            </div>
          </GlassCard>

          <DataTable<SoftwareLicenseItem>
            data={mockSoftwareLicenses}
            keyExtractor={(l) => l.id}
            columns={[
              {
                header: 'Software Title',
                accessor: (l) => (
                  <div>
                    <span className="font-bold text-white block">{l.name}</span>
                    <span className="text-xs text-slate-400 font-mono">Vendor: {l.vendor}</span>
                  </div>
                ),
              },
              { header: 'Category', accessor: 'category' },
              { header: 'Quota Usage', accessor: (l) => <span className="font-mono">{l.usedQuantity} / {l.totalQuantity}</span> },
              {
                header: 'Expiry Status',
                accessor: (l) => (
                  <span className={`text-xs font-semibold ${
                    l.status === 'Expired' ? 'text-rose-400' : l.status === 'Expiring Soon' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {l.status === 'Expired' ? 'Expired' : `Expires in ${l.expiryDays} days`} ({l.expiryDate})
                  </span>
                ),
              },
              { header: 'Status', accessor: (l) => <StatusBadge status={l.status} /> },
              {
                header: 'Action',
                accessor: (l) => (
                  <Button
                    variant={l.status === 'Expiring Soon' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedLicense(l)}
                  >
                    {l.status === 'Expiring Soon' ? 'Start Renewal' : l.status === 'Expired' ? 'Review' : 'View'}
                  </Button>
                ),
              },
            ]}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. COMPLIANCE TAB */}
      {/* ========================================================================= */}
      {activeTab === 'compliance' && (
        <div className="space-y-6 animate-fade-in">
          {/* Overall Compliance Header Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/20 via-slate-900 to-cyan-950/20 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                Security Posture Assessment
              </span>
              <h2 className="text-2xl font-bold text-white">Overall Compliance: 92%</h2>
              <p className="text-xs text-slate-300 mt-1">
                Good — 18 of 20 mandatory controls compliant. 2 operational items require attention.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                18 / 20 Controls Compliant
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold">
                2 Attention Required
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Control Categories (2 Cols) */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-base font-bold text-white">Compliance Control Categories</h3>
              <div className="space-y-3">
                {mockComplianceControls.map((ctrl) => (
                  <div key={ctrl.name} className="p-4 rounded-xl glass-panel border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white flex items-center gap-2">
                        {ctrl.status === 'Compliant' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                        )}
                        {ctrl.name}
                      </span>
                      <StatusBadge status={ctrl.status} size="sm" />
                    </div>
                    <p className="text-xs text-slate-400">{ctrl.description}</p>
                    <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/80">
                      <span>Controls Met: {ctrl.compliantCount} of {ctrl.totalCount}</span>
                      {ctrl.status !== 'Compliant' && (
                        <span className="text-amber-400 font-semibold cursor-pointer hover:underline" onClick={() => onOpenAssignModal(ctrl.name, ctrl.description)}>
                          Remediate Control →
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Actions + Compliance Activity */}
            <div className="space-y-6">
              <GlassCard className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Recommended Actions
                </h4>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <p className="text-slate-200">3 software licenses expire within 30 days.</p>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab('licenses')}>
                    Review Licenses
                  </Button>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <p className="text-slate-200">2 infrastructure components require patching.</p>
                  <Button variant="primary" size="sm" onClick={() => onOpenAssignModal('Patch Management', 'Scheduled preventive maintenance patching')}>
                    Assign Technician
                  </Button>
                </div>
              </GlassCard>

              <GlassCard className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Compliance Activity
                </h4>
                <ActivityTimeline activities={complianceTimeline} />
              </GlassCard>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PERMISSION MATRIX MODAL */}
      {/* ========================================================================= */}
      {showMatrixModal && (
        <Modal
          isOpen={showMatrixModal}
          onClose={() => setShowMatrixModal(false)}
          title="AICTE DCIM Role-Based Access Control (RBAC) Matrix"
          subtitle="Least-privilege permission matrix enforced via Casbin authorization engine"
          maxWidth="max-w-4xl"
          footer={
            <Button variant="secondary" size="sm" onClick={() => setShowMatrixModal(false)}>
              Close Matrix
            </Button>
          }
        >
          <div className="overflow-x-auto rounded-xl border border-slate-800 text-xs">
            <table className="w-full text-left font-mono">
              <thead className="bg-slate-900 text-slate-300 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 font-sans font-bold">Permission Scope</th>
                  <th className="px-4 py-3 text-center text-cyan-400">Admin</th>
                  <th className="px-4 py-3 text-center text-indigo-400">Technician</th>
                  <th className="px-4 py-3 text-center text-amber-400">Security</th>
                  <th className="px-4 py-3 text-center text-emerald-400">Auditor</th>
                  <th className="px-4 py-3 text-center text-slate-400">Viewer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950">
                {mockPermissionMatrix.map((row) => (
                  <tr key={row.permission} className="hover:bg-slate-900/60 font-sans">
                    <td className="px-4 py-3 font-semibold text-slate-200">{row.permission}</td>
                    <td className="px-4 py-3 text-center">
                      {row.admin ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-slate-600 mx-auto" />}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {row.technician ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-slate-600 mx-auto" />}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {row.security ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-slate-600 mx-auto" />}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {row.auditor ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-slate-600 mx-auto" />}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {row.viewer ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-slate-600 mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal>
      )}

      {/* USER DETAIL DRAWER */}
      {selectedUser && (
        <Drawer
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          title={`User Profile — ${selectedUser.name}`}
          subtitle={`${selectedUser.email} • Role: ${selectedUser.role}`}
        >
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold uppercase">Department</span>
                <span className="text-xs font-bold text-white">{selectedUser.department}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold uppercase">Account Status</span>
                <StatusBadge status={selectedUser.status === 'Active' ? 'Healthy' : 'Pending'} size="sm" />
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Assigned Permissions</h4>
              <div className="space-y-1.5">
                {selectedUser.permissions.map((p) => (
                  <div key={p} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs flex items-center gap-2 text-slate-200">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Drawer>
      )}

      {/* LICENSE DETAIL DRAWER */}
      {selectedLicense && (
        <Drawer
          isOpen={!!selectedLicense}
          onClose={() => setSelectedLicense(null)}
          title={`License Details — ${selectedLicense.name}`}
          subtitle={`Vendor: ${selectedLicense.vendor} • Category: ${selectedLicense.category}`}
          footer={
            <Button variant="primary" size="sm" onClick={() => setSelectedLicense(null)}>
              Start Renewal Requisition
            </Button>
          }
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold uppercase">Compliance Status</span>
                <StatusBadge status={selectedLicense.status} />
              </div>
              <p className="text-xs text-slate-300">
                {selectedLicense.status === 'Expiring Soon'
                  ? `License expires on ${selectedLicense.expiryDate}. Immediate renewal advised.`
                  : 'License is fully compliant with active vendor maintenance support.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Allocated Quota</span>
                <span className="text-white font-mono">{selectedLicense.usedQuantity} / {selectedLicense.totalQuantity} Units</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Annual Maintenance</span>
                <span className="text-cyan-400 font-mono font-bold">{selectedLicense.costAnnual}</span>
              </div>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
};
