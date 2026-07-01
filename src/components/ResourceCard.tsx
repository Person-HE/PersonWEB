import { Link } from 'react-router-dom';
import { Download, ExternalLink, FileText, PlayCircle, ArrowRight } from 'lucide-react';
import type { Resource } from '@/types';

interface ResourceCardProps {
  resource: Resource;
  compact?: boolean;
}

const categoryColor: Record<string, string> = {
  个人产品: 'bg-[var(--crimson)] text-[var(--paper-light)]',
  教程资料: 'bg-[var(--indigo)] text-[var(--paper-light)]',
  AI资料: 'bg-[var(--violet)] text-[var(--paper-light)]',
};

export default function ResourceCard({ resource, compact = false }: ResourceCardProps) {
  const isProduct = resource.category === '个人产品';
  const actionUrl = isProduct ? resource.productUrl : resource.downloadUrl;
  const actionLabel = isProduct ? '使用' : '下载';
  const ActionIcon = isProduct ? ExternalLink : Download;

  return (
    <div className="hand-card ink-spread group flex h-full flex-col p-5">
      {/* 顶部：图标 + 标签 */}
      <div className="mb-3 flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-[var(--ink)] bg-[var(--paper)] shadow-[2px_2px_0_var(--ink)]">
          {resource.icon ? (
            <img
              src={resource.icon}
              alt={resource.title}
              className="h-full w-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <FileText className="h-5 w-5 text-[var(--ink-soft)]" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-1 font-hand-title text-base text-[var(--ink)]">
            {resource.title}
          </h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span
              className={`rounded-md border-2 border-[var(--ink)] px-2 py-0.5 text-[10px] font-bold ${
                categoryColor[resource.category] ?? 'bg-[var(--paper-light)] text-[var(--ink)]'
              }`}
            >
              {resource.category}
            </span>
            {resource.subCategory ? (
              <span className="hand-tag">{resource.subCategory}</span>
            ) : null}
            {resource.isNew ? (
              <span className="rounded-md border-2 border-[var(--ink)] bg-[var(--teal)] px-2 py-0.5 text-[10px] font-bold text-[var(--paper-light)]">
                NEW
              </span>
            ) : null}
            {resource.isHot ? (
              <span className="rounded-md border-2 border-[var(--ink)] bg-[var(--mustard)] px-2 py-0.5 text-[10px] font-bold text-[var(--ink)]">
                HOT
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <p className={`mb-4 font-hand-body text-sm leading-relaxed text-[var(--ink-soft)] ${compact ? 'line-clamp-2' : 'line-clamp-3'}`}>
        {resource.description}
      </p>

      {resource.videoRef && !compact ? (
        <a
          href={resource.videoRef.url}
          target="_blank"
          rel="noreferrer"
          className="mb-4 flex items-center gap-2 rounded-lg border-2 border-[var(--indigo)] bg-[var(--indigo)]/10 px-3 py-2 font-hand-body text-xs text-[var(--indigo)] transition-colors hover:bg-[var(--indigo)]/20"
        >
          <PlayCircle className="h-4 w-4 shrink-0" />
          <span className="line-clamp-1">{resource.videoRef.title}</span>
        </a>
      ) : null}

      <div className="mt-auto flex items-center justify-between gap-2 font-hand-body text-xs text-[var(--ink-mute)]">
        <span className="flex items-center gap-1">
          <FileText className="h-3.5 w-3.5" />
          {resource.fileCount > 0 ? `${resource.fileCount} 个文件` : '—'}
        </span>
        <span>更新于 {resource.updatedAt || '—'}</span>
      </div>

      <div className="mt-4 flex items-center gap-2">
        {actionUrl ? (
          <a
            href={actionUrl}
            target="_blank"
            rel="noreferrer"
            className="hand-btn hand-btn-primary flex-1 text-sm"
          >
            <ActionIcon className="h-4 w-4" />
            {actionLabel}
          </a>
        ) : (
          <span className="flex-1 rounded-xl border-2 border-dashed border-[var(--ink)]/40 px-4 py-2.5 text-center font-hand-body text-sm text-[var(--ink-mute)]">
            暂无下载链接
          </span>
        )}
        <Link
          to={`/resources/${resource.id}`}
          className="hand-btn text-sm"
        >
          详情
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
