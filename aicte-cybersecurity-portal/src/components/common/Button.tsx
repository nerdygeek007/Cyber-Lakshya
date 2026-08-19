import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const getVariant = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/20 active:scale-[0.98]';
      case 'secondary':
        return 'bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 border border-slate-700 active:scale-[0.98]';
      case 'outline':
        return 'bg-transparent border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400 active:scale-[0.98]';
      case 'danger':
        return 'bg-rose-600 hover:bg-rose-500 text-white font-medium shadow-md shadow-rose-600/20 active:scale-[0.98]';
      case 'ghost':
        return 'bg-transparent text-slate-300 hover:text-white hover:bg-slate-800/60 active:scale-[0.98]';
    }
  };

  const getSize = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-xs rounded-lg gap-1.5';
      case 'lg':
        return 'px-6 py-3 text-base rounded-xl gap-2.5';
      case 'md':
      default:
        return 'px-4 py-2 text-sm rounded-lg gap-2';
    }
  };

  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${getVariant()} ${getSize()} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : (
        icon
      )}
      <span>{children}</span>
    </button>
  );
};
