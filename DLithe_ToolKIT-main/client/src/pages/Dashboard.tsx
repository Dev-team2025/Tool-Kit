import DailyQuote from '../components/DailyQuote';
import ToolCard from '../components/ToolCard';
import UpcomingBirthdays from '../components/UpcomingBirthdays';
import { Calendar, Clock, BarChart, Monitor} from 'lucide-react';


const recentTools = [
{
    name: 'Timesheet',
    description: 'Accurately record and submit your work hours for various projects and tasks.',
    url: '#',
    category: 'Timesheet',
    color: 'bg-orange-600',
    icon: Calendar
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
    name: 'Project Dashboard',
    description: 'Get a real-time snapshot of all ongoing projects, progress, and key metrics.',
    url: '#',
    category: 'Project Overview',
    color: 'bg-blue-600',
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
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Welcome to Dlithe Tool Kit-Simplify your work ,Enhance your impact.</h1>
        <p className="text-gray-600 text-xl text-center ">Your centralized hub for accessing departmental tools and resources.</p>
      </div>

      <DailyQuote />

      <UpcomingBirthdays />

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Quick Access Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentTools.map((tool, index) => (
            <ToolCard key={index} {...tool} />
          ))}
        </div>
      </div>

     
    </div>
  );
};

export default Dashboard;