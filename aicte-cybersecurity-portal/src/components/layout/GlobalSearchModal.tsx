import React, { useState, useMemo, useEffect } from 'react';
import { Search, Server, Shield, AlertTriangle, Users, FileText, X } from 'lucide-react';
import { mockServers, mockNetworkDevices, mockAlerts, mockIncidents, mockUsers, mockSoftwareLicenses } from '../../data/mockData';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (route: string, itemId: string, itemType: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectResult,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // toggle modal
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const items: Array<{ id: string; title: string; subtitle: string; category: string; icon: any; route: string; type: string }> = [];

    // Search Servers
    mockServers.forEach((s) => {
      if (s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.ip.includes(q)) {
        items.push({
          id: s.id,
          title: `${s.id} — ${s.name}`,
          subtitle: `IP: ${s.ip} • Status: ${s.status} • Location: ${s.location}`,
          category: 'Servers',
          icon: Server,
          route: '/infrastructure',
          type: 'server',
        });
      }
    });

    // Search Firewalls & Network
    mockNetworkDevices.forEach((n) => {
      if (n.name.toLowerCase().includes(q) || n.id.toLowerCase().includes(q) || n.ip.includes(q)) {
        items.push({
          id: n.id,
          title: `${n.id} — ${n.name}`,
          subtitle: `Type: ${n.type} • IP: ${n.ip} • Status: ${n.status}`,
          category: 'Network & Firewalls',
          icon: Shield,
          route: '/infrastructure',
          type: 'network',
        });
      }
    });

    // Search Alerts
    mockAlerts.forEach((a) => {
      if (a.id.toLowerCase().includes(q) || a.description.toLowerCase().includes(q) || a.source.toLowerCase().includes(q)) {
        items.push({
          id: a.id,
          title: `${a.id} — ${a.description}`,
          subtitle: `Source: ${a.source} • Severity: ${a.severity} • Status: ${a.status}`,
          category: 'Alerts',
          icon: AlertTriangle,
          route: '/security-center',
          type: 'alert',
        });
      }
    });

    // Search Users
    mockUsers.forEach((u) => {
      if (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q)) {
        items.push({
          id: u.id,
          title: `${u.name} (${u.role})`,
          subtitle: `${u.email} • Department: ${u.department}`,
          category: 'Users & Roles',
          icon: Users,
          route: '/access-compliance',
          type: 'user',
        });
      }
    });

    // Search Licenses
    mockSoftwareLicenses.forEach((l) => {
      if (l.name.toLowerCase().includes(q) || l.vendor.toLowerCase().includes(q)) {
        items.push({
          id: l.id,
          title: `${l.name} (${l.vendor})`,
          subtitle: `Usage: ${l.usedQuantity}/${l.totalQuantity} • Expiry: ${l.expiryDate}`,
          category: 'Software Licenses',
          icon: FileText,
          route: '/access-compliance',
          type: 'license',
        });
      }
    });

    return items;
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-md" />
      <div className="relative w-full max-w-2xl glass-modal rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden z-10 animate-fade-in">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800 bg-slate-900/80">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a server tag (e.g. SRV-024), firewall, alert ID, user, or license..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-400 text-sm focus:outline-none"
          />
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 divide-y divide-slate-800/40">
          {!query.trim() ? (
            <div className="py-10 text-center text-slate-400">
              <p className="text-sm font-medium">Quick Search Portal Index</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for "SRV-024", "FW-018", "VMware", "Aarav", or "Critical"</p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-10 text-center text-slate-400">
              <p className="text-sm font-medium">No matches found for "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">Check the spelling or try searching by IP address or category.</p>
            </div>
          ) : (
            results.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={`${item.category}-${item.id}`}
                  onClick={() => {
                    onSelectResult(item.route, item.id, item.type);
                    onClose();
                  }}
                  className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-slate-800/60 cursor-pointer transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-cyan-400 group-hover:border-cyan-500/40">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        {item.title}
                      </p>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.subtitle}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
