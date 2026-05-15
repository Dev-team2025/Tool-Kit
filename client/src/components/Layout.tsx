import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '@/contexts/AuthContext';

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  '/': {
    title: 'Dashboard',
    subtitle: 'Your workspace overview and quick access tools'
  },
  '/profile': {
    title: 'Profile',
    subtitle: 'Manage your personal information and settings'
  },
  '/sales-marketing': {
    title: 'Sales & Marketing',
    subtitle: 'Campaigns, proposals, and growth insights'
  },
  '/hr': {
    title: 'Human Resources',
    subtitle: 'People operations and employee services'
  },
  '/learning': {
    title: 'Learning & Development',
    subtitle: 'Upskill, certify, and grow your expertise'
  },
  '/technical': {
    title: 'Technical Hub',
    subtitle: 'Engineering tools and technical resources'
  }
};

const Layout = () => {
  const location = useLocation();
  const { user } = useAuth();

  const currentMeta = pageMeta[location.pathname] ?? {
    title: 'Workspace',
    subtitle: 'Manage your tools and resources'
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 truncate">
                  {currentMeta.title}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {currentMeta.subtitle}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

