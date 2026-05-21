
import ToolCard from '../components/ToolCard';

import { BarChart, Monitor, GraduationCap, Globe } from 'lucide-react';

const technicalTools = [
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
  {
    name: 'Student Project Submissions',
    description: 'Facilitate student project submissions and review their technical work.',
    url: '#',
    category: 'Student Submissions',
    color: 'bg-amber-500',
    icon: GraduationCap
  },
  {
    name: 'DLithe Website',
    description: 'Quick access to the official DLithe website for information and resources.',
    url: '#',
    category: 'DLithe Web Portal',
    color: 'bg-primary',
    icon: Globe
  }
];

const Technical = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-display font-bold text-gray-900">Technical Hub Tools</h2>
        <p className="text-sm text-muted-foreground mt-1">Engineering resources, infrastructure tools, and developer utilities</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {technicalTools.map((tool, index) => (
          <ToolCard key={index} {...tool} />
        ))}
      </div>
    </div>
  );
};

export default Technical;
