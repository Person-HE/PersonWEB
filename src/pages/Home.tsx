import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Download, Compass, User, ChevronRight, Sparkles } from 'lucide-react';
import { useStore } from '@/store/useStore';
import ParticleBg from '@/components/ParticleBg';
import type { Tool, Resource, NavSite } from '@/types';

type LatestItem = (Tool | Resource | NavSite) & { type: string };

export default function Home() {
  const { tools, resources, navSites, init } = useStore();
  const [latest, setLatest] = useState<LatestItem[]>([]);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    const all: LatestItem[] = [
      ...tools.map((t) => ({ ...t, type: '工具' })),
      ...resources.map((r) => ({ ...r, type: '资源' })),
      ...navSites.map((n) => ({ ...n, type: '网站' })),
    ];
    all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setLatest(all.slice(0, 6));
  }, [tools, resources, navSites]);

  const modules = [
    {
      path: '/tools',
      icon: Wrench,
      title: '工具集',
      desc: '免费实用小工具，去水印、转格式、手机优化...',
      gradient: 'from-emerald-500/20 to-emerald-900/20',
      border: 'hover:border-emerald-500/30',
      iconColor: 'text-emerald-400',
      tagColor: 'bg-emerald-500/15 text-emerald-400',
    },
    {
      path: '/resources',
      icon: Download,
      title: '资源下载站',
      desc: '精选资源合集，开源软件、AI提示词、防骗指南...',
      gradient: 'from-amber-500/20 to-amber-900/20',
      border: 'hover:border-amber-500/30',
      iconColor: 'text-amber-400',
      tagColor: 'bg-amber-500/15 text-amber-400',
    },
    {
      path: '/navigation',
      icon: Compass,
      title: '网站导航',
      desc: '收录优质网站，开发工具、设计资源、学习平台...',
      gradient: 'from-cyan-500/20 to-cyan-900/20',
      border: 'hover:border-cyan-500/30',
      iconColor: 'text-cyan-400',
      tagColor: 'bg-cyan-500/15 text-cyan-400',
    },
    {
      path: '/about',
      icon: User,
      title: '关于我',
      desc: '我的故事，为什么做这些，还有微信入口',
      gradient: 'from-pink-500/20 to-pink-900/20',
      border: 'hover:border-pink-500/30',
      iconColor: 'text-pink-400',
      tagColor: 'bg-pink-500/15 text-pink-400',
    },
  ];

  return (
    <div className="relative min-h-screen bg-slate-950">
      <ParticleBg />

      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-emerald-400" />
          <span className="text-sm font-medium text-emerald-400">免费 · 开放 · 持续更新</span>
        </div>
        <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
          你的数字
          <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-400 bg-clip-text text-transparent">
            百宝箱
          </span>
        </h1>
        <p className="mb-10 max-w-xl text-lg text-slate-400">
          工具集入口 · 资源下载站 · 网站导航 · 个人名片
          <br />
          一站式获取优质工具与资源，零门槛使用
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/tools"
            className="rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25"
          >
            探索工具
          </Link>
          <Link
            to="/resources"
            className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all hover:border-white/20 hover:bg-white/10"
          >
            浏览资源
          </Link>
        </div>
        <div className="mt-16 animate-bounce text-slate-600">
          <ChevronRight className="h-6 w-6 rotate-90" />
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center text-2xl font-bold text-white">四大模块</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <Link
                key={m.path}
                to={m.path}
                className={`group rounded-2xl border border-white/5 bg-gradient-to-br ${m.gradient} p-6 transition-all duration-300 ${m.border} hover:shadow-lg`}
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 ${m.iconColor}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">{m.title}</h3>
                <p className="text-sm text-slate-400">{m.desc}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {latest.length > 0 && (
        <section className="relative z-10 mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-2xl font-bold text-white">最新更新</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 transition-all hover:border-white/10 hover:bg-white/[0.06]"
              >
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                      item.type === '工具'
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : item.type === '资源'
                          ? 'bg-amber-500/15 text-amber-400'
                          : 'bg-cyan-500/15 text-cyan-400'
                    }`}
                  >
                    {item.type}
                  </span>
                  <span className="text-xs text-slate-600">{item.createdAt}</span>
                </div>
                <h3 className="mb-1 text-sm font-semibold text-white">{item.name}</h3>
                <p className="text-xs text-slate-500">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
