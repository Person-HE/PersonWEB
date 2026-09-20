import { Link } from 'react-router-dom';
import { FileText, PlayCircle, ArrowRight } from 'lucide-react';
import type { Resource } from '@/types';

interface ResourceCardProps {
  resource: Resource;
  compact?: boolean;
}

const categoryColor: Record<string, string> = {
  个人产品: 'bg-[var(--accent-alt)] text-[var(--ink)]',
  教程资料: 'bg-[var(--accent-cyan)] text-[var(--bg)]',
  AI资料: 'bg-[var(--accent)] text-[var(--bg)]',
};

export default function ResourceCard({ resource, compact = false }: ResourceCardProps) {
  return (
    <div className="hand-card rgb-shift group flex h-full flex-col p-5">
      {/* 顶部：图标 + 标签 */}
      <div className="mb-3 flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-[var(--ink)] bg-[var(--bg-surface)] shadow-[2px_2px_0_var(--ink)]">
          <FileText className="h-5 w-5 text-[var(--accent)]" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-1 font-display text-base text-[var(--ink)]">
            {resource.title}
          </h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span
              className={`border-2 border-[var(--ink)] px-2 py-0.5 font-mono text-[10px] font-bold ${
                categoryColor[resource.category] ?? 'bg-[var(--bg-elevated)] text-[var(--ink)]'
              }`}
            >
              {resource.category}
            </span>
            {resource.subCategory ? (
              <span className="hand-tag">{resource.subCategory}</span>
            ) : null}
            {resource.isNew ? (
              <span className="border-2 border-[var(--ink)] bg-[var(--accent-cyan)] px-2 py-0.5 font-mono text-[10px] font-bold text-[var(--bg)]">
                NEW
              </span>
            ) : null}
            {resource.isHot ? (
              <span className="border-2 border-[var(--ink)] bg-[var(--accent)] px-2 py-0.5 font-mono text-[10px] font-bold text-[var(--bg)]">
                HOT
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <p className={`mb-4 font-mono text-xs leading-relaxed text-[var(--ink-soft)] ${compact ? 'line-clamp-2' : 'line-clamp-3'}`}>
        {resource.description}
      </p>

      {resource.videoUrl && !compact ? (
        <a
          href={resource.videoUrl}
          target="_blank"
          rel="noreferrer"
          className="mb-4 flex items-center gap-2 border-2 border-[var(--accent-cyan)] bg-[var(--accent-cyan)]/10 px-3 py-2 font-mono text-xs text-[var(--accent-cyan)] transition-colors hover:bg-[var(--accent-cyan)]/20"
        >
          <PlayCircle className="h-4 w-4 shrink-0" />
          <span className="line-clamp-1">{'>'} 抖音视频</span>
        </a>
      ) : null}

      <div className="mt-4 flex items-center gap-2">
        <Link
          to={`/resources/${resource.id}`}
          className="hand-btn hand-btn-primary flex-1 text-center text-sm"
        >
          查看详情
          <ArrowRight className="ml-1 inline h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
