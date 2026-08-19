import React from 'react';
import { GlassCard } from './GlassCard';

interface StatCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  trend?: { value: string; positive: boolean };
  icon?: React.ReactNode;
  statusColor?: 'emerald' | 'amber' | 'rose' | 'cyan' | 'indigo';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subValue,
  trend,
  icon,
  statusColor = 'cyan',
  onClick,
}) => {
  const getGlowBorder = () => {
    switch (statusColor) {
      case 'emerald':
        return 'hover:border-emerald-500/40 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]';
      case 'amber':
        return 'hover:border-amber-500/40 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)]';
      case 'rose':
        return 'hover:border-rose-500/40 hover:shadow-[0_0_15px_rgba(244,63,94,0.15)]';
      case 'indigo':
        return 'hover:border-indigo-500/40 hover:shadow-[0_0_15px_rgba(99,102,241,0.15)]';
      case 'cyan':
      default:
        return 'hover:border-cyan-500/40 hover:shadow-[0_0_15px_rgba(0,242,254,0.15)]';
    }
  };

  const getIconBg = () => {
    switch (statusColor) {
      case 'emerald':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'amber':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'rose':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'indigo':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      default:
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    }
  };

  return (
    <GlassCard
      onClick={onClick}
      hoverable={!!onClick}
      className={`relative overflow-hidden transition-all duration-300 ${getGlowBorder()}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-2xl font-bold tracking-tight text-white">{value}</h3>
            {subValue && <span className="text-xs text-slate-400 font-medium">{subValue}</span>}
          </div>
          {trend && (
            <p className={`mt-2 text-xs flex items-center gap-1 font-medium ${trend.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
              <span>{trend.positive ? '↑' : '↓'}</span>
              <span>{trend.value}</span>
            </p>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-lg border ${getIconBg()}`}>
            {icon}
          </div>
        )}
      </div>
    </GlassCard>
  );
};
