/**
 * 案例详情页 —— 单一数据源：portfolio 集合（后台可管理）
 *
 * 数据诚实性约束：
 * - metrics 只渲染带 source（可复现出处）的指标，无出处不展示；
 * - 仓库语言/push 时间来自 /api/github 活快照，缺失则整块不渲染；
 * - 关联文章/代码直达均为深链，不是仓库首页。
 */
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  FileCode2,
  Github,
  MessageSquareText,
  Rocket,
  FileImage,
} from 'lucide-react';
import { useDataStore } from '@/store/useDataStore';
import { useLiveStore, repoOf, daysAgo } from '@/store/useLiveStore';
import Breadcrumb from '@/components/Breadcrumb';
import PaperBackground from '@/components/PaperBackground';
import EmptyState from '@/components/EmptyState';
import Seo from '@/components/Seo';
import FormattedText from '@/components/FormattedText';
import DemoFrame from '@/components/DemoFrame';
import { SmartImage } from '@/components/SmartMedia';
import { siteConfig } from '@/config/site.config';

export default function PortfolioDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { portfolio, services, loading, loaded, loadAll } = useDataStore();
  const { github, load: loadLive } = useLiveStore();
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    loadAll();
    loadLive();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [loadAll, loadLive, slug]);

  const project = useMemo(
    () => portfolio.find((p) => p.slug === slug && p.published) || null,
    [portfolio, slug],
  );
  const repo = project ? repoOf(github, project.repo) : null;
  const ctaService = project?.ctaServiceId
    ? services.find((s) => s.id === project.ctaServiceId) || null
    : null;

  if (loading && !loaded) {
    return (
      <div className="relative min-h-screen pt-16">
        <PaperBackground />
        <div className="relative z-10 mx-auto max-w-5xl px-4 py-20 font-mono text-sm text-[var(--ink-mute)]">
          <span className="text-[var(--accent)]">{'>'}</span> <span className="terminal-cursor">loading…</span>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="relative min-h-screen overflow-hidden pt-16">
        <PaperBackground />
        <Seo title="案例不存在" description="未找到该作品" path="/portfolio" />
        <div className="relative z-10 mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
          <EmptyState
            icon={<FileCode2 className="h-7 w-7" />}
            title={`404 · 未找到案例 ${slug ?? ''}`}
            description="该案例可能已下线。回到作品集查看全部项目。"
            action={
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-1 border-2 border-[var(--ink)] bg-[var(--accent)] px-4 py-2 font-mono text-xs text-[var(--bg)] shadow-[2px_2px_0_var(--ink)]"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> 返回作品集
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const metricsWithSource = project.metrics.filter((m) => m.value && m.source);

  return (
    <div className="relative min-h-screen overflow-hidden pt-16">
      <PaperBackground />
      <Seo
        title={`${project.name}：${project.tagline}`}
        description={`${project.name} —— ${project.tagline}。${project.problem.slice(0, 80)}`}
        path={`/portfolio/${project.slug}`}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: project.name,
            applicationCategory: 'DeveloperApplication',
            description: project.tagline,
            url: project.demoUrl || `${siteConfig.githubUrl}/${project.repo}`,
            codeRepository: project.repo ? `${siteConfig.githubUrl}/${project.repo}` : undefined,
            author: { '@type': 'Person', name: siteConfig.owner, url: siteConfig.githubUrl },
          },
        ]}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: '作品集', to: '/portfolio' }, { label: project.name }]} />

        {/* ===== Hero ===== */}
        <header className="border-2 border-[var(--ink)] bg-[var(--bg-elevated)] shadow-[4px_4px_0_var(--accent)]">
          {project.coverImage ? (
            <SmartImage
              src={project.coverImage}
              alt={project.name}
              eager
              wrapperClassName="h-56 w-full border-b-2 border-[var(--ink)] sm:h-72"
              fallbackLabel="暂无封面"
            />
          ) : null}
          <div className="p-6 sm:p-8">
            <div className="mb-3 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-widest">
              <span className="bg-[var(--accent)] px-2 py-0.5 text-[var(--bg)]">{project.status}</span>
              <span className="border border-[var(--ink-mute)] px-2 py-0.5 text-[var(--ink-mute)]">{project.period}</span>
              <span className="border border-[var(--ink-mute)] px-2 py-0.5 text-[var(--ink-mute)]">{project.role}</span>
              {repo ? (
                <span className="border border-[var(--accent-cyan)] px-2 py-0.5 text-[var(--accent-cyan)]">
                  {repo.language ?? '多语言'} · push {daysAgo(repo.pushedAt)} · LIVE
                </span>
              ) : null}
            </div>
            <h1 className="font-display text-4xl font-black text-[var(--ink)] sm:text-5xl">
              <span className="text-[var(--accent)]">{'>'}</span> {project.name}
            </h1>
            <p className="mt-3 font-mono text-sm text-[var(--ink-soft)]">{project.tagline}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.techStack.map((t) => (
                <span key={t} className="border border-[var(--ink-mute)] px-2 py-0.5 font-mono text-[10px] text-[var(--ink-mute)]">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {project.demoUrl ? (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 border-2 border-[var(--ink)] bg-[var(--accent)] px-5 py-2.5 font-display text-lg font-bold text-[var(--bg)] shadow-[3px_3px_0_var(--ink)] transition-transform hover:-translate-y-0.5"
                >
                  <Rocket className="h-5 w-5" /> 在线体验
                </a>
              ) : null}
              {project.repo ? (
                <a
                  href={`${siteConfig.githubUrl}/${project.repo}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 border-2 border-[var(--ink)] bg-[var(--bg)] px-5 py-2.5 font-display text-lg font-bold text-[var(--ink)] shadow-[3px_3px_0_var(--ink)] transition-transform hover:-translate-y-0.5"
                >
                  <Github className="h-5 w-5" /> 阅读源码
                </a>
              ) : null}
            </div>
          </div>
        </header>

        {/* ===== 成果数据（只渲染有出处的） ===== */}
        {metricsWithSource.length > 0 ? (
          <section className="mt-10">
            <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--accent)]">
              {'//'} 成果数据 · 每个数字都有出处
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {metricsWithSource.map((m) => (
                <div key={m.label} className="border-2 border-[var(--ink)] bg-[var(--bg-elevated)] p-4 shadow-[2px_2px_0_var(--ink)]">
                  <div className="font-display text-3xl font-black text-[var(--accent)]">{m.value}</div>
                  <div className="mt-1 font-mono text-xs text-[var(--ink-soft)]">{m.label}</div>
                  <div className="mt-2 inline-block bg-[var(--accent-cyan)] px-1.5 py-0.5 font-mono text-[9px] text-[var(--bg)]">
                    出处：{m.source}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* ===== 挑战 & 方案 ===== */}
        <section className="mt-10 space-y-8">
          {project.problem ? (
            <div>
              <h2 className="mb-3 font-display text-2xl font-bold text-[var(--ink)]">
                <span className="text-[var(--accent-alt)]">[!]</span> 面对的真实问题
              </h2>
              <FormattedText text={project.problem} className="font-mono text-sm leading-relaxed text-[var(--ink-soft)]" />
            </div>
          ) : null}
          {project.solution ? (
            <div>
              <h2 className="mb-3 font-display text-2xl font-bold text-[var(--ink)]">
                <span className="text-[var(--accent)]">[+]</span> 我的方案与架构
              </h2>
              <FormattedText text={project.solution} className="font-mono text-sm leading-relaxed text-[var(--ink-soft)]" />
            </div>
          ) : null}
        </section>

        {/* ===== 亮点 ===== */}
        {project.highlights.length > 0 ? (
          <section className="mt-10">
            <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--accent)]">
              {'//'} 关键亮点
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {project.highlights.map((h) => (
                <div key={h.title} className="border-l-4 border-[var(--accent)] bg-[var(--bg-elevated)] p-4">
                  <div className="font-display text-lg font-bold text-[var(--ink)]">{h.title}</div>
                  <p className="mt-1 font-mono text-xs leading-relaxed text-[var(--ink-soft)]">{h.desc}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* ===== 技术决策 ===== */}
        {project.decisions.length > 0 ? (
          <section className="mt-10">
            <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--accent)]">
              {'//'} 关键技术决策 —— 为什么这么选
            </h2>
            <div className="space-y-3">
              {project.decisions.map((d, i) => (
                <div key={i} className="border-2 border-[var(--ink)] bg-[var(--bg-elevated)]">
                  <div className="border-b border-[var(--ink-mute)] bg-[var(--bg-deep)] px-4 py-2 font-mono text-xs text-[var(--ink)]">
                    <span className="text-[var(--accent)]">Q{i + 1}</span> {d.question}
                  </div>
                  <div className="grid gap-2 px-4 py-3 font-mono text-xs sm:grid-cols-[1fr_2fr]">
                    <div className="text-[var(--accent-cyan)]">→ {d.choice}</div>
                    <div className="text-[var(--ink-soft)]">{d.reason}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* ===== 截图 ===== */}
        {project.screenshots.length > 0 ? (
          <section className="mt-10">
            <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--accent)]">
              {'//'} 产品实拍
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {project.screenshots.map((src) => (
                <button key={src} onClick={() => setLightbox(src)} className="block w-full cursor-zoom-in text-left">
                  <SmartImage
                    src={src}
                    alt={`${project.name} 截图`}
                    wrapperClassName="h-48 w-full border-2 border-[var(--ink)] shadow-[2px_2px_0_var(--ink)]"
                    fallbackLabel="截图待上传"
                  />
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {/* ===== 在线 Demo ===== */}
        {project.demoUrl ? (
          <section className="mt-10">
            <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--accent)]">
              {'//'} 在线 Demo —— 直连生产环境
            </h2>
            <DemoFrame url={project.demoUrl} name={project.name} />
          </section>
        ) : null}

        {/* ===== 深挖：文章 & 代码 ===== */}
        {project.relatedPosts.length > 0 || project.relatedFiles.length > 0 ? (
          <section className="mt-10 grid gap-4 sm:grid-cols-2">
            {project.relatedPosts.length > 0 ? (
              <div className="border-2 border-[var(--ink)] bg-[var(--bg-elevated)] p-5">
                <h3 className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[var(--accent)]">
                  <MessageSquareText className="h-4 w-4" /> 深挖文章
                </h3>
                <ul className="space-y-2">
                  {project.relatedPosts.map((l) => (
                    <li key={l.url}>
                      <a
                        href={l.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-start gap-1.5 font-mono text-xs text-[var(--ink-soft)] hover:text-[var(--accent)]"
                      >
                        <ExternalLink className="mt-0.5 h-3 w-3 shrink-0" /> {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {project.relatedFiles.length > 0 ? (
              <div className="border-2 border-[var(--ink)] bg-[var(--bg-elevated)] p-5">
                <h3 className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[var(--accent)]">
                  <FileCode2 className="h-4 w-4" /> 代码直达
                </h3>
                <ul className="space-y-2">
                  {project.relatedFiles.map((l) => (
                    <li key={l.url}>
                      <a
                        href={l.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-start gap-1.5 font-mono text-xs text-[var(--ink-soft)] hover:text-[var(--accent)]"
                      >
                        <FileCode2 className="mt-0.5 h-3 w-3 shrink-0" /> {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>
        ) : null}

        {/* ===== 底部 CTA ===== */}
        <section className="mt-12 border-2 border-[var(--ink)] bg-[var(--bg-deep)] p-6 sm:p-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-2xl font-bold text-[var(--ink)]">
                <span className="text-[var(--accent)]">{'>'}</span> 想要类似的东西？
              </h2>
              <p className="mt-1 font-mono text-xs text-[var(--ink-soft)]">
                这个项目暴露出的能力，同样可以用在你的需求上。
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {ctaService ? (
                <Link
                  to={`/services/${ctaService.id}`}
                  className="border-2 border-[var(--ink)] bg-[var(--bg-elevated)] px-5 py-2.5 font-mono text-xs text-[var(--ink)] shadow-[2px_2px_0_var(--ink)] hover:bg-[var(--accent-cyan)]"
                >
                  对应服务：{ctaService.name}
                </Link>
              ) : null}
              <Link
                to={`/contact?ref=${project.slug}&type=${encodeURIComponent('Web应用/小程序')}`}
                className="border-2 border-[var(--ink)] bg-[var(--accent)] px-5 py-2.5 font-mono text-xs text-[var(--bg)] shadow-[2px_2px_0_var(--ink)] transition-transform hover:-translate-y-0.5"
              >
                获取报价
              </Link>
            </div>
          </div>
        </section>

        <div className="mt-8">
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-1 font-mono text-xs text-[var(--ink-mute)] hover:text-[var(--accent)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> 返回作品集
          </Link>
        </div>
      </div>

      {/* 截图灯箱 */}
      {lightbox ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[var(--bg)]/95 p-4"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-label="截图预览"
        >
          <img src={lightbox} alt={`${project.name} 大图`} className="max-h-full max-w-full border-2 border-[var(--ink)]" />
          <div className="absolute right-4 top-4 flex items-center gap-2 font-mono text-xs text-[var(--ink-mute)]">
            <FileImage className="h-4 w-4" /> 点击任意处关闭
          </div>
        </div>
      ) : null}
    </div>
  );
}
