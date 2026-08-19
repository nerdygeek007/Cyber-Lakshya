import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Shield, Play, Pause } from 'lucide-react';

export const LiveSecurityTerminal: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([
    "[10:42:01.402] [eBPF_PROBE] TCP INGRESS 198.51.100.24:58210 -> 10.10.0.18:443 [FLAGS: SF] [LEN: 1420] -> ALLOW",
    "[10:42:02.115] [CASBIN_RBAC] sub='admin_aarav' obj='firewalls/FW-018' act='write' verdict='ALLOW'",
    "[10:42:02.940] [ANOMALY_AI] Node='SRV-024' CPU_Z_SCORE=+3.42 -> ANOMALY TRIGGERED (Severity: CRITICAL)",
    "[10:42:03.112] [ITSM_AUTO] Created Incident #INC-1042 -> Assigned to 'Infrastructure Team'",
    "[10:42:04.004] [FW_POLICY] Dropped 14 un-solicited SYN packets on perimeter port 23 (Telnet)",
  ]);
  const [isPaused, setIsPaused] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const time = new Date().toISOString().substring(11, 23);
      const rand = Math.random();
      let newLog = '';

      if (rand > 0.7) {
        newLog = `[${time}] [CASBIN_RBAC] sub='secops_riya' obj='audit_logs' act='read' verdict='ALLOW' (jwt_exp=valid)`;
      } else if (rand > 0.4) {
        const ip = `192.168.10.${Math.floor(Math.random() * 50) + 1}`;
        newLog = `[${time}] [eBPF_STREAM] src=${ip} dst=10.10.1.24 port=5432 [PGSQL] -> 0.4ms latency OK`;
      } else {
        newLog = `[${time}] [FIREWALL_ACL] Rule='R-199' Drop WAN source CIDR 198.51.100.44:445 [SMB_BLOCK]`;
      }

      setLogs((prev) => [...prev.slice(-15), newLog]);
    }, 1800);

    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="rounded-2xl bg-slate-950 border border-slate-800/90 shadow-2xl overflow-hidden font-mono text-xs">
      {/* Terminal Titlebar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-slate-300">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-[11px] font-bold text-slate-200 ml-2 flex items-center gap-1.5 font-sans">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" /> AICTE Live Security & Telemetry Console
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            {isPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3 text-amber-400" />}
            <span>{isPaused ? 'Resume Stream' : 'Pause'}</span>
          </button>
          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            LIVE
          </span>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="p-3.5 bg-black/90 space-y-1.5 max-h-44 overflow-y-auto scanlines leading-relaxed">
        {logs.map((line, idx) => {
          const isCrit = line.includes('CRITICAL') || line.includes('ANOMALY');
          const isAllow = line.includes('ALLOW') || line.includes('OK');
          const isDrop = line.includes('Drop') || line.includes('Dropped');
          return (
            <div
              key={idx}
              className={`text-[11px] font-mono ${
                isCrit ? 'text-rose-400 font-bold' : isDrop ? 'text-amber-300' : isAllow ? 'text-emerald-400/90' : 'text-slate-300'
              }`}
            >
              {line}
            </div>
          );
        })}
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
};
