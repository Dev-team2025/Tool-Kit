import { Outlet, useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '@/contexts/AuthContext';

const Layout = () => {
  const location = useLocation();
  const { user } = useAuth();

  const pageMeta: Record<string, { title: string; subtitle: string }> = {
    '/': {
      title: 'Dashboard',
      subtitle: 'Your workspace overview and quick access tools.'
    },
    '/sales-marketing': {
      title: 'Sales & Marketing',
      subtitle: 'Campaigns, proposals, and growth insights.'
    },
    '/hr': {
      title: 'Human Resources',
      subtitle: 'People ops, policies, and employee services.'
    },
    '/learning': {
      title: 'Learning & Development',
      subtitle: 'Upskill, certify, and grow your expertise.'
    },
    '/technical': {
      title: 'Technical Hub',
      subtitle: 'Engineering tools and technical resources.'
    }
  };

  const currentMeta = pageMeta[location.pathname] ?? {
    title: 'Workspace',
    subtitle: 'Manage your tools and resources.'
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/70 border-b border-gray-200">
          <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-gray-500 uppercase">
                <Sparkles className="h-4 w-4 text-teal-500" />
                DLithe ToolKit
              </div>
              <h1 className="mt-2 text-2xl font-display text-gray-900 sm:text-3xl">
                {currentMeta.title}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {currentMeta.subtitle}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-gray-700 shadow-sm border border-gray-200">
                <span className="font-medium text-gray-900">
                  {user?.name ?? user?.email ?? 'Signed in'}
                </span>
                <span className="text-xs text-gray-500">• Workspace user</span>
              </div>
              <div className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 border border-teal-100">
                Supabase Connected
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="px-4 pb-10 pt-6 sm:px-8 lg:px-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

