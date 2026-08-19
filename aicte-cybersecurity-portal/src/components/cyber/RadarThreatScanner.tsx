import React from 'react';
import { ShieldAlert, Crosshair } from 'lucide-react';

interface RadarThreatScannerProps {
  onSelectThreat?: (threat: string) => void;
}

export const RadarThreatScanner: React.FC<RadarThreatScannerProps> = ({ onSelectThreat }) => {
  return (
    <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800/90 flex flex-col items-center justify-between relative overflow-hidden space-y-4">
      <div className="w-full flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-rose-400 font-bold flex items-center gap-1.5">
            <Crosshair className="w-3.5 h-3.5 animate-spin" /> Perimeter Threat Radar Scanner
          </span>
          <p className="text-xs text-slate-400">360° AICTE WAN Ingress Spectrum</p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
          DEFCON 2 ACTIVE
        </span>
      </div>

      {/* Radar Circular Screen */}
      <div className="relative w-48 h-48 rounded-full border-2 border-cyan-500/30 bg-slate-900/90 flex items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(0,242,254,0.15)]">
        {/* Concentric Circles */}
        <div className="absolute w-36 h-36 rounded-full border border-cyan-500/20" />
        <div className="absolute w-24 h-24 rounded-full border border-cyan-500/25" />
        <div className="absolute w-12 h-12 rounded-full border border-cyan-500/30" />
        {/* Crosshair lines */}
        <div className="absolute w-full h-[1px] bg-cyan-500/20" />
        <div className="absolute h-full w-[1px] bg-cyan-500/20" />

        {/* Radar Sweep Line */}
        <div className="absolute inset-0 origin-center animate-radar-sweep pointer-events-none">
          <div className="w-1/2 h-1/2 bg-gradient-to-tr from-cyan-400/30 via-cyan-400/5 to-transparent rounded-tl-full" />
        </div>

        {/* Threat Blip 1 (SRV-024) */}
        <div
          onClick={() => onSelectThreat && onSelectThreat('SRV-024')}
          className="absolute top-10 right-10 w-3 h-3 rounded-full bg-rose-500 led-beacon-red cursor-pointer animate-ping"
          title="Critical: SRV-024 CPU Saturation"
        />
        <div className="absolute top-10 right-10 w-2.5 h-2.5 rounded-full bg-rose-400" />

        {/* Threat Blip 2 (FW-018) */}
        <div
          onClick={() => onSelectThreat && onSelectThreat('FW-018')}
          className="absolute bottom-12 left-10 w-3 h-3 rounded-full bg-amber-500 led-beacon-amber cursor-pointer"
          title="Warning: FW-018 Rule R-102 WAN SSH"
        />

        {/* Center Node */}
        <div className="w-3 h-3 rounded-full bg-cyan-400 led-beacon-cyan z-10" />
      </div>

      <div className="w-full flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-800/80 pt-2">
        <span className="text-rose-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> 2 Active Vectors</span>
        <span className="text-emerald-400">Zero Unidentified Probes</span>
      </div>
    </div>
  );
};
