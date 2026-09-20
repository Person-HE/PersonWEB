/**
 * 联系 / 获取报价页 —— 全站转化出口
 *
 * 表单直达后台「需求工单」（/api/quote，IP 限流 + 蜜罐防灌）；
 * 急单引导微信；并从 GitHub / 博客渠道串联身份。
 */
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Github, MessageCircle, Rss } from 'lucide-react';
import QuoteForm from '@/components/QuoteForm';
import PaperBackground from '@/components/PaperBackground';
import { PageHeader } from '@/components/SectionTitle';
import Seo from '@/components/Seo';
import { siteConfig } from '@/config/site.config';
import { useWechatModal } from '@/components/WeChatModal';

export default function Contact() {
  const [params] = useSearchParams();
  const { open } = useWechatModal();
  const quoteRef = params.get('ref') || 'contact';
  const serviceType = params.get('type') || undefined;
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative min-h-screen overflow-hidden pt-16">
      <PaperBackground />
      <Seo
        title="获取报价"
        description="描述你的需求，直达站长后台：网站/落地页、Web 应用、自动化脚本、AI 工作流、企业 AI 落地。先诊断后报价，不接说不清的需求。"
        path="/contact"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <PageHeader
          title="获取报价"
          description={
            quoteRef === 'contact'
              ? '先说清楚你要什么，我才能给准价。表单提交直达我的后台，不经过任何中介。'
              : `从「${quoteRef}」过来的需求 —— 把你要的类似东西说清楚，我按同一套标准交付。`
          }
        />

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          {/* 左：需求表单 */}
          <div className="border-2 border-[var(--ink)] bg-[var(--bg-elevated)] p-5 shadow-[4px_4px_0_var(--ink)] sm:p-8" style={mounted ? undefined : { minHeight: 480 }}>
            <QuoteForm quoteRef={quoteRef} defaultServiceType={serviceType} />
          </div>

          {/* 右：联系渠道 */}
          <aside className="space-y-4">
            <div className="border-2 border-[var(--ink)] bg-[var(--bg-deep)] p-5">
              <h3 className="mb-1 font-mono text-xs uppercase tracking-widest text-[var(--accent)]">
                {'//'} 急单通道
              </h3>
              <p className="mb-4 font-mono text-xs leading-relaxed text-[var(--ink-soft)]">
                表单按提交顺序处理。当天要答复，直接加微信，备注来意。
              </p>
              <button
                onClick={() => open('default')}
                className="flex w-full items-center justify-center gap-2 border-2 border-[var(--ink)] bg-[var(--accent)] px-4 py-2.5 font-display text-lg font-bold text-[var(--bg)] shadow-[3px_3px_0_var(--ink)] transition-transform hover:-translate-y-0.5"
              >
                <MessageCircle className="h-5 w-5" /> 加微信
              </button>
            </div>

            <div className="border-2 border-[var(--ink)] bg-[var(--bg-elevated)] p-5">
              <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-[var(--accent)]">
                {'//'} 先验证我再谈合作
              </h3>
              <ul className="space-y-2.5 font-mono text-xs">
                <li>
                  <a
                    href={siteConfig.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-[var(--ink-soft)] hover:text-[var(--accent)]"
                  >
                    <Github className="h-4 w-4" /> GitHub · {siteConfig.githubUrl.replace('https://', '')}
                  </a>
                </li>
                <li>
                  <a
                    href={siteConfig.blogUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-[var(--ink-soft)] hover:text-[var(--accent)]"
                  >
                    <Rss className="h-4 w-4" /> 技术博客 · person-he.github.io
                  </a>
                </li>
              </ul>
              <p className="mt-3 border-t border-dashed border-[var(--ink-mute)] pt-3 font-mono text-[10px] leading-relaxed text-[var(--ink-mute)]">
                {'//'} 三处 ID 指向同一个人：阿维 = Person-HE = 博客作者。提交渠道会记录在工单里，我知道你从哪来。
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
