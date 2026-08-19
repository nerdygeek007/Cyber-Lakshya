import React from 'react';
import { Clock, ShieldAlert, Cpu, CheckCircle2, RefreshCw } from 'lucide-react';

export interface ActivityItem {
  id: string;
  time: string;
  title: string;
  description?: string;
  type?: 'alert' | 'system' | 'security' | 'task' | 'success';
  author?: string;
}

interface ActivityTimelineProps {
  activities: ActivityItem[];
  className?: string;
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities, className = '' }) => {
  const getIcon = (type?: string) => {
    switch (type) {
      case 'security':
        return <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />;
      case 'alert':
        return <Cpu className="h-3.5 w-3.5 text-amber-400" />;
      case 'task':
        return <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />;
      case 'system':
      default:
        return <RefreshCw className="h-3.5 w-3.5 text-blue-400" />;
    }
  };

  const getDotBg = (type?: string) => {
    switch (type) {
      case 'security':
        return 'bg-rose-500/20 border-rose-500/50';
      case 'alert':
        return 'bg-amber-500/20 border-amber-500/50';
      case 'task':
        return 'bg-cyan-500/20 border-cyan-500/50';
      default:
        return 'bg-blue-500/20 border-blue-500/50';
    }
  };

  return (
    <div className={`flow-root ${className}`}>
      <ul className="-mb-8">
        {activities.map((act, actIdx) => (
          <li key={act.id}>
            <div className="relative pb-8">
              {actIdx !== activities.length - 1 ? (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-800"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3 items-start">
                <div>
                  <span className={`h-8 w-8 rounded-full border flex items-center justify-center ${getDotBg(act.type)}`}>
                    {getIcon(act.type)}
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm font-medium text-slate-200">{act.title}</p>
                    {act.description && (
                      <p className="text-xs text-slate-400 mt-0.5">{act.description}</p>
                    )}
                    {act.author && (
                      <p className="text-[11px] text-cyan-400/80 font-mono mt-0.5">By {act.author}</p>
                    )}
                  </div>
                  <div className="whitespace-nowrap text-right text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="h-3 w-3 inline" />
                    <span>{act.time}</span>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
