import { useEffect, useState, useMemo } from 'react';
import { Wrench } from 'lucide-react';
import { useStore } from '@/store/useStore';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import ToolCard from '@/components/ToolCard';
import DetailModal from '@/components/DetailModal';
import type { Tool } from '@/types';

export default function Tools() {
  const { tools, init } = useStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [selected, setSelected] = useState<Tool | null>(null);

  useEffect(() => {
    init();
  }, [init]);

  const categories = useMemo(() => [...new Set(tools.map((t) => t.category))], [tools]);

  const filtered = useMemo(() => {
    return tools.filter((t) => {
      const matchSearch =
        !search ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = !category || t.category === category;
      return matchSearch && matchCat;
    });
  }, [tools, search, category]);

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15">
              <Wrench className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">工具集</h1>
              <p className="text-sm text-slate-500">免费实用小工具，一键获取</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="sm:w-80">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="搜索工具名称或描述..."
              />
            </div>
            <CategoryFilter categories={categories} selected={category} onChange={setCategory} />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Wrench className="mx-auto mb-4 h-12 w-12 text-slate-700" />
            <p className="text-slate-500">没有找到匹配的工具</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((tool) => (
              <ToolCard key={tool.id} tool={tool} onClick={() => setSelected(tool)} />
            ))}
          </div>
        )}
      </div>

      <DetailModal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name || ''}
        imageUrl={selected?.imageUrl || ''}
        detail={selected?.detail || ''}
        driveLink={selected?.driveLink}
        category={selected?.category || ''}
      />
    </div>
  );
}
