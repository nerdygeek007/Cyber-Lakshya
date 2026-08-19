import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, Bell, User, ChevronDown, 
  ShieldCheck, AlertTriangle, Info, Check 
} from 'lucide-react';
import { NotificationItem } from '../../types';

interface TopbarProps {
  currentRoute: string;
  onOpenSearch: () => void;
  notifications: NotificationItem[];
  onNotificationClick: (notif: NotificationItem) => void;
  onMarkAllNotificationsRead: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentRoute,
  onOpenSearch,
  notifications,
  onNotificationClick,
  onMarkAllNotificationsRead,
}) => {
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getPageInfo = () => {
    switch (currentRoute) {
      case '/command-center':
        return { title: 'Command Center', section: 'Overview' };
      case '/infrastructure':
        return { title: 'Infrastructure Management', section: 'DCIM' };
      case '/security-center':
        return { title: 'Security Operations Center', section: 'Security' };
      case '/access-compliance':
        return { title: 'Access & Compliance Governance', section: 'IAM & RBAC' };
      case '/integration-automation':
        return { title: 'Integration & Automation Engine', section: 'Workflows' };
      case '/reports-analytics':
        return { title: 'Reports & Telemetry Analytics', section: 'Analytics' };
      case '/settings':
        return { title: 'System Settings & Preferences', section: 'Admin' };
      default:
        return { title: 'AICTE Cybersecurity Portal', section: 'Dashboard' };
    }
  };

  const pageInfo = getPageInfo();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifMenu(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-6 backdrop-blur-xl">
      {/* Left: Breadcrumbs & Title */}
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>AICTE Portal</span>
            <span>/</span>
            <span className="text-cyan-400 font-medium">{pageInfo.section}</span>
          </div>
          <h2 className="text-base font-bold text-white tracking-tight">{pageInfo.title}</h2>
        </div>
      </div>

      {/* Right: Global Search, Notification Bell, User Badge */}
      <div className="flex items-center gap-3.5">
        {/* Global Search Bar Button */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg border border-slate-700/80 bg-slate-900/90 text-xs text-slate-400 hover:text-slate-200 hover:border-cyan-500/50 transition-all shadow-sm group"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400" />
          <span className="hidden sm:inline">Search servers, firewalls, alerts...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 border border-slate-700">
            Ctrl + K
          </kbd>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm shadow-rose-500/40">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-700/80 bg-slate-950/95 shadow-2xl backdrop-blur-2xl py-3 z-50 animate-fade-in">
              <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Notifications ({unreadCount} New)
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllNotificationsRead}
                    className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>

              <div className="divide-y divide-slate-800/60 max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="py-6 text-center text-xs text-slate-400">No new notifications</p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        onNotificationClick(notif);
                        setShowNotifMenu(false);
                      }}
                      className={`p-3.5 hover:bg-slate-900/80 cursor-pointer transition-colors ${
                        !notif.read ? 'bg-cyan-500/5' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {notif.type === 'critical' ? (
                            <span className="p-1 rounded-full bg-rose-500/20 text-rose-400 block">
                              <AlertTriangle className="w-3.5 h-3.5" />
                            </span>
                          ) : notif.type === 'warning' ? (
                            <span className="p-1 rounded-full bg-amber-500/20 text-amber-400 block">
                              <AlertTriangle className="w-3.5 h-3.5" />
                            </span>
                          ) : (
                            <span className="p-1 rounded-full bg-cyan-500/20 text-cyan-400 block">
                              <Info className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-white">{notif.title}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{notif.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block font-mono">{notif.time}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Badge */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-850 hover:border-slate-700 transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold text-xs shadow-sm">
              AD
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-semibold text-white leading-tight">Aarav Mehta</p>
              <p className="text-[10px] text-cyan-400 font-medium">Administrator</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-700/80 bg-slate-950/95 shadow-2xl backdrop-blur-2xl py-2 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-slate-800">
                <p className="text-xs font-bold text-white">Aarav Mehta</p>
                <p className="text-[11px] text-slate-400 truncate">aarav.mehta@aicte.gov.in</p>
                <span className="mt-1.5 inline-block text-[10px] font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  Role: Administrator
                </span>
              </div>
              <div className="py-1">
                <div className="px-4 py-1.5 text-xs text-slate-400 flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> MFA Enabled (AICTE SSO)
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
