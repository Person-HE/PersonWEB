/**
 * 关于页 —— 个人画像的完整展示（单一数据源：profile 集合，后台可编辑）
 *
 * 叙事结构：我是谁 → 走过的路（时间线）→ 会什么（每条挂证据）→
 * 精力怎么分配（45/35/15/5）→ 在哪找到我（三链身份 + 二维码）。
 */
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageCircle,
  Music2,
  Tv,
  ArrowRight,
  ArrowLeft,
  Github,
  Rss,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { siteConfig } from '@/config/site.config';
import { useDataStore } from '@/store/useDataStore';
import { useWechatModal } from '@/components/WeChatModal';
import Breadcrumb from '@/components/Breadcrumb';
import PaperBackground from '@/components/PaperBackground';
import Seo, { personJsonLd } from '@/components/Seo';
import FormattedText from '@/components/FormattedText';
import EmptyState from '@/components/EmptyState';
import { SmartImage } from '@/components/SmartMedia';
import { useElasticEnter, useStaggerReveal, useScrollReveal } from '@/hooks/useGsap';

const QR_CARDS = [
  {
    key: 'wechat',
    title: '个人微信',
    desc: '加好友聊需求、问问题',
    icon: MessageCircle,
    url: siteConfig.wechatQrUrl,
    color: 'var(--accent-cyan)',
    rotate: -1.2,
  },
  {
    key: 'official',
    title: '微信公众号',
    desc: '订阅不定期更新与干货',
    icon: Tv,
    url: siteConfig.wechatOfficialQrUrl,
    color: 'var(--accent)',
    rotate: 1,
  },
  {
    key: 'douyin',
    title: '抖音',
    desc: '扫码看视频内容',
    icon: Music2,
    url: siteConfig.douyinQrUrl,
    color: 'var(--accent-alt)',
    rotate: -0.8,
  },
];

const SOCIAL_PLATFORMS = ['B站', '小红书', '快手', '抖音'];

export default function About() {
  const { profile, loading, loaded, loadAll } = useDataStore();
  const { open } = useWechatModal();

  const heroRef = useElasticEnter<HTMLDivElement>([!!profile], { y: 40, delay: 0.1 });
  const tlRef = useScrollReveal<HTMLDivElement>('.tl-item', [profile?.timeline.length ?? 0], { stagger: 0.1, y: 40 });
  const capRef = useStaggerReveal<HTMLDivElement>('.cap-item', [profile?.capabilities.length ?? 0], { stagger: 0.08 });
  const qrRef = useStaggerReveal<HTMLDivElement>('.qr-card', [], { stagger: 0.12 });

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  if (loading && !loaded) {
    return (
      <div className="relative min-h-screen pt-16">
        <PaperBackground />
        <div className="relative z-10 mx-auto max-w-5xl px-4 py-24 font-mono text-sm text-[var(--ink-mute)]">
          <span className="text-[var(--accent)]">{'>'}</span> <span className="terminal-cursor">loading…</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="relative min-h-screen overflow-hidden pt-16">
        <PaperBackground />
        <div className="relative z-10 mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8">
          <EmptyState
            title="画像尚未录入"
            description="关于页的全部内容来自后台「个人画像」。登录后在 管理后台 → 个人画像 中编辑，本页即生效。"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden pt-16">
      <PaperBackground />
      <Seo
        title={`关于${profile.nickname}`}
        description={`${profile.identity}。${profile.focus}`}
        path="/about"
        jsonLd={[personJsonLd()]}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: '首页', to: '/' }, { label: '关于' }]} />

        {/* ===== 我是谁 ===== */}
        <section ref={heroRef} className="layer-mid relative mb-12">
          <div
            className="hand-card hand-card-alt rgb-shift overflow-hidden p-8 sm:p-10"
            style={{ transform: 'rotate(-0.5deg)' }}
          >
            <div className="pointer-events-none absolute inset-0 opacity-30">
              <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-[var(--accent-alt)]/20 blur-2xl" />
              <div className="absolute -left-6 -bottom-6 h-32 w-32 rounded-full bg-[var(--accent)]/20 blur-2xl" />
            </div>

            <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <div
                className="h-24 w-24 shrink-0 overflow-hidden border-2 border-[var(--ink)] bg-[var(--accent-alt)] shadow-[4px_4px_0_var(--ink)] sm:h-28 sm:w-28"
                style={{ transform: 'rotate(-3deg)' }}
              >
                {profile.avatarUrl ? (
                  <SmartImage src={profile.avatarUrl} alt={profile.nickname} wrapperClassName="h-full w-full" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="font-display text-5xl font-black text-[var(--ink)]">
                      {profile.nickname.slice(0, 1)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="mb-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <h1
                    className="font-display text-3xl font-black text-[var(--ink)] sm:text-4xl glitch-text"
                    data-text={profile.nickname}
                  >
                    {profile.nickname}
                    {profile.realName ? (
                      <span className="ml-2 font-mono text-sm font-normal text-[var(--ink-mute)]">/ {profile.realName}</span>
                    ) : null}
                  </h1>
                  <span className="hand-tag bg-[var(--accent)]/20">{profile.identity}</span>
                </div>
                <p className="mb-2 flex items-center justify-center gap-1 font-mono text-xs text-[var(--ink-mute)] sm:justify-start">
                  <MapPin className="h-3.5 w-3.5" /> {profile.location} · 品牌 {profile.brand}
                </p>
                <div className="font-mono text-sm leading-relaxed text-[var(--ink-soft)] sm:text-base">
                  <FormattedText text={profile.story} />
                </div>
                <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                  <button onClick={() => open('default')} className="hand-btn hand-btn-primary text-sm">
                    <MessageCircle className="h-4 w-4" />
                    微信聊
                  </button>
                  <Link to="/portfolio" className="hand-btn text-sm">
                    看作品 <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link to="/services" className="hand-btn text-sm">
                    看服务 <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 时间线 ===== */}
        {profile.timeline.length > 0 ? (
          <section className="mb-12">
            <h2 className="mb-6 font-display text-2xl text-[var(--ink)] sm:text-3xl glitch-text inline-block" data-text="走过的路">
              走过的路
            </h2>
            <div ref={tlRef} className="relative space-y-0 border-l-2 border-dashed border-[var(--ink-mute)] pl-6">
              {profile.timeline.map((t, i) => (
                <div key={i} className="tl-item relative pb-8">
                  <span className="absolute -left-[31px] top-1 h-2.5 w-2.5 border-2 border-[var(--ink)] bg-[var(--accent)]" />
                  <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--accent-cyan)]">{t.date}</div>
                  <h3 className="font-display text-xl font-bold text-[var(--ink)]">{t.title}</h3>
                  <p className="mt-1 max-w-2xl font-mono text-xs leading-relaxed text-[var(--ink-soft)]">{t.desc}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* ===== 能力 × 证据 ===== */}
        {profile.capabilities.length > 0 ? (
          <section className="mb-12">
            <h2 className="mb-2 font-display text-2xl text-[var(--ink)] sm:text-3xl glitch-text" data-text="能力清单">
              能力清单
            </h2>
            <p className="mb-6 font-mono text-xs text-[var(--ink-mute)]">
              {'//'} 每条「我会」后面都挂着可点开的证据，没有证据的不写。
            </p>
            <div ref={capRef} className="grid gap-4 sm:grid-cols-2">
              {profile.capabilities.map((c) => (
                <div key={c.title} className="cap-item hand-card rgb-shift flex flex-col p-5">
                  <h3 className="font-display text-lg font-bold text-[var(--ink)]">
                    <span className="text-[var(--accent)]">{'>'}</span> {c.title}
                  </h3>
                  <p className="mt-1 flex-1 font-mono text-xs leading-relaxed text-[var(--ink-soft)]">{c.desc}</p>
                  {c.evidenceUrl ? (
                    <Link
                      to={c.evidenceUrl.startsWith('/') ? c.evidenceUrl : '/portfolio'}
                      className="mt-3 inline-flex items-center gap-1 border border-[var(--accent-cyan)] px-2 py-1 font-mono text-[10px] text-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)] hover:text-[var(--bg)]"
                    >
                      <ShieldCheck className="h-3 w-3" /> {c.evidenceLabel}
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* ===== 精力分配模型 ===== */}
        {profile.effortModel.length > 0 ? (
          <section className="mb-12">
            <h2 className="mb-2 font-display text-2xl text-[var(--ink)] sm:text-3xl glitch-text" data-text="我的 45/35/15/5">
              {profile.effortModel.map((e) => e.percent).join('/')} —— 精力花在哪
            </h2>
            <p className="mb-6 font-mono text-xs text-[var(--ink-mute)]">
              {'//'} 一个人精力有限，这份比例决定了你找我做什么最合适。
            </p>
            <div className="space-y-3">
              {profile.effortModel.map((e, i) => (
                <div key={i} className="hand-card flex items-center gap-4 p-4">
                  <span className="w-14 shrink-0 font-display text-2xl font-black text-[var(--accent)]">{e.percent}%</span>
                  <div className="h-3 flex-1 overflow-hidden border-2 border-[var(--ink)] bg-[var(--bg)]">
                    <div
                      className={`h-full ${i === 0 ? 'bg-[var(--accent)]' : i === 1 ? 'bg-[var(--accent-cyan)]' : i === 2 ? 'bg-[var(--accent-alt)]' : 'bg-[var(--ink-mute)]'}`}
                      style={{ width: `${e.percent}%` }}
                    />
                  </div>
                  <div className="w-full shrink-0 sm:w-64">
                    <div className="font-mono text-xs font-bold text-[var(--ink)]">{e.layer}</div>
                    <div className="font-mono text-[10px] text-[var(--ink-soft)]">{e.focus}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* ===== 价值观 ===== */}
        {profile.values.length > 0 ? (
          <section className="mb-12">
            <div className="flex flex-wrap gap-2">
              {profile.values.map((v) => (
                <span
                  key={v}
                  className="border-2 border-[var(--ink)] bg-[var(--bg-elevated)] px-3 py-1.5 font-mono text-xs text-[var(--ink)] shadow-[2px_2px_0_var(--ink)]"
                >
                  <span className="text-[var(--accent)]">{'#'}</span> {v}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        {/* ===== 三链身份：同一人可交叉验证 ===== */}
        <section className="mb-12">
          <div
            className="hand-card hand-card-accent rgb-shift p-6 sm:p-8"
            style={{ transform: 'rotate(0.4deg)' }}
          >
            <h2 className="mb-5 font-display text-xl text-[var(--ink)] sm:text-2xl glitch-text" data-text="验证我">
              交叉验证：阿维 = Person-HE = 博客作者
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <a
                href={profile.githubUrl || siteConfig.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 border-2 border-[var(--ink)] bg-[var(--bg)] p-4 font-mono text-xs text-[var(--ink)] shadow-[2px_2px_0_var(--ink)] hover:-translate-y-0.5"
              >
                <Github className="h-5 w-5 text-[var(--accent)]" /> GitHub · Person-HE
              </a>
              <a
                href={profile.blogUrl || siteConfig.blogUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 border-2 border-[var(--ink)] bg-[var(--bg)] p-4 font-mono text-xs text-[var(--ink)] shadow-[2px_2px_0_var(--ink)] hover:-translate-y-0.5"
              >
                <Rss className="h-5 w-5 text-[var(--accent)]" /> 博客 · person-he.github.io
              </a>
              <Link
                to="/blog"
                className="flex items-center gap-3 border-2 border-[var(--ink)] bg-[var(--bg)] p-4 font-mono text-xs text-[var(--ink)] shadow-[2px_2px_0_var(--ink)] hover:-translate-y-0.5"
              >
                <ArrowRight className="h-5 w-5 text-[var(--accent)]" /> 本站文章目录
              </Link>
            </div>
            <p className="mt-4 font-mono text-[10px] leading-relaxed text-[var(--ink-mute)]">
              {'//'} 仓库 README、博客文章、在线产品署名互相引用，任何一条链都能推到另外两条。
            </p>
          </div>
        </section>

        {/* ===== 关注我：二维码 ===== */}
        <section className="mb-12">
          <div className="mb-6 text-center">
            <div className="mb-2 font-mono text-xs uppercase tracking-widest text-[var(--accent)] terminal-cursor">
              {'>'} 关注我
            </div>
            <h2 className="font-display text-2xl text-[var(--ink)] sm:text-3xl glitch-text inline-block" data-text="扫码找到我">
              扫码找到我
            </h2>
          </div>

          <div ref={qrRef} className="grid gap-5 sm:grid-cols-3">
            {QR_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.key}
                  className="qr-card hand-card rgb-shift flex flex-col items-center p-6"
                  style={{ transform: `rotate(${card.rotate}deg)` }}
                >
                  <div
                    className="mb-3 flex h-10 w-10 items-center justify-center border-2 border-[var(--ink)] shadow-[2px_2px_0_var(--ink)]"
                    style={{ background: card.color }}
                  >
                    <Icon className="h-5 w-5 text-[var(--ink)]" />
                  </div>
                  <h3 className="mb-1 font-display text-lg text-[var(--ink)]">{card.title}</h3>
                  <p className="mb-4 font-mono text-xs text-[var(--ink-mute)]">{card.desc}</p>
                  <div className="flex h-44 w-44 items-center justify-center overflow-hidden border-2 border-[var(--ink)] bg-[var(--bg)] shadow-[3px_3px_0_var(--ink)]">
                    <SmartImage
                      src={card.url}
                      alt={`${card.title}二维码`}
                      fallbackLabel="二维码待上传"
                      wrapperClassName="h-full w-full"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="mt-3 font-mono text-[10px] text-[var(--ink-mute)]">长按或扫码识别</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ===== 全平台账号 ===== */}
        <section className="mb-12">
          <div className="hand-card rgb-shift p-6 text-center sm:p-8" style={{ transform: 'rotate(-0.4deg)' }}>
            <div className="mb-4 flex items-center justify-center gap-2">
              <Tv className="h-5 w-5 text-[var(--ink)]" />
              <h2 className="font-display text-xl text-[var(--ink)] sm:text-2xl">全平台同名</h2>
            </div>
            <div className="mx-auto mb-5 inline-flex items-center gap-2 border-2 border-dashed border-[var(--ink)] bg-[var(--bg)] px-5 py-2.5 shadow-[3px_3px_0_var(--ink)]">
              <span className="font-mono text-xs text-[var(--ink-mute)]">账号名</span>
              <span className="font-display text-xl font-black text-[var(--accent-alt)] sm:text-2xl">
                {siteConfig.socialBrand}
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {SOCIAL_PLATFORMS.map((name) => (
                <span
                  key={name}
                  className="border-2 border-[var(--ink)] bg-[var(--bg-elevated)] px-4 py-2 font-display text-sm text-[var(--ink)] shadow-[2px_2px_0_var(--ink)]"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 联系区 ===== */}
        <section
          className="hand-card hand-card-alt rgb-shift p-8 text-center sm:p-10"
          style={{ transform: 'rotate(-0.6deg)' }}
        >
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center border-2 border-[var(--ink)] bg-[var(--accent-alt)] shadow-[3px_3px_0_var(--ink)]">
            <MessageCircle className="h-6 w-6 text-[var(--ink)]" />
          </div>
          <h2 className="mb-2 font-display text-2xl text-[var(--ink)] sm:text-3xl glitch-text" data-text="聊聊吧">
            聊聊吧
          </h2>
          <p className="mb-6 font-mono text-sm text-[var(--ink-soft)]">合作 · 交流 · 技术咨询 · 什么都可以聊</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="hand-btn hand-btn-primary">
              提交需求 <ArrowRight className="h-4 w-4" />
            </Link>
            <button onClick={() => open('default')} className="hand-btn">
              微信咨询
            </button>
          </div>
        </section>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1 font-mono text-sm text-[var(--ink-mute)] transition-colors hover:text-[var(--accent-alt)]"
          >
            <ArrowLeft className="h-4 w-4" /> 回到首页
          </Link>
        </div>
      </div>
    </div>
  );
}
