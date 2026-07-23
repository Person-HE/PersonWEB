import { useEffect, useMemo, useState } from 'react';
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
  ExternalLink,
  Github,
  Bot,
  Layers,
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
import type { Service, ServiceType } from '@/types';

const serviceIconMap: Record<ServiceType, LucideIcon> = {
  'tool-config': Wrench,
  'ai-output': Wand2,
  custom: Puzzle,
  'product-pro': Crown,
  product: Package,
  automation: Workflow,
  enterprise: Building2,
};

/** 仅展示 4 大类服务（不含 enterprise，企业服务单独引导） */
const HOME_SERVICE_TYPES = SERVICE_TYPES.filter((s) => s.id !== 'enterprise');

/** 正在做的项目 —— 打字机轮播 */
const TYPING_PROJECTS = ['爆款选题智能系统', '多Agent学习平台', '8平台自动发布'];

/** Hero 实时能力看板量化指标（硬编码展示站长真实能力） */
const HERO_METRICS: { value: string; label: string; sub: string; icon: LucideIcon }[] = [
  { value: '9k+', label: 'Star', sub: 'GitHub开源', icon: Github },
  { value: '8大平台', label: '自动化覆盖', sub: '一键分发', icon: Layers },
  { value: '7个', label: 'AI Agent', sub: '协作架构', icon: Bot },
];

/** 招牌作品占位数据（无 featured 服务时使用） */
const FALLBACK_FEATURED: {
  id: string;
  name: string;
  description: string;
  metrics: { label: string; value: string }[];
}[] = [
  {
    id: 'fallback-topic',
    name: '爆款选题智能系统',
    description: '基于多 Agent 协作的爆款内容选题引擎，自动挖掘情绪金矿、生成多平台适配文案。',
    metrics: [
      { label: '日产出', value: '120+' },
      { label: '爆款率', value: '32%' },
    ],
  },
  {
    id: 'fallback-learn',
    name: '多 Agent 学习平台',
    description: '7 个 AI Agent 协作的个性化学习平台，覆盖规划、答疑、复盘、评估全流程。',
    metrics: [
      { label: 'Agent', value: '7' },
      { label: '完课率', value: '78%' },
    ],
  },
  {
    id: 'fallback-publish',
    name: '8 平台自动发布',
    description: '一站式多平台内容自动发布系统，覆盖小红书、抖音、B站、公众号等 8 大平台。',
    metrics: [
      { label: '平台数', value: '8' },
      { label: '耗时', value: '<3min' },
    ],
  },
];

type TypewriterPhase = 'typing' | 'pausing' | 'deleting';

export default function Home() {
  const { resources, tools, services, loading, loaded, loadAll } = useDataStore();
  const { open } = useWechatModal();

  const heroRef = useElasticEnter<HTMLDivElement>([], { y: 40, delay: 0.1 });
  const showcaseRef = useStaggerReveal<HTMLDivElement>('.showcase-card', [services.length], { stagger: 0.1 });
  const statsRef = useStaggerReveal<HTMLDivElement>('.nav-stat-card', [tools.length], { stagger: 0.06 });
  const resourceSectionRef = useParallax<HTMLDivElement>(0.05);

  // 打字机效果：正在做的项目轮播
  const [typedText, setTypedText] = useState('');
  const [phase, setPhase] = useState<TypewriterPhase>('typing');
  const [projectIdx, setProjectIdx] = useState(0);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  useEffect(() => {
    const fullText = TYPING_PROJECTS[projectIdx];
    let timer: ReturnType<typeof setTimeout>;

    if (phase === 'typing') {
      if (typedText.length < fullText.length) {
        timer = setTimeout(() => {
          setTypedText(fullText.slice(0, typedText.length + 1));
        }, 110);
      } else {
        timer = setTimeout(() => setPhase('pausing'), 600);
      }
    } else if (phase === 'pausing') {
      timer = setTimeout(() => setPhase('deleting'), 1800);
    } else {
      if (typedText.length > 0) {
        timer = setTimeout(() => {
          setTypedText(fullText.slice(0, typedText.length - 1));
        }, 50);
      } else {
        setProjectIdx((prev) => (prev + 1) % TYPING_PROJECTS.length);
        setPhase('typing');
      }
    }

    return () => clearTimeout(timer);
  }, [typedText, phase, projectIdx]);

  const featuredServices = useMemo(() => {
    return services.filter((s) => s.isFeatured);
  }, [services]);

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
    return HOME_SERVICE_TYPES.map((meta) => {
      const sample = services.find((s) => s.type === meta.id);
      return {
        ...meta,
        count: services.filter((s) => s.type === meta.id).length,
        sampleServiceId: sample?.id ?? null,
      };
    });
  }, [services]);

  const totalTools = tools.length;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <PaperBackground />

      {/* ===== HERO ===== */}
      <section className="relative z-10 flex min-h-screen items-center px-4 pt-24 pb-16 sm:px-6 lg:px-8">
        {/* 背景层：缓慢流动的模糊光晕 */}
        <div className="layer-bg pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-[var(--crimson)] opacity-30 blur-3xl" />
          <div className="absolute right-1/4 top-1/3 h-80 w-80 rounded-full bg-[var(--mustard)] opacity-40 blur-3xl" />
          <div className="absolute left-1/3 bottom-1/4 h-80 w-80 rounded-full bg-[var(--teal)] opacity-30 blur-3xl" />
        </div>

        <div ref={heroRef} className="layer-mid relative mx-auto w-full max-w-7xl">
          <div className="grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
            {/* 左侧：标题区（左对齐，反居中套路） */}
            <div className="text-left">
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

              <p className="mb-6 max-w-2xl font-hand-body text-base text-[var(--ink-soft)] sm:text-lg">
                {siteConfig.tagline}
              </p>

              {/* 打字机：正在做的项目 */}
              <div className="mb-8 inline-flex items-center gap-2 rounded-xl border-2 border-[var(--ink)] bg-[var(--paper-light)] px-4 py-2 shadow-[3px_3px_0_var(--ink)]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--teal)] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--teal)]" />
                </span>
                <span className="font-hand-body text-xs text-[var(--ink-mute)]">正在做：</span>
                <span className="font-hand-title text-sm font-bold text-[var(--crimson)] sm:text-base">
                  {typedText}
                  <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-[var(--crimson)] align-middle sm:h-5" />
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
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

            {/* 右侧：实时数据看板（Neobrutalism 硬阴影） */}
            <div
              className="hand-card hand-card-crimson p-6 sm:p-8"
              style={{ transform: 'rotate(1.2deg)' }}
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2 font-hand-title text-sm text-[var(--ink)]">
                  <Sparkles className="h-4 w-4 text-[var(--crimson)]" />
                  实时能力看板
                </div>
                <span className="inline-flex items-center gap-1 rounded-md border-2 border-[var(--ink)] bg-[var(--crimson)] px-1.5 py-0.5 text-[9px] font-bold text-[var(--paper-light)] shadow-[2px_2px_0_var(--ink)]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--paper-light)]" />
                  LIVE
                </span>
              </div>

              <div className="space-y-3">
                {HERO_METRICS.map((m, i) => {
                  const Icon = m.icon;
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-4 rounded-xl border-2 border-[var(--ink)] bg-[var(--paper-light)] p-4 shadow-[3px_3px_0_var(--ink)] transition-transform hover:-translate-y-0.5"
                      style={{ transform: `rotate(${(i % 2 ? 1 : -1) * 0.4}deg)` }}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-[var(--ink)] bg-[var(--crimson)] shadow-[2px_2px_0_var(--ink)]">
                        <Icon className="h-5 w-5 text-[var(--paper-light)]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-hand-title text-2xl font-black leading-none text-[var(--ink)]">
                          {m.value}
                        </div>
                        <div className="mt-1 font-hand-body text-xs text-[var(--ink-soft)]">
                          {m.label}
                        </div>
                      </div>
                      <div className="shrink-0 rounded-md border-2 border-[var(--ink)] bg-[var(--paper)] px-2 py-0.5 font-hand-body text-[10px] text-[var(--ink-soft)]">
                        {m.sub}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 border-t-2 border-dashed border-[var(--ink)]/30 pt-4 text-center">
                <span className="font-hand-body text-[11px] text-[var(--ink-mute)]">
                  全部数据真实可查 · 拒绝虚标
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 招牌作品 Showcase ===== */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="招牌作品"
          title="代表作 Showcase"
          subtitle="用作品说话 —— 这些是阿维正在做的真实项目，每一个都已落地运行"
          actionLabel="查看全部服务"
          actionTo="/services"
          align="left"
        />
        {loading && !loaded ? (
          <div className="hand-empty">加载中...</div>
        ) : featuredServices.length > 0 ? (
          <div ref={showcaseRef} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredServices.map((s, i) => (
              <ShowcaseCard key={s.id} service={s} index={i} />
            ))}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FALLBACK_FEATURED.map((f, i) => (
              <FallbackShowcaseCard key={f.id} item={f} index={i} />
            ))}
          </div>
        )}
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
            const targetTo = s.sampleServiceId ? `/services/${s.sampleServiceId}` : '/services';
            return (
              <div
                key={s.id}
                className="hand-card ink-spread group flex h-full flex-col p-5"
                style={{ transform: `rotate(${(i % 2 ? 1 : -1) * 0.8}deg)` }}
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[var(--ink)] bg-[var(--crimson)] shadow-[2px_2px_0_var(--ink)]">
                  <Icon className="h-5 w-5 text-[var(--paper-light)]" />
                </div>
                <h3 className="mb-1.5 font-hand-title text-base text-[var(--ink)]">{s.name}</h3>
                <p className="mb-3 font-hand-title text-sm font-bold text-[var(--crimson)]">{s.priceRange}</p>
                <p className="line-clamp-3 font-hand-body text-xs leading-relaxed text-[var(--ink-soft)]">
                  {s.description}
                </p>
                <div className="mt-auto flex items-center gap-2 pt-4">
                  <Link
                    to={targetTo}
                    className="hand-btn hand-btn-primary flex-1 justify-center text-xs"
                  >
                    查看详情
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                  <button
                    onClick={() => open(s.id)}
                    className="hand-btn text-xs"
                    aria-label="微信咨询"
                    title="微信咨询"
                  >
                    <LifeBuoy className="h-3.5 w-3.5" />
                  </button>
                </div>
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

/** 招牌作品卡片（真实服务数据） */
function ShowcaseCard({ service, index }: { service: Service; index: number }) {
  return (
    <div
      className="showcase-card hand-card ink-spread group flex h-full flex-col overflow-hidden"
      style={{ transform: `rotate(${(index % 2 ? 1 : -1) * 0.6}deg)` }}
    >
      {service.coverImage ? (
        <div className="relative aspect-[16/10] overflow-hidden border-b-2 border-[var(--ink)] bg-[var(--paper-deep)]">
          <img
            src={service.coverImage}
            alt={service.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <span className="absolute left-3 top-3 rounded-md border-2 border-[var(--ink)] bg-[var(--crimson)] px-2 py-0.5 text-[10px] font-bold text-[var(--paper-light)] shadow-[2px_2px_0_var(--ink)]">
            FEATURED
          </span>
        </div>
      ) : (
        <div className="relative aspect-[16/10] flex items-center justify-center border-b-2 border-[var(--ink)] bg-gradient-to-br from-[var(--paper-deep)] to-[var(--paper-light)]">
          <Sparkles className="h-10 w-10 text-[var(--crimson)]/40" />
          <span className="absolute left-3 top-3 rounded-md border-2 border-[var(--ink)] bg-[var(--crimson)] px-2 py-0.5 text-[10px] font-bold text-[var(--paper-light)] shadow-[2px_2px_0_var(--ink)]">
            FEATURED
          </span>
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 font-hand-title text-lg text-[var(--ink)]">{service.name}</h3>

        {service.metrics && service.metrics.length > 0 ? (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {service.metrics.slice(0, 3).map((m, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 rounded-md border-2 border-[var(--ink)] bg-[var(--mustard)] px-2 py-0.5 text-[10px] font-bold text-[var(--ink)] shadow-[2px_2px_0_var(--ink)]"
              >
                <span>{m.value}</span>
                <span className="font-normal text-[var(--ink-soft)]">{m.label}</span>
              </span>
            ))}
          </div>
        ) : null}

        <p className="mb-4 line-clamp-3 font-hand-body text-sm leading-relaxed text-[var(--ink-soft)]">
          {service.description}
        </p>

        <div className="mt-auto flex items-center gap-2">
          <Link
            to={`/services/${service.id}`}
            className="hand-btn hand-btn-primary flex-1 justify-center text-xs"
          >
            查看案例详情
            <ArrowRight className="h-3 w-3" />
          </Link>
          {service.liveDemoUrl ? (
            <a
              href={service.liveDemoUrl}
              target="_blank"
              rel="noreferrer"
              className="hand-btn text-xs"
              aria-label="在线 Demo"
              title="在线 Demo"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Demo
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** 招牌作品占位卡片（无 featured 服务时使用） */
function FallbackShowcaseCard({
  item,
  index,
}: {
  item: (typeof FALLBACK_FEATURED)[number];
  index: number;
}) {
  return (
    <div
      className="showcase-card hand-card ink-spread group flex h-full flex-col overflow-hidden"
      style={{ transform: `rotate(${(index % 2 ? 1 : -1) * 0.6}deg)` }}
    >
      <div className="relative aspect-[16/10] flex items-center justify-center border-b-2 border-[var(--ink)] bg-gradient-to-br from-[var(--paper-deep)] to-[var(--paper-light)]">
        <Sparkles className="h-10 w-10 text-[var(--crimson)]/40" />
        <span className="absolute left-3 top-3 rounded-md border-2 border-[var(--ink)] bg-[var(--mustard)] px-2 py-0.5 text-[10px] font-bold text-[var(--ink)] shadow-[2px_2px_0_var(--ink)]">
          即将上线
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 font-hand-title text-lg text-[var(--ink)]">{item.name}</h3>

        <div className="mb-3 flex flex-wrap gap-1.5">
          {item.metrics.map((m, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 rounded-md border-2 border-[var(--ink)] bg-[var(--mustard)] px-2 py-0.5 text-[10px] font-bold text-[var(--ink)] shadow-[2px_2px_0_var(--ink)]"
            >
              <span>{m.value}</span>
              <span className="font-normal text-[var(--ink-soft)]">{m.label}</span>
            </span>
          ))}
        </div>

        <p className="mb-4 line-clamp-3 font-hand-body text-sm leading-relaxed text-[var(--ink-soft)]">
          {item.description}
        </p>

        <Link to="/services" className="mt-auto hand-btn justify-center text-xs">
          了解更多
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
