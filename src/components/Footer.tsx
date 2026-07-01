import { Link } from 'react-router-dom';
import { PenTool, MessageCircle, Github, Music2, Tv } from 'lucide-react';
import { siteConfig } from '@/config/site.config';
import { useWechatModal } from '@/components/WeChatModal';

export default function Footer() {
  const { open } = useWechatModal();
  const year = siteConfig.copyrightYear;

  return (
    <footer className="relative z-10 border-t-2 border-[var(--ink)] bg-[var(--paper-deep)]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* 左：站名 + 简介 */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-[var(--ink)] bg-[var(--crimson)] shadow-[2px_2px_0_var(--ink)]">
                <PenTool className="h-5 w-5 text-[var(--paper-light)]" />
              </div>
              <span className="font-hand-title text-lg font-bold text-[var(--ink)]">{siteConfig.name}</span>
            </div>
            <p className="max-w-xs font-hand-body text-sm leading-relaxed text-[var(--ink-soft)]">
              {siteConfig.tagline}
            </p>
          </div>

          {/* 中：快速链接 */}
          <div>
            <h4 className="mb-3 font-hand-title text-xs uppercase tracking-widest text-[var(--ink-mute)]">
              · 快速链接 ·
            </h4>
            <ul className="grid grid-cols-2 gap-2 font-hand-body text-sm">
              {[
                { path: '/', label: '首页' },
                { path: '/resources', label: '资源中心' },
                { path: '/navigation', label: 'AI导航' },
                { path: '/services', label: '服务中心' },
                { path: '/enterprise', label: '企业服务' },
                { path: '/about', label: '关于' },
              ].map((l) => (
                <li key={l.path}>
                  <Link
                    to={l.path}
                    className="text-[var(--ink-soft)] transition-colors hover:text-[var(--crimson)]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 右：社交链接 */}
          <div>
            <h4 className="mb-3 font-hand-title text-xs uppercase tracking-widest text-[var(--ink-mute)]">
              · 关注阿维 ·
            </h4>
            <div className="mb-3 flex items-center gap-3">
              <button
                onClick={() => open('default')}
                className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[var(--ink)] bg-[var(--paper-light)] text-[var(--ink)] shadow-[2px_2px_0_var(--ink)] transition-all hover:bg-[var(--teal)] hover:text-[var(--paper-light)]"
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
                  className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[var(--ink)] bg-[var(--paper-light)] text-[var(--ink)] shadow-[2px_2px_0_var(--ink)] transition-all hover:bg-[var(--crimson)] hover:text-[var(--paper-light)]"
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
                  className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[var(--ink)] bg-[var(--paper-light)] text-[var(--ink)] shadow-[2px_2px_0_var(--ink)] transition-all hover:bg-[var(--ink)] hover:text-[var(--paper-light)]"
                  aria-label="GitHub"
                  title="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
              ) : null}
            </div>
            {siteConfig.socialBrand ? (
              <div className="flex items-center gap-2">
                <Tv className="h-4 w-4 text-[var(--indigo)]" />
                <span className="font-hand-body text-sm text-[var(--ink-soft)]">
                  全平台：<span className="font-hand-title text-[var(--crimson)]">{siteConfig.socialBrand}</span>
                </span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-8 border-t-2 border-dashed border-[var(--ink)]/30 pt-6 text-center font-hand-body text-xs text-[var(--ink-mute)]">
          Copyright (c) {year} {siteConfig.name} · 手工打造，认真做事
        </div>
      </div>
    </footer>
  );
}
