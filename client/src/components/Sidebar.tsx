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
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const departments = [
  { name: 'Dashboard', path: '/', icon: Home, color: 'text-teal-600' },
  { name: 'Sales & Marketing', path: '/sales-marketing', icon: TrendingUp, color: 'text-amber-600' },
  { name: 'Human Resources', path: '/hr', icon: Users, color: 'text-slate-600' },
  { name: 'Learning & Development', path: '/learning', icon: GraduationCap, color: 'text-emerald-600' },
  { name: 'Technical', path: '/technical', icon: Settings, color: 'text-rose-600' },
];

const quickAccessTools = [
  { name: 'Attendance', path: '#', icon: Clock, color: 'from-teal-500 to-teal-600', shadowColor: 'shadow-teal-500/25' },
  { name: 'Time Sheet', path: '#', icon: Calendar, color: 'from-amber-500 to-amber-600', shadowColor: 'shadow-amber-500/25' },
  { name: 'Events', path: '#', icon: CalendarDays, color: 'from-emerald-500 to-emerald-600', shadowColor: 'shadow-emerald-500/25' },
  { name: 'Practice Test', path: '#', icon: FileText, color: 'from-rose-500 to-rose-600', shadowColor: 'shadow-rose-500/25' },
  { name: 'Activity Monitor', path: '#', icon: TrendingUp, color: 'from-sky-500 to-sky-600', shadowColor: 'shadow-sky-500/25' },
  { name: 'Proposal Vault', path: '#', icon: FolderOpen, color: 'from-slate-600 to-slate-700', shadowColor: 'shadow-slate-500/25' },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredTool, setHoveredTool] = useState(null);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    const confirmed = window.confirm('Are you sure you want to log out?');
    if (!confirmed) return;

    await logout();
    navigate('/login');
  };

  const handleToolClick = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation"
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white/90 rounded-full shadow-md hover:shadow-lg transition-shadow"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full w-72 bg-white/90 backdrop-blur-2xl shadow-[0_20px_60px_rgba(15,23,42,0.18)] z-40 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-0 flex flex-col border-r border-gray-200/70
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="px-6 pt-6">
          <div className="rounded-3xl border border-teal-100/70 bg-gradient-to-br from-white via-white to-teal-50 p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <img src="/Dlithe_logo.png" alt="DLithe Logo" className="w-28" />
              <span className="rounded-full bg-teal-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-teal-700">
                Live
              </span>
            </div>
            <div className="mt-4">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Workspace</p>
              <p className="text-lg font-display text-gray-900">DLithe ToolKit</p>
              <p className="text-xs text-gray-500">
                {user?.name ?? user?.email ?? 'Signed in'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-6 pt-6">
          <nav className="space-y-1" aria-label="Primary">
            {departments.map((dept) => {
              
              const IconComponent = dept.icon;
              return (
                <NavLink
                  key={dept.path}
                  to={dept.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `
                    group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-700 transition-all duration-200
                    hover:bg-white hover:shadow-sm hover:text-gray-900
                    ${isActive ? 'bg-gradient-to-r from-teal-50 via-white to-white text-teal-800 shadow-sm ring-1 ring-teal-100' : ''}
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-500 transition-colors group-hover:bg-teal-50 ${isActive ? 'bg-teal-100 text-teal-700' : ''}`}>
                        <IconComponent className={`h-5 w-5 ${dept.color}`} />
                      </div>
                      <div className="flex flex-1 items-center justify-between">
                        <span>{dept.name}</span>
                        {isActive && <span className="text-xs text-teal-600">Active</span>}
                      </div>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Quick Access 3D Tools after departments */}
          <div className="mt-8 rounded-2xl border border-gray-200/70 bg-white/70 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-[0.25em]">
                Quick Access
              </h3>
              <Sparkles className="h-4 w-4 text-amber-400" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3" style={{ transformStyle: 'preserve-3d' }}>
              {quickAccessTools.map((tool, index) => {
                const IconComponent = tool.icon;
                const isHovered = hoveredTool === index;

                return (
                  <button
                    key={index}
                    type="button"
                    className={`
                      relative flex flex-col items-start gap-2 rounded-2xl border border-transparent bg-white p-3 text-left shadow-sm transition-all duration-300
                      ${isHovered ? 'scale-[1.03] border-teal-100 shadow-md' : 'hover:scale-[1.03] hover:border-teal-100'}
                    `}
                    onMouseEnter={() => setHoveredTool(index)}
                    onMouseLeave={() => setHoveredTool(null)}
                    onClick={() => handleToolClick(tool.path)}
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${tool.color} text-white shadow ${tool.shadowColor}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-semibold text-gray-700">{tool.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200/70 mt-auto">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-100 transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;


