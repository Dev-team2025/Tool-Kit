import { ExternalLink, LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ToolCardProps {
  name: string;
  description: string;
  url: string;
  category: string;
  color: string;
  icon?: LucideIcon;
}

const ToolCard = ({ name, description, url, category, color, icon: IconComponent }: ToolCardProps) => {
  // Check if the URL is internal (starts with /) or external
  const isInternal = url.startsWith('/');

  const cardContent = (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${color} text-white shadow-md shadow-black/5`}>
          {IconComponent ? (
            <IconComponent className="h-6 w-6" />
          ) : (
            <ExternalLink className="h-6 w-6" />
          )}
        </div>
        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
          {category}
        </span>
      </div>

      <h3 className="mt-5 text-lg font-semibold text-gray-900 group-hover:text-teal-700">
        {name}
      </h3>

      <p className="mt-2 text-sm leading-relaxed text-gray-600">
        {description}
      </p>

      <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-teal-700">
        Access tool
        <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </>
  );

  const classes = "group block rounded-2xl border border-gray-200/80 bg-white/80 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500";

  if (isInternal) {
    return (
      <Link
        to={url}
        className={classes}
        aria-label={`Open ${name}`}
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={classes}
      aria-label={`Open ${name}`}
    >
      {cardContent}
    </a>
  );
};

export default ToolCard;
