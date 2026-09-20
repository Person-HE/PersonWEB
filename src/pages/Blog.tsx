/**
 * 博客页 —— 目录来自 /api/blog 快照（cron 每小时解析 GitHub Pages 发布站点）
 *
 * 阅读发生在 person-he.github.io（Hexo 主站），本站只做目录与串联，
 * 不复制正文，保证全站单一事实源。
 */
import { useEffect } from 'react';
import { ExternalLink, Rss } from 'lucide-react';
import { useLiveStore } from '@/store/useLiveStore';
import BlogList from '@/components/BlogList';
import PaperBackground from '@/components/PaperBackground';
import { PageHeader } from '@/components/SectionTitle';
import Seo from '@/components/Seo';
import { siteConfig } from '@/config/site.config';

export default function Blog() {
  const { blog, load } = useLiveStore();

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="relative min-h-screen overflow-hidden pt-16">
      <PaperBackground />
      <Seo
        title="技术博客"
        description={`阿维的技术博客目录：Agent 运行时、浏览器自动化、全栈工程实录。共 ${blog?.posts.length ?? '—'} 篇，正文在 person-he.github.io。`}
        path="/blog"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: '阿维的技术博客',
            url: siteConfig.blogUrl,
            description: siteConfig.tagline,
          },
        ]}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <PageHeader
          title="技术博客"
          description="每个作品背后都有一篇以上的工程实录：为什么做、怎么设计、踩了什么坑。目录由服务端每小时同步，正文在原站阅读。"
        />

        <div className="mb-8 flex flex-wrap items-center gap-3 border-2 border-[var(--ink)] bg-[var(--bg-elevated)] p-4 shadow-[2px_2px_0_var(--ink)]">
          <Rss className="h-5 w-5 text-[var(--accent)]" />
          <span className="font-mono text-xs text-[var(--ink-soft)]">
            本站只做目录，避免双站内容漂移。订阅与阅读请去 Hexo 主站：
          </span>
          <a
            href={siteConfig.blogUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 border-2 border-[var(--ink)] bg-[var(--accent)] px-3 py-1 font-mono text-xs text-[var(--bg)] shadow-[2px_2px_0_var(--ink)] hover:-translate-y-0.5"
          >
            person-he.github.io <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <BlogList />
      </div>
    </div>
  );
}
