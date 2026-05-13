import DailyQuote from '../components/DailyQuote';
import ToolCard from '../components/ToolCard';
import UpcomingBirthdays from '../components/UpcomingBirthdays';
import { Calendar, Clock, BarChart, Monitor, Sparkles } from 'lucide-react';


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
    color: 'bg-teal-500',
    icon: Clock
  },
  {
    name: 'Project Dashboard',
    description: 'Get a real-time snapshot of all ongoing projects, progress, and key metrics.',
    url: '#',
    category: 'Project Overview',
    color: 'bg-sky-500',
    icon: BarChart
  },
  {
    name: 'Project Repository',
    description: 'Access and manage all project codebases, documentation, and technical assets.',
    url: '#',
    category: 'Codebase Explorer',
    color: 'bg-emerald-500',
    icon: Monitor
  },
];

const stats = [
  { label: 'Active tools', value: '18', hint: 'Across departments' },
  { label: 'Team updates', value: '6', hint: 'This week' },
  { label: 'Upcoming events', value: '3', hint: 'Next 30 days' },
];

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <section className="rounded-3xl border border-teal-100/70 bg-white/80 p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
              <Sparkles className="h-4 w-4" />
              Today at a glance
            </div>
            <h2 className="mt-4 text-3xl font-display text-gray-900 sm:text-4xl">
              Welcome to DLithe ToolKit
            </h2>
            <p className="mt-3 text-base text-gray-600">
              Your centralized workspace for daily operations, resources, and team updates.
            </p>
          </div>
          <div className="grid w-full gap-4 sm:grid-cols-3 lg:max-w-md">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-gray-200/80 bg-white p-4 text-center shadow-sm"
              >
                <div className="text-2xl font-display text-gray-900">{stat.value}</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                  {stat.label}
                </div>
                <div className="mt-2 text-xs text-gray-500">{stat.hint}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DailyQuote />

      <UpcomingBirthdays />

      <section>
        <div className="flex items-end justify-between">
          <div>
            <h3 className="text-2xl font-display text-gray-900">Quick Access Tools</h3>
            <p className="text-sm text-gray-600">Open your most-used tools in one tap.</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {recentTools.map((tool, index) => (
            <ToolCard key={index} {...tool} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;