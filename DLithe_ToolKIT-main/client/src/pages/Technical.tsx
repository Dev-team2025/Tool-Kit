
import ToolCard from '../components/ToolCard';

import { BarChart, Monitor, GraduationCap, Globe } from 'lucide-react';

const technicalTools = [
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
  {
    name: 'Student Project Submissions',
    description: 'Facilitate student project submissions and review their technical work.',
    url: '#',
    category: 'Student Submissions',
    color: 'bg-purple-600',
    icon: GraduationCap
  },
  {
    name: 'DLithe Website',
    description: 'Quick access to the official DLithe website for information and resources.',
    url: '#',
    category: 'DLithe Web Portal',
    color: 'bg-orange-600',
    icon: Globe
  }
];

const Technical = () => {
  console.log('Technical page rendering');
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Technical Tools</h1>
        <p className="text-gray-600">Development, deployment, and infrastructure management tools.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {technicalTools.map((tool, index) => (
          <ToolCard key={index} {...tool} />
        ))}
      </div>
    </div>
  );
};

export default Technical;
