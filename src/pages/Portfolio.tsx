/**
 * 作品集列表页 —— 数据全部来自 portfolio 集合（后台可管理）
 *
 * 卡片上的仓库活跃度为活数据（/api/github 快照按 repo 名匹配）。
 */
import { useEffect, useMemo, useState } from 'react';
import { FolderOpen } from 'lucide-react';
import { useDataStore } from '@/store/useDataStore';
import { useLiveStore } from '@/store/useLiveStore';
import ProjectCard from '@/components/ProjectCard';
import PaperBackground from '@/components/PaperBackground';
import EmptyState from '@/components/EmptyState';
import { PageHeader } from '@/components/SectionTitle';
import Seo from '@/components/Seo';
import { siteConfig } from '@/config/site.config';
import type { Portfolio } from '@/types';

type CatFilter = 'all' | Portfolio['category'];

const CAT_TABS: { id: CatFilter; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'web-app', label: 'Web 应用' },
  { id: 'desktop', label: '桌面端' },
  { id: 'cli', label: 'CLI 工具' },
  { id: 'ai', label: 'AI 工程' },
  { id: 'backend', label: '后端' },
  { id: 'site', label: '站点' },
];

export default function PortfolioPage() {
  const { portfolio, loading, loaded, loadAll } = useDataStore();
  const loadLive = useLiveStore((s) => s.load);
  const [cat, setCat] = useState<CatFilter>('all');

  useEffect(() => {
    loadAll();
    loadLive();
  }, [loadAll, loadLive]);

  const published = useMemo(() => portfolio.filter((p) => p.published), [portfolio]);
  const featured = useMemo(() => published.filter((p) => p.isFeatured), [published]);
  const filtered = useMemo(
    () => (cat === 'all' ? published : published.filter((p) => p.category === cat)),
    [published, cat],
  );

  return (
    <div className="relative min-h-screen overflow-hidden pt-16">
      <PaperBackground />
      <Seo
        title="作品集"
        description={`${siteConfig.name}的作品集：${published.length} 个真实上线的产品与工程项目，每个案例含挑战、方案、关键技术决策与可复现的成果数据，全部可在线体验或读源码。`}
        path="/portfolio"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <PageHeader
          title="作品集"
          description="不做演示性质的玩具。每个项目都回答三个问题：解决了什么真实问题、为什么这么设计、效果如何被验证。"
        />

        {/* 分类 Tab */}
        <div className="mb-8 flex flex-wrap gap-2">
          {CAT_TABS.map((t) => {
            const active = cat === t.id;
            const count = t.id === 'all' ? published.length : published.filter((p) => p.category === t.id).length;
            if (t.id !== 'all' && count === 0) return null;
            return (
              <button
                key={t.id}
                onClick={() => setCat(t.id)}
                className={`border-2 px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-all ${
                  active
                    ? 'border-[var(--ink)] bg-[var(--accent)] text-[var(--bg)] shadow-[2px_2px_0_var(--ink)]'
                    : 'border-[var(--ink-mute)] text-[var(--ink-soft)] hover:border-[var(--ink)] hover:text-[var(--accent)]'
                }`}
              >
                <span className="text-[var(--accent)]">{'>'}</span> {t.label}
                <span className="ml-1 text-[var(--ink-mute)]">{count}</span>
              </button>
            );
          })}
        </div>

        {loading && !loaded ? (
          <div className="font-mono text-sm text-[var(--ink-mute)]">
            <span className="text-[var(--accent)]">{'>'}</span> <span className="terminal-cursor">loading…</span>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<FolderOpen className="h-7 w-7" />}
            title="该分类暂无项目"
            description="换一个分类看看，或访问我的 GitHub 主页查看全部仓库。"
          />
        ) : (
          <div className="space-y-10">
            {/* 主推案例区（仅在「全部」Tab 显示） */}
            {cat === 'all' && featured.length > 0 ? (
              <section>
                <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--accent)]">
                  {'//'} 主推案例
                </h2>
                <div className="grid gap-5 md:grid-cols-2">
                  {featured.map((p) => (
                    <ProjectCard key={p.id} project={p} />
                  ))}
                </div>
              </section>
            ) : null}

            <section>
              {cat === 'all' && featured.length > 0 ? (
                <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--accent)]">
                  {'//'} 全部项目
                </h2>
              ) : null}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
