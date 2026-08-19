import React from 'react';

interface LoadingStateProps {
  message?: string;
  rows?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading telemetry & records...',
  rows = 4,
}) => {
  return (
    <div className="space-y-4 py-8">
      <div className="flex items-center justify-center gap-3 text-cyan-400">
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <span className="text-sm font-medium text-slate-300">{message}</span>
      </div>
      <div className="space-y-2 max-w-xl mx-auto opacity-40">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-4 bg-slate-800 rounded animate-pulse" />
        ))}
      </div>
    </div>
  );
};
