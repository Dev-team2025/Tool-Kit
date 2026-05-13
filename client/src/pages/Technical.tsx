
import ToolCard from '../components/ToolCard';

import { BarChart, Monitor, GraduationCap, Globe } from 'lucide-react';

const technicalTools = [
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
    color: 'bg-teal-500',
    icon: Globe
  }
];

const Technical = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <section className="rounded-3xl border border-sky-100/80 bg-white/80 p-8 shadow-sm">
        <h2 className="text-3xl font-display text-gray-900">Technical Hub</h2>
        <p className="mt-2 text-sm text-gray-600">
          Engineering resources, infrastructure tools, and developer utilities.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {technicalTools.map((tool, index) => (
          <ToolCard key={index} {...tool} />
        ))}
      </section>
    </div>
  );
};

export default Technical;
