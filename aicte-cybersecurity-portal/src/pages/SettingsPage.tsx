import React, { useState } from 'react';
import { 
  Settings, Bell, Shield, Server, 
  CheckCircle2, Globe, Lock, Key, RefreshCw 
} from 'lucide-react';
import { Tabs } from '../components/common/Tabs';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  // Settings Form State
  const [portalName, setPortalName] = useState('AICTE Cybersecurity Portal');
  const [timeZone, setTimeZone] = useState('Asia/Kolkata (IST +5:30)');
  const [language, setLanguage] = useState('English (Government of India standard)');

  // Notification Toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [criticalSms, setCriticalSms] = useState(true);
  const [licenseReminders, setLicenseReminders] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);

  // Security Policy
  const [sessionTimeout, setSessionTimeout] = useState('15 Minutes');
  const [mfaEnforced, setMfaEnforced] = useState(true);

  const settingsTabs = [
    { id: 'general', label: 'General', icon: <Globe className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'security', label: 'Security & Auth', icon: <Shield className="w-4 h-4" /> },
    { id: 'system', label: 'System Information', icon: <Server className="w-4 h-4" /> },
  ];

  const handleSave = () => {
    setSavedMessage('Settings successfully saved to local configuration store.');
    setTimeout(() => {
      setSavedMessage(null);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">System Settings & Governance</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure administrative preferences, notification channels, authentication policies, and portal runtime.
          </p>
        </div>
      </div>

      <Tabs tabs={settingsTabs} activeTab={activeTab} onChange={setActiveTab} />

      {savedMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{savedMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. GENERAL TAB */}
      {/* ========================================================================= */}
      {activeTab === 'general' && (
        <GlassCard className="max-w-2xl space-y-5 animate-fade-in">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Portal Application Name
            </label>
            <input
              type="text"
              value={portalName}
              onChange={(e) => setPortalName(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-3 text-xs text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Data Center System Time Zone
            </label>
            <select
              value={timeZone}
              onChange={(e) => setTimeZone(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-3 text-xs text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="Asia/Kolkata (IST +5:30)">Asia/Kolkata (IST +5:30)</option>
              <option value="UTC (Coordinated Universal Time)">UTC (Coordinated Universal Time)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Interface Language
            </label>
            <input
              type="text"
              disabled
              value={language}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2 px-3 text-xs text-slate-400"
            />
          </div>

          <div className="pt-2 border-t border-slate-800 flex justify-end">
            <Button variant="primary" size="sm" onClick={handleSave}>
              Save General Preferences
            </Button>
          </div>
        </GlassCard>
      )}

      {/* ========================================================================= */}
      {/* 2. NOTIFICATIONS TAB */}
      {/* ========================================================================= */}
      {activeTab === 'notifications' && (
        <GlassCard className="max-w-2xl space-y-4 animate-fade-in">
          <h3 className="text-base font-bold text-white mb-2">Notification & Dispatch Preferences</h3>

          <div className="space-y-3 divide-y divide-slate-800">
            <div className="flex items-center justify-between pt-3">
              <div>
                <span className="text-xs font-bold text-white block">Email Dispatch Notifications</span>
                <span className="text-[11px] text-slate-400">Receive alert summaries on official email.</span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500"
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <span className="text-xs font-bold text-white block">Critical Incident SMS / Priority Push</span>
                <span className="text-[11px] text-slate-400">Send high-priority SMS alerts when CPU &gt; 95% or WAN SSH is modified.</span>
              </div>
              <input
                type="checkbox"
                checked={criticalSms}
                onChange={(e) => setCriticalSms(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500"
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <span className="text-xs font-bold text-white block">License Expiry 30-Day Reminders</span>
                <span className="text-[11px] text-slate-400">Notify IT asset management desk when software enters renewal window.</span>
              </div>
              <input
                type="checkbox"
                checked={licenseReminders}
                onChange={(e) => setLicenseReminders(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end">
            <Button variant="primary" size="sm" onClick={handleSave}>
              Save Notification Preferences
            </Button>
          </div>
        </GlassCard>
      )}

      {/* ========================================================================= */}
      {/* 3. SECURITY TAB */}
      {/* ========================================================================= */}
      {activeTab === 'security' && (
        <GlassCard className="max-w-2xl space-y-4 animate-fade-in">
          <h3 className="text-base font-bold text-white mb-2">Zero-Trust Authentication Policies</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Session Inactivity Timeout
              </label>
              <select
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-3 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="15 Minutes">15 Minutes (High Security Standard)</option>
                <option value="30 Minutes">30 Minutes</option>
                <option value="60 Minutes">60 Minutes</option>
              </select>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">AICTE Multi-Factor Authentication (MFA)</span>
                <span className="text-[11px] text-emerald-400 font-semibold">Enforced via Government SSO Gateway</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold font-mono">
                ACTIVE
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end">
            <Button variant="primary" size="sm" onClick={handleSave}>
              Update Security Policies
            </Button>
          </div>
        </GlassCard>
      )}

      {/* ========================================================================= */}
      {/* 4. SYSTEM TAB */}
      {/* ========================================================================= */}
      {activeTab === 'system' && (
        <GlassCard className="max-w-2xl space-y-4 animate-fade-in">
          <h3 className="text-base font-bold text-white mb-2">Portal Environment Information</h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Portal Engine Version</span>
              <span className="font-mono text-cyan-300 font-bold">v1.0.0 (SIH-2026 Edition)</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Problem Statement</span>
              <span className="font-mono text-white font-bold">CHA-39 (AICTE DCIM)</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">PostgreSQL Database Store</span>
              <span className="font-mono text-emerald-400 font-bold">cyber_lakshya (3NF + JSONB)</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Authorization Engine</span>
              <span className="font-mono text-indigo-400 font-bold">Casbin Zero-Trust PERM</span>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
};
