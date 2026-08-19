import React from 'react';
import { 
  LayoutDashboard, Server, Shield, Users, 
  Workflow, BarChart3, Settings, ShieldCheck, LogOut, ChevronLeft, ChevronRight 
} from 'lucide-react';

interface SidebarProps {
  currentRoute: string;
  navigate: (route: string) => void;
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  navigate,
  collapsed,
  setCollapsed,
  onLogout,
}) => {
  const navItems = [
    { id: '/command-center', label: 'Command Center', icon: LayoutDashboard },
    { id: '/infrastructure', label: 'Infrastructure', icon: Server },
    { id: '/security-center', label: 'Security Center', icon: Shield },
    { id: '/access-compliance', label: 'Access & Compliance', icon: Users },
    { id: '/integration-automation', label: 'Integration & Automation', icon: Workflow },
    { id: '/reports-analytics', label: 'Reports & Analytics', icon: BarChart3 },
    { id: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 border-r border-slate-800/80 bg-[#060c1d]/95 backdrop-blur-xl flex flex-col justify-between ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div>
        <div className="flex items-center justify-between px-4 py-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => navigate('/command-center')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            {!collapsed && (
              <div className="transition-opacity duration-200">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-extrabold tracking-wider text-white">AICTE</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">CHA-39</span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium truncate">Cybersecurity Portal</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/10 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}

          {/* Presentation Deck Launcher */}
          <button
            onClick={() => navigate('/presentation')}
            title={collapsed ? 'SIH 2026 Presentation Deck' : undefined}
            className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-cyan-500/20 text-cyan-200 border border-cyan-500/40 hover:border-cyan-400 shadow-sm shadow-indigo-500/10 mt-2"
          >
            <ShieldCheck className="w-5 h-5 shrink-0 text-cyan-400 animate-pulse" />
            {!collapsed && <span className="truncate">SIH 2026 Deck (6 Slides)</span>}
          </button>
        </nav>
      </div>

      {/* Footer System Status & Logout */}
      <div className="p-3 border-t border-slate-800/80 space-y-2">
        {!collapsed && (
          <div className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>System Status</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Operational
              </span>
            </div>
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full w-[96.4%]"></div>
            </div>
          </div>
        )}

        <button
          onClick={onLogout}
          title="Sign Out"
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-400/80 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
