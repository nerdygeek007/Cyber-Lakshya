import React, { useEffect, useState } from 'react';

export const LiveBandwidthWaveform: React.FC = () => {
  const [points, setPoints] = useState<number[]>([
    240, 260, 230, 290, 310, 280, 420, 390, 360, 480, 520, 490, 540, 610, 580, 720, 690, 840, 810, 760
  ]);
  const [currentMbps, setCurrentMbps] = useState(840.4);

  useEffect(() => {
    const interval = setInterval(() => {
      setPoints((prev) => {
        const nextVal = Math.floor(Math.random() * 250) + (Math.random() > 0.85 ? 700 : 350);
        setCurrentMbps(Number((nextVal + Math.random() * 10).toFixed(1)));
        return [...prev.slice(1), nextVal];
      });
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const width = 450;
  const height = 120;
  const maxVal = 1000;

  const svgPoints = points
    .map((val, idx) => {
      const x = (idx / (points.length - 1)) * width;
      const y = height - (val / maxVal) * (height - 20) - 10;
      return `${x},${y}`;
    })
    .join(' ');

  const areaPoints = `0,${height} ${svgPoints} ${width},${height}`;

  return (
    <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800/90 relative overflow-hidden space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            Real-Time WAN Egress Waveform (eBPF Stream)
          </span>
          <p className="text-xs text-slate-400">Live aggregated network telemetry from FortiGate & Palo Alto clusters</p>
        </div>
        <div className="text-right">
          <span className="text-xl font-mono font-extrabold text-white tracking-tight">{currentMbps}</span>
          <span className="text-[11px] font-mono text-cyan-400 font-bold ml-1">Mbps</span>
        </div>
      </div>

      {/* Waveform SVG */}
      <div className="relative w-full h-28 overflow-hidden rounded-xl bg-slate-900/60 border border-slate-800/80">
        {/* Background Grid Lines */}
        <div className="absolute inset-0 grid grid-rows-4 grid-cols-6 pointer-events-none opacity-20">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="border-b border-r border-cyan-500/30" />
          ))}
        </div>

        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full preserve-3d">
          <defs>
            <linearGradient id="waveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#00f2fe" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          {/* Shaded Area */}
          <polygon points={areaPoints} fill="url(#waveGrad)" />
          {/* Spline Line */}
          <polyline
            fill="none"
            stroke="#00f2fe"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={svgPoints}
          />
        </svg>

        <div className="absolute bottom-1 right-2 flex items-center gap-3 text-[10px] font-mono text-slate-400">
          <span>T-00:00 (Live)</span>
          <span className="text-emerald-400">Packet Loss: 0.00%</span>
        </div>
      </div>
    </div>
  );
};
