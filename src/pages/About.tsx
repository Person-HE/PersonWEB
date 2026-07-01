import { Link } from 'react-router-dom';
import {
  MessageCircle,
  Music2,
  Tv,
  ArrowRight,
  ArrowLeft,
  Target,
  Heart,
  Newspaper,
  Sparkles,
} from 'lucide-react';
import { siteConfig } from '@/config/site.config';
import { useWechatModal } from '@/components/WeChatModal';
import Breadcrumb from '@/components/Breadcrumb';
import PaperBackground from '@/components/PaperBackground';
import { useElasticEnter, useStaggerReveal, useParallax } from '@/hooks/useGsap';

/** 三张二维码卡片配置 */
const QR_CARDS = [
  {
    key: 'wechat',
    title: '个人微信',
    desc: '加好友聊需求、问问题',
    icon: MessageCircle,
    url: siteConfig.wechatQrUrl,
    color: 'var(--teal)',
    rotate: -1.2,
  },
  {
    key: 'official',
    title: '微信公众号',
    desc: '订阅不定期更新与干货',
    icon: Newspaper,
    url: siteConfig.wechatOfficialQrUrl,
    color: 'var(--indigo)',
    rotate: 1,
  },
  {
    key: 'douyin',
    title: '抖音',
    desc: '扫码看视频内容',
    icon: Music2,
    url: siteConfig.douyinQrUrl,
    color: 'var(--crimson)',
    rotate: -0.8,
  },
];

/** 全平台账号 */
const SOCIAL_PLATFORMS = [
  { name: 'B站', emoji: '📺' },
  { name: '小红书', emoji: '📕' },
  { name: '快手', emoji: '🎬' },
  { name: '抖音', emoji: '🎵' },
];

export default function About() {
  const { open } = useWechatModal();

  const heroRef = useElasticEnter<HTMLDivElement>([], { y: 40, delay: 0.1 });
  const qrRef = useStaggerReveal<HTMLDivElement>('.qr-card', [], { stagger: 0.12 });
  const socialRef = useStaggerReveal<HTMLDivElement>('.social-chip', [], { stagger: 0.08, delay: 0.2 });
  const philosophyRef = useParallax<HTMLDivElement>(0.04);

  return (
    <div className="relative min-h-screen overflow-hidden pt-16">
      <PaperBackground />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: '首页', to: '/' }, { label: '关于' }]} />

        {/* ===== 个人介绍区 ===== */}
        <section ref={heroRef} className="layer-mid relative mb-12">
          <div
            className="hand-card hand-card-crimson overflow-hidden p-8 sm:p-10"
            style={{ transform: 'rotate(-0.5deg)' }}
          >
            {/* 背景墨点装饰 */}
            <div className="pointer-events-none absolute inset-0 opacity-30">
              <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-[var(--crimson)]/20 blur-2xl" />
              <div className="absolute -left-6 -bottom-6 h-32 w-32 rounded-full bg-[var(--mustard)]/30 blur-2xl" />
            </div>

            <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              {/* 头像（手绘方框） */}
              <div
                className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-2 border-[var(--ink)] bg-[var(--crimson)] shadow-[4px_4px_0_var(--ink)] sm:h-28 sm:w-28"
                style={{ transform: 'rotate(-3deg)' }}
              >
                <span className="font-hand-title text-5xl font-black text-[var(--paper-light)]">
                  {siteConfig.owner.slice(0, 1)}
                </span>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="mb-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <h1 className="ink-title font-hand-title text-3xl font-black sm:text-4xl">
                    {siteConfig.owner}
                  </h1>
                  <span className="hand-tag bg-[var(--mustard)]/30">{siteConfig.ownerTitle}</span>
                </div>
                <p className="font-hand-body text-sm leading-relaxed text-[var(--ink-soft)] sm:text-base">
                  全栈开发者，做过后端、搞过前端、玩过AI。被技术毒打过、也靠技术翻过身。
                  做这个站，是想把踩过的坑、用过的工具、攒下的资源分享出来，帮你少走弯路，把AI真正用起来。
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                  <button onClick={() => open('default')} className="hand-btn hand-btn-primary text-sm">
                    <MessageCircle className="h-4 w-4" />
                    微信聊
                  </button>
                  <Link to="/services" className="hand-btn text-sm">
                    看看服务 <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 建站理念 ===== */}
        <section ref={philosophyRef} className="mb-12">
          <div className="mb-6 text-center">
            <div className="mb-2 font-hand-title text-xs uppercase tracking-widest text-[var(--crimson)]">
              · 理念 ·
            </div>
            <h2 className="hand-underline inline-block font-hand-title text-2xl text-[var(--ink)] sm:text-3xl">
              为什么做这个站
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: Target,
                title: '把好工具整理出来',
                desc: 'AI工具太多太杂，我帮你筛掉花架子和割韭菜的，只留下真用得上的。',
                color: 'var(--indigo)',
                rotate: -1,
              },
              {
                icon: Heart,
                title: '把踩过的坑写下来',
                desc: '不卖课不卖训练营。免费资源尽管拿，觉得好用再回来聊聊。',
                color: 'var(--crimson)',
                rotate: 1.2,
              },
              {
                icon: Sparkles,
                title: '把服务交付到底',
                desc: '不玩概念不写PPT。你需要什么，我交付什么。搞不定不收费。',
                color: 'var(--teal)',
                rotate: -0.8,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="hand-card ink-spread group p-5"
                  style={{ transform: `rotate(${item.rotate}deg)` }}
                >
                  <div
                    className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[var(--ink)] shadow-[2px_2px_0_var(--ink)]"
                    style={{ background: item.color }}
                  >
                    <Icon className="h-5 w-5 text-[var(--paper-light)]" />
                  </div>
                  <h3 className="mb-2 font-hand-title text-base text-[var(--ink)]">{item.title}</h3>
                  <p className="font-hand-body text-sm leading-relaxed text-[var(--ink-soft)]">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ===== 关注我：3 张二维码 ===== */}
        <section className="mb-12">
          <div className="mb-6 text-center">
            <div className="mb-2 font-hand-title text-xs uppercase tracking-widest text-[var(--crimson)]">
              · 关注我 ·
            </div>
            <h2 className="hand-underline inline-block font-hand-title text-2xl text-[var(--ink)] sm:text-3xl">
              扫码找到我
            </h2>
            <p className="mt-3 font-hand-body text-sm text-[var(--ink-soft)]">
              三个地方都能找到我，挑你顺手的方式
            </p>
          </div>

          <div ref={qrRef} className="grid gap-5 sm:grid-cols-3">
            {QR_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.key}
                  className="qr-card hand-card ink-spread flex flex-col items-center p-6"
                  style={{ transform: `rotate(${card.rotate}deg)` }}
                >
                  <div
                    className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[var(--ink)] shadow-[2px_2px_0_var(--ink)]"
                    style={{ background: card.color }}
                  >
                    <Icon className="h-5 w-5 text-[var(--paper-light)]" />
                  </div>
                  <h3 className="mb-1 font-hand-title text-lg text-[var(--ink)]">{card.title}</h3>
                  <p className="mb-4 font-hand-body text-xs text-[var(--ink-mute)]">{card.desc}</p>

                  {/* 二维码图片 */}
                  <div className="flex h-44 w-44 items-center justify-center overflow-hidden rounded-xl border-2 border-[var(--ink)] bg-[var(--paper)] shadow-[3px_3px_0_var(--ink)]">
                    {card.url ? (
                      <img
                        src={card.url}
                        alt={`${card.title}二维码`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <span className="px-3 text-center font-hand-body text-xs text-[var(--ink-mute)]">
                        二维码待上传
                      </span>
                    )}
                  </div>

                  {/* 长按提示 */}
                  <p className="mt-3 font-hand-body text-[10px] text-[var(--ink-mute)]">
                    长按或扫码识别
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ===== 全平台账号名 ===== */}
        <section className="mb-12">
          <div
            className="hand-card hand-card-gold p-6 sm:p-8"
            style={{ transform: 'rotate(0.4deg)' }}
          >
            <div className="mb-5 flex items-center justify-center gap-2">
              <Tv className="h-5 w-5 text-[var(--ink)]" />
              <h2 className="font-hand-title text-xl text-[var(--ink)] sm:text-2xl">
                全平台同名
              </h2>
            </div>
            <p className="mb-6 text-center font-hand-body text-sm text-[var(--ink-soft)]">
              在以下平台搜索下面这个账号名，都能找到我
            </p>

            {/* 账号名突出展示 */}
            <div className="mb-6 text-center">
              <div className="mx-auto inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-[var(--ink)] bg-[var(--paper)] px-5 py-2.5 shadow-[3px_3px_0_var(--ink)]">
                <span className="font-hand-body text-xs text-[var(--ink-mute)]">账号名</span>
                <span className="font-hand-title text-xl font-black text-[var(--crimson)] sm:text-2xl">
                  {siteConfig.socialBrand}
                </span>
              </div>
            </div>

            {/* 平台 chips */}
            <div ref={socialRef} className="flex flex-wrap justify-center gap-3">
              {SOCIAL_PLATFORMS.map((p) => (
                <div
                  key={p.name}
                  className="social-chip flex items-center gap-2 rounded-xl border-2 border-[var(--ink)] bg-[var(--paper-light)] px-4 py-2 shadow-[2px_2px_0_var(--ink)] transition-all hover:-translate-y-0.5 hover:bg-[var(--mustard)]/30"
                >
                  <span className="text-base">{p.emoji}</span>
                  <span className="font-hand-title text-sm text-[var(--ink)]">{p.name}</span>
                  <span className="font-hand-body text-xs text-[var(--ink-soft)]">· {siteConfig.socialBrand}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 联系区 ===== */}
        <section
          className="hand-card hand-card-crimson p-8 text-center sm:p-10"
          style={{ transform: 'rotate(-0.6deg)' }}
        >
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-[var(--ink)] bg-[var(--crimson)] shadow-[3px_3px_0_var(--ink)]">
            <MessageCircle className="h-6 w-6 text-[var(--paper-light)]" />
          </div>
          <h2 className="mb-2 font-hand-title text-2xl text-[var(--ink)] sm:text-3xl">聊聊吧</h2>
          <p className="mb-6 font-hand-body text-sm text-[var(--ink-soft)]">
            合作 · 交流 · 技术咨询 · 什么都可以聊
          </p>
          <button onClick={() => open('default')} className="hand-btn hand-btn-primary">
            微信咨询
            <ArrowRight className="h-4 w-4" />
          </button>
        </section>

        {/* 返回首页 */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1 font-hand-body text-sm text-[var(--ink-mute)] transition-colors hover:text-[var(--crimson)]"
          >
            <ArrowLeft className="h-4 w-4" /> 回到首页
          </Link>
        </div>
      </div>
    </div>
  );
}
