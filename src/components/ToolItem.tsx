import { useState } from 'react';
import { ExternalLink, Star } from 'lucide-react';
import type { Tool, AccessType, Pricing } from '@/types';

const accessTypeColor: Record<AccessType, string> = {
  国内可用: 'bg-[var(--accent-cyan)] text-[var(--bg)]',
  需中转: 'bg-[var(--accent)] text-[var(--bg)]',
  需翻墙: 'bg-[var(--accent-alt)] text-[var(--ink)]',
};

const pricingColor: Record<Pricing, string> = {
  免费: 'bg-[var(--accent-cyan)] text-[var(--bg)]',
  部分免费: 'bg-[var(--accent-blue)] text-[var(--ink)]',
  付费: 'bg-[var(--ink)] text-[var(--bg)]',
};

function Rating({ value }: { value: number }) {
  if (value <= 0) return null;
  return (
    <div className="flex items-center gap-0.5" title={`评分 ${value}`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${
            i <= Math.round(value)
              ? 'fill-[var(--accent)] text-[var(--accent)]'
              : 'fill-transparent text-[var(--ink-mute)]'
          }`}
        />
      ))}
      <span className="ml-1 font-mono text-[10px] text-[var(--ink-mute)]">{value.toFixed(1)}</span>
    </div>
  );
}

/** 工具图标：加载失败回退首字母（小图标不用雪花屏，太重） */
function ToolIcon({ tool, size = 'sm' }: { tool: Tool; size?: 'sm' | 'lg' }) {
  const [errored, setErrored] = useState(false);
  const dim = size === 'lg' ? 'h-12 w-12' : 'h-10 w-10 sm:h-12 sm:w-12';
  const showImg = tool.icon && !errored;
  return (
    <div className={`flex ${dim} shrink-0 items-center justify-center overflow-hidden border-2 border-[var(--ink)] bg-[var(--bg-surface)] shadow-[2px_2px_0_var(--ink)]`}>
      {showImg ? (
        <img
          src={tool.icon as string}
          alt={tool.name}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setErrored(true)}
        />
      ) : (
        <span className={`font-display ${size === 'lg' ? 'text-base' : 'text-sm'} text-[var(--accent)]`}>
          {tool.name.slice(0, 1)}
        </span>
      )}
    </div>
  );
}

export default function ToolItem({ tool }: { tool: Tool }) {
  return (
    <div className="hand-card rgb-shift group flex items-center gap-3 p-4 sm:gap-4">
      <ToolIcon tool={tool} />

      {/* 主体信息 */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={tool.url}
            target="_blank"
            rel="noreferrer"
            className="font-display text-base text-[var(--ink)] transition-colors hover:text-[var(--accent)]"
          >
            {tool.name}
          </a>
          <Rating value={tool.rating} />
        </div>
        <p className="mt-0.5 line-clamp-1 font-mono text-xs text-[var(--ink-soft)] sm:text-sm">
          {tool.description}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className={`border-2 border-[var(--ink)] px-1.5 py-0.5 font-mono text-[10px] font-bold ${accessTypeColor[tool.accessType]}`}>
            {tool.accessType}
          </span>
          <span className={`border-2 border-[var(--ink)] px-1.5 py-0.5 font-mono text-[10px] font-bold ${pricingColor[tool.pricing]}`}>
            {tool.pricing}
          </span>
          {tool.tags.slice(0, 3).map((t) => (
            <span key={t} className="hand-tag text-[10px]">#{t}</span>
          ))}
        </div>
      </div>

      <a
        href={tool.url}
        target="_blank"
        rel="noreferrer"
        className="hand-btn shrink-0 text-xs sm:text-sm"
      >
        访问
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}

/** 推荐工具大卡片 */
export function RecommendedToolCard({ tool }: { tool: Tool }) {
  return (
    <div className="hand-card hand-card-accent rgb-shift group relative overflow-hidden p-5">
      <div className="absolute right-3 top-3 rotate-3 border-2 border-[var(--accent-alt)] bg-[var(--accent-alt)] px-2 py-0.5 font-mono text-[10px] font-bold text-[var(--ink)] shadow-[1px_1px_0_var(--ink)]">
        {'>'} 编辑推荐
      </div>
      <div className="mb-3 flex items-center gap-3">
        <ToolIcon tool={tool} size="lg" />
        <div>
          <a
            href={tool.url}
            target="_blank"
            rel="noreferrer"
            className="font-display text-base text-[var(--ink)] transition-colors hover:text-[var(--accent)]"
          >
            {tool.name}
          </a>
          <p className="font-mono text-xs text-[var(--ink-soft)]">{tool.description}</p>
        </div>
      </div>
      {tool.recommendReason ? (
        <p className="mb-4 border-2 border-dashed border-[var(--accent)] bg-[var(--accent)]/10 px-3 py-2 font-mono text-xs leading-relaxed text-[var(--ink-soft)]">
          <span className="text-[var(--accent)]">{'>'}</span> {tool.recommendReason}
        </p>
      ) : null}
      <a
        href={tool.url}
        target="_blank"
        rel="noreferrer"
        className="hand-btn hand-btn-primary text-xs"
      >
        访问
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}
