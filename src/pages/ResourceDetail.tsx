import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ExternalLink, FileText, PlayCircle, ArrowLeft, Download, Package } from 'lucide-react';
import { useDataStore } from '@/store/useDataStore';
import Breadcrumb from '@/components/Breadcrumb';
import EmptyState from '@/components/EmptyState';
import ResourceCard from '@/components/ResourceCard';
import PaperBackground from '@/components/PaperBackground';
import { useElasticEnter, useStaggerReveal } from '@/hooks/useGsap';
import type { ResourceCategory } from '@/types';

const categoryColor: Record<ResourceCategory, string> = {
  个人产品: 'bg-[var(--crimson)] text-[var(--paper-light)]',
  教程资料: 'bg-[var(--indigo)] text-[var(--paper-light)]',
  AI资料: 'bg-[var(--violet)] text-[var(--paper-light)]',
};

export default function ResourceDetail() {
  const { id } = useParams<{ id: string }>();
  const { resources, loading, loaded, loadAll } = useDataStore();

  const heroRef = useElasticEnter<HTMLDivElement>([], { y: 30, delay: 0.05 });
  const relatedRef = useStaggerReveal<HTMLDivElement>('.related-card', [], { stagger: 0.08 });

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const resource = useMemo(() => resources.find((r) => r.id === id), [resources, id]);

  const related = useMemo(() => {
    if (!resource) return [];
    return resources
      .filter((r) => r.id !== resource.id && r.category === resource.category)
      .slice(0, 3);
  }, [resources, resource]);

  if (loading && !loaded) {
    return (
      <div className="relative min-h-screen overflow-hidden pt-16">
        <PaperBackground />
        <div className="relative z-10 mx-auto max-w-4xl px-4 py-20 text-center font-hand-body text-sm text-[var(--ink-mute)]">
          加载中...
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="relative min-h-screen overflow-hidden pt-16">
        <PaperBackground />
        <div className="relative z-10 mx-auto max-w-4xl px-4 py-12">
          <Breadcrumb
            items={[
              { label: '首页', to: '/' },
              { label: '资源中心', to: '/resources' },
              { label: '未找到' },
            ]}
          />
          <EmptyState
            title="资源不存在"
            description="该资源可能已被移除或链接有误。"
            action={
              <Link to="/resources" className="hand-btn text-sm">
                <ArrowLeft className="h-4 w-4" /> 返回资源中心
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const isProduct = resource.category === '个人产品';
  const hasDownload = !isProduct && resource.downloadUrl;
  const hasFiles = resource.fileList && resource.fileList.length > 0;

  return (
    <div className="relative min-h-screen overflow-hidden pt-16">
      <PaperBackground />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: '首页', to: '/' },
            { label: '资源中心', to: '/resources' },
            { label: resource.title },
          ]}
        />

        <div ref={heroRef}>
          {/* 头部 */}
          <div
            className="hand-card mb-6 overflow-hidden p-0"
            style={{ transform: 'rotate(-0.4deg)' }}
          >
            {/* 封面图 */}
            {resource.coverImage ? (
              <div className="relative h-48 w-full overflow-hidden border-b-2 border-[var(--ink)] sm:h-60">
                <img
                  src={resource.coverImage}
                  alt={resource.title}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.currentTarget.parentElement as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            ) : null}

            <div className="p-6">
              <div className="mb-4 flex items-start gap-4">
                {/* 图标：优先用 icon 字段，否则用默认 FileText */}
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border-2 border-[var(--ink)] bg-[var(--paper)] shadow-[3px_3px_0_var(--ink)]">
                  {resource.icon ? (
                    <span className="text-3xl">{resource.icon}</span>
                  ) : (
                    <FileText className="h-8 w-8 text-[var(--ink-mute)]" />
                  )}
                </div>
                <div className="min-w-0">
                  <h1 className="mb-2 font-hand-title text-2xl text-[var(--ink)] sm:text-3xl">
                    {resource.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-md border-2 border-[var(--ink)] px-2 py-0.5 font-hand-title text-xs font-bold ${
                        categoryColor[resource.category] ?? 'bg-[var(--paper-light)] text-[var(--ink)]'
                      }`}
                    >
                      {resource.category}
                    </span>
                    {resource.subCategory ? (
                      <span className="hand-tag text-xs">{resource.subCategory}</span>
                    ) : null}
                    {resource.isHot ? (
                      <span className="hand-tag text-xs" style={{ background: 'var(--crimson)', color: 'var(--paper-light)' }}>热门</span>
                    ) : null}
                    {resource.isNew ? (
                      <span className="hand-tag text-xs" style={{ background: 'var(--teal)', color: 'var(--paper-light)' }}>NEW</span>
                    ) : null}
                    {resource.tags.map((t) => (
                      <span key={t} className="hand-tag text-xs">#{t}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 操作按钮区：产品链接 / 下载链接 */}
              <div className="flex flex-wrap gap-2">
                {isProduct && resource.productUrl ? (
                  <a
                    href={resource.productUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hand-btn hand-btn-primary inline-flex text-sm"
                  >
                    <ExternalLink className="h-4 w-4" />
                    前往使用
                  </a>
                ) : null}
                {hasDownload ? (
                  <a
                    href={resource.downloadUrl!}
                    target="_blank"
                    rel="noreferrer"
                    className="hand-btn hand-btn-primary inline-flex text-sm"
                  >
                    <Download className="h-4 w-4" />
                    下载资源
                  </a>
                ) : null}
              </div>
            </div>
          </div>

          {/* 简介 */}
          <div
            className="hand-card mb-6 p-5"
            style={{ transform: 'rotate(0.3deg)' }}
          >
            <h2 className="mb-3 font-hand-title text-base text-[var(--ink)]">资源简介</h2>
            <p className="font-hand-body text-sm leading-relaxed text-[var(--ink-soft)]">{resource.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-4 font-hand-body text-xs text-[var(--ink-mute)]">
              <span>更新于 {resource.updatedAt || '—'}</span>
              <span>创建于 {resource.createdAt || '—'}</span>
            </div>
          </div>

          {/* 文件清单 */}
          {hasFiles ? (
            <div
              className="hand-card mb-6 p-5"
              style={{ transform: 'rotate(-0.3deg)' }}
            >
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-[var(--ink)] bg-[var(--indigo)] shadow-[1px_1px_0_var(--ink)]">
                  <Package className="h-3.5 w-3.5 text-[var(--paper-light)]" />
                </div>
                <h2 className="font-hand-title text-base text-[var(--ink)]">
                  文件清单 <span className="text-xs text-[var(--ink-mute)]">（共 {resource.fileCount || resource.fileList.length} 个）</span>
                </h2>
              </div>
              <ul className="grid gap-1 sm:grid-cols-2">
                {resource.fileList.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 rounded-md border border-[var(--ink)]/20 bg-[var(--paper-light)] px-3 py-1.5 font-hand-body text-xs text-[var(--ink-soft)]"
                  >
                    <FileText className="h-3 w-3 shrink-0 text-[var(--ink-mute)]" />
                    <span className="truncate">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* 对应视频 */}
          {resource.videoRef ? (
            <a
              href={resource.videoRef.url}
              target="_blank"
              rel="noreferrer"
              className="hand-card mb-6 flex items-center gap-3 p-4 transition-colors hover:bg-[var(--indigo)]/5"
              style={{ transform: 'rotate(-0.2deg)' }}
            >
              <PlayCircle className="h-6 w-6 shrink-0 text-[var(--indigo)]" />
              <div>
                <div className="font-hand-body text-xs text-[var(--indigo)]">{resource.videoRef.platform}</div>
                <div className="font-hand-body text-sm text-[var(--ink)]">{resource.videoRef.title}</div>
              </div>
            </a>
          ) : null}

          {/* 相关资源 */}
          {related.length > 0 ? (
            <div>
              <h2 className="mb-4 font-hand-title text-base text-[var(--ink)]">
                <span className="hand-underline inline-block">相关资源</span>
              </h2>
              <div ref={relatedRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((r, i) => (
                  <div
                    key={r.id}
                    className="related-card"
                    style={{ transform: `rotate(${(i % 2 ? -1 : 1) * 0.4}deg)` }}
                  >
                    <ResourceCard resource={r} compact />
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
