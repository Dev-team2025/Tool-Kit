import ToolCard from '../components/ToolCard';

import { Users, FolderOpen, TrendingUp, Newspaper } from 'lucide-react';

const salesTools = [
  {
    name: 'S&M Requirements & Trainer Pool',
    description: 'Centralized platform for managing sales & marketing requirements and curating our pool of expert trainers.',
    url: 'http://143.110.185.65:5173 ',
    category: 'Resource Hub',
    color: 'bg-teal-500',
    icon: Users
  },
  {
    name: 'S&M – Proposal Archive',
    description: 'Access and manage a comprehensive archive of all past sales and marketing proposals for reference and learning.',
    url: '#',
    category: 'Proposal Vault',
    color: 'bg-amber-500',
    icon: FolderOpen
  },
  {
    name: 'S&M – Activity Tracker',
    description: 'Track and visualize all sales and marketing activities to measure engagement and performance.',
    url: '#',
    category: 'Activity Monitor',
    color: 'bg-rose-500',
    icon: TrendingUp
  },
  {
    name: 'S&M – Articles & Posts',
    description: 'Browse and contribute to our curated collection of sales and marketing articles, blogs, and social media posts.',
    url: '#',
    category: 'Content Library',
    color: 'bg-sky-500',
    icon: Newspaper
  }
];

const SalesMarketing = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <section className="rounded-3xl border border-amber-100/80 bg-white/80 p-8 shadow-sm">
        <h2 className="text-3xl font-display text-gray-900">Sales & Marketing</h2>
        <p className="mt-2 text-sm text-gray-600">
          Access your CRM, campaign tools, and performance insights.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {salesTools.map((tool, index) => (
          <ToolCard key={index} {...tool} />
        ))}
      </section>
    </div>
  );
};

export default SalesMarketing;