import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-xl border border-dashed border-slate-800 bg-slate-900/30">
      <div className="p-4 rounded-full bg-slate-800/80 text-cyan-400 border border-slate-700 mb-4">
        {icon || <ShieldAlert className="h-8 w-8" />}
      </div>
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="mt-1 text-sm text-slate-400 max-w-sm">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} variant="outline" size="sm" className="mt-4">
          {actionText}
        </Button>
      )}
    </div>
  );
};
