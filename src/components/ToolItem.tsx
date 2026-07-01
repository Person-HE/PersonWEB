import { ExternalLink, Star } from 'lucide-react';
import type { Tool, AccessType, Pricing } from '@/types';

const accessTypeColor: Record<AccessType, string> = {
  国内可用: 'bg-[var(--teal)] text-[var(--paper-light)]',
  需中转: 'bg-[var(--mustard)] text-[var(--ink)]',
  需翻墙: 'bg-[var(--crimson)] text-[var(--paper-light)]',
};

const pricingColor: Record<Pricing, string> = {
  免费: 'bg-[var(--teal)] text-[var(--paper-light)]',
  部分免费: 'bg-[var(--indigo)] text-[var(--paper-light)]',
  付费: 'bg-[var(--ink)] text-[var(--paper-light)]',
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
              ? 'fill-[var(--mustard)] text-[var(--mustard)]'
              : 'fill-transparent text-[var(--ink-mute)]'
          }`}
        />
      ))}
      <span className="ml-1 font-hand-en text-[10px] text-[var(--ink-mute)]">{value.toFixed(1)}</span>
    </div>
  );
}

export default function ToolItem({ tool }: { tool: Tool }) {
  return (
    <div className="hand-card ink-spread group flex items-center gap-3 p-4 sm:gap-4">
      {/* 图标 */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 border-[var(--ink)] bg-[var(--paper)] shadow-[2px_2px_0_var(--ink)] sm:h-12 sm:w-12">
        {tool.icon ? (
          <img
            src={tool.icon}
            alt={tool.name}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <span className="font-hand-title text-sm text-[var(--ink)]">{tool.name.slice(0, 1)}</span>
        )}
      </div>

      {/* 主体信息 */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={tool.url}
            target="_blank"
            rel="noreferrer"
            className="font-hand-title text-base text-[var(--ink)] transition-colors hover:text-[var(--crimson)]"
          >
            {tool.name}
          </a>
          <Rating value={tool.rating} />
        </div>
        <p className="mt-0.5 line-clamp-1 font-hand-body text-xs text-[var(--ink-soft)] sm:text-sm">
          {tool.description}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className={`rounded border-2 border-[var(--ink)] px-1.5 py-0.5 text-[10px] font-bold ${accessTypeColor[tool.accessType]}`}>
            {tool.accessType}
          </span>
          <span className={`rounded border-2 border-[var(--ink)] px-1.5 py-0.5 text-[10px] font-bold ${pricingColor[tool.pricing]}`}>
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
    <div className="hand-card hand-card-crimson group relative overflow-hidden p-5">
      <div className="absolute right-3 top-3 rotate-3 rounded-full border-2 border-[var(--crimson)] bg-[var(--crimson)] px-2 py-0.5 text-[10px] font-bold text-[var(--paper-light)] shadow-[1px_1px_0_var(--ink)]">
        编辑推荐
      </div>
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border-2 border-[var(--ink)] bg-[var(--paper)] shadow-[2px_2px_0_var(--ink)]">
          {tool.icon ? (
            <img
              src={tool.icon}
              alt={tool.name}
              className="h-full w-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <span className="font-hand-title text-base text-[var(--ink)]">{tool.name.slice(0, 1)}</span>
          )}
        </div>
        <div>
          <a
            href={tool.url}
            target="_blank"
            rel="noreferrer"
            className="font-hand-title text-base text-[var(--ink)] transition-colors hover:text-[var(--crimson)]"
          >
            {tool.name}
          </a>
          <p className="font-hand-body text-xs text-[var(--ink-soft)]">{tool.description}</p>
        </div>
      </div>
      {tool.recommendReason ? (
        <p className="mb-4 rounded-lg border-2 border-dashed border-[var(--ink)] bg-[var(--mustard)]/10 px-3 py-2 font-hand-body text-xs leading-relaxed text-[var(--ink-soft)]">
          {tool.recommendReason}
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
