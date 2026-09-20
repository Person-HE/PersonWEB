/**
 * BlogList —— 博客文章列表（数据来自 /api/blog 快照，cron 每小时同步）
 *
 * 快照不可用时显示诚实降级提示，不伪造文章。
 */
import { ExternalLink, Newspaper } from 'lucide-react';
import { useLiveStore } from '@/store/useLiveStore';
import { siteConfig } from '@/config/site.config';
import EmptyState from '@/components/EmptyState';

export default function BlogList({ limit }: { limit?: number }) {
  const { blog, loading, loaded, load } = useLiveStore();

  if (!loaded && !loading) load();

  if (!blog) {
    return (
      <EmptyState
        icon={<Newspaper className="h-7 w-7" />}
        title={loading ? '数据同步中' : '博客目录暂不可用'}
        description={
          loading
            ? '正在拉取博客快照…'
            : `快照由服务端每小时同步一次。可直接访问 ${siteConfig.blogUrl}`
        }
        action={
          <a
            href={siteConfig.blogUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 border-2 border-[var(--ink)] bg-[var(--bg-elevated)] px-3 py-1.5 font-mono text-xs text-[var(--ink)] shadow-[2px_2px_0_var(--ink)] hover:bg-[var(--accent)] hover:text-[var(--bg)]"
          >
            <ExternalLink className="h-3.5 w-3.5" /> 前往博客
          </a>
        }
      />
    );
  }

  const posts = limit ? blog.posts.slice(0, limit) : blog.posts;

  return (
    <div>
      <ul className="divide-y-2 divide-dashed divide-[var(--ink-mute)] border-y-2 border-[var(--ink)]">
        {posts.map((p) => (
          <li key={p.url}>
            <a
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className="group flex items-baseline gap-4 bg-[var(--bg-elevated)] px-4 py-4 transition-colors hover:bg-[var(--bg-deep)]"
            >
              <time className="shrink-0 font-mono text-xs text-[var(--accent-cyan)]">{p.date}</time>
              <span className="flex-1 font-display text-lg text-[var(--ink)] group-hover:text-[var(--accent)]">
                {p.title}
              </span>
              <ExternalLink className="h-4 w-4 shrink-0 text-[var(--ink-mute)] group-hover:text-[var(--accent)]" />
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-2 font-mono text-[10px] text-[var(--ink-mute)]">
        {'//'} 共 {blog.posts.length} 篇 · 快照时间 {blog.fetchedAt.slice(0, 16).replace('T', ' ')} UTC · 数据源 person-he.github.io
      </div>
    </div>
  );
}
