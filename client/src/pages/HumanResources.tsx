import ToolCard from '../components/ToolCard';

import { User, Clock, Calendar, Plane, CalendarDays, Medal } from 'lucide-react';

const hrTools = [
  {
    name: 'Employee Profile',
    description: 'View and manage personal employee details, contact information, and HR records.',
    url: '/profile',
    category: 'My Profile',
    color: 'bg-gray-600',
    icon: User
  },
  {
    name: 'Attendance',
    description: 'Mark daily attendance and review your work presence records.',
    url: '#',
    category: 'Attendance Log',
    color: 'bg-primary',
    icon: Clock
  },
  {
    name: 'Timesheet',
    description: 'Accurately record and submit your work hours for various projects and tasks.',
    url: '#',
    category: 'Timesheet Submissions',
    color: 'bg-amber-500',
    icon: Calendar
  },
  {
    name: 'Leave Management',
    description: 'Apply for and track your leave requests, and view your leave balances.',
    url: '#',
    category: 'Leave Requests',
    color: 'bg-green-600',
    icon: Plane
  },
  {
    name: 'Events',
    description: 'Stay updated on upcoming company events, holidays, and celebrations.',
    url: '#',
    category: 'Company Events',
    color: 'bg-pink-500',
    icon: CalendarDays
  },
  {
    name: 'Certification Generation',
    description: 'Generate and download official certifications for completed training and achievements.',
    url: 'http://143.110.185.65:8501',
    category: 'Certificates',
    color: 'bg-blue-500',
    icon: Medal
  }
];

const HumanResources = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-display font-bold text-gray-900">Human Resources Tools</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage people operations, payroll, and employee success</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {hrTools.map((tool, index) => (
          <ToolCard key={index} {...tool} />
        ))}
      </div>
    </div>
  );
};

export default HumanResources;