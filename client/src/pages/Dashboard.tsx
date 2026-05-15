import DailyQuote from '../components/DailyQuote';
import ToolCard from '../components/ToolCard';
import UpcomingBirthdays from '../components/UpcomingBirthdays';
import { Calendar, Clock, BarChart, Monitor } from 'lucide-react';

const recentTools = [
  {
    name: 'Timesheet',
    description: 'Accurately record and submit your work hours for various projects and tasks.',
    url: '#',
    category: 'Timesheet',
    color: 'bg-amber-500',
    icon: Calendar
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
    name: 'Project Dashboard',
    description: 'Get a real-time snapshot of all ongoing projects, progress, and key metrics.',
    url: '#',
    category: 'Project Overview',
    color: 'bg-blue-500',
    icon: BarChart
  },
  {
    name: 'Project Repository',
    description: 'Access and manage all project codebases, documentation, and technical assets.',
    url: '#',
    category: 'Codebase Explorer',
    color: 'bg-green-600',
    icon: Monitor
  },
];

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Daily Quote */}
      <DailyQuote />

      {/* Upcoming Birthdays */}
      <UpcomingBirthdays />

      {/* Quick Access Tools */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-display font-bold text-gray-900">Quick Access Tools</h2>
          <p className="text-sm text-muted-foreground mt-1">Access your most-used tools instantly</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentTools.map((tool, index) => (
            <ToolCard key={index} {...tool} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;