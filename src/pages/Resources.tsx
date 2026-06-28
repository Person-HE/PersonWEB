import { useEffect, useState, useMemo } from 'react';
import { Download } from 'lucide-react';
import { useStore } from '@/store/useStore';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import ResourceCard from '@/components/ResourceCard';
import DetailModal from '@/components/DetailModal';
import type { Resource } from '@/types';

export default function Resources() {
  const { resources, init } = useStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [selected, setSelected] = useState<Resource | null>(null);

  useEffect(() => {
    init();
  }, [init]);

  const categories = useMemo(() => [...new Set(resources.map((r) => r.category))], [resources]);

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      const matchSearch =
        !search ||
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = !category || r.category === category;
      return matchSearch && matchCat;
    });
  }, [resources, search, category]);

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15">
              <Download className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">资源下载站</h1>
              <p className="text-sm text-slate-500">精选资源合集，网盘直链获取</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="sm:w-80">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="搜索资源名称或描述..."
              />
            </div>
            <CategoryFilter categories={categories} selected={category} onChange={setCategory} />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Download className="mx-auto mb-4 h-12 w-12 text-slate-700" />
            <p className="text-slate-500">没有找到匹配的资源</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((res) => (
              <ResourceCard key={res.id} resource={res} onClick={() => setSelected(res)} />
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
