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
  FolderOpen
} from 'lucide-react';

const departments = [
  { name: 'Dashboard', path: '/', icon: Home, color: 'text-blue-600' },
  { name: 'Sales & Marketing', path: '/sales-marketing', icon: TrendingUp, color: 'text-green-600' },
  { name: 'Human Resources', path: '/hr', icon: Users, color: 'text-purple-600' },
  { name: 'Learning & Development', path: '/learning', icon: GraduationCap, color: 'text-orange-600' },
  { name: 'Technical', path: '/technical', icon: Settings, color: 'text-red-600' },
];

const quickAccessTools = 
[
  { name: 'Attendance', path: '#', icon: Clock, color: 'from-green-400 to-green-600', shadowColor: 'shadow-green-500/25' },
  { name: 'Time Sheet', path: '#', icon: Calendar, color: 'from-red-400 to-red-600', shadowColor: 'shadow-red-500/25' },
  { name: 'Events', path: '#', icon: CalendarDays, color: 'from-orange-400 to-orange-600', shadowColor: 'shadow-orange-500/25' },
  { name: 'Practice Test', path: '#', icon: FileText, color: 'from-purple-400 to-purple-600', shadowColor: 'shadow-purple-500/25' },
  { name: 'Activity Monitor', path: '#', icon: TrendingUp, color: 'from-yellow-400 to-yellow-600', shadowColor: 'shadow-yellow-500/25' },
  { name: 'Proposal Vault', path: '#', icon: FolderOpen, color: 'from-pink-400 to-pink-600', shadowColor: 'shadow-pink-500/25' },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredTool, setHoveredTool] = useState(null);
  const navigate = useNavigate();

  const handleToolClick = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md hover:shadow-lg transition-shadow"
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
        fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-gray-200 flex flex-col items-center">
          <img src="/Dlithe_logo.png" alt="DLithe Logo" className="w-40" />
        </div>

        <nav className="mt-0">
          {departments.map((dept) => {
            
            const IconComponent = dept.icon;
            return (
              <NavLink
                key={dept.path}
                to={dept.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `
                  flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200
                  ${isActive ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' : ''}
                `}
              >
                <IconComponent className={`w-5 h-5 mr-3 ${dept.color}`} />
                <span className="font-medium">{dept.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Quick Access 3D Tools after departments */}
        <div className="p-4 border-t border-gray-200 mt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Access</h3>
          <div style={{ perspective: '1000px' }}>
            <div className="grid grid-cols-2 gap-3" style={{ transformStyle: 'preserve-3d' }}>
              {quickAccessTools.map((tool, index) => {
                const IconComponent = tool.icon;
                const isHovered = hoveredTool === index;
                
                return (
                  <div
                    key={index}
                    className={`
                      relative cursor-pointer transform transition-all duration-300 ease-out
                      ${isHovered ? 'scale-110' : 'hover:scale-105'}
                    `}
                    onMouseEnter={() => setHoveredTool(index)}
                    onMouseLeave={() => setHoveredTool(null)}
                    onClick={() => handleToolClick(tool.path)}
                    style={{
                      transform: isHovered 
                        ? 'scale(1.1) rotateY(12deg) translateZ(8px)' 
                        : 'scale(1)',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    <div className={`relative w-14 h-14 bg-gradient-to-br ${tool.color}
                      rounded-lg shadow-lg ${tool.shadowColor}
                      transition-all duration-300 ease-out
                      ${isHovered ? 'shadow-xl' : ''}`}>
                      <div className={`absolute inset-0 bg-gradient-to-br ${tool.color}
                        rounded-lg flex items-center justify-center
                        transition-all duration-300
                        ${isHovered ? 'brightness-110' : ''}`}>
                        <IconComponent className="w-6 h-6 text-white drop-shadow-lg" />
                      </div>
                      <div className={`absolute top-0 right-0 w-1 h-full bg-gradient-to-b 
                        from-black/10 to-black/30 rounded-r-lg 
                        ${isHovered ? 'opacity-60' : 'opacity-40'} transition-opacity duration-300`} />
                      <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r 
                        from-black/10 to-black/30 rounded-b-lg
                        ${isHovered ? 'opacity-60' : 'opacity-40'} transition-opacity duration-300`} />
                      {isHovered && (
                        <div className={`absolute inset-0 bg-gradient-to-br ${tool.color}
                          rounded-lg opacity-50 blur-sm animate-pulse`} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;


