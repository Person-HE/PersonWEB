import { Link } from 'react-router-dom';
import { MessageCircle, Github, Music2, Tv, Terminal, Rss } from 'lucide-react';
import { siteConfig } from '@/config/site.config';
import { useWechatModal } from '@/components/WeChatModal';

export default function Footer() {
  const { open } = useWechatModal();
  const year = siteConfig.copyrightYear;

  return (
    <footer className="relative z-10 border-t-2 border-[var(--ink)] bg-[var(--bg-deep)]">
      {/* 顶部强调线 */}
      <div className="h-0.5 w-full bg-[var(--accent)]" />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* 左：站名 + 简介（终端日志风格） */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center border-2 border-[var(--ink)] bg-[var(--accent)] shadow-[2px_2px_0_var(--ink)]">
                <Terminal className="h-5 w-5 text-[var(--bg)]" />
              </div>
              <span className="font-display text-lg font-bold tracking-wide text-[var(--ink)]">
                <span className="text-[var(--accent)]">{'>'}</span>
                {siteConfig.name}
              </span>
            </div>
            <p className="max-w-xs font-mono text-xs leading-relaxed text-[var(--ink-soft)]">
              <span className="text-[var(--accent-cyan)]">#</span> {siteConfig.tagline}
            </p>
          </div>

          {/* 中：快速链接（终端目录风格） */}
          <div>
            <h4 className="mb-3 font-mono text-xs uppercase tracking-widest text-[var(--accent)]">
              {'//'} 快速链接
            </h4>
            <ul className="grid grid-cols-2 gap-1.5 font-mono text-xs">
              {[
                { path: '/', label: '首页' },
                { path: '/portfolio', label: '作品集' },
                { path: '/services', label: '服务' },
                { path: '/resources', label: '资源' },
                { path: '/navigation', label: 'AI导航' },
                { path: '/blog', label: '博客' },
                { path: '/about', label: '关于' },
                { path: '/enterprise', label: '企业服务' },
                { path: '/contact', label: '获取报价' },
              ].map((l) => (
                <li key={l.path}>
                  <Link
                    to={l.path}
                    className="text-[var(--ink-soft)] transition-colors hover:text-[var(--accent)]"
                  >
                    <span className="text-[var(--accent)]">{'>'}</span> {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 右：社交链接 */}
          <div>
            <h4 className="mb-3 font-mono text-xs uppercase tracking-widest text-[var(--accent)]">
              {'//'} 关注{siteConfig.owner}
            </h4>
            <div className="mb-3 flex items-center gap-3">
              <button
                onClick={() => open('default')}
                className="flex h-10 w-10 items-center justify-center border-2 border-[var(--ink)] bg-[var(--bg-elevated)] text-[var(--ink)] shadow-[2px_2px_0_var(--ink)] transition-all hover:bg-[var(--accent-cyan)] hover:text-[var(--bg)]"
                aria-label="微信"
                title="微信"
              >
                <MessageCircle className="h-5 w-5" />
              </button>
              {siteConfig.douyinUrl ? (
                <a
                  href={siteConfig.douyinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center border-2 border-[var(--ink)] bg-[var(--bg-elevated)] text-[var(--ink)] shadow-[2px_2px_0_var(--ink)] transition-all hover:bg-[var(--accent-alt)] hover:text-[var(--ink)]"
                  aria-label="抖音"
                  title="抖音"
                >
                  <Music2 className="h-5 w-5" />
                </a>
              ) : null}
              {siteConfig.githubUrl ? (
                <a
                  href={siteConfig.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center border-2 border-[var(--ink)] bg-[var(--bg-elevated)] text-[var(--ink)] shadow-[2px_2px_0_var(--ink)] transition-all hover:bg-[var(--accent)] hover:text-[var(--bg)]"
                  aria-label="GitHub"
                  title="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
              ) : null}
              {siteConfig.blogUrl ? (
                <a
                  href={siteConfig.blogUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center border-2 border-[var(--ink)] bg-[var(--bg-elevated)] text-[var(--ink)] shadow-[2px_2px_0_var(--ink)] transition-all hover:bg-[var(--accent-cyan)] hover:text-[var(--bg)]"
                  aria-label="技术博客"
                  title="技术博客"
                >
                  <Rss className="h-5 w-5" />
                </a>
              ) : null}
            </div>
            {siteConfig.socialBrand ? (
              <div className="flex items-center gap-2">
                <Tv className="h-4 w-4 text-[var(--accent-cyan)]" />
                <span className="font-mono text-xs text-[var(--ink-soft)]">
                  全平台：<span className="font-bold text-[var(--accent)]">{siteConfig.socialBrand}</span>
                </span>
              </div>
            ) : null}
          </div>
        </div>

        {/* 底部：终端命令行风格 */}
        <div className="mt-8 border-t border-dashed border-[var(--ink-mute)] pt-6">
          <div className="font-mono text-xs text-[var(--ink-mute)]">
            <span className="text-[var(--accent)]">{'>'}</span> copyright (c) {year} {siteConfig.name}
            <span className="ml-2 inline-block w-2 h-3 bg-[var(--accent)] animate-pulse align-middle" />
          </div>
        </div>
      </div>
    </footer>
  );
}
