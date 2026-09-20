/**
 * 首页 —— 全部区块由数据驱动，零硬编码内容：
 * - Hero / Marquee / 能力矩阵：profile 集合（后台「个人画像」编辑）
 * - 主推案例：portfolio 集合 isFeatured
 * - 信任数据栏：/api/github + /api/blog 活快照
 * - 招牌服务：services 集合 isFeatured
 * - 最新文章：/api/blog 快照前 5 篇
 * 任何一块数据缺失都整块隐藏，不渲染占位假内容。
 */
import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  MessageCircle,
  Zap,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useDataStore } from '@/store/useDataStore';
import { useLiveStore } from '@/store/useLiveStore';
import { useWechatModal } from '@/components/WeChatModal';
import SectionTitle from '@/components/SectionTitle';
import TrustBar from '@/components/TrustBar';
import MarqueeStrip from '@/components/MarqueeStrip';
import ProjectCard from '@/components/ProjectCard';
import BlogList from '@/components/BlogList';
import Seo, { personJsonLd } from '@/components/Seo';
import { SmartImage } from '@/components/SmartMedia';
import { useElasticEnter, useScrollReveal } from '@/hooks/useGsap';
import { siteConfig } from '@/config/site.config';
import type { Service } from '@/types';

export default function Home() {
  const { services, portfolio, profile, loading, loaded, loadAll } = useDataStore();
  const loadLive = useLiveStore((s) => s.load);
  const { open } = useWechatModal();

  const heroRef = useElasticEnter<HTMLDivElement>([!!profile], { y: 40, delay: 0.1 });
  const capRef = useScrollReveal<HTMLDivElement>('.cap-card', [profile?.capabilities.length ?? 0], {
    stagger: 0.1,
    y: 50,
  });
  const showcaseRef = useScrollReveal<HTMLDivElement>('.showcase-card', [services.length], {
    stagger: 0.15,
    y: 60,
  });
  const ctaRef = useElasticEnter<HTMLDivElement>([], { y: 30, delay: 0.1 });

  useEffect(() => {
    loadAll();
    loadLive();
  }, [loadAll, loadLive]);

  const featuredProjects = useMemo(
    () => portfolio.filter((p) => p.published && p.isFeatured).slice(0, 4),
    [portfolio],
  );
  const heroProject = featuredProjects[0] || null;
  const featuredServices = useMemo(() => services.filter((s) => s.isFeatured).slice(0, 3), [services]);

  const marqueeItems = useMemo(() => {
    if (!profile) return [];
    return [
      profile.slogan,
      ...profile.values,
      '只交付能跑通的东西',
      '验收不通过不收尾款',
      `${portfolio.filter((p) => p.published && p.demoUrl).length} 个在线产品可玩`,
      '代码全部开源可查',
    ].filter(Boolean);
  }, [profile, portfolio]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--bg)]">
      <Seo
        title={siteConfig.name}
        description={
          profile
            ? `${profile.identity}。${profile.focus}。在线产品 / 开源代码 / 工程实录，全部可验证。`
            : siteConfig.tagline
        }
        path="/"
        jsonLd={[personJsonLd()]}
      />

      {/* 背景氛围 */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-20 top-1/4 h-[500px] w-[500px] rounded-full bg-[var(--accent)] opacity-[0.04] blur-[120px]" />
        <div className="absolute -right-20 bottom-1/4 h-[500px] w-[500px] rounded-full bg-[var(--accent-alt)] opacity-[0.05] blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* ===== HERO：画像驱动 ===== */}
      <section className="relative z-10 flex min-h-screen items-center px-4 pt-24 pb-16 sm:px-6 lg:px-8">
        <div ref={heroRef} className="relative mx-auto w-full max-w-7xl">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr]">
            <div className="text-left">
              <div className="text-eyebrow mb-4 terminal-cursor">
                {profile ? `${profile.location} · ${profile.identity}` : `${siteConfig.name} · ${siteConfig.ownerTitle}`}
              </div>
              <h1 className="text-display mb-6 font-black text-[var(--ink)]">
                <span className="glitch-text block" data-text={profile?.brand ?? siteConfig.brand}>
                  {profile?.brand ?? siteConfig.brand}
                </span>
                <span
                  className="glitch-text block text-[var(--accent)]"
                  data-text={profile?.slogan ?? siteConfig.tagline.split('——')[0].trim()}
                >
                  {profile?.slogan ?? siteConfig.tagline.split('——')[0].trim()}
                </span>
              </h1>
              <p className="mb-6 max-w-xl font-body text-lg text-[var(--ink-soft)]">
                {profile?.focus ?? siteConfig.ownerTitle}
              </p>
              <div className="mb-8 flex flex-wrap gap-3">
                <Link to="/portfolio" className="hand-btn hand-btn-primary text-base rgb-shift">
                  看我的作品
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/contact" className="hand-btn text-base">
                  获取报价
                </Link>
                <button onClick={() => open('default')} className="hand-btn text-base">
                  <MessageCircle className="h-4 w-4" />
                  直接聊聊
                </button>
              </div>
              {/* 身份三链：同一人三个入口，可交叉验证 */}
              <div className="flex flex-wrap gap-4 font-mono text-xs text-[var(--ink-soft)]">
                <a href={siteConfig.githubUrl} target="_blank" rel="noreferrer" className="hover:text-[var(--accent)]">
                  GitHub: Person-HE
                </a>
                <a href={siteConfig.blogUrl} target="_blank" rel="noreferrer" className="hover:text-[var(--accent)]">
                  Blog: person-he.github.io
                </a>
                <span>
                  品牌: <span className="text-[var(--accent)]">{profile?.brand ?? siteConfig.brand}</span>
                </span>
              </div>
            </div>

            {/* 右侧：主推项目真实截图 */}
            <div className="relative">
              <div className="hand-card-accent overflow-hidden">
                <div className="relative aspect-[16/10] w-full">
                  <SmartImage
                    src={heroProject?.coverImage || null}
                    alt={heroProject ? `${heroProject.name} 真实截图` : '产品截图'}
                    eager
                    fallbackLabel="后台上传案例封面"
                  />
                </div>
                <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-md border-2 border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-[10px] font-bold text-[var(--accent)] shadow-[2px_2px_0_var(--border)]">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--accent)]" />
                  {heroProject ? `在线产品 · ${heroProject.name}` : '真实运行截图'}
                </div>
              </div>
              {heroProject?.demoUrl ? (
                <div
                  className="absolute -bottom-4 -left-4 hidden sm:block"
                  style={{ transform: 'rotate(-3deg)' }}
                >
                  <a
                    href={heroProject.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block border-2 border-[var(--border)] bg-[var(--bg-elevated)] p-4 font-display text-2xl font-bold text-[var(--accent)] shadow-[4px_4px_0_var(--border)] hover:bg-[var(--accent)] hover:text-[var(--bg)]"
                  >
                    点开就能玩 →
                  </a>
                </div>
              ) : null}
              <div
                className="absolute -right-3 top-6 hidden rounded-md border-2 border-[var(--accent-alt)] bg-[var(--accent-alt)] px-2 py-1 font-mono text-[10px] font-bold text-[var(--ink)] shadow-[2px_2px_0_var(--ink)] sm:block"
                style={{ transform: 'rotate(4deg)' }}
              >
                LIVE / NOT_DEMO
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 实时信任数据栏（cron 快照） ===== */}
      <TrustBar />

      {/* ===== Marquee：价值观（画像驱动） ===== */}
      {marqueeItems.length > 0 ? <MarqueeStrip items={marqueeItems} /> : null}

      {/* ===== 主推案例（portfolio 集合） ===== */}
      {featuredProjects.length > 0 ? (
        <section className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="作品集"
            title="做出来的东西，先给你玩"
            subtitle="每个项目都有在线 Demo、源码和工程实录。数字有出处，决策有理由。"
            actionLabel="全部项目"
            actionTo="/portfolio"
          />
          <div className="grid gap-5 sm:grid-cols-2">
            {featuredProjects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      ) : loading && !loaded ? (
        <div className="py-24 text-center font-mono text-sm text-[var(--ink-mute)]">
          <span className="text-[var(--accent)]">{'>'}</span> <span className="terminal-cursor">loading…</span>
        </div>
      ) : null}

      {/* ===== 能力矩阵（画像 capabilities，每条带证据链） ===== */}
      {profile && profile.capabilities.length > 0 ? (
        <section className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="能力矩阵"
            title="每句「我会」，后面都挂着证据"
            subtitle="点击任意一条，直达对应作品或文章 —— 不接受无凭证的自我吹嘘。"
          />
          <div ref={capRef} className="grid gap-4 sm:grid-cols-2">
            {profile.capabilities.map((c, i) => (
              <Link
                key={c.title}
                to={c.evidenceUrl.startsWith('/') ? c.evidenceUrl : '/portfolio'}
                className="cap-card hand-card rgb-shift group flex items-start gap-4 p-5"
                style={{ transform: `rotate(${(i % 2 ? 1 : -1) * 0.5}deg)` }}
              >
                <span className="font-mono text-xs text-[var(--accent)]">/{String(i + 1).padStart(2, '0')}</span>
                <div className="flex-1">
                  <h3 className="font-display text-xl font-bold text-[var(--ink)]">{c.title}</h3>
                  <p className="mt-1 font-mono text-xs leading-relaxed text-[var(--ink-soft)]">{c.desc}</p>
                  <span className="mt-2 inline-flex items-center gap-1 font-mono text-[10px] text-[var(--accent-cyan)]">
                    <ShieldCheck className="h-3 w-3" /> 证据：{c.evidenceLabel}
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* ===== 招牌服务（services 集合 isFeatured） ===== */}
      {featuredServices.length > 0 ? (
        <section className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="招牌服务"
            title="已经交付过的，才敢接来做的"
            subtitle="每个服务背后都是一个真实产品。先诊断需求，能帮才报价。"
            actionLabel="全部服务"
            actionTo="/services"
          />
          <div ref={showcaseRef} className="space-y-16">
            {featuredServices.map((s, i) => (
              <ShowcaseRow key={s.id} service={s} index={i} />
            ))}
          </div>
        </section>
      ) : null}

      {/* ===== 最新文章（/api/blog 快照） ===== */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="工程实录"
          title="做过什么，博客里怎么拆的"
          subtitle="正文全部在 Hexo 主站，本站目录由服务端每小时同步。"
          actionLabel="全部文章"
          actionTo="/blog"
        />
        <div className="max-w-4xl">
          <BlogList limit={5} />
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div
          ref={ctaRef}
          className="hand-card-alt rgb-shift relative overflow-hidden p-10 text-center sm:p-16"
          style={{ transform: 'rotate(0.8deg)' }}
        >
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
            aria-hidden="true"
          >
            <span className="font-display text-[20vw] font-black leading-none text-[var(--accent)] opacity-[0.06]">
              LET'S TALK
            </span>
          </div>
          <div className="relative">
            <Zap className="mx-auto mb-4 h-10 w-10 text-[var(--accent)]" />
            <h2
              className="text-headline mb-4 font-black text-[var(--ink)] glitch-text"
              data-text="有一个想法？先聊聊"
            >
              有一个想法？先聊聊
            </h2>
            <p className="mx-auto mb-8 max-w-xl font-body text-lg text-[var(--ink-soft)]">
              不收费咨询，先听需求再谈合作。搞不定不收费，验收不通过不收尾款。
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/contact"
                className="hand-btn hand-btn-primary inline-flex items-center gap-2 text-lg"
              >
                <Sparkles className="h-5 w-5" />
                提交需求 · 获取报价
                <ArrowRight className="h-5 w-5" />
              </Link>
              <button onClick={() => open('default')} className="hand-btn text-lg">
                <MessageCircle className="h-5 w-5" />
                加我微信
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/** 招牌服务横向卡片：真实截图 + 服务数据 */
function ShowcaseRow({ service, index }: { service: Service; index: number }) {
  const { open } = useWechatModal();
  const isReversed = index % 2 === 1;
  const tilt = index % 2 === 0 ? -0.6 : 0.6;

  return (
    <div
      className={`showcase-card hand-card rgb-shift group flex flex-col overflow-hidden lg:flex-row ${
        isReversed ? 'lg:flex-row-reverse' : ''
      }`}
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <div
        className={`relative aspect-[16/10] w-full overflow-hidden border-b-2 border-[var(--border)] lg:aspect-auto lg:w-[55%] lg:border-b-0 ${
          isReversed ? 'lg:border-l-2' : 'lg:border-r-2'
        }`}
      >
        <SmartImage
          src={service.coverImage || null}
          alt={service.name}
          fallbackLabel="案例截图丢失"
          wrapperClassName="h-full w-full"
          className="transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <span className="absolute left-4 top-4 z-10 font-mono text-xs font-bold text-[var(--accent)] mix-blend-difference">
          #{String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-center p-6 sm:p-8">
        <div className="text-eyebrow mb-2">SERVICE_{String(index + 1).padStart(2, '0')}</div>
        <h3
          className="mb-3 font-display text-3xl font-black text-[var(--ink)] glitch-text"
          data-text={service.name}
        >
          {service.name}
        </h3>
        <p className="mb-5 font-body text-base leading-relaxed text-[var(--ink-soft)]">
          {service.description}
        </p>
        {service.metrics && service.metrics.length > 0 ? (
          <div className="mb-6 flex flex-wrap gap-2">
            {service.metrics.map((m) => (
              <span
                key={m.label}
                className="inline-flex items-center gap-1.5 rounded-md border-2 border-[var(--border)] bg-[var(--accent)] px-3 py-1.5 font-mono text-xs font-bold text-[var(--bg)] shadow-[2px_2px_0_var(--border)]"
              >
                {m.value} {m.label}
              </span>
            ))}
          </div>
        ) : null}
        <div className="flex flex-wrap gap-3">
          <Link to={`/services/${service.id}`} className="hand-btn hand-btn-primary rgb-shift">
            查看这个服务
            <ArrowRight className="h-4 w-4" />
          </Link>
          <button onClick={() => open(service.type)} className="hand-btn">
            微信咨询
          </button>
        </div>
      </div>
    </div>
  );
}
