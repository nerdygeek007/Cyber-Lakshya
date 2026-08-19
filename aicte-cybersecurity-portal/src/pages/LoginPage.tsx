import React, { useState } from 'react';
import { 
  ShieldCheck, Lock, User, ArrowRight, Eye, 
  EyeOff, CheckCircle2, AlertCircle, Server, Activity, Shield, Terminal 
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { ThreeCyberDefenseShield } from '../components/cyber/ThreeCyberDefenseShield';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('admin_aarav');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      setError('Please enter your authorized AICTE identity or email.');
      return;
    }
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess();
    }, 600);
  };

  const handleQuickDemoRole = (roleUser: string) => {
    setUsername(roleUser);
    setPassword('••••••••••••');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess();
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Ambience & Cyber Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,242,254,0.08),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(99,102,241,0.08),transparent_50%)] pointer-events-none" />

      {/* Top Government Header Banner */}
      <header className="w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-6 py-3.5 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(0,242,254,0.4)]">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xs font-bold text-white tracking-wide block">
              ALL INDIA COUNCIL FOR TECHNICAL EDUCATION (AICTE)
            </span>
            <span className="text-[10px] text-cyan-400 font-mono">
              Centralized Cybersecurity Portal & Data Center Infrastructure Management (DCIM)
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] text-slate-400 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Zero-Trust Gateway Online</span>
        </div>
      </header>

      {/* Main Split Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        {/* Left Col: Mission Statement & 3D Hologram Shield (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            Smart India Hackathon (SIH 2026) • Problem Statement CHA-39
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="space-y-3 flex-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-none">
                Unified Server & Firewall <br />
                <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                  Command & Defense System
                </span>
              </h1>
              <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
                Equipping non-technical AICTE administrators with plain-language operational visibility, instant technician task dispatching, and real-time perimeter threat intelligence.
              </p>
            </div>

            {/* 3D Holographic Defense Shield */}
            <div className="w-48 h-48 shrink-0 hidden md:block">
              <ThreeCyberDefenseShield size={190} />
            </div>
          </div>

          {/* 3 Value Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1 hover:border-cyan-500/40 transition-colors">
              <Activity className="w-5 h-5 text-cyan-400 mb-1" />
              <h4 className="text-xs font-bold text-white">Full DCIM Observability</h4>
              <p className="text-[11px] text-slate-400">124 servers, 118 switches, and multi-region DC environmental sensors.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1 hover:border-cyan-500/40 transition-colors">
              <Shield className="w-5 h-5 text-indigo-400 mb-1" />
              <h4 className="text-xs font-bold text-white">Zero-Trust RBAC & Firewalls</h4>
              <p className="text-[11px] text-slate-400">Instant plain-language risk translation for modified WAN rules.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1 hover:border-cyan-500/40 transition-colors">
              <Server className="w-5 h-5 text-emerald-400 mb-1" />
              <h4 className="text-xs font-bold text-white">Automated ITSM Workflows</h4>
              <p className="text-[11px] text-slate-400">One-click technician task dispatches with full audit traceability.</p>
            </div>
          </div>
        </div>

        {/* Right Col: High-Tech Glass Login Box (5 Cols) */}
        <div className="lg:col-span-5">
          <div className="p-8 rounded-3xl glass-panel-glow border-cyan-500/30 space-y-6 shadow-2xl relative">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-cyan-400" /> Authorized Portal Sign In
              </h2>
              <p className="text-xs text-slate-400 mt-1">Enter your government SSO credentials or select demo role</p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  User ID / Official Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. admin_aarav@aicte.gov.in"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  SSO Security Passcode
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded bg-slate-900 border-slate-700 text-cyan-500" />
                  <span>Enforce MFA Session</span>
                </label>
                <span className="text-cyan-400 font-mono text-[11px]">FIPS 140-3 SHA-256</span>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full justify-center shadow-[0_0_20px_rgba(0,242,254,0.3)]"
                disabled={loading}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                {loading ? 'Authenticating Zero-Trust Session...' : 'Enter AICTE Command Center'}
              </Button>
            </form>

            {/* Quick Demo Role Selector */}
            <div className="pt-3 border-t border-slate-800/80 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block text-center">
                Instant Hackathon Judge Demo Login:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoRole('Aarav Mehta (Admin)')}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-cyan-950/40 border border-slate-700 hover:border-cyan-500 text-[11px] text-cyan-300 font-semibold transition-all text-center"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoRole('Riya Sharma (SecOps)')}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-amber-950/40 border border-slate-700 hover:border-amber-500 text-[11px] text-amber-300 font-semibold transition-all text-center"
                >
                  SecOps
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoRole('Vikram Patel (Tech)')}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-indigo-950/40 border border-slate-700 hover:border-indigo-500 text-[11px] text-indigo-300 font-semibold transition-all text-center"
                >
                  Technician
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Disclaimer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 px-6 py-3 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 z-10">
        <span>© 2026 AICTE Cybersecurity Division. All rights reserved. Government of India.</span>
        <span className="font-mono">Security Clearance: RESTRICTED • TLS 1.3 Enforced</span>
      </footer>
    </div>
  );
};
