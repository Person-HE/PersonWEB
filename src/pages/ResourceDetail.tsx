import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ExternalLink,
  FileText,
  PlayCircle,
  ArrowLeft,
  Download,
  Package,
  Link as LinkIcon,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { useDataStore } from '@/store/useDataStore';
import Breadcrumb from '@/components/Breadcrumb';
import EmptyState from '@/components/EmptyState';
import ResourceCard from '@/components/ResourceCard';
import PaperBackground from '@/components/PaperBackground';
import Seo from '@/components/Seo';
import { useElasticEnter, useStaggerReveal } from '@/hooks/useGsap';
import { getResourceLink } from '@/lib/resourceLink';
import FormattedText from '@/components/FormattedText';
import { SmartImage, SmartVideo } from '@/components/SmartMedia';
import type { ResourceCategory } from '@/types';

const categoryColor: Record<ResourceCategory, string> = {
  个人产品: 'bg-[var(--accent-alt)] text-[var(--bg-elevated)]',
  教程资料: 'bg-[var(--accent-blue)] text-[var(--bg-elevated)]',
  AI资料: 'bg-[var(--accent-violet)] text-[var(--bg-elevated)]',
};

/** 判断是否为可直接内嵌播放的视频直链（mp4 / webm） */
function isDirectVideoUrl(url: string): boolean {
  return /\.(mp4|webm)(\?.*)?$/i.test(url);
}

/** 判断是否为抖音链接（保留外链卡片样式） */
function isDouyinUrl(url: string): boolean {
  return /douyin\.com|iesdouyin\.com|dy\.com/i.test(url);
}

export default function ResourceDetail() {
  const { id } = useParams<{ id: string }>();
  const { resources, loading, loaded, loadAll } = useDataStore();
  const [activeShot, setActiveShot] = useState<string | null>(null);

  const heroRef = useElasticEnter<HTMLDivElement>([], { y: 30, delay: 0.05 });
  const galleryRef = useStaggerReveal<HTMLDivElement>('.shot-item', [], { stagger: 0.06 });
  const relatedRef = useStaggerReveal<HTMLDivElement>('.related-card', [], { stagger: 0.08 });

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const resource = useMemo(() => resources.find((r) => String(r.id) === String(id)), [resources, id]);

  const related = useMemo(() => {
    if (!resource) return [];
    return resources
      .filter((r) => r.id !== resource.id && r.category === resource.category)
      .slice(0, 3);
  }, [resources, resource]);

  const { url: linkUrl, password: linkPassword } = useMemo(
    () => (resource ? getResourceLink(resource) : { url: null, password: null }),
    [resource]
  );

  if (loading && !loaded) {
    return (
      <div className="relative min-h-screen overflow-hidden pt-16">
        <PaperBackground />
        <div className="relative z-10 mx-auto max-w-4xl px-4 py-20 text-center font-mono text-sm text-[var(--ink-mute)]">
          <span className="text-[var(--accent)]">{'>'}</span> loading...
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
  const hasLink = !!linkUrl && linkUrl.trim() !== '';
  const hasFiles = resource.fileList && resource.fileList.length > 0;
  const hasFileCount = resource.fileCount && resource.fileCount > 0;
  const hasScreenshots = !!(resource.screenshots && resource.screenshots.length > 0);
  const hasVideo = !!resource.videoUrl;
  const isDirectVideo = hasVideo && isDirectVideoUrl(resource.videoUrl as string);
  const hasDemo = !!resource.demoUrl && resource.demoUrl.trim() !== '';

  return (
    <div className="relative min-h-screen overflow-hidden pt-16">
      <PaperBackground />
      <Seo title={resource.title} description={resource.description} path={`/resources/${resource.id}`} />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: '首页', to: '/' },
            { label: '资源中心', to: '/resources' },
            { label: resource.title },
          ]}
        />

        <div ref={heroRef}>
          {/* 头部：终端面板风格 */}
          <div
            className="hand-card mb-6 overflow-hidden p-0 rgb-shift"
            style={{ transform: 'rotate(-0.4deg)' }}
          >
            {/* 封面图 */}
            {resource.coverImage ? (
              <div className="relative h-48 w-full overflow-hidden border-b-2 border-[var(--ink)] sm:h-60">
                <SmartImage
                  src={resource.coverImage}
                  alt={resource.title}
                  eager
                  fallbackLabel="封面信号丢失"
                  wrapperClassName="h-full w-full"
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}

            <div className="p-6">
              <div className="mb-4 flex items-start gap-4">
                {/* 图标：优先用 icon 字段，否则用默认 FileText */}
                <div className="flex h-20 w-20 shrink-0 items-center justify-center border-2 border-[var(--ink)] bg-[var(--bg)] shadow-[3px_3px_0_var(--ink)]">
                  {resource.icon ? (
                    <span className="text-3xl">{resource.icon}</span>
                  ) : (
                    <FileText className="h-8 w-8 text-[var(--ink-mute)]" />
                  )}
                </div>
                <div className="min-w-0">
                  <h1
                    className="mb-2 font-display text-2xl text-[var(--ink)] glitch-text sm:text-3xl"
                    data-text={resource.title}
                  >
                    {resource.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`border-2 border-[var(--ink)] px-2 py-0.5 font-display text-xs font-bold ${
                        categoryColor[resource.category] ?? 'bg-[var(--bg-elevated)] text-[var(--ink)]'
                      }`}
                    >
                      {resource.category}
                    </span>
                    {resource.subCategory ? (
                      <span className="hand-tag text-xs">{resource.subCategory}</span>
                    ) : null}
                    {resource.isHot ? (
                      <span className="hand-tag text-xs" style={{ background: 'var(--accent-alt)', color: 'var(--bg-elevated)' }}>热门</span>
                    ) : null}
                    {resource.isNew ? (
                      <span className="hand-tag text-xs" style={{ background: 'var(--accent-cyan)', color: 'var(--bg-elevated)' }}>NEW</span>
                    ) : null}
                    {resource.tags.map((t) => (
                      <span key={t} className="hand-tag text-xs">#{t}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 网盘链接 */}
              {hasLink ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={linkUrl!}
                      target="_blank"
                      rel="noreferrer"
                      className="hand-btn hand-btn-primary inline-flex text-sm"
                    >
                      <LinkIcon className="h-4 w-4" />
                      访问网盘链接
                    </a>
                    {linkPassword ? (
                      <span className="border-2 border-[var(--ink)] bg-[var(--accent)] px-2 py-1 font-mono text-xs text-[var(--ink)]">
                        提取码：{linkPassword}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-2 border-2 border-[var(--ink)]/20 bg-[var(--bg-elevated)] px-3 py-2">
                    <span className="flex-1 truncate font-mono text-xs text-[var(--ink-soft)]">
                      {linkUrl}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (linkUrl) {
                          navigator.clipboard.writeText(linkUrl);
                        }
                      }}
                      className="shrink-0 border-2 border-[var(--ink)] bg-[var(--bg)] px-2 py-1 font-mono text-xs text-[var(--ink)] shadow-[1px_1px_0_var(--ink)] hover:bg-[var(--bg-elevated)]"
                    >
                      复制链接
                    </button>
                  </div>
                </div>
              ) : (
                <p className="font-mono text-sm text-[var(--ink-mute)]">{'>'} 暂无网盘链接</p>
              )}
            </div>
          </div>

          {/* 简介 */}
          <div
            className="hand-card mb-6 p-5 rgb-shift"
            style={{ transform: 'rotate(0.3deg)' }}
          >
            <h2 className="mb-3 font-display text-base text-[var(--ink)]">
              <span className="text-[var(--accent)]">{'// '}</span>
              资源简介
            </h2>
            <FormattedText text={resource.description} />
            <div className="mt-4 flex flex-wrap items-center gap-4 font-mono text-xs text-[var(--ink-mute)]">
              <span><span className="text-[var(--accent)]">{'>'}</span> 更新于 {resource.updatedAt || '—'}</span>
              <span><span className="text-[var(--accent)]">{'>'}</span> 创建于 {resource.createdAt || '—'}</span>
            </div>
          </div>

          {/* 效果展示（截图画廊） */}
          {hasScreenshots ? (
            <div className="mb-6">
              <h2 className="mb-3 font-display text-base text-[var(--ink)]">
                <span className="text-[var(--accent)]">{'// '}</span>
                效果展示
              </h2>
              <div
                ref={galleryRef}
                className="flex gap-3 overflow-x-auto pb-3"
                style={{ scrollbarWidth: 'thin' }}
              >
                {resource.screenshots.map((shot, i) => (
                  <button
                    type="button"
                    key={`${i}-${shot}`}
                    onClick={() => setActiveShot(shot)}
                    className="shot-item hand-card rgb-shift shrink-0 overflow-hidden p-0"
                    style={{ transform: `rotate(${(i % 2 ? 1 : -1) * 0.4}deg)`, width: '16rem' }}
                    aria-label={`查看效果截图 ${i + 1}`}
                  >
                    <div className="relative h-40 w-full overflow-hidden border-b-2 border-[var(--ink)]">
                      <SmartImage
                        src={shot}
                        alt={`效果截图 ${i + 1}`}
                        fallbackLabel={`截图 ${i + 1} 丢失`}
                        wrapperClassName="h-full w-full"
                        className="h-full w-full object-cover"
                      />
                      <span
                        className="hand-tag absolute right-2 top-2 z-10 text-xs"
                        style={{ background: 'var(--bg-elevated)', color: 'var(--ink)' }}
                      >
                        <ImageIcon className="h-3 w-3" /> {i + 1}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              <p className="mt-1 font-mono text-xs text-[var(--ink-mute)]">
                <span className="text-[var(--accent)]">{'>'}</span> 点击截图可放大查看 →
              </p>
            </div>
          ) : null}

          {/* 文件信息 */}
          {(hasFiles || hasFileCount) ? (
            <div
              className="hand-card mb-6 p-5 rgb-shift"
              style={{ transform: 'rotate(-0.3deg)' }}
            >
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center border-2 border-[var(--ink)] bg-[var(--accent-blue)] shadow-[1px_1px_0_var(--ink)]">
                  <Package className="h-3.5 w-3.5 text-[var(--ink)]" />
                </div>
                <h2 className="font-display text-base text-[var(--ink)]">
                  <span className="text-[var(--accent)]">{'// '}</span>
                  文件信息 <span className="text-xs text-[var(--ink-mute)]">（共 {resource.fileCount || resource.fileList.length} 个）</span>
                </h2>
              </div>
              {hasFiles ? (
                <ul className="grid gap-1 sm:grid-cols-2">
                  {resource.fileList.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 border border-[var(--ink)]/20 bg-[var(--bg-elevated)] px-3 py-1.5 font-mono text-xs text-[var(--ink-soft)]"
                    >
                      <FileText className="h-3 w-3 shrink-0 text-[var(--ink-mute)]" />
                      <span className="truncate">{f}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="font-mono text-sm text-[var(--ink-mute)]">{'>'} 暂无文件列表</p>
              )}
            </div>
          ) : null}

          {/* 视频演示 */}
          {hasVideo ? (
            <div className="mb-6">
              <h2 className="mb-3 font-display text-base text-[var(--ink)]">
                <span className="text-[var(--accent)]">{'// '}</span>
                视频演示
              </h2>
              {isDirectVideo ? (
                <div
                  className="hand-card overflow-hidden p-0 rgb-shift"
                  style={{ transform: 'rotate(-0.3deg)' }}
                >
                  <SmartVideo
                    src={resource.videoUrl as string}
                    poster={resource.coverImage || undefined}
                    wrapperClassName="aspect-video w-full"
                    className="aspect-video w-full object-cover"
                    fallbackLabel="视频信号丢失"
                  />
                </div>
              ) : (
                <div
                  className="hand-card p-5 rgb-shift"
                  style={{ transform: 'rotate(-0.3deg)' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-[var(--ink)] bg-[var(--accent-blue)] shadow-[2px_2px_0_var(--ink)]">
                      <PlayCircle className="h-5 w-5 text-[var(--ink)]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-sm text-[var(--ink)]">
                        {isDouyinUrl(resource.videoUrl as string) ? '抖音视频演示' : '视频演示'}
                      </p>
                      <p className="truncate font-mono text-xs text-[var(--ink-mute)]">
                        {resource.videoUrl}
                      </p>
                    </div>
                    <a
                      href={resource.videoUrl as string}
                      target="_blank"
                      rel="noreferrer"
                      className="hand-btn hand-btn-blue inline-flex text-xs"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      前往观看
                    </a>
                  </div>
                </div>
              )}
              {hasDemo ? (
                <a
                  href={resource.demoUrl as string}
                  target="_blank"
                  rel="noreferrer"
                  className="hand-btn hand-btn-primary mt-3 inline-flex text-sm"
                >
                  <PlayCircle className="h-4 w-4" />
                  在线体验 Demo
                </a>
              ) : null}
            </div>
          ) : hasDemo ? (
            <div className="mb-6">
              <a
                href={resource.demoUrl as string}
                target="_blank"
                rel="noreferrer"
                className="hand-btn hand-btn-primary inline-flex text-sm"
              >
                <PlayCircle className="h-4 w-4" />
                在线体验 Demo
              </a>
            </div>
          ) : null}

          {/* 相关资源 */}
          {related.length > 0 ? (
            <div>
              <h2 className="mb-4 font-display text-base text-[var(--ink)]">
                <span className="text-[var(--accent)]">{'// '}</span>
                相关资源
              </h2>
              <div ref={relatedRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((r, i) => (
                  <div
                    key={r.id}
                    className="related-card rgb-shift"
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

      {/* 截图放大模态 */}
      {activeShot ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setActiveShot(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-h-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveShot(null)}
              className="hand-btn absolute -right-3 -top-3 z-10 h-9 w-9 p-0"
              style={{ background: 'var(--accent-alt)', color: 'var(--bg-elevated)' }}
              aria-label="关闭"
            >
              <X className="h-4 w-4" />
            </button>
            <SmartImage
              src={activeShot}
              alt="效果截图放大"
              wrapperClassName="max-h-[80vh] w-auto border-2 border-[var(--ink)] shadow-[6px_6px_0_var(--ink)]"
              className="max-h-[80vh] w-auto object-contain"
              fallbackLabel="放大查看失败"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
