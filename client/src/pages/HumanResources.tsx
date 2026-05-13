import ToolCard from '../components/ToolCard';

import { User, Clock, Calendar, Plane, CalendarDays, Medal } from 'lucide-react';

const hrTools = [
  {
    name: 'Employee Profile',
    description: 'View and manage personal employee details, contact information, and HR records.',
    url: '#',
    category: 'My Profile',
    color: 'bg-slate-500',
    icon: User
  },
  {
    name: 'Attendance',
    description: 'Mark daily attendance and review your work presence records.',
    url: '#',
    category: 'Attendance Log',
    color: 'bg-teal-500',
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
    color: 'bg-emerald-500',
    icon: Plane
  },
  {
    name: 'Events',
    description: 'Stay updated on upcoming company events, holidays, and celebrations.',
    url: '#',
    category: 'Company Events',
    color: 'bg-rose-500',
    icon: CalendarDays
  },
  {
    name: 'Certification Generation',
    description: 'Generate and download official certifications for completed training and achievements.',
    url: 'http://143.110.185.65:8501',
    category: 'Certificates',
    color: 'bg-sky-500',
    icon: Medal
  }
];

const HumanResources = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <section className="rounded-3xl border border-slate-100/80 bg-white/80 p-8 shadow-sm">
        <h2 className="text-3xl font-display text-gray-900">Human Resources</h2>
        <p className="mt-2 text-sm text-gray-600">
          Manage people operations, payroll, and employee success in one place.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {hrTools.map((tool, index) => (
          <ToolCard key={index} {...tool} />
        ))}
      </section>
    </div>
  );
};

export default HumanResources;