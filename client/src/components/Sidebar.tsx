import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Users, 
  TrendingUp, 
  GraduationCap, 
  Settings,
  Home,
  Menu,
  X,
  Clock,
  Calendar,
  CalendarDays,
  FileText,
  FolderOpen,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const departments = [
  { name: 'Dashboard', path: '/', icon: Home },
  { name: 'Profile', path: '/profile', icon: Users },
  { name: 'Sales & Marketing', path: '/sales-marketing', icon: TrendingUp },
  { name: 'Human Resources', path: '/hr', icon: Users },
  { name: 'Learning & Development', path: '/learning', icon: GraduationCap },
  { name: 'Technical', path: '/technical', icon: Settings },
];

const quickAccessTools = [
  { name: 'Attendance', path: '#', icon: Clock },
  { name: 'Time Sheet', path: '#', icon: Calendar },
  { name: 'Events', path: '#', icon: CalendarDays },
  { name: 'Practice Test', path: '#', icon: FileText },
  { name: 'Activity Monitor', path: '#', icon: TrendingUp },
  { name: 'Proposal Vault', path: '#', icon: FolderOpen },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    const confirmed = window.confirm('Are you sure you want to log out?');
    if (!confirmed) return;

    await logout();
    navigate('/login');
  };

  const handleToolClick = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation"
        className="lg:hidden fixed top-5 left-5 z-50 p-2.5 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200"
      >
        {isOpen ? <X size={20} className="text-gray-700" /> : <Menu size={20} className="text-gray-700" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full w-72 bg-white z-40 transform transition-transform duration-300 ease-out
        lg:translate-x-0 lg:static lg:z-0 flex flex-col border-r border-gray-200 shadow-xl lg:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img src="/Dlithe_logo.png" alt="DLithe Logo" className="w-10 h-10 object-contain" />
            <div className="flex-1">
              <h2 className="text-lg font-display font-bold text-gray-900">DLithe ToolKit</h2>
              <p className="text-xs text-muted-foreground">Workspace Portal</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Online" />
          </div>
        </div>

        {/* User Info */}
        <div className="px-4 py-4 border-b border-gray-200 bg-gradient-to-br from-primary/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-semibold text-sm shadow-md">
              {user?.name?.[0] || user?.email?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email || 'user@example.com'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <nav className="space-y-1" aria-label="Primary navigation">
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Menu</p>
            {departments.map((dept) => {
              const IconComponent = dept.icon;
              return (
                <NavLink
                  key={dept.path}
                  to={dept.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `
                    group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-primary text-white shadow-md shadow-primary/20' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <IconComponent className={`h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                      <span className="flex-1">{dept.name}</span>
                      {isActive && <ChevronRight className="h-4 w-4" />}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Quick Access */}
          <div className="mt-6">
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Access</p>
            <div className="grid grid-cols-2 gap-2">
              {quickAccessTools.map((tool, index) => {
                const IconComponent = tool.icon;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleToolClick(tool.path)}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 hover:from-primary/10 hover:to-primary/5 border border-gray-200 hover:border-primary/30 transition-all duration-200 hover:shadow-sm group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center group-hover:shadow-md transition-shadow">
                      <IconComponent className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-[10px] font-medium text-gray-700 text-center leading-tight">{tool.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </Button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
