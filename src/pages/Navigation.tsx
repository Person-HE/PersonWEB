import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, Sparkles, Clock } from 'lucide-react';
import { useDataStore } from '@/store/useDataStore';
import ToolItem, { RecommendedToolCard } from '@/components/ToolItem';
import EmptyState from '@/components/EmptyState';
import { PageHeader } from '@/components/SectionTitle';
import PaperBackground from '@/components/PaperBackground';
import { TOOL_CATEGORIES } from '@/constants';
import { useStaggerReveal } from '@/hooks/useGsap';
import type { Tool, ToolCategory } from '@/types';

type TabId = 'all' | ToolCategory;

export default function Navigation() {
  const { tools, loading, loaded, loadAll } = useDataStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = (searchParams.get('cat') as TabId) || 'all';
  const [tab, setTab] = useState<TabId>(
    TOOL_CATEGORIES.some((c) => c.id === initialCat) ? initialCat : 'all',
  );
  const [search, setSearch] = useState('');

  const listRef = useStaggerReveal<HTMLDivElement>('.tool-row', [tools.length, tab, search], {
    stagger: 0.05,
  });
  const recRef = useStaggerReveal<HTMLDivElement>('.rec-card', [tab], { stagger: 0.1 });
  const latestRef = useStaggerReveal<HTMLDivElement>('.latest-card', [tools.length], { stagger: 0.06 });

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const switchTab = (t: TabId) => {
    setTab(t);
    if (t === 'all') setSearchParams({});
    else setSearchParams({ cat: t });
  };

  const categoryTools = useMemo(() => {
    if (tab === 'all') return tools;
    return tools.filter((t) => t.category === tab);
  }, [tools, tab]);

  const searchResults = useMemo(() => {
    if (!search.trim()) return null;
    const kw = search.trim().toLowerCase();
    return tools.filter(
      (t) =>
        t.name.toLowerCase().includes(kw) ||
        t.description.toLowerCase().includes(kw) ||
        t.tags.some((tag) => tag.toLowerCase().includes(kw)),
    );
  }, [tools, search]);

  const recommended = useMemo(() => {
    return categoryTools.filter((t) => t.isRecommended).slice(0, 2);
  }, [categoryTools]);

  const latestAdded = useMemo(() => {
    return [...tools]
      .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
      .slice(0, 5);
  }, [tools]);

  const normalList = useMemo(() => {
    return categoryTools.filter((t) => !t.isRecommended);
  }, [categoryTools]);

  const displayList: Tool[] = searchResults ?? normalList;
  const isSearching = searchResults !== null;

  const tabs: { id: TabId; name: string; count: number }[] = [
    { id: 'all', name: '全部', count: tools.length },
    ...TOOL_CATEGORIES.map((c) => ({
      id: c.id,
      name: c.name,
      count: tools.filter((t) => t.category === c.id).length,
    })),
  ];

  return (
    <div className="relative min-h-screen overflow-hidden pt-16">
      <PaperBackground />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <PageHeader
          title="AI工具导航"
          description="收录经过实测的AI工具，帮你找到趁手的工具。持续更新中。"
        />

        {/* 搜索框 */}
        <div className="relative mb-6 max-w-xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-mute)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索工具名称、描述或标签..."
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

        {/* 分类 Tab */}
        <div className="mb-8 flex flex-wrap gap-2 pb-2">
          {tabs.map((t, i) => {
            const active = tab === t.id && !isSearching;
            return (
              <button
                key={t.id}
                onClick={() => switchTab(t.id)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl border-2 border-[var(--ink)] px-3.5 py-1.5 font-hand-title text-sm transition-all ${
                  active
                    ? 'bg-[var(--crimson)] text-[var(--paper-light)] shadow-[3px_3px_0_var(--ink)]'
                    : 'bg-[var(--paper-light)] text-[var(--ink)] hover:bg-[var(--mustard)]/30'
                }`}
                style={{ transform: `rotate(${(i % 2 ? 1 : -1) * 0.4}deg)` }}
              >
                {t.name}
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                    active ? 'bg-[var(--paper)]/30 text-[var(--paper-light)]' : 'bg-[var(--ink)] text-[var(--paper-light)]'
                  }`}
                >
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 内容区 */}
        {loading && !loaded ? (
          <div className="hand-empty">加载中...</div>
        ) : tools.length === 0 ? (
          <EmptyState
            title="工具即将收录"
            description="AI工具正在整理测试中，请稍后再来。"
          />
        ) : isSearching ? (
          searchResults!.length === 0 ? (
            <EmptyState
              title="没有找到匹配的工具"
              description="换个关键词试试？"
              action={
                <button onClick={() => setSearch('')} className="hand-btn text-sm">
                  清除搜索
                </button>
              }
            />
          ) : (
            <div ref={listRef} className="space-y-3">
              {searchResults!.map((t) => (
                <div key={t.id} className="tool-row">
                  <ToolItem tool={t} />
                </div>
              ))}
            </div>
          )
        ) : (
          <>
            {/* 编辑推荐 */}
            {recommended.length > 0 ? (
              <section className="mb-8">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-[var(--ink)] bg-[var(--mustard)] shadow-[1px_1px_0_var(--ink)]">
                    <Sparkles className="h-3.5 w-3.5 text-[var(--ink)]" />
                  </div>
                  <h2 className="font-hand-title text-base text-[var(--ink)]">编辑推荐</h2>
                </div>
                <div ref={recRef} className="grid gap-4 sm:grid-cols-2">
                  {recommended.map((t) => (
                    <div key={t.id} className="rec-card">
                      <RecommendedToolCard tool={t} />
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {/* 工具列表 */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-hand-title text-base text-[var(--ink)]">
                  {tab === 'all' ? '全部工具' : TOOL_CATEGORIES.find((c) => c.id === tab)?.name}
                  <span className="ml-2 font-hand-body text-xs text-[var(--ink-mute)]">({displayList.length})</span>
                </h2>
              </div>
              {displayList.length === 0 ? (
                <EmptyState title="该分类暂无工具" description="试试切换其他分类？" />
              ) : (
                <div ref={listRef} className="space-y-3">
                  {displayList.map((t) => (
                    <div key={t.id} className="tool-row">
                      <ToolItem tool={t} />
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* 最新收录 */}
            {tab === 'all' && latestAdded.length > 0 ? (
              <section className="mt-12">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-[var(--ink)] bg-[var(--teal)] shadow-[1px_1px_0_var(--ink)]">
                    <Clock className="h-3.5 w-3.5 text-[var(--paper-light)]" />
                  </div>
                  <h2 className="font-hand-title text-base text-[var(--ink)]">最新收录</h2>
                </div>
                <div ref={latestRef} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {latestAdded.map((t) => (
                    <div key={t.id} className="latest-card">
                      <ToolItem tool={t} />
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
