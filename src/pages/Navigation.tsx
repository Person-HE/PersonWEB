import { useEffect, useState, useMemo } from 'react';
import { Compass } from 'lucide-react';
import { useStore } from '@/store/useStore';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import NavSiteCard from '@/components/NavSiteCard';

export default function Navigation() {
  const { navSites, init } = useStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    init();
  }, [init]);

  const categories = useMemo(() => [...new Set(navSites.map((n) => n.category))], [navSites]);

  const filtered = useMemo(() => {
    return navSites.filter((n) => {
      const matchSearch =
        !search ||
        n.name.toLowerCase().includes(search.toLowerCase()) ||
        n.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = !category || n.category === category;
      return matchSearch && matchCat;
    });
  }, [navSites, search, category]);

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15">
              <Compass className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">网站导航</h1>
              <p className="text-sm text-slate-500">收录优质网站，一键直达</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="sm:w-80">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="搜索网站名称或描述..."
              />
            </div>
            <CategoryFilter categories={categories} selected={category} onChange={setCategory} />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Compass className="mx-auto mb-4 h-12 w-12 text-slate-700" />
            <p className="text-slate-500">没有找到匹配的网站</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((site) => (
              <NavSiteCard key={site.id} site={site} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
