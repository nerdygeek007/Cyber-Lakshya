import React from 'react';
import { Server } from 'lucide-react';

interface NodeItem {
  id: string;
  status: 'Healthy' | 'Warning' | 'Critical';
  cpu: number;
  dc: string;
}

interface ComputeHoneycombGridProps {
  onSelectNode?: (nodeId: string) => void;
}

export const ComputeHoneycombGrid: React.FC<ComputeHoneycombGridProps> = ({ onSelectNode }) => {
  // Generate 24 distributed compute nodes
  const nodes: NodeItem[] = Array.from({ length: 24 }).map((_, i) => {
    const num = i + 1;
    const tag = `SRV-${num.toString().padStart(3, '0')}`;
    if (num === 24) return { id: tag, status: 'Critical', cpu: 97, dc: 'DC-A' };
    if (num === 18) return { id: tag, status: 'Warning', cpu: 82, dc: 'DC-B' };
    if (num === 31 || num === 12) return { id: tag, status: 'Warning', cpu: 78, dc: 'DC-A' };
    return { id: tag, status: 'Healthy', cpu: Math.floor(Math.random() * 35) + 30, dc: i % 2 === 0 ? 'DC-A' : 'DC-B' };
  });

  return (
    <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800/90 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5" /> 24-Node Compute Cluster Matrix
          </span>
          <p className="text-xs text-slate-400">Click any compute blade to inspect real-time core allocation</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span className="flex items-center gap-1 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> 21 OK</span>
          <span className="flex items-center gap-1 text-amber-400"><span className="w-2 h-2 rounded-full bg-amber-400"></span> 2 Warn</span>
          <span className="flex items-center gap-1 text-rose-400"><span className="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span> 1 Crit</span>
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
        {nodes.map((node) => {
          const isCritical = node.status === 'Critical';
          const isWarning = node.status === 'Warning';
          return (
            <div
              key={node.id}
              onClick={() => onSelectNode && onSelectNode(node.id)}
              title={`${node.id} (${node.dc}): ${node.cpu}% CPU - ${node.status}`}
              className={`p-2 rounded-xl border text-center cursor-pointer transition-all duration-200 hover:scale-105 ${
                isCritical
                  ? 'bg-rose-950/30 border-rose-500/60 shadow-[0_0_12px_rgba(244,63,94,0.3)] animate-pulse'
                  : isWarning
                  ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-400'
                  : 'bg-slate-900/90 border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 mb-1">
                <span>{node.dc}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  isCritical ? 'bg-rose-400' : isWarning ? 'bg-amber-400' : 'bg-emerald-400'
                }`} />
              </div>
              <span className="text-[11px] font-bold text-white block">{node.id}</span>
              <span className={`text-[10px] font-mono font-bold block mt-0.5 ${
                isCritical ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-cyan-300'
              }`}>
                {node.cpu}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
