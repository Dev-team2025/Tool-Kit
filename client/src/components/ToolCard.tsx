import { ExternalLink, LucideIcon } from 'lucide-react';

interface ToolCardProps {
  name: string;
  description: string;
  url: string;
  category: string;
  color: string;
  icon?: LucideIcon;
}

const ToolCard = ({ name, description, url, category, color, icon: IconComponent }: ToolCardProps) => {
  const handleClick = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border hover:border-gray-300 group"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-3`}>
            {IconComponent ? (
              <IconComponent className="w-6 h-6 text-white" />
            ) : (
              <ExternalLink className="w-6 h-6 text-white" />
            )}
          </div>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
            {category}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
          {name}
        </h3>
        
        <p className="text-gray-600 text-sm leading-relaxed">
          {description}
        </p>
        
        <div className="mt-4 flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
          <span>Access Tool</span>
          <ExternalLink className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
