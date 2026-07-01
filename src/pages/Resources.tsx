import { useEffect, useMemo, useState } from 'react';
import { Search, X, Clock, Flame, ArrowDownAZ } from 'lucide-react';
import { useDataStore } from '@/store/useDataStore';
import ResourceCard from '@/components/ResourceCard';
import EmptyState from '@/components/EmptyState';
import { PageHeader } from '@/components/SectionTitle';
import PaperBackground from '@/components/PaperBackground';
import { useStaggerReveal } from '@/hooks/useGsap';
import type { Resource, ResourceCategory } from '@/types';

type SortKey = 'latest' | 'hot' | 'name';

const categories: { id: 'all' | ResourceCategory; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: '个人产品', label: '我的产品' },
  { id: '教程资料', label: '教程资料' },
  { id: 'AI资料', label: 'AI资料' },
];

const sortOptions: { id: SortKey; label: string; icon: typeof Clock }[] = [
  { id: 'latest', label: '最新', icon: Clock },
  { id: 'hot', label: '最热', icon: Flame },
  { id: 'name', label: '按名称', icon: ArrowDownAZ },
];

export default function Resources() {
  const { resources, loading, loaded, loadAll } = useDataStore();
  const [category, setCategory] = useState<'all' | ResourceCategory>('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('latest');

  const gridRef = useStaggerReveal<HTMLDivElement>('.res-card', [resources.length, category, sort, search], {
    stagger: 0.06,
  });

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const filtered = useMemo(() => {
    let list: Resource[] = [...resources];
    if (category !== 'all') {
      list = list.filter((r) => r.category === category);
    }
    if (search.trim()) {
      const kw = search.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(kw) ||
          r.description.toLowerCase().includes(kw) ||
          r.tags.some((t) => t.toLowerCase().includes(kw)),
      );
    }
    switch (sort) {
      case 'latest':
        list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
      case 'hot':
        list.sort((a, b) => {
          if (a.isHot !== b.isHot) return a.isHot ? -1 : 1;
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });
        break;
      case 'name':
        list.sort((a, b) => a.title.localeCompare(b.title, 'zh'));
        break;
    }
    return list;
  }, [resources, category, search, sort]);

  const clearAll = () => {
    setCategory('all');
    setSearch('');
    setSort('latest');
  };

  return (
    <div className="relative min-h-screen overflow-hidden pt-16">
      <PaperBackground />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <PageHeader
          title="资源中心"
          description="全部免费，拿走不谢。觉得好用记得回来看看。"
        />

        {/* 筛选 + 搜索 + 排序 */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* 分类 Tab */}
            <div className="flex flex-wrap gap-2">
              {categories.map((c, i) => {
                const active = category === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    className={`hand-btn text-sm ${active ? 'hand-btn-primary' : ''}`}
                    style={{ transform: `rotate(${(i % 2 ? 1 : -1) * 0.5}deg)` }}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>

            {/* 排序 */}
            <div className="flex flex-wrap items-center gap-2">
              {sortOptions.map((opt) => {
                const Icon = opt.icon;
                const active = sort === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSort(opt.id)}
                    className={`inline-flex items-center gap-1 rounded-lg border-2 border-[var(--ink)] px-3 py-1.5 font-hand-body text-xs transition-all ${
                      active
                        ? 'bg-[var(--ink)] text-[var(--paper-light)] shadow-[2px_2px_0_var(--crimson)]'
                        : 'bg-[var(--paper-light)] text-[var(--ink-soft)] hover:bg-[var(--mustard)]/30'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 搜索框 */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-mute)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索资源名称、简介或标签..."
              className="w-full rounded-xl border-2 border-[var(--ink)] bg-[var(--paper-light)] py-2.5 pl-10 pr-10 font-hand-body text-sm text-[var(--ink)] placeholder-[var(--ink-mute)] shadow-[3px_3px_0_var(--ink)] outline-none transition-all focus:-translate-y-0.5 focus:shadow-[4px_4px_0_var(--crimson)]"
            />
            {search ? (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-mute)] transition-colors hover:text-[var(--crimson)]"
                aria-label="清除"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>

        {/* 列表 */}
        {loading && !loaded ? (
          <div className="hand-empty">加载中...</div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="没有找到匹配的资源"
            description={
              resources.length === 0
                ? '资源尚未录入，请稍后再来。'
                : '换个关键词或清除筛选条件试试？'
            }
            action={
              resources.length > 0 ? (
                <button onClick={clearAll} className="hand-btn text-sm">
                  清除筛选
                </button>
              ) : undefined
            }
          />
        ) : (
          <div ref={gridRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((r, i) => (
              <div
                key={r.id}
                className="res-card"
                style={{ transform: `rotate(${(i % 2 ? -1 : 1) * 0.4}deg)` }}
              >
                <ResourceCard resource={r} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
