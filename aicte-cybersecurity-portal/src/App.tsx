import React, { useState, useEffect } from 'react';
import { LoginPage } from './pages/LoginPage';
import { CommandCenterPage } from './pages/CommandCenterPage';
import { InfrastructurePage } from './pages/InfrastructurePage';
import { SecurityCenterPage } from './pages/SecurityCenterPage';
import { AccessCompliancePage } from './pages/AccessCompliancePage';
import { IntegrationAutomationPage } from './pages/IntegrationAutomationPage';
import { ReportsAnalyticsPage } from './pages/ReportsAnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { PresentationPage } from './pages/PresentationPage';
import { AppLayout } from './components/layout/AppLayout';

export function App() {
  const [currentRoute, setCurrentRoute] = useState<string>('/login');
  const [assignModalTarget, setAssignModalTarget] = useState<{ target: string; desc: string } | null>(null);

  // Sync route with URL hash for browser history / direct access support
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || '/login';
      if (['/login', '/presentation', '/command-center', '/infrastructure', '/security-center', '/access-compliance', '/integration-automation', '/reports-analytics', '/settings'].includes(hash)) {
        setCurrentRoute(hash);
      }
    };

    if (window.location.hash) {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (route: string) => {
    window.location.hash = route;
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAssignModal = (target: string, desc: string) => {
    setAssignModalTarget({ target, desc });
  };

  // Standalone Fullscreen Routes
  if (currentRoute === '/login') {
    return <LoginPage onLoginSuccess={() => navigate('/command-center')} />;
  }

  if (currentRoute === '/presentation') {
    return <PresentationPage />;
  }

  // Render main dashboard within shared AppLayout
  return (
    <AppLayout
      currentRoute={currentRoute}
      navigate={navigate}
      onLogout={() => navigate('/login')}
      assignModalTarget={assignModalTarget}
      setAssignModalTarget={setAssignModalTarget}
    >
      {currentRoute === '/command-center' && (
        <CommandCenterPage navigate={navigate} onOpenAssignModal={handleOpenAssignModal} />
      )}
      {currentRoute === '/infrastructure' && (
        <InfrastructurePage onOpenAssignModal={handleOpenAssignModal} />
      )}
      {currentRoute === '/security-center' && (
        <SecurityCenterPage onOpenAssignModal={handleOpenAssignModal} />
      )}
      {currentRoute === '/access-compliance' && (
        <AccessCompliancePage onOpenAssignModal={handleOpenAssignModal} />
      )}
      {currentRoute === '/integration-automation' && (
        <IntegrationAutomationPage />
      )}
      {currentRoute === '/reports-analytics' && (
        <ReportsAnalyticsPage />
      )}
      {currentRoute === '/settings' && (
        <SettingsPage />
      )}
    </AppLayout>
  );
}

export default App;
