import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Code2,
  Brain,
  Rocket,
  Download,
  Compass,
  Wrench,
  ChevronRight,
  Zap,
  TrendingUp,
  Star,
  ArrowRight,
  Github,
  BookOpen,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import ParticleBg from '@/components/ParticleBg';
import type { Tool, Resource, NavSite } from '@/types';

type LatestItem = (Tool | Resource | NavSite) & { type: string };

const stats = [
  { value: '16+', label: 'AI 产品/项目', icon: Rocket, color: 'from-emerald-400 to-cyan-400' },
  { value: '550+', label: '技术文档沉淀', icon: BookOpen, color: 'from-cyan-400 to-blue-400' },
  { value: '38', label: '蒸馏 AI Skills', icon: Zap, color: 'from-amber-400 to-orange-400' },
  { value: '4000+', label: '内容创作素材', icon: Star, color: 'from-pink-400 to-rose-400' },
];

const modules = [
  {
    path: '/tools',
    icon: Wrench,
    title: 'AI 工具集',
    desc: '自研实用工具，去水印、视频剪辑、手机优化、Web 绘图...',
    gradient: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
    border: 'hover:border-emerald-500/40',
    glow: 'group-hover:shadow-emerald-500/20',
    iconBg: 'bg-gradient-to-br from-emerald-400 to-emerald-600',
    tag: '开发中',
  },
  {
    path: '/resources',
    icon: Download,
    title: '资源下载站',
    desc: 'AI 知识库、技术文档、Skills 技能包、视觉素材合集...',
    gradient: 'from-amber-500/20 via-amber-500/5 to-transparent',
    border: 'hover:border-amber-500/40',
    glow: 'group-hover:shadow-amber-500/20',
    iconBg: 'bg-gradient-to-br from-amber-400 to-orange-500',
    tag: '夸克网盘',
  },
  {
    path: '/navigation',
    icon: Compass,
    title: '网站导航',
    desc: '精选开发工具、设计资源、AI 平台、学习社区...',
    gradient: 'from-cyan-500/20 via-cyan-500/5 to-transparent',
    border: 'hover:border-cyan-500/40',
    glow: 'group-hover:shadow-cyan-500/20',
    iconBg: 'bg-gradient-to-br from-cyan-400 to-blue-500',
    tag: '持续更新',
  },
  {
    path: '/about',
    icon: Brain,
    title: '关于我',
    desc: 'AI 创作者 · 独立开发者 · 信息差猎手 · 知识蒸馏师',
    gradient: 'from-pink-500/20 via-pink-500/5 to-transparent',
    border: 'hover:border-pink-500/40',
    glow: 'group-hover:shadow-pink-500/20',
    iconBg: 'bg-gradient-to-br from-pink-400 to-rose-500',
    tag: '个人 IP',
  },
];

const highlights = [
  {
    title: 'AI 知识体系',
    subtitle: '550+ 篇深度技术文档',
    desc: '覆盖 Java 后端、AI Agents、RAG、LangChain4j、系统设计、分布式、性能优化等全栈技术栈，从零到架构师完整路径。',
    tags: ['AI Agents', 'RAG', 'LangChain4j', '系统设计'],
    gradient: 'from-violet-500 to-purple-600',
    icon: Brain,
  },
  {
    title: 'AI Skills 技能库',
    subtitle: '38 个蒸馏技能 · 一人公司架构',
    desc: '从 CPO 到 CTO、从小说创作到自然流量增长，每个 Skill 都是实战沉淀的 AI 工作流，让 AI 真正替你干活。',
    tags: ['一人公司', '内容创作', '流量增长', '产品设计'],
    gradient: 'from-amber-500 to-orange-600',
    icon: Zap,
  },
  {
    title: '自媒体内容矩阵',
    subtitle: '4000+ 素材 · 多平台布局',
    desc: '硬核拆解、爆款短篇、脱口秀文案、保姆级教程、今日头条、微信公众号……用 AI 规模化生产有传播力的内容。',
    tags: ['硬核科普', '爆款短篇', '脱口秀', '保姆教程'],
    gradient: 'from-pink-500 to-rose-600',
    icon: TrendingUp,
  },
];

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

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <ParticleBg />

      {/* ===== HERO ===== */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute right-1/4 top-1/3 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="absolute left-1/4 bottom-1/4 h-80 w-80 rounded-full bg-pink-500/10 blur-3xl" />
        </div>

        <div className="relative mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 backdrop-blur-sm">
          <Sparkles className="h-4 w-4 text-emerald-400" />
          <span className="text-xs font-medium text-emerald-300">AI 创作者 · 独立开发者 · 持续更新中</span>
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
        </div>

        <h1 className="relative mb-6 text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-8xl">
          用 <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-400 bg-clip-text text-transparent">AI</span> 造
          <br className="sm:hidden" />
          <span className="bg-gradient-to-r from-amber-400 via-pink-400 to-violet-400 bg-clip-text text-transparent">
            我的数字宇宙
          </span>
        </h1>

        <p className="relative mb-10 max-w-2xl text-base text-slate-400 sm:text-lg">
          产品 · 工具 · 知识体系 · 自媒体 · Skills 技能包
          <br />
          <span className="text-slate-500">
            一个人 + AI，搭起一整套能跑起来的生产力系统
          </span>
        </p>

        <div className="relative flex flex-wrap justify-center gap-3">
          <Link
            to="/resources"
            className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-7 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:shadow-emerald-500/40"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Download className="h-4 w-4" />
              获取资源包
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
          <Link
            to="/tools"
            className="rounded-xl border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/10"
          >
            <span className="flex items-center gap-2">
              <Code2 className="h-4 w-4" />
              看看我做的工具
            </span>
          </Link>
        </div>

        <div className="relative mt-20 animate-bounce text-slate-600">
          <ChevronRight className="h-6 w-6 rotate-90" />
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/5 bg-gradient-to-br from-white/[0.04] to-transparent p-8 backdrop-blur-sm">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="group text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 transition-all group-hover:bg-white/10">
                    <Icon className={`h-6 w-6 bg-gradient-to-br ${s.color} bg-clip-text text-transparent`} style={{ color: 'inherit' }} />
                  </div>
                  <div className={`mb-1 bg-gradient-to-br ${s.color} bg-clip-text text-3xl font-black text-transparent sm:text-4xl`}>
                    {s.value}
                  </div>
                  <div className="text-xs text-slate-500 sm:text-sm">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== 4 MODULES ===== */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-emerald-400">
            · 四大核心模块 ·
          </div>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">一站式数字工作台</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <Link
                key={m.path}
                to={m.path}
                className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br ${m.gradient} p-6 transition-all duration-500 ${m.border} hover:-translate-y-1 hover:shadow-2xl ${m.glow}`}
              >
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5 blur-2xl transition-all group-hover:bg-white/10" />
                <div className="relative">
                  <div className="mb-4 flex items-center justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${m.iconBg} shadow-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-medium text-slate-300 backdrop-blur-sm">
                      {m.tag}
                    </span>
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-white">{m.title}</h3>
                  <p className="mb-4 text-sm leading-relaxed text-slate-400">{m.desc}</p>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-white/70 transition-all group-hover:text-white">
                    进入模块
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ===== HIGHLIGHTS ===== */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-400">
            · 核心资产 ·
          </div>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">我用 AI 沉淀下来的东西</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-400">
            不只是"用 AI 聊天"，而是把 AI 真正变成生产力工具——知识体系、工作流、内容引擎
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {highlights.map((h) => {
            const Icon = h.icon;
            return (
              <div
                key={h.title}
                className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04]"
              >
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${h.gradient}`} />
                <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${h.gradient} shadow-lg`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                  {h.subtitle}
                </div>
                <h3 className="mb-3 text-xl font-bold text-white">{h.title}</h3>
                <p className="mb-5 text-sm leading-relaxed text-slate-400">{h.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {h.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-white/5 bg-white/[0.03] px-2 py-0.5 text-xs text-slate-400"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== LATEST ===== */}
      {latest.length > 0 && (
        <section className="relative z-10 mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-cyan-400">
                · 最近更新 ·
              </div>
              <h2 className="text-2xl font-bold text-white">新鲜出炉</h2>
            </div>
            <Link
              to="/resources"
              className="flex items-center gap-1 text-sm text-slate-400 transition-colors hover:text-white"
            >
              查看全部
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((item) => (
              <div
                key={item.id}
                className="group rounded-2xl border border-white/5 bg-white/[0.03] p-5 transition-all hover:border-white/10 hover:bg-white/[0.06]"
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
                <h3 className="mb-1.5 text-sm font-semibold text-white transition-colors group-hover:text-emerald-400">
                  {item.name}
                </h3>
                <p className="line-clamp-2 text-xs text-slate-500">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== FOOTER CTA ===== */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/10 via-cyan-500/5 to-pink-500/10 p-10 text-center sm:p-14">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-emerald-500/20 blur-3xl" />
            <div className="absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-pink-500/20 blur-3xl" />
          </div>
          <div className="relative">
            <Github className="mx-auto mb-4 h-8 w-8 text-white/60" />
            <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl">想一起折腾？</h2>
            <p className="mx-auto mb-6 max-w-xl text-sm text-slate-400">
              如果你也在用 AI 搞事情，欢迎加我交流——工具、资源、方法论、自媒体运营，都可以聊
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-slate-950 transition-all hover:bg-slate-100 hover:shadow-lg"
            >
              联系我
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
