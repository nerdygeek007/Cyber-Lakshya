import React from 'react';
import { Server, Activity, Thermometer, Zap } from 'lucide-react';

interface ServerRackVisualizerProps {
  rackId?: string;
  onSelectSlot?: (slotName: string) => void;
}

export const ServerRackVisualizer: React.FC<ServerRackVisualizerProps> = ({
  rackId = "AICTE-RACK-01 (DC A)",
  onSelectSlot,
}) => {
  const rackUnits = [
    { u: "U40-U42", name: "AICTE-EDGE-FW-001 (Palo Alto 5250)", type: "Firewall", status: "Healthy", temp: 31, pwr: 280 },
    { u: "U38-U39", name: "AICTE-CORE-RTR-01 (Cisco XR)", type: "Router", status: "Healthy", temp: 33, pwr: 310 },
    { u: "U36-U37", name: "AICTE-DIST-SW-01 (Cisco Catalyst)", type: "Switch", status: "Healthy", temp: 29, pwr: 240 },
    { u: "U33-U35", name: "AICTE-PORTAL-LB-01 (F5 BIG-IP)", type: "Load Balancer", status: "Healthy", temp: 32, pwr: 350 },
    { u: "U29-U32", name: "AICTE-PROD-SRV-024 (Dell PowerEdge)", type: "Server", status: "Critical", temp: 48, pwr: 740 },
    { u: "U25-U28", name: "AICTE-CORE-SRV-031 (HP DL380)", type: "Server", status: "Warning", temp: 38, pwr: 520 },
    { u: "U21-U24", name: "AICTE-GATEWAY-SRV-001 (Dell R750)", type: "Server", status: "Healthy", temp: 31, pwr: 410 },
    { u: "U17-U20", name: "AICTE-AUTH-SRV-005 (Zero-Trust Node)", type: "Server", status: "Healthy", temp: 28, pwr: 390 },
  ];

  return (
    <div className="p-4 rounded-2xl bg-slate-950/95 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5" /> 42U Physical Server Rack Enclosure
          </span>
          <p className="text-xs text-white font-bold">{rackId}</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span className="text-slate-400">Total Load: <b className="text-cyan-300">3.24 kW</b></span>
          <span className="text-slate-400">Ambient: <b className="text-emerald-400">22.4°C</b></span>
        </div>
      </div>

      {/* 42U Rack Frame with Stacked Blades */}
      <div className="space-y-2 p-2 rounded-xl bg-slate-900/80 border-2 border-slate-800 shadow-inner">
        {rackUnits.map((unit) => {
          const isCritical = unit.status === 'Critical';
          const isWarning = unit.status === 'Warning';
          return (
            <div
              key={unit.u}
              onClick={() => onSelectSlot && onSelectSlot(unit.name)}
              className={`p-2.5 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer transition-all duration-150 hover:scale-[1.01] ${
                isCritical
                  ? 'bg-rose-950/40 border-rose-500/60 shadow-[0_0_12px_rgba(244,63,94,0.25)]'
                  : isWarning
                  ? 'bg-amber-950/30 border-amber-500/50'
                  : 'bg-slate-950/90 border-slate-800 hover:border-cyan-500/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono font-bold text-slate-500 w-14 shrink-0 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-center">
                  {unit.u}
                </span>
                <div>
                  <span className="text-xs font-bold text-white block">{unit.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{unit.type} Chassis</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <span className={`flex items-center gap-1 ${unit.temp > 40 ? 'text-rose-400 font-bold' : 'text-slate-300'}`}>
                  <Thermometer className="w-3.5 h-3.5 text-slate-400" /> {unit.temp}°C
                </span>
                <span className="text-slate-300 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> {unit.pwr}W
                </span>
                <span className={`w-2.5 h-2.5 rounded-full ${
                  isCritical ? 'bg-rose-400 led-beacon-red' : isWarning ? 'bg-amber-400 led-beacon-amber' : 'bg-emerald-400 led-beacon-green'
                }`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
