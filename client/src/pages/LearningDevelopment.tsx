import ToolCard from '../components/ToolCard';

import { Brain, FileText } from 'lucide-react';

const learningTools = [
  {
    name: 'Skill Development Request',
    description: 'Request new training programs or resources to enhance your professional skills.',
    url: '#',
    category: 'Skill Development',
    color: 'bg-blue-600',
    icon: Brain
  },
  {
    name: 'Practice Test',
    description: 'Access and attempt practice tests to assess your knowledge and prepare for certifications.',
    url: '#',
    category: 'Practice Zone',
    color: 'bg-green-600',
    icon: FileText
  }
];

const LearningDevelopment = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Learning & Development</h1>
        <p className="text-gray-600">Enhance skills and knowledge with these learning platforms.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {learningTools.map((tool, index) => (
          <ToolCard key={index} {...tool} />
        ))}
      </div>
    </div>
  );
};

export default LearningDevelopment;