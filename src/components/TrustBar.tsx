/**
 * TrustBar —— 首页实时信任数据栏
 *
 * 数字全部来自 /api/github 与 /api/blog（cron 每小时同步的 KV 快照）。
 * 快照不可用时降级：隐藏数字显示「数据同步中」，绝不显示编造的静态值。
 */
import { Link } from 'react-router-dom';
import { useLiveStore } from '@/store/useLiveStore';
import { useDataStore } from '@/store/useDataStore';
import { siteConfig } from '@/config/site.config';

interface Item {
  value: string;
  label: string;
  source: string;
  to?: string;
}

export default function TrustBar() {
  const { github, blog } = useLiveStore();
  const portfolio = useDataStore((s) => s.portfolio);
  const onlineProducts = portfolio.filter((p) => p.published && p.demoUrl).length;

  const items: Item[] = [
    {
      value: github ? String(github.user.publicRepos) : '--',
      label: '开源项目',
      source: 'api.github.com',
      to: siteConfig.githubUrl,
    },
    {
      value: portfolio.length > 0 ? String(onlineProducts) : '--',
      label: '在线可用产品',
      source: '作品集实测',
      to: '/portfolio',
    },
    {
      value: blog ? String(blog.posts.length) : '--',
      label: '技术文章',
      source: 'person-he.github.io',
      to: '/blog',
    },
    {
      value: github && github.lastPushDays !== null ? String(github.lastPushDays) : '--',
      label: '最近提交（天前）',
      source: 'repos.pushed_at',
      to: siteConfig.githubUrl,
    },
  ];

  return (
    <div className="border-y-2 border-[var(--ink-mute)] bg-[var(--bg-elevated)]">
      <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
        {items.map((it, i) => {
          const inner = (
            <>
              <div className="font-display text-5xl font-bold text-[var(--accent)]">{it.value}</div>
              <div className="mt-1 font-mono text-xs uppercase tracking-widest text-[var(--ink-soft)]">{it.label}</div>
              <div className="mt-2 inline-block bg-[var(--accent-cyan)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--bg)]">
                {it.source} · LIVE
              </div>
            </>
          );
          return it.to && it.to.startsWith('/') ? (
            <Link
              key={i}
              to={it.to}
              className={`border-[var(--ink-mute)] p-6 text-center transition-colors hover:bg-[var(--bg-deep)] ${i < 3 ? 'md:border-r-2' : ''} ${i % 2 === 0 ? 'border-r-2 md:border-r-2' : ''}`}
            >
              {inner}
            </Link>
          ) : (
            <a
              key={i}
              href={it.to}
              target="_blank"
              rel="noreferrer"
              className={`border-[var(--ink-mute)] p-6 text-center transition-colors hover:bg-[var(--bg-deep)] ${i < 3 ? 'md:border-r-2' : ''} ${i % 2 === 0 ? 'border-r-2 md:border-r-2' : ''}`}
            >
              {inner}
            </a>
          );
        })}
      </div>
    </div>
  );
}
