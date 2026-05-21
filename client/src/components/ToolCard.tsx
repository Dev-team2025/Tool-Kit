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
  const isInternal = url.startsWith('/');

  const cardContent = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color} text-white shadow-md flex-shrink-0`}>
          {IconComponent ? (
            <IconComponent className="h-6 w-6" />
          ) : (
            <ExternalLink className="h-6 w-6" />
          )}
        </div>
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-semibold text-gray-700 uppercase tracking-wider">
          {category}
        </span>
      </div>

      <div className="mt-4">
        <h3 className="text-base font-semibold text-gray-900 group-hover:text-primary transition-colors">
          {name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {description}
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-sm font-medium text-primary">
        <span>Access tool</span>
        <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </>
  );

  const classes = "group block rounded-xl border-2 border-gray-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

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
