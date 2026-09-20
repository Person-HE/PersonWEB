import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Wrench,
  Wand2,
  Puzzle,
  Crown,
  Building2,
  Package,
  Workflow,
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  ExternalLink,
  Image as ImageIcon,
  PlayCircle,
  Lightbulb,
  Target,
  TrendingUp,
  Sparkles,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useDataStore } from '@/store/useDataStore';
import { useWechatModal } from '@/components/WeChatModal';
import Breadcrumb from '@/components/Breadcrumb';
import EmptyState from '@/components/EmptyState';
import PaperBackground from '@/components/PaperBackground';
import Seo from '@/components/Seo';
import { siteConfig } from '@/config/site.config';
import { SERVICE_TYPES } from '@/constants';
import { useElasticEnter, useStaggerReveal } from '@/hooks/useGsap';
import FormattedText from '@/components/FormattedText';
import { SmartImage, SmartVideo } from '@/components/SmartMedia';
import type { ServiceType } from '@/types';

const iconMap: Record<ServiceType, LucideIcon> = {
  'tool-config': Wrench,
  'ai-output': Wand2,
  custom: Puzzle,
  'product-pro': Crown,
  product: Package,
  automation: Workflow,
  enterprise: Building2,
};

/** 判断是否为可直接内嵌播放的视频直链（mp4 / webm） */
function isDirectVideoUrl(url: string): boolean {
  return /\.(mp4|webm)(\?.*)?$/i.test(url);
}

/** 判断是否为抖音链接（保留外链卡片样式） */
function isDouyinUrl(url: string): boolean {
  return /douyin\.com|iesdouyin\.com|dy\.com/i.test(url);
}

export default function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const { services, loading, loaded, loadAll } = useDataStore();
  const { open } = useWechatModal();
  const [activeShot, setActiveShot] = useState<string | null>(null);

  const heroRef = useElasticEnter<HTMLDivElement>([], { y: 30, delay: 0.05 });
  const galleryRef = useStaggerReveal<HTMLDivElement>('.shot-item', [], { stagger: 0.06 });
  const caseRef = useStaggerReveal<HTMLDivElement>('.cs-card', [], { stagger: 0.1 });
  const relatedRef = useStaggerReveal<HTMLDivElement>('.rel-svc', [], { stagger: 0.08 });

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const service = useMemo(() => services.find((s) => String(s.id) === String(id)), [services, id]);
  const related = useMemo(() => {
    if (!service) return [];
    return services.filter((s) => String(s.id) !== String(service.id) && s.type === service.type).slice(0, 3);
  }, [services, service]);

  if (loading && !loaded) {
    return (
      <div className="relative min-h-screen overflow-hidden pt-16">
        <PaperBackground />
        <div className="relative z-10 mx-auto max-w-4xl px-4 py-20 text-center font-mono text-sm text-[var(--ink-mute)]">
          <span className="text-[var(--accent)]">{'>'}</span> loading...
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="relative min-h-screen overflow-hidden pt-16">
        <PaperBackground />
        <div className="relative z-10 mx-auto max-w-4xl px-4 py-12">
          <Breadcrumb
            items={[
              { label: '首页', to: '/' },
              { label: '服务中心', to: '/services' },
              { label: '未找到' },
            ]}
          />
          <EmptyState
            title="服务不存在"
            description="该服务可能已下线或链接有误。"
            action={
              <Link to="/services" className="hand-btn text-sm">
                <ArrowLeft className="h-4 w-4" /> 返回服务中心
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const meta = SERVICE_TYPES.find((m) => m.id === service.type);
  const Icon = iconMap[service.type] ?? Wrench;
  const isEnterprise = service.type === 'enterprise';
  const cardCls = isEnterprise ? 'hand-card hand-card-accent' : 'hand-card';

  const hasScreenshots = !!(service.screenshots && service.screenshots.length > 0);
  const hasVideo = !!service.videoUrl;
  const isDirectVideo = hasVideo && isDirectVideoUrl(service.videoUrl as string);
  const hasLiveDemo = !!service.liveDemoUrl;
  const hasCaseStudy = !!service.caseStudy;
  const hasMetrics = !!(service.metrics && service.metrics.length > 0);
  const hasVisualContent = hasScreenshots || hasVideo || hasCaseStudy;

  return (
    <div className="relative min-h-screen overflow-hidden pt-16">
      <PaperBackground />
      <Seo
        title={service.name}
        description={service.description}
        path={`/services/${service.id}`}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: service.name,
            description: service.description,
            provider: { '@type': 'Person', name: siteConfig.owner },
            offers: { '@type': 'Offer', price: service.price, priceCurrency: 'CNY' },
          },
        ]}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: '首页', to: '/' },
            { label: '服务中心', to: '/services' },
            { label: service.name },
          ]}
        />

        {/* 头部：终端面板风格 */}
        <section ref={heroRef}>
          <div
            className={`${cardCls} mb-6 overflow-hidden p-0 rgb-shift`}
            style={{ transform: 'rotate(-0.4deg)' }}
          >
            {/* 封面图 */}
            {service.coverImage ? (
              <div className="relative h-48 w-full overflow-hidden border-b-2 border-[var(--ink)] sm:h-60">
                <SmartImage
                  src={service.coverImage}
                  alt={service.name}
                  eager
                  fallbackLabel="封面信号丢失"
                  wrapperClassName="h-full w-full"
                  className="h-full w-full object-cover"
                />
                {service.isFeatured ? (
                  <span className="absolute right-3 top-3 z-10 border-2 border-[var(--ink)] bg-[var(--accent)] px-2 py-0.5 font-mono text-[10px] font-bold text-[var(--bg)] shadow-[2px_2px_0_var(--ink)]">
                    <Sparkles className="mr-1 inline h-3 w-3" />FEATURED
                  </span>
                ) : null}
              </div>
            ) : null}

            <div className="p-6">
              <div className="flex items-start gap-4">
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center border-2 border-[var(--ink)] shadow-[3px_3px_0_var(--ink)]"
                  style={{ background: 'var(--accent)', transform: 'rotate(-3deg)' }}
                >
                  <Icon className="h-7 w-7 text-[var(--bg)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1
                      className="font-display text-2xl text-[var(--ink)] sm:text-3xl glitch-text"
                      data-text={service.name}
                    >
                      {service.name}
                    </h1>
                    {meta ? (
                      <span className="hand-tag text-xs">{meta.name}</span>
                    ) : null}
                    {service.isFeatured && !service.coverImage ? (
                      <span className="border-2 border-[var(--ink)] bg-[var(--accent)] px-2 py-0.5 font-mono text-[10px] font-bold text-[var(--bg)]">
                        <Sparkles className="mr-1 inline h-3 w-3" />FEATURED
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <p className="font-mono text-lg font-bold text-[var(--accent)]">
                      <span className="text-[var(--ink-mute)]">$</span> {service.priceRange || service.price}
                    </p>
                    {hasMetrics ? (
                      <div className="flex flex-wrap gap-1">
                        {service.metrics.map((m) => (
                          <span
                            key={m.label}
                            className="border-2 border-[var(--ink)] bg-[var(--accent-cyan)] px-2 py-0.5 font-mono text-[10px] font-bold text-[var(--bg)]"
                          >
                            <TrendingUp className="mr-1 inline h-3 w-3" />{m.value} {m.label}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <div className="mt-2">
                    <FormattedText text={service.description} />
                  </div>
                  {service.tags && service.tags.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {service.tags.map((t) => (
                        <span key={t} className="hand-tag text-xs">#{t}</span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>

              {/* 产品链接 */}
              {service.productUrl ? (
                <a
                  href={service.productUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`hand-btn mt-3 inline-flex text-sm ${isEnterprise ? 'hand-btn-gold' : 'hand-btn-primary'}`}
                >
                  <ExternalLink className="h-4 w-4" />
                  访问产品
                </a>
              ) : null}
            </div>
          </div>
        </section>

        {/* 详情 */}
        <div
          className="hand-card mb-6 p-6 rgb-shift"
          style={{ transform: 'rotate(0.3deg)' }}
        >
          <h2 className="mb-3 font-display text-base text-[var(--ink)]">
            <span className="text-[var(--accent)]">{'// '}</span>
            服务详情
          </h2>
          <FormattedText text={service.details} />
        </div>

        {/* 截图画廊 */}
        {hasScreenshots ? (
          <div className="mb-6">
            <h2 className="mb-3 font-display text-base text-[var(--ink)]">
              <span className="text-[var(--accent)]">{'// '}</span>
              案例截图
            </h2>
            <div
              ref={galleryRef}
              className="flex gap-3 overflow-x-auto pb-3"
              style={{ scrollbarWidth: 'thin' }}
            >
              {service.screenshots.map((shot, i) => (
                <button
                  type="button"
                  key={`${i}-${shot}`}
                  onClick={() => setActiveShot(shot)}
                  className="shot-item hand-card rgb-shift shrink-0 overflow-hidden p-0"
                  style={{ transform: `rotate(${(i % 2 ? 1 : -1) * 0.4}deg)`, width: '16rem' }}
                  aria-label={`查看案例截图 ${i + 1}`}
                >
                  <div className="relative h-40 w-full overflow-hidden border-b-2 border-[var(--ink)]">
                    <SmartImage
                      src={shot}
                      alt={`案例截图 ${i + 1}`}
                      fallbackLabel={`截图 ${i + 1} 丢失`}
                      wrapperClassName="h-full w-full"
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute right-2 top-2 z-10 border-2 border-[var(--ink)] bg-[var(--bg)] px-1.5 py-0.5 font-mono text-[10px] font-bold text-[var(--accent)]">
                      <ImageIcon className="mr-1 inline h-3 w-3" />{i + 1}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <p className="mt-1 font-mono text-xs text-[var(--ink-mute)]">
              <span className="text-[var(--accent)]">{'>'}</span> 点击截图可放大查看 →
            </p>
          </div>
        ) : null}

        {/* 视频演示 */}
        {hasVideo ? (
          <div className="mb-6">
            <h2 className="mb-3 font-display text-base text-[var(--ink)]">
              <span className="text-[var(--accent)]">{'// '}</span>
              视频演示
            </h2>
            {isDirectVideo ? (
              <div
                className="hand-card overflow-hidden p-0 rgb-shift"
                style={{ transform: 'rotate(-0.3deg)' }}
              >
                <SmartVideo
                  src={service.videoUrl as string}
                  poster={service.coverImage || undefined}
                  wrapperClassName="aspect-video w-full"
                  className="aspect-video w-full object-cover"
                  fallbackLabel="视频信号丢失"
                />
              </div>
            ) : (
              <div
                className="hand-card p-5 rgb-shift"
                style={{ transform: 'rotate(-0.3deg)' }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-[var(--ink)] bg-[var(--accent-alt)] shadow-[2px_2px_0_var(--ink)]">
                    <PlayCircle className="h-5 w-5 text-[var(--ink)]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-sm text-[var(--ink)]">
                      {isDouyinUrl(service.videoUrl as string) ? '抖音视频演示' : '视频演示'}
                    </p>
                    <p className="truncate font-mono text-xs text-[var(--ink-mute)]">
                      {service.videoUrl}
                    </p>
                  </div>
                  <a
                    href={service.videoUrl as string}
                    target="_blank"
                    rel="noreferrer"
                    className={`hand-btn inline-flex text-xs ${isEnterprise ? 'hand-btn-gold' : 'hand-btn-primary'}`}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    观看
                  </a>
                </div>
              </div>
            )}
            {hasLiveDemo ? (
              <a
                href={service.liveDemoUrl as string}
                target="_blank"
                rel="noreferrer"
                className="hand-btn mt-3 inline-flex text-sm"
              >
                <PlayCircle className="h-4 w-4" />
                在线体验 Demo
              </a>
            ) : null}
          </div>
        ) : null}

        {/* 案例研究 */}
        {hasCaseStudy && service.caseStudy ? (
          <div className="mb-6">
            <h2 className="mb-1 font-display text-base text-[var(--ink)]">
              <span className="text-[var(--accent)]">{'// '}</span>
              {service.caseStudy.title || '案例研究'}
            </h2>
            <p className="mb-3 font-mono text-xs text-[var(--ink-mute)]">{'>'} 用真实故事说话</p>
            <div ref={caseRef} className="grid gap-3 sm:grid-cols-3">
              <div
                className="cs-card hand-card p-4 rgb-shift"
                style={{ transform: 'rotate(-0.5deg)' }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center border-2 border-[var(--ink)] bg-[var(--accent-blue)] shadow-[1px_1px_0_var(--ink)]">
                    <Lightbulb className="h-3.5 w-3.5 text-[var(--ink)]" />
                  </div>
                  <h3 className="font-display text-sm text-[var(--ink)]">项目背景</h3>
                </div>
                <FormattedText text={service.caseStudy.background} />
              </div>
              <div
                className="cs-card hand-card p-4 rgb-shift"
                style={{ transform: 'rotate(0.4deg)' }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center border-2 border-[var(--ink)] bg-[var(--accent-cyan)] shadow-[1px_1px_0_var(--ink)]">
                    <Target className="h-3.5 w-3.5 text-[var(--bg)]" />
                  </div>
                  <h3 className="font-display text-sm text-[var(--ink)]">解决方案</h3>
                </div>
                <FormattedText text={service.caseStudy.solution} />
              </div>
              <div
                className="cs-card hand-card p-4 rgb-shift"
                style={{ transform: 'rotate(-0.3deg)' }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center border-2 border-[var(--ink)] bg-[var(--accent)] shadow-[1px_1px_0_var(--ink)]">
                    <TrendingUp className="h-3.5 w-3.5 text-[var(--bg)]" />
                  </div>
                  <h3 className="font-display text-sm text-[var(--ink)]">实际成果</h3>
                </div>
                <FormattedText text={service.caseStudy.result} />
              </div>
            </div>
            {service.caseStudy.techStack && service.caseStudy.techStack.length > 0 ? (
              <div className="mt-3 flex flex-wrap items-center gap-1">
                <span className="font-mono text-xs text-[var(--ink-mute)]">{'>'} 技术栈：</span>
                {service.caseStudy.techStack.map((t) => (
                  <span key={t} className="hand-tag text-xs">{t}</span>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {/* 中间 CTA：看看类似案例 */}
        {hasVisualContent ? (
          <div className="mb-6 text-center">
            <Link to="/services" className="hand-btn text-sm">
              <ArrowRight className="h-4 w-4" />
              看看类似案例
            </Link>
          </div>
        ) : null}

        {/* 交付信息 */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div
            className="hand-card p-5 rgb-shift"
            style={{ transform: 'rotate(-0.5deg)' }}
          >
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center border-2 border-[var(--ink)] bg-[var(--accent-blue)] shadow-[1px_1px_0_var(--ink)]">
                <Package className="h-3.5 w-3.5 text-[var(--ink)]" />
              </div>
              <h3 className="font-display text-sm text-[var(--ink)]">交付信息</h3>
            </div>
            <dl className="space-y-2 font-mono text-xs">
              <div className="flex justify-between gap-2">
                <dt className="text-[var(--ink-mute)]">{'>'} 交付方式</dt>
                <dd className="text-right text-[var(--ink)]">{service.delivery.method}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-[var(--ink-mute)]">{'>'} 交付时间</dt>
                <dd className="text-right text-[var(--ink)]">{service.delivery.time}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-[var(--ink-mute)]">{'>'} 免费修改</dt>
                <dd className="text-right text-[var(--ink)]">
                  {service.delivery.revisions > 0 ? `${service.delivery.revisions} 次` : '—'}
                </dd>
              </div>
            </dl>
          </div>

          <div
            className="hand-card p-5 rgb-shift"
            style={{ transform: 'rotate(0.5deg)' }}
          >
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center border-2 border-[var(--ink)] bg-[var(--accent-cyan)] shadow-[1px_1px_0_var(--ink)]">
                <Check className="h-3.5 w-3.5 text-[var(--bg)]" />
              </div>
              <h3 className="font-display text-sm text-[var(--ink)]">保障与下单</h3>
            </div>
            <dl className="space-y-2 font-mono text-xs">
              <div className="flex justify-between gap-2">
                <dt className="text-[var(--ink-mute)]">{'>'} 保障承诺</dt>
                <dd className="text-right text-[var(--ink)]">{service.guarantee || '—'}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-[var(--ink-mute)]">{'>'} 下单方式</dt>
                <dd className="text-right text-[var(--ink)]">{service.orderMethod}</dd>
              </div>
              {service.maintenancePeriod ? (
                <div className="flex justify-between gap-2">
                  <dt className="text-[var(--ink-mute)]">{'>'} 维护期</dt>
                  <dd className="text-right text-[var(--ink)]">{service.maintenancePeriod}</dd>
                </div>
              ) : null}
            </dl>
          </div>
        </div>

        {/* 适用场景 / 预期效果 */}
        {service.applicableScene || service.expectedEffect ? (
          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            {service.applicableScene ? (
              <div
                className="hand-card p-5 rgb-shift"
                style={{ transform: 'rotate(-0.3deg)' }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center border-2 border-[var(--ink)] bg-[var(--accent-blue)] shadow-[1px_1px_0_var(--ink)]">
                    <Clock className="h-3.5 w-3.5 text-[var(--ink)]" />
                  </div>
                  <h3 className="font-display text-sm text-[var(--ink)]">适用场景</h3>
                </div>
                <FormattedText text={service.applicableScene} />
              </div>
            ) : null}
            {service.expectedEffect ? (
              <div
                className="hand-card p-5 rgb-shift"
                style={{ transform: 'rotate(0.3deg)' }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center border-2 border-[var(--ink)] bg-[var(--accent)] shadow-[1px_1px_0_var(--ink)]">
                    <ArrowRight className="h-3.5 w-3.5 text-[var(--bg)]" />
                  </div>
                  <h3 className="font-display text-sm text-[var(--ink)]">预期效果</h3>
                </div>
                <FormattedText text={service.expectedEffect} />
              </div>
            ) : null}
          </div>
        ) : null}

        {/* CTA */}
        <div
          className={`${cardCls} p-6 text-center rgb-shift`}
          style={{ transform: 'rotate(0.4deg)' }}
        >
          <h3 className="mb-2 font-display text-lg text-[var(--ink)] sm:text-xl glitch-text" data-text="聊聊你的需求">
            聊聊你的需求
          </h3>
          <p className="mb-4 font-mono text-sm text-[var(--ink-soft)]">{'>'} 免费咨询，不收费，搞不定不收费。</p>
          <button
            onClick={() => open(service.type)}
            className={`hand-btn ${isEnterprise ? 'hand-btn-gold' : 'hand-btn-primary'}`}
          >
            立即咨询
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* 相关服务 */}
        {related.length > 0 ? (
          <div className="mt-10">
            <h2 className="mb-4 font-display text-base text-[var(--ink)]">
              <span className="text-[var(--accent)]">{'// '}</span>
              相关服务
            </h2>
            <div ref={relatedRef} className="grid gap-3 sm:grid-cols-3">
              {related.map((s, i) => (
                <Link
                  key={s.id}
                  to={`/services/${s.id}`}
                  className={`rel-svc hand-card rgb-shift block p-4`}
                  style={{ transform: `rotate(${(i % 2 ? 1 : -1) * 0.5}deg)` }}
                >
                  <h3 className="line-clamp-1 font-display text-sm text-[var(--ink)]">{s.name}</h3>
                  <p className="mt-1 line-clamp-2 font-mono text-xs text-[var(--ink-soft)]">{s.description}</p>
                  <p className="mt-2 font-mono text-xs font-bold text-[var(--accent)]">
                    <span className="text-[var(--ink-mute)]">$</span> {s.price}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* 截图放大模态 */}
      {activeShot ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setActiveShot(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-h-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveShot(null)}
              className="hand-btn absolute -right-3 -top-3 z-10 h-9 w-9 p-0"
              style={{ background: 'var(--accent-alt)', color: 'var(--ink)' }}
              aria-label="关闭"
            >
              <X className="h-4 w-4" />
            </button>
            <SmartImage
              src={activeShot}
              alt="案例截图放大"
              wrapperClassName="max-h-[80vh] w-auto border-2 border-[var(--ink)] shadow-[6px_6px_0_var(--ink)]"
              className="max-h-[80vh] w-auto object-contain"
              fallbackLabel="放大查看失败"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
