import React from 'react';
import { StatusType } from '../../types';

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '', size = 'md' }) => {
  const getStyle = () => {
    switch (status) {
      case 'Healthy':
      case 'Operational':
      case 'Active':
      case 'Connected':
      case 'Compliant':
      case 'Resolved':
      case 'Online':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

      case 'Warning':
      case 'Attention Required':
      case 'Expiring Soon':
      case 'Investigating':
      case 'Pending':
      case 'Degraded':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';

      case 'Critical':
      case 'Failed':
      case 'Expired':
      case 'Non-Compliant':
      case 'Disconnected':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';

      case 'Informational':
      case 'In Progress':
      default:
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    }
  };

  const getDotColor = () => {
    switch (status) {
      case 'Healthy':
      case 'Operational':
      case 'Active':
      case 'Connected':
      case 'Compliant':
      case 'Resolved':
      case 'Online':
        return 'bg-emerald-400';
      case 'Warning':
      case 'Attention Required':
      case 'Expiring Soon':
      case 'Investigating':
      case 'Pending':
      case 'Degraded':
        return 'bg-amber-400';
      case 'Critical':
      case 'Failed':
      case 'Expired':
      case 'Non-Compliant':
      case 'Disconnected':
        return 'bg-rose-400';
      default:
        return 'bg-cyan-400';
    }
  };

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${getStyle()} ${sizeClass} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${getDotColor()}`}></span>
      <span>{status}</span>
    </span>
  );
};
