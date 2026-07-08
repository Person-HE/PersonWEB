import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Wrench,
  Wand2,
  Puzzle,
  Crown,
  Building2,
  Package,
  Workflow,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  ExternalLink,
  type LucideIcon,
} from 'lucide-react';
import { useDataStore } from '@/store/useDataStore';
import { useWechatModal } from '@/components/WeChatModal';
import Breadcrumb from '@/components/Breadcrumb';
import EmptyState from '@/components/EmptyState';
import PaperBackground from '@/components/PaperBackground';
import { SERVICE_TYPES } from '@/constants';
import { useElasticEnter, useStaggerReveal } from '@/hooks/useGsap';
import type { ServiceType } from '@/types';

const iconMap: Record<ServiceType, LucideIcon> = {
  'tool-config': Wrench,
  'ai-output': Wand2,
  custom: Puzzle,
  'product-pro': Crown,
  product: Package,
  automation: Workflow,
  skills: Sparkles,
  enterprise: Building2,
};

export default function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const { services, loading, loaded, loadAll } = useDataStore();
  const { open } = useWechatModal();

  const heroRef = useElasticEnter<HTMLDivElement>([], { y: 30, delay: 0.05 });
  const relatedRef = useStaggerReveal<HTMLDivElement>('.rel-svc', [], { stagger: 0.08 });

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const service = useMemo(() => services.find((s) => s.id === id), [services, id]);
  const related = useMemo(() => {
    if (!service) return [];
    return services.filter((s) => s.id !== service.id && s.type === service.type).slice(0, 3);
  }, [services, service]);

  if (loading && !loaded) {
    return (
      <div className="relative min-h-screen overflow-hidden pt-16">
        <PaperBackground />
        <div className="relative z-10 mx-auto max-w-4xl px-4 py-20 text-center font-hand-body text-sm text-[var(--ink-mute)]">
          加载中...
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
  const cardCls = isEnterprise ? 'hand-card hand-card-gold' : 'hand-card';
  const accentColor = isEnterprise ? 'var(--mustard)' : 'var(--crimson)';

  return (
    <div className="relative min-h-screen overflow-hidden pt-16">
      <PaperBackground />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: '首页', to: '/' },
            { label: '服务中心', to: '/services' },
            { label: service.name },
          ]}
        />

        {/* 头部 */}
        <section ref={heroRef}>
          <div
            className={`${cardCls} mb-6 p-6`}
            style={{ transform: 'rotate(-0.4deg)' }}
          >
            <div className="flex items-start gap-4">
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-[var(--ink)] shadow-[3px_3px_0_var(--ink)]"
                style={{ background: accentColor, transform: 'rotate(-3deg)' }}
              >
                <Icon className={`h-7 w-7 ${isEnterprise ? 'text-[var(--ink)]' : 'text-[var(--paper-light)]'}`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-hand-title text-2xl text-[var(--ink)] sm:text-3xl">{service.name}</h1>
                  {meta ? (
                    <span className="hand-tag text-xs">{meta.name}</span>
                  ) : null}
                </div>
                <p className="mt-2 font-hand-title text-lg font-bold text-[var(--crimson)]">
                  {service.priceRange || service.price}
                </p>
                <p className="mt-2 font-hand-body text-sm text-[var(--ink-soft)]">{service.description}</p>
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
        </section>

        {/* 详情 */}
        <div
          className="hand-card mb-6 p-6"
          style={{ transform: 'rotate(0.3deg)' }}
        >
          <h2 className="mb-3 font-hand-title text-base text-[var(--ink)]">
            <span className="hand-underline inline-block">服务详情</span>
          </h2>
          <p className="font-hand-body text-sm leading-relaxed text-[var(--ink-soft)]">{service.details}</p>
        </div>

        {/* 交付信息 */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div
            className="hand-card p-5"
            style={{ transform: 'rotate(-0.5deg)' }}
          >
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-[var(--ink)] bg-[var(--indigo)] shadow-[1px_1px_0_var(--ink)]">
                <Package className="h-3.5 w-3.5 text-[var(--paper-light)]" />
              </div>
              <h3 className="font-hand-title text-sm text-[var(--ink)]">交付信息</h3>
            </div>
            <dl className="space-y-2 font-hand-body text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-[var(--ink-mute)]">交付方式</dt>
                <dd className="text-right text-[var(--ink)]">{service.delivery.method}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-[var(--ink-mute)]">交付时间</dt>
                <dd className="text-right text-[var(--ink)]">{service.delivery.time}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-[var(--ink-mute)]">免费修改</dt>
                <dd className="text-right text-[var(--ink)]">
                  {service.delivery.revisions > 0 ? `${service.delivery.revisions} 次` : '—'}
                </dd>
              </div>
            </dl>
          </div>

          <div
            className="hand-card p-5"
            style={{ transform: 'rotate(0.5deg)' }}
          >
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-[var(--ink)] bg-[var(--teal)] shadow-[1px_1px_0_var(--ink)]">
                <Check className="h-3.5 w-3.5 text-[var(--paper-light)]" />
              </div>
              <h3 className="font-hand-title text-sm text-[var(--ink)]">保障与下单</h3>
            </div>
            <dl className="space-y-2 font-hand-body text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-[var(--ink-mute)]">保障承诺</dt>
                <dd className="text-right text-[var(--ink)]">{service.guarantee || '—'}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-[var(--ink-mute)]">下单方式</dt>
                <dd className="text-right text-[var(--ink)]">{service.orderMethod}</dd>
              </div>
              {service.maintenancePeriod ? (
                <div className="flex justify-between gap-2">
                  <dt className="text-[var(--ink-mute)]">维护期</dt>
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
                className="hand-card p-5"
                style={{ transform: 'rotate(-0.3deg)' }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-[var(--ink)] bg-[var(--indigo)] shadow-[1px_1px_0_var(--ink)]">
                    <Clock className="h-3.5 w-3.5 text-[var(--paper-light)]" />
                  </div>
                  <h3 className="font-hand-title text-sm text-[var(--ink)]">适用场景</h3>
                </div>
                <p className="font-hand-body text-sm leading-relaxed text-[var(--ink-soft)]">{service.applicableScene}</p>
              </div>
            ) : null}
            {service.expectedEffect ? (
              <div
                className="hand-card p-5"
                style={{ transform: 'rotate(0.3deg)' }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-[var(--ink)] bg-[var(--mustard)] shadow-[1px_1px_0_var(--ink)]">
                    <ArrowRight className="h-3.5 w-3.5 text-[var(--ink)]" />
                  </div>
                  <h3 className="font-hand-title text-sm text-[var(--ink)]">预期效果</h3>
                </div>
                <p className="font-hand-body text-sm leading-relaxed text-[var(--ink-soft)]">{service.expectedEffect}</p>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* CTA */}
        <div
          className={`${cardCls} p-6 text-center`}
          style={{ transform: 'rotate(0.4deg)' }}
        >
          <h3 className="mb-2 font-hand-title text-lg text-[var(--ink)] sm:text-xl">感兴趣？聊聊吧</h3>
          <p className="mb-4 font-hand-body text-sm text-[var(--ink-soft)]">免费咨询，不收费，搞不定不收费。</p>
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
            <h2 className="mb-4 font-hand-title text-base text-[var(--ink)]">
              <span className="hand-underline inline-block">相关服务</span>
            </h2>
            <div ref={relatedRef} className="grid gap-3 sm:grid-cols-3">
              {related.map((s, i) => (
                <Link
                  key={s.id}
                  to={`/services/${s.id}`}
                  className={`rel-svc hand-card ink-spread block p-4`}
                  style={{ transform: `rotate(${(i % 2 ? 1 : -1) * 0.5}deg)` }}
                >
                  <h3 className="line-clamp-1 font-hand-title text-sm text-[var(--ink)]">{s.name}</h3>
                  <p className="mt-1 line-clamp-2 font-hand-body text-xs text-[var(--ink-soft)]">{s.description}</p>
                  <p className="mt-2 font-hand-title text-xs font-bold text-[var(--crimson)]">{s.price}</p>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
