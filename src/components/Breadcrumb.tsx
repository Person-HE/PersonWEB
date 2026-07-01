import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="mb-6 flex flex-wrap items-center gap-1 font-hand-body text-sm text-[var(--ink-mute)]" aria-label="面包屑">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1">
            {item.to && !isLast ? (
              <Link to={item.to} className="transition-colors hover:text-[var(--crimson)]">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'font-hand-title text-[var(--ink)]' : ''}>{item.label}</span>
            )}
            {!isLast && <ChevronRight className="h-3.5 w-3.5 text-[var(--ink-mute)]" />}
          </span>
        );
      })}
    </nav>
  );
}
