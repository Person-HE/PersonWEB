import { useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Download,
  Compass,
  LifeBuoy,
  ArrowRight,
  Wrench,
  Wand2,
  Puzzle,
  Crown,
  Building2,
  Package,
  Workflow,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { useDataStore } from '@/store/useDataStore';
import { useWechatModal } from '@/components/WeChatModal';
import PaperBackground from '@/components/PaperBackground';
import ResourceCard from '@/components/ResourceCard';
import EmptyState from '@/components/EmptyState';
import SectionTitle from '@/components/SectionTitle';
import { siteConfig } from '@/config/site.config';
import { SERVICE_TYPES, TOOL_CATEGORIES } from '@/constants';
import { useElasticEnter, useStaggerReveal, useParallax } from '@/hooks/useGsap';
import type { ServiceType } from '@/types';

const serviceIconMap: Record<ServiceType, LucideIcon> = {
  'tool-config': Wrench,
  'ai-output': Wand2,
  custom: Puzzle,
  'product-pro': Crown,
  product: Package,
  automation: Workflow,
  skills: Sparkles,
  enterprise: Building2,
};

/** 仅展示 4 大类服务（不含 enterprise，企业服务单独引导） */
const HOME_SERVICE_TYPES = SERVICE_TYPES.filter((s) => s.id !== 'enterprise');

export default function Home() {
  const { resources, tools, services, loading, loaded, loadAll } = useDataStore();
  const { open } = useWechatModal();

  const heroRef = useElasticEnter<HTMLDivElement>([], { y: 40, delay: 0.1 });
  const statsRef = useStaggerReveal<HTMLDivElement>('.nav-stat-card', [tools.length], { stagger: 0.06 });
  const resourceSectionRef = useParallax<HTMLDivElement>(0.05);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const featuredResources = useMemo(() => {
    return [...resources]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 6);
  }, [resources]);

  const navStats = useMemo(() => {
    return TOOL_CATEGORIES.map((cat) => ({
      ...cat,
      count: tools.filter((t) => t.category === cat.id).length,
    }));
  }, [tools]);

  const serviceOverview = useMemo(() => {
    return HOME_SERVICE_TYPES.map((meta) => ({
      ...meta,
      count: services.filter((s) => s.type === meta.id).length,
    }));
  }, [services]);

  const totalTools = tools.length;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <PaperBackground />

      {/* ===== HERO ===== */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pt-16 text-center">
        {/* 背景层：缓慢流动的模糊光晕 */}
        <div className="layer-bg pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-[var(--crimson)] opacity-30 blur-3xl" />
          <div className="absolute right-1/4 top-1/3 h-80 w-80 rounded-full bg-[var(--mustard)] opacity-40 blur-3xl" />
          <div className="absolute left-1/3 bottom-1/4 h-80 w-80 rounded-full bg-[var(--teal)] opacity-30 blur-3xl" />
        </div>

        <div ref={heroRef} className="layer-mid relative">
          {/* 状态徽章 */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-[var(--ink)] bg-[var(--paper-light)] px-4 py-1.5 shadow-[3px_3px_0_var(--ink)] animate-wobble">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--crimson)] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--crimson)]" />
            </span>
            <span className="font-hand-body text-xs text-[var(--ink-soft)]">
              持续更新中 · 免费资源 · 真实服务
            </span>
          </div>

          <h1 className="ink-title mb-6 font-hand-title text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
            {siteConfig.name}
          </h1>

          <p className="mb-10 max-w-2xl font-hand-body text-base text-[var(--ink-soft)] sm:text-lg">
            {siteConfig.tagline}
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/resources" className="hand-btn hand-btn-primary">
              <Download className="h-4 w-4" />
              浏览资源
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/navigation" className="hand-btn hand-btn-blue">
              <Compass className="h-4 w-4" />
              AI导航
            </Link>
            <Link to="/services" className="hand-btn">
              <LifeBuoy className="h-4 w-4" />
              需要帮忙
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 资源精选 ===== */}
      <section ref={resourceSectionRef} className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="免费资源"
          title="资源精选"
          subtitle="AI知识、教程资料、个人产品 —— 全部免费，拿走不谢"
          actionLabel="查看全部资源"
          actionTo="/resources"
          align="left"
        />
        {loading && !loaded ? (
          <div className="hand-empty">加载中...</div>
        ) : featuredResources.length === 0 ? (
          <EmptyState
            title="资源即将上线"
            description="资源正在整理中，请稍后再来。也可先去看看AI导航或服务介绍。"
            action={
              <Link to="/navigation" className="hand-btn text-sm">
                先逛逛AI导航 <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredResources.map((r, i) => (
              <div key={r.id} style={{ transform: `rotate(${(i % 2 ? -1 : 1) * 0.5}deg)` }}>
                <ResourceCard resource={r} compact />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ===== AI导航速览 ===== */}
      <section ref={statsRef} className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="工具导航"
          title="AI工具导航"
          subtitle={`收录 ${totalTools}+ 经过实测的AI工具，帮你找到趁手的工具`}
          actionLabel="查看完整导航"
          actionTo="/navigation"
          align="left"
        />
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {navStats.map((cat, i) => (
            <Link
              key={cat.id}
              to={`/navigation?cat=${cat.id}`}
              className="nav-stat-card hand-card group p-5 text-center"
              style={{ transform: `rotate(${(i % 2 ? 1 : -1) * 0.6}deg)` }}
            >
              <div className="mb-2 font-hand-title text-2xl font-black text-[var(--ink)]">
                {totalTools === 0 ? '—' : cat.count}
              </div>
              <div className="font-hand-body text-xs text-[var(--ink-soft)] group-hover:text-[var(--crimson)]">
                {cat.name}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== 服务概览（4大类）===== */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="技术服务"
          title="需要帮忙？"
          subtitle="不卖课不卖训练营，只提供实实在在的技术服务"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {serviceOverview.map((s, i) => {
            const Icon = serviceIconMap[s.id] ?? Wrench;
            return (
              <div
                key={s.id}
                className="hand-card ink-spread group flex h-full cursor-pointer flex-col p-5"
                style={{ transform: `rotate(${(i % 2 ? 1 : -1) * 0.8}deg)` }}
                role="button"
                tabIndex={0}
                onClick={() => open(s.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    open(s.id);
                  }
                }}
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[var(--ink)] bg-[var(--crimson)] shadow-[2px_2px_0_var(--ink)]">
                  <Icon className="h-5 w-5 text-[var(--paper-light)]" />
                </div>
                <h3 className="mb-1.5 font-hand-title text-base text-[var(--ink)]">{s.name}</h3>
                <p className="mb-3 font-hand-title text-sm font-bold text-[var(--crimson)]">{s.priceRange}</p>
                <p className="mt-auto line-clamp-3 font-hand-body text-xs leading-relaxed text-[var(--ink-soft)]">
                  {s.description}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 font-hand-body text-xs text-[var(--ink-mute)] group-hover:text-[var(--crimson)]">
                  立即咨询 <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            );
          })}
        </div>

        {/* 企业服务单独引导 */}
        <div className="mt-6">
          <Link
            to="/enterprise"
            className="hand-card hand-card-gold group flex flex-col items-center justify-between gap-4 p-6 sm:flex-row"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[var(--ink)] bg-[var(--mustard)] shadow-[2px_2px_0_var(--ink)]">
                <Building2 className="h-6 w-6 text-[var(--ink)]" />
              </div>
              <div>
                <h3 className="font-hand-title text-lg text-[var(--ink)]">企业AI落地服务</h3>
                <p className="font-hand-body text-sm text-[var(--ink-soft)]">
                  不卖概念不写PPT，帮企业把AI装到每个工位上 · 3,000 - 20,000 元/项目
                </p>
              </div>
            </div>
            <span className="hand-btn hand-btn-gold shrink-0 text-sm">
              查看详细方案 <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>

        {/* 统一咨询 CTA */}
        <div className="mt-10 hand-card hand-card-crimson p-8 text-center sm:p-12" style={{ transform: 'rotate(-0.5deg)' }}>
          <h3 className="mb-2 font-hand-title text-xl text-[var(--ink)] sm:text-2xl">不确定需要什么？</h3>
          <p className="mb-6 font-hand-body text-sm text-[var(--ink-soft)]">加微信聊聊，免费咨询不收费。</p>
          <button onClick={() => open('default')} className="hand-btn">
            微信咨询
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
