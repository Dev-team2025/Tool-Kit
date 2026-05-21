import ToolCard from '../components/ToolCard';

import { Brain, FileText } from 'lucide-react';

const learningTools = [
  {
    name: 'Skill Development Request',
    description: 'Request new training programs or resources to enhance your professional skills.',
    url: '#',
    category: 'Skill Development',
    color: 'bg-primary',
    icon: Brain
  },
  {
    name: 'Practice Test',
    description: 'Access and attempt practice tests to assess your knowledge and prepare for certifications.',
    url: '#',
    category: 'Practice Zone',
    color: 'bg-amber-500',
    icon: FileText
  }
];

const LearningDevelopment = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-display font-bold text-gray-900">Learning & Development Tools</h2>
        <p className="text-sm text-muted-foreground mt-1">Build new skills, access training, and track your growth journey</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {learningTools.map((tool, index) => (
          <ToolCard key={index} {...tool} />
        ))}
      </div>
    </div>
  );
};

export default LearningDevelopment;