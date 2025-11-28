import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="h-screen flex overflow-hidden bg-blue-50">
      {/* Sidebar remains fixed */}
      <Sidebar />

      {/* Scrollable Outlet content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8 min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;

