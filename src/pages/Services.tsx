import { useEffect, useMemo, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Building2, ArrowRight, MessageCircle } from 'lucide-react';
import { useDataStore } from '@/store/useDataStore';
import { useWechatModal } from '@/components/WeChatModal';
import EmptyState from '@/components/EmptyState';
import { PageHeader } from '@/components/SectionTitle';
import ServiceCard from '@/components/ServiceCard';
import PaperBackground from '@/components/PaperBackground';
import Seo from '@/components/Seo';
import { useScrollReveal } from '@/hooks/useGsap';
import { siteConfig } from '@/config/site.config';
import type { Service, ServiceType } from '@/types';

const SERVICE_SECTIONS: {
  key: string;
  title: string;
  desc: string;
  eyebrow: string;
  types: ServiceType[];
}[] = [
  {
    key: 'tool-config',
    eyebrow: '01 / 工具配置',
    title: '工具配置服务',
    desc: '远程帮你安装、配置、调试各种AI工具。你不用折腾，我来搞定。',
    types: ['tool-config'],
  },
  {
    key: 'ai-output',
    eyebrow: '02 / AI成品',
    title: 'AI成品代做',
    desc: '你说需求，我出成品。不教你用AI，直接给你AI做好的东西。',
    types: ['ai-output'],
  },
  {
    key: 'custom',
    eyebrow: '03 / 定制开发',
    title: '定制服务',
    desc: '针对你的具体场景，量身定制AI解决方案。不是通用模板，是为你量身打造的。',
    types: ['custom'],
  },
  {
    key: 'product-automation',
    eyebrow: '04 / 产品与自动化',
    title: '产品与自动化',
    desc: '我自己做的AI产品、付费工具，以及能把重复工作自动化的流水线。',
    types: ['product-pro', 'product', 'automation'],
  },
];

function sectionKeyForType(type: ServiceType | null): string {
  if (!type) return '';
  if (type === 'tool-config' || type === 'ai-output' || type === 'custom') return type;
  if (type === 'product-pro' || type === 'product' || type === 'automation') {
    return 'product-automation';
  }
  return '';
}

export default function Services() {
  const { services, loading, loaded, loadAll } = useDataStore();
  const { open } = useWechatModal();
  const [searchParams] = useSearchParams();
  const highlightType = searchParams.get('type') as ServiceType | null;
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const sectionRef = useScrollReveal<HTMLDivElement>('.svc-section', [services.length], {
    stagger: 0.15,
    y: 50,
  });

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  useEffect(() => {
    const key = sectionKeyForType(highlightType);
    if (key && sectionRefs.current[key]) {
      setTimeout(() => {
        sectionRefs.current[key]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, [highlightType, loaded]);

  const grouped = useMemo(() => {
    const map: Record<string, Service[]> = {
      'tool-config': [],
      'ai-output': [],
      custom: [],
      'product-automation': [],
    };
    services.forEach((s) => {
      SERVICE_SECTIONS.forEach((sec) => {
        if (sec.types.includes(s.type)) {
          map[sec.key].push(s);
        }
      });
    });
    return map;
  }, [services]);

  const hasAnyServices = useMemo(() => {
    return Object.values(grouped).some((list) => list.length > 0);
  }, [grouped]);

  // 企业服务价格从 services 集合读取，不硬编码
  const enterpriseService = useMemo(
    () => services.find((s) => s.type === 'enterprise') || null,
    [services],
  );

  return (
    <div className="relative min-h-screen overflow-hidden pt-16">
      <PaperBackground />
      <Seo
        title="技术服务"
        description={`${siteConfig.name}的技术服务：工具配置、AI 成品代做、定制开发、自动化流水线与企业 AI 落地。搞不定不收费，验收不通过不收尾款。`}
        path="/services"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <PageHeader
          title="我能帮你解决什么问题"
          description="每个服务背后，都有我真实做过的案例。不卖课，不卖训练营，你提需求，我交付结果。"
        >
          <div className="hand-card rgb-shift bg-[var(--bg-elevated)] p-4 font-mono text-sm leading-relaxed text-[var(--ink-soft)]">
            <p className="mb-1">
              <span className="font-display font-bold text-[var(--accent)]">{'// '}服务理念：</span>
              不卖概念、不写PPT，只做能落地、能看到效果的事。
            </p>
            <p>
              <span className="font-display font-bold text-[var(--accent)]">{'// '}交付原则：</span>
              搞不定不收费，验收不通过不收尾款。先免费咨询，满意再合作。
            </p>
          </div>
        </PageHeader>

        {loading && !loaded ? (
          <div className="hand-empty font-mono text-sm">
            <span className="text-[var(--accent)]">{'>'}</span> loading...
          </div>
        ) : !hasAnyServices ? (
          <EmptyState
            title="服务数据加载中"
            description="具体服务项即将上线，欢迎加微信免费咨询。"
            action={
              <button onClick={() => open('default')} className="hand-btn hand-btn-primary text-sm">
                微信咨询 <ArrowRight className="h-4 w-4" />
              </button>
            }
          />
        ) : (
          <div ref={sectionRef} className="space-y-20">
            {SERVICE_SECTIONS.map((sec) => {
              const list = grouped[sec.key] || [];
              if (list.length === 0) return null;
              const isHighlighted = sectionKeyForType(highlightType) === sec.key;
              return (
                <section
                  key={sec.key}
                  ref={(el) => {
                    sectionRefs.current[sec.key] = el;
                  }}
                  id={`section-${sec.key}`}
                  className={`svc-section scroll-mt-24 ${
                    isHighlighted ? 'p-4 border-2 border-[var(--accent)] shadow-[4px_4px_0_var(--ink)]' : ''
                  }`}
                >
                  <div className="mb-6">
                    <div className="text-eyebrow mb-2 terminal-cursor">{sec.eyebrow}</div>
                    <h2
                      className="text-headline font-black text-[var(--ink)] glitch-text"
                      data-text={sec.title}
                    >
                      {sec.title}
                    </h2>
                    <p className="mt-2 max-w-2xl font-body text-base text-[var(--ink-soft)]">
                      <span className="text-[var(--accent)]">{'>'}</span> {sec.desc}
                    </p>
                  </div>

                  <div className="space-y-6">
                    {list.map((s) => (
                      <ServiceCard key={s.id} service={s} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {/* 企业服务单独引导 */}
        <div className="mt-20">
          <Link
            to="/enterprise"
            className="hand-card-gold rgb-shift group flex flex-col items-center justify-between gap-4 p-6 sm:flex-row"
            style={{ transform: 'rotate(0.5deg)' }}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center border-2 border-[var(--ink)] bg-[var(--accent)] text-[var(--bg)] shadow-[3px_3px_0_var(--ink)]">
                <Building2 className="h-7 w-7" />
              </div>
              <div>
                <h3
                  className="font-display text-xl font-bold text-[var(--ink)] glitch-text"
                  data-text="企业AI落地服务"
                >
                  企业AI落地服务
                </h3>
                <p className="mt-1 font-mono text-sm text-[var(--ink-soft)]">
                  <span className="text-[var(--accent)]">{'>'}</span> 不卖概念不写PPT，帮企业把AI装到每个工位上
                </p>
                {enterpriseService?.priceRange ? (
                  <p className="mt-1 font-mono text-sm font-bold text-[var(--accent)]">
                    <span className="text-[var(--ink-mute)]">$</span> {enterpriseService.priceRange}
                  </p>
                ) : null}
              </div>
            </div>
            <span className="hand-btn hand-btn-gold shrink-0 text-sm">
              查看详细方案 <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>

        {/* 底部统一 CTA */}
        <div
          className="mt-10 hand-card-alt rgb-shift p-8 text-center sm:p-12"
          style={{ transform: 'rotate(-0.5deg)' }}
        >
          <h3
            className="mb-2 font-display text-2xl font-bold text-[var(--ink)] glitch-text"
            data-text="不确定需要什么？"
          >
            不确定需要什么？
          </h3>
          <p className="mb-6 font-mono text-base text-[var(--ink-soft)]">
            <span className="text-[var(--accent)]">{'>'}</span> 聊清楚需求再谈合作。填一张需求工单更快，或直接加微信。
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="hand-btn hand-btn-primary">
              提交需求 · 获取报价
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button onClick={() => open('default')} className="hand-btn">
              <MessageCircle className="h-4 w-4" />
              微信咨询
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
