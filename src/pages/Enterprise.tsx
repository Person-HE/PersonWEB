import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Wrench,
  MessageCircle,
} from 'lucide-react';
import { useDataStore } from '@/store/useDataStore';
import { useWechatModal } from '@/components/WeChatModal';
import Breadcrumb from '@/components/Breadcrumb';
import EmptyState from '@/components/EmptyState';
import PaperBackground from '@/components/PaperBackground';
import { ENTERPRISE_PAINS, ENTERPRISE_PROCESS, ENTERPRISE_ADVANTAGES, ENTERPRISE_FAQS } from '@/constants';
import { siteConfig } from '@/config/site.config';
import { useElasticEnter, useStaggerReveal } from '@/hooks/useGsap';

export default function Enterprise() {
  const { services, loading, loaded, loadAll } = useDataStore();
  const { open } = useWechatModal();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const enterpriseServices = useMemo(() => {
    return services.filter((s) => s.type === 'enterprise');
  }, [services]);

  const heroRef = useElasticEnter<HTMLDivElement>([], { y: 40, delay: 0.1 });
  const painRef = useStaggerReveal<HTMLDivElement>('.pain-card', [], { stagger: 0.08 });
  const serviceRef = useStaggerReveal<HTMLDivElement>('.ent-service-card', [enterpriseServices.length], { stagger: 0.1 });
  const stepRef = useStaggerReveal<HTMLDivElement>('.step-card', [], { stagger: 0.1 });
  const advRef = useStaggerReveal<HTMLDivElement>('.adv-card', [], { stagger: 0.08 });

  return (
    <div className="relative min-h-screen overflow-hidden pt-16">
      <PaperBackground />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: '首页', to: '/' },
            { label: '服务中心', to: '/services' },
            { label: '企业服务' },
          ]}
        />

        {/* ===== Hero ===== */}
        <section ref={heroRef} className="layer-mid relative mb-16">
          <div
            className="hand-card hand-card-gold relative overflow-hidden p-8 sm:p-12"
            style={{ transform: 'rotate(-0.4deg)' }}
          >
            {/* 背景墨点 */}
            <div className="pointer-events-none absolute inset-0 opacity-40">
              <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-[var(--mustard)]/30 blur-3xl" />
              <div className="absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-[var(--crimson)]/20 blur-3xl" />
            </div>

            <div className="relative text-center">
              <div
                className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-[var(--ink)] bg-[var(--mustard)] shadow-[4px_4px_0_var(--ink)]"
                style={{ transform: 'rotate(-4deg)' }}
              >
                <Building2 className="h-8 w-8 text-[var(--ink)]" />
              </div>
              <h1 className="ink-title mb-3 font-hand-title text-3xl font-black sm:text-5xl">
                企业AI落地服务
              </h1>
              <p className="mb-8 mx-auto max-w-2xl font-hand-body text-base text-[var(--ink-soft)] sm:text-lg">
                不卖概念，不写PPT。帮你把AI装到每个工位上。
              </p>
              <button
                onClick={() => open('enterprise')}
                className="hand-btn hand-btn-gold text-sm sm:text-base"
              >
                预约免费咨询
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        {/* ===== 痛点区 ===== */}
        <section ref={painRef} className="mb-16">
          <div className="mb-8 text-center">
            <div className="mb-2 font-hand-title text-xs uppercase tracking-widest text-[var(--crimson)]">
              · 痛点 ·
            </div>
            <h2 className="hand-underline inline-block font-hand-title text-2xl text-[var(--ink)] sm:text-3xl">
              你是不是也遇到了这些问题？
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {ENTERPRISE_PAINS.map((p, i) => (
              <div
                key={p.title}
                className="pain-card hand-card ink-spread flex items-start gap-3 p-5"
                style={{ transform: `rotate(${(i % 2 ? 1 : -1) * 0.6}deg)` }}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-[var(--ink)] bg-[var(--mustard)] shadow-[2px_2px_0_var(--ink)]">
                  <AlertCircle className="h-4 w-4 text-[var(--ink)]" />
                </div>
                <div>
                  <h3 className="mb-1 font-hand-title text-base text-[var(--ink)]">{p.title}</h3>
                  <p className="font-hand-body text-sm leading-relaxed text-[var(--ink-soft)]">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== 服务详情 ===== */}
        <section className="mb-16">
          <div className="mb-8 text-center">
            <div className="mb-2 font-hand-title text-xs uppercase tracking-widest text-[var(--crimson)]">
              · 服务 ·
            </div>
            <h2 className="hand-underline inline-block font-hand-title text-2xl text-[var(--ink)] sm:text-3xl">
              我能帮你做什么
            </h2>
          </div>

          {loading && !loaded ? (
            <div className="hand-empty">加载中...</div>
          ) : enterpriseServices.length === 0 ? (
            <EmptyState
              icon={<Wrench className="h-7 w-7" />}
              title="企业服务方案整理中"
              description="具体服务方案正在梳理，欢迎加微信免费咨询，根据你的业务场景定制方案。"
              action={
                <button onClick={() => open('enterprise')} className="hand-btn hand-btn-gold text-sm">
                  微信咨询 <ArrowRight className="h-4 w-4" />
                </button>
              }
            />
          ) : (
            <div ref={serviceRef} className="grid gap-4 sm:grid-cols-2">
              {enterpriseServices.map((s, i) => (
                <div
                  key={s.id}
                  className="ent-service-card hand-card hand-card-gold ink-spread group p-6"
                  style={{ transform: `rotate(${(i % 2 ? -1 : 1) * 0.5}deg)` }}
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <h3 className="font-hand-title text-lg text-[var(--ink)]">{s.name}</h3>
                    <span className="shrink-0 rounded-md border-2 border-[var(--ink)] bg-[var(--mustard)] px-2 py-0.5 font-hand-title text-xs font-bold text-[var(--ink)] shadow-[1px_1px_0_var(--ink)]">
                      {s.priceRange}
                    </span>
                  </div>
                  <p className="mb-3 font-hand-body text-sm leading-relaxed text-[var(--ink-soft)]">{s.details}</p>

                  {s.expectedEffect ? (
                    <div className="mb-3 rounded-lg border-2 border-dashed border-[var(--teal)] bg-[var(--teal)]/10 px-3 py-2">
                      <div className="mb-0.5 flex items-center gap-1 font-hand-title text-xs text-[var(--teal)]">
                        <CheckCircle2 className="h-3.5 w-3.5" /> 预期效果
                      </div>
                      <p className="font-hand-body text-xs text-[var(--ink-soft)]">{s.expectedEffect}</p>
                    </div>
                  ) : null}

                  <div className="mb-4 flex flex-wrap gap-x-4 gap-y-1 font-hand-body text-xs text-[var(--ink-mute)]">
                    <span>周期：{s.delivery.time}</span>
                    {s.maintenancePeriod ? <span>免费维护：{s.maintenancePeriod}</span> : null}
                  </div>
                  <Link
                    to={`/services/${s.id}`}
                    className="hand-btn inline-flex text-sm"
                  >
                    了解详情 <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ===== 合作流程 ===== */}
        <section className="mb-16">
          <div className="mb-8 text-center">
            <div className="mb-2 font-hand-title text-xs uppercase tracking-widest text-[var(--crimson)]">
              · 流程 ·
            </div>
            <h2 className="hand-underline inline-block font-hand-title text-2xl text-[var(--ink)] sm:text-3xl">
              合作流程
            </h2>
          </div>
          <div ref={stepRef} className="grid gap-4 sm:grid-cols-5">
            {ENTERPRISE_PROCESS.map((step, i) => (
              <div key={step.step} className="step-card relative">
                <div
                  className="hand-card p-5 text-center"
                  style={{ transform: `rotate(${(i % 2 ? 1 : -1) * 0.8}deg)` }}
                >
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--ink)] bg-[var(--mustard)] font-hand-title text-sm font-black text-[var(--ink)] shadow-[2px_2px_0_var(--ink)]">
                    {step.step}
                  </div>
                  <h3 className="mb-1.5 font-hand-title text-sm text-[var(--ink)]">{step.name}</h3>
                  <p className="font-hand-body text-xs leading-relaxed text-[var(--ink-mute)]">{step.desc}</p>
                </div>
                {i < ENTERPRISE_PROCESS.length - 1 ? (
                  <ArrowRight className="absolute -right-2 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-[var(--ink-mute)] sm:block" />
                ) : null}
              </div>
            ))}
          </div>
        </section>

        {/* ===== 为什么选择我 ===== */}
        <section className="mb-16">
          <div className="mb-8 text-center">
            <div className="mb-2 font-hand-title text-xs uppercase tracking-widest text-[var(--crimson)]">
              · 优势 ·
            </div>
            <h2 className="hand-underline inline-block font-hand-title text-2xl text-[var(--ink)] sm:text-3xl">
              为什么选择我
            </h2>
          </div>
          <div ref={advRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ENTERPRISE_ADVANTAGES.map((a, i) => (
              <div
                key={a.title}
                className="adv-card hand-card ink-spread p-5 text-center"
                style={{ transform: `rotate(${(i % 2 ? 1 : -1) * 0.7}deg)` }}
              >
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[var(--ink)] bg-[var(--teal)] shadow-[2px_2px_0_var(--ink)]">
                  <CheckCircle2 className="h-5 w-5 text-[var(--paper-light)]" />
                </div>
                <h3 className="mb-1.5 font-hand-title text-base text-[var(--ink)]">{a.title}</h3>
                <p className="font-hand-body text-xs leading-relaxed text-[var(--ink-soft)]">{a.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section className="mb-16">
          <div className="mb-8 text-center">
            <div className="mb-2 font-hand-title text-xs uppercase tracking-widest text-[var(--crimson)]">
              · FAQ ·
            </div>
            <h2 className="hand-underline inline-block font-hand-title text-2xl text-[var(--ink)] sm:text-3xl">
              常见问题
            </h2>
          </div>
          <div className="mx-auto max-w-3xl space-y-2.5">
            {ENTERPRISE_FAQS.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className="hand-card overflow-hidden"
                  style={{ transform: `rotate(${(i % 2 ? 0.4 : -0.4) * 1}deg)` }}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-[var(--mustard)]/10"
                  >
                    <span className="font-hand-title text-sm text-[var(--ink)] sm:text-base">{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-[var(--ink-mute)] transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen ? (
                    <div className="border-t-2 border-dashed border-[var(--ink)]/30 px-5 py-4 font-hand-body text-sm leading-relaxed text-[var(--ink-soft)]">
                      {faq.a}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>

        {/* ===== 联系区 ===== */}
        <section
          className="hand-card hand-card-gold p-8 text-center sm:p-12"
          style={{ transform: 'rotate(0.5deg)' }}
        >
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[var(--ink)] bg-[var(--mustard)] shadow-[3px_3px_0_var(--ink)]">
            <MessageCircle className="h-7 w-7 text-[var(--ink)]" />
          </div>
          <h2 className="mb-2 font-hand-title text-2xl text-[var(--ink)] sm:text-3xl">开始聊聊</h2>
          <p className="mb-6 font-hand-body text-sm text-[var(--ink-soft)]">
            添加时请备注"企业咨询+公司名"，方便我提前了解您的需求
          </p>

          <div className="mx-auto mb-4 inline-block rounded-xl border-2 border-[var(--ink)] bg-[var(--paper)] p-3 shadow-[3px_3px_0_var(--ink)]">
            <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-lg bg-[var(--paper-light)]">
              {siteConfig.wechatQrUrl ? (
                <img
                  src={siteConfig.wechatQrUrl}
                  alt="微信二维码"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="px-3 text-center">
                  <MessageCircle className="mx-auto mb-2 h-8 w-8 text-[var(--ink-mute)]" />
                  <p className="font-hand-body text-xs text-[var(--ink-mute)]">二维码待上传</p>
                </div>
              )}
            </div>
          </div>

          {siteConfig.wechatId ? (
            <p className="mb-6 font-hand-body text-sm text-[var(--ink-soft)]">
              微信号：
              <span className="font-hand-title font-bold text-[var(--ink)]">{siteConfig.wechatId}</span>
            </p>
          ) : (
            <p className="mb-6 font-hand-body text-xs text-[var(--ink-mute)]">微信号待填写（请在 site.config.ts 中配置）</p>
          )}

          <button onClick={() => open('enterprise')} className="hand-btn hand-btn-gold">
            预约免费咨询
            <ArrowRight className="h-4 w-4" />
          </button>
        </section>

        {/* 底部返回链接 */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 font-hand-body text-sm">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-[var(--ink-mute)] transition-colors hover:text-[var(--crimson)]"
          >
            <ArrowLeft className="h-4 w-4" /> 回到首页
          </Link>
          <span className="text-[var(--ink-mute)]">·</span>
          <Link
            to="/services"
            className="inline-flex items-center gap-1 text-[var(--ink-mute)] transition-colors hover:text-[var(--crimson)]"
          >
            <ArrowLeft className="h-4 w-4" /> 返回服务中心
          </Link>
        </div>
      </div>
    </div>
  );
}
