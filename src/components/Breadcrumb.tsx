import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

/** 面包屑：终端路径风格 ~/path/to/current */
export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="mb-6 flex flex-wrap items-center gap-1 font-mono text-xs text-[var(--ink-mute)]" aria-label="面包屑">
      <span className="text-[var(--accent)]">~</span>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1">
            <span className="text-[var(--ink-mute)]">/</span>
            {item.to && !isLast ? (
              <Link to={item.to} className="text-[var(--ink-soft)] transition-colors hover:text-[var(--accent)]">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'font-bold text-[var(--accent)]' : 'text-[var(--ink-soft)]'}>
                {item.label}
              </span>
            )}
            {!isLast && <ChevronRight className="h-3 w-3 text-[var(--ink-mute)]" />}
          </span>
        );
      })}
    </nav>
  );
}
