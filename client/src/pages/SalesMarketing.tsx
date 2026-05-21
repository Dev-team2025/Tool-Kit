import ToolCard from '../components/ToolCard';

import { Users, FolderOpen, TrendingUp, Newspaper } from 'lucide-react';

const salesTools = [
  {
    name: 'S&M Requirements & Trainer Pool',
    description: 'Centralized platform for managing sales & marketing requirements and curating our pool of expert trainers.',
    url: 'http://143.110.185.65:5173 ',
    category: 'Resource Hub',
    color: 'bg-primary',
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
    color: 'bg-blue-500',
    icon: TrendingUp
  },
  {
    name: 'S&M – Articles & Posts',
    description: 'Browse and contribute to our curated collection of sales and marketing articles, blogs, and social media posts.',
    url: '#',
    category: 'Content Library',
    color: 'bg-indigo-500',
    icon: Newspaper
  }
];

const SalesMarketing = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-display font-bold text-gray-900">Sales & Marketing Tools</h2>
        <p className="text-sm text-muted-foreground mt-1">Access your CRM, campaign tools, and performance insights</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {salesTools.map((tool, index) => (
          <ToolCard key={index} {...tool} />
        ))}
      </div>
    </div>
  );
};

export default SalesMarketing;