import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  onClick?: () => void;
  hoverable?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  glow = false,
  onClick,
  hoverable = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        ${glow ? 'glass-panel-glow' : 'glass-panel'}
        ${hoverable ? 'transition-all duration-200 hover:border-cyan-500/40 hover:bg-slate-900/80 cursor-pointer' : ''}
        rounded-xl p-5 ${className}
      `}
    >
      {children}
    </div>
  );
};
