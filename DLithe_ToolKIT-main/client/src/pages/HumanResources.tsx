import ToolCard from '../components/ToolCard';

import { User, Clock, Calendar, Plane, CalendarDays, Medal } from 'lucide-react';

const hrTools = [
  {
    name: 'Employee Profile',
    description: 'View and manage personal employee details, contact information, and HR records.',
    url: '#',
    category: 'My Profile',
    color: 'bg-blue-600',
    icon: User
  },
  {
    name: 'Attendance',
    description: 'Mark daily attendance and review your work presence records.',
    url: '#',
    category: 'Attendance Log',
    color: 'bg-green-600',
    icon: Clock
  },
  {
    name: 'Timesheet',
    description: 'Accurately record and submit your work hours for various projects and tasks.',
    url: '#',
    category: 'Timesheet Submissions',
    color: 'bg-orange-600',
    icon: Calendar
  },
  {
    name: 'Leave Management',
    description: 'Apply for and track your leave requests, and view your leave balances.',
    url: '#',
    category: 'Leave Requests',
    color: 'bg-teal-600',
    icon: Plane
  },
  {
    name: 'Events',
    description: 'Stay updated on upcoming company events, holidays, and celebrations.',
    url: '#',
    category: 'Company Events',
    color: 'bg-purple-600',
    icon: CalendarDays
  },
  {
    name: 'Certification Generation',
    description: 'Generate and download official certifications for completed training and achievements.',
    url: 'http://143.110.185.65:8501',
    category: 'Certificates',
    color: 'bg-yellow-600',
    icon: Medal
  }
];

const HumanResources = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Human Resources Tools</h1>
        <p className="text-gray-600">Manage employee lifecycle, payroll, and performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hrTools.map((tool, index) => (
          <ToolCard key={index} {...tool} />
        ))}
      </div>
    </div>
  );
};

export default HumanResources;