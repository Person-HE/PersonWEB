import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Wrench,
  Wand2,
  Puzzle,
  Crown,
  Building2,
  Package,
  Workflow,
  Sparkles,
  ArrowRight,
  MessageCircle,
  type LucideIcon,
} from 'lucide-react';
import { useDataStore } from '@/store/useDataStore';
import { useWechatModal } from '@/components/WeChatModal';
import EmptyState from '@/components/EmptyState';
import { PageHeader } from '@/components/SectionTitle';
import { SERVICE_TYPES } from '@/constants';
import { useStaggerReveal } from '@/hooks/useGsap';
import type { Service, ServiceType } from '@/types';

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

/** 仅展示 4 大类服务（企业服务摘出，单独在 /enterprise 路由） */
const FOUR_SERVICE_TYPES = SERVICE_TYPES.filter((s) => s.id !== 'enterprise');

export default function Services() {
  const { services, loading, loaded, loadAll } = useDataStore();
  const { open } = useWechatModal();
  const cardsRef = useStaggerReveal<HTMLDivElement>('.svc-card', [services.length], { stagger: 0.08 });

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const grouped = useMemo(() => {
    const map: Record<ServiceType, Service[]> = {
      'tool-config': [],
      'ai-output': [],
      custom: [],
      'product-pro': [],
      product: [],
      automation: [],
      skills: [],
      enterprise: [],
    };
    services.forEach((s) => {
      if (map[s.type]) map[s.type].push(s);
    });
    return map;
  }, [services]);

  return (
    <div className="min-h-screen pt-16">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <PageHeader
          title="服务中心"
          description="不卖课，不卖训练营。你提需求，我交付结果。"
        >
          <div className="hand-box bg-[var(--paper-light)] p-4 font-hand-body text-sm leading-relaxed text-[var(--ink-soft)]">
            <p className="mb-1">
              <span className="font-hand-title text-[var(--crimson)]">服务理念：</span>
              不卖概念、不写PPT，只做能落地、能看到效果的事。
            </p>
            <p>
              <span className="font-hand-title text-[var(--crimson)]">交付原则：</span>
              搞不定不收费，验收不通过不收尾款。先免费咨询，满意再合作。
            </p>
          </div>
        </PageHeader>

        {/* 4大类服务卡片网格 */}
        <div ref={cardsRef} className="grid gap-6 sm:grid-cols-2">
          {FOUR_SERVICE_TYPES.map((meta, idx) => {
            const Icon = iconMap[meta.id] ?? Wrench;
            const list = grouped[meta.id] ?? [];
            const tilt = idx % 2 === 0 ? '-0.6deg' : '0.6deg';

            return (
              <section
                key={meta.id}
                className="svc-card hand-card flex h-full flex-col p-6"
                style={{ transform: `rotate(${tilt})` }}
              >
                {/* 头部 */}
                <div className="mb-4 flex items-start gap-3 border-b-2 border-dashed border-[var(--ink)]/30 pb-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-[var(--ink)] bg-[var(--crimson)] shadow-[2px_2px_0_var(--ink)]">
                    <Icon className="h-6 w-6 text-[var(--paper-light)]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-hand-title text-lg text-[var(--ink)]">{meta.name}</h2>
                    <span className="mt-1 inline-block rounded-md border-2 border-[var(--ink)] bg-[var(--mustard)] px-2 py-0.5 font-hand-title text-xs font-bold text-[var(--ink)]">
                      {meta.priceRange}
                    </span>
                  </div>
                </div>

                <p className="mb-4 font-hand-body text-sm leading-relaxed text-[var(--ink-soft)]">
                  {meta.description}
                </p>

                {/* 具体服务列表 */}
                <div className="mb-4 flex-1 space-y-3">
                  {loading && !loaded ? (
                    <div className="rounded-lg border-2 border-dashed border-[var(--ink)]/40 py-8 text-center font-hand-body text-sm text-[var(--ink-mute)]">
                      加载中...
                    </div>
                  ) : list.length === 0 ? (
                    <div className="rounded-lg border-2 border-dashed border-[var(--ink)]/40 px-4 py-6 text-center">
                      <p className="font-hand-body text-sm text-[var(--ink-mute)]">具体服务项即将上线</p>
                      <button
                        onClick={() => open(meta.id)}
                        className="mt-2 inline-flex items-center gap-1 font-hand-body text-xs text-[var(--crimson)] hover:underline"
                      >
                        微信咨询 <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    list.map((s) => (
                      <div
                        key={s.id}
                        className="rounded-lg border-2 border-[var(--ink)] bg-[var(--paper)] p-3 transition-all hover:bg-[var(--paper-deep)] hover:shadow-[2px_2px_0_var(--ink)]"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-hand-title text-sm text-[var(--ink)]">{s.name}</h3>
                              <span className="rounded border-2 border-[var(--ink)] bg-[var(--crimson)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--paper-light)]">
                                {s.price}
                              </span>
                            </div>
                            <p className="mt-1 line-clamp-2 font-hand-body text-xs text-[var(--ink-soft)]">
                              {s.description}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 font-hand-body text-[10px] text-[var(--ink-mute)]">
                              <span>交付：{s.delivery.method}</span>
                              <span>周期：{s.delivery.time}</span>
                              {s.guarantee ? <span>保障：{s.guarantee}</span> : null}
                            </div>
                          </div>
                          <div className="flex shrink-0 flex-col gap-1">
                            <Link
                              to={`/services/${s.id}`}
                              className="rounded border-2 border-[var(--ink)] bg-[var(--paper-light)] px-2 py-1 text-center font-hand-body text-[10px] text-[var(--ink)] transition-all hover:bg-[var(--mustard)]"
                            >
                              详情
                            </Link>
                            <button
                              onClick={() => open(meta.id)}
                              className="rounded border-2 border-[var(--ink)] bg-[var(--crimson)] px-2 py-1 text-center font-hand-body text-[10px] text-[var(--paper-light)] transition-all hover:bg-[var(--ink)]"
                            >
                              下单
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* 底部 CTA */}
                <button
                  onClick={() => open(meta.id)}
                  className="hand-btn hand-btn-primary mt-auto w-full text-sm"
                >
                  <MessageCircle className="h-4 w-4" />
                  微信下单 / 咨询
                </button>
              </section>
            );
          })}
        </div>

        {/* 企业服务单独引导卡片 */}
        <div className="mt-10">
          <Link
            to="/enterprise"
            className="hand-card hand-card-gold group flex flex-col items-center justify-between gap-4 p-6 sm:flex-row"
            style={{ transform: 'rotate(0.5deg)' }}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[var(--ink)] bg-[var(--mustard)] shadow-[3px_3px_0_var(--ink)]">
                <Building2 className="h-7 w-7 text-[var(--ink)]" />
              </div>
              <div>
                <h3 className="font-hand-title text-lg text-[var(--ink)]">企业AI落地服务</h3>
                <p className="mt-1 font-hand-body text-sm text-[var(--ink-soft)]">
                  不卖概念不写PPT，帮企业把AI装到每个工位上
                </p>
                <p className="mt-1 font-hand-title text-sm font-bold" style={{ color: '#B8791B' }}>
                  3,000 - 20,000 元/项目
                </p>
              </div>
            </div>
            <span className="hand-btn hand-btn-gold shrink-0 text-sm">
              查看详细方案 <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>

        {/* 底部统一 CTA */}
        <div className="mt-10 hand-card hand-card-crimson p-8 text-center sm:p-12" style={{ transform: 'rotate(-0.5deg)' }}>
          <h3 className="mb-2 font-hand-title text-xl text-[var(--ink)] sm:text-2xl">不确定需要什么？</h3>
          <p className="mb-6 font-hand-body text-sm text-[var(--ink-soft)]">加微信聊聊，免费咨询不收费。</p>
          <button onClick={() => open('default')} className="hand-btn">
            微信咨询
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
