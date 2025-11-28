import ToolCard from '../components/ToolCard';

import { Users, FolderOpen, TrendingUp, Newspaper } from 'lucide-react';

const salesTools = [
  {
    name: 'S&M Requirements & Trainer Pool',
    description: 'Centralized platform for managing sales & marketing requirements and curating our pool of expert trainers.',
    url: 'http://143.110.185.65:5173 ',
    category: 'Resource Hub',
    color: 'bg-green-600',
    icon: Users
  },
  {
    name: 'S&M – Proposal Archive',
    description: 'Access and manage a comprehensive archive of all past sales and marketing proposals for reference and learning.',
    url: '#',
    category: 'Proposal Vault',
    color: 'bg-blue-600',
    icon: FolderOpen
  },
  {
    name: 'S&M – Activity Tracker',
    description: 'Track and visualize all sales and marketing activities to measure engagement and performance.',
    url: '#',
    category: 'Activity Monitor',
    color: 'bg-red-600',
    icon: TrendingUp
  },
  {
    name: 'S&M – Articles & Posts',
    description: 'Browse and contribute to our curated collection of sales and marketing articles, blogs, and social media posts.',
    url: '#',
    category: 'Content Library',
    color: 'bg-purple-600',
    icon: Newspaper
  }
];

const SalesMarketing = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Sales & Marketing Tools</h1>
        <p className="text-gray-600">Access your CRM, marketing platforms, and analytics tools.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {salesTools.map((tool, index) => (
          <ToolCard key={index} {...tool} />
        ))}
      </div>
    </div>
  );
};

export default SalesMarketing;