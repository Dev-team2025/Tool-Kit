import ToolCard from '../components/ToolCard';

import { Brain, FileText } from 'lucide-react';

const learningTools = [
  {
    name: 'Skill Development Request',
    description: 'Request new training programs or resources to enhance your professional skills.',
    url: '#',
    category: 'Skill Development',
    color: 'bg-teal-500',
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
    <div className="max-w-7xl mx-auto space-y-8">
      <section className="rounded-3xl border border-emerald-100/80 bg-white/80 p-8 shadow-sm">
        <h2 className="text-3xl font-display text-gray-900">Learning & Development</h2>
        <p className="mt-2 text-sm text-gray-600">
          Build new skills, access training, and track your growth journey.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {learningTools.map((tool, index) => (
          <ToolCard key={index} {...tool} />
        ))}
      </section>
    </div>
  );
};

export default LearningDevelopment;