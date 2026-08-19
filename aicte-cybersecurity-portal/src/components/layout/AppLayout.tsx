import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { GlobalSearchModal } from './GlobalSearchModal';
import { AssignTaskModal } from './AssignTaskModal';
import { NotificationItem } from '../../types';
import { mockNotifications } from '../../data/mockData';

interface AppLayoutProps {
  currentRoute: string;
  navigate: (route: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
  assignModalTarget: { target: string; desc: string } | null;
  setAssignModalTarget: (val: { target: string; desc: string } | null) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  currentRoute,
  navigate,
  onLogout,
  children,
  assignModalTarget,
  setAssignModalTarget,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);

  const handleNotificationClick = (notif: NotificationItem) => {
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    if (notif.linkRoute) {
      navigate(notif.linkRoute);
    }
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentRoute={currentRoute}
        navigate={navigate}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
        sidebarCollapsed ? 'pl-20' : 'pl-64'
      }`}>
        {/* Sticky Topbar */}
        <Topbar
          currentRoute={currentRoute}
          onOpenSearch={() => setShowSearchModal(true)}
          notifications={notifications}
          onNotificationClick={handleNotificationClick}
          onMarkAllNotificationsRead={handleMarkAllRead}
        />

        {/* Dynamic Page Container */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto pb-16">
          {children}
        </main>
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSelectResult={(route) => navigate(route)}
      />

      {/* Global Technician Dispatch Modal */}
      {assignModalTarget && (
        <AssignTaskModal
          isOpen={!!assignModalTarget}
          onClose={() => setAssignModalTarget(null)}
          targetEntity={assignModalTarget.target}
          issueDescription={assignModalTarget.desc}
          onAssigned={() => {
            // Task assigned
          }}
        />
      )}
    </div>
  );
};
