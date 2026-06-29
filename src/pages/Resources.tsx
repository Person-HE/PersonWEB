import { useEffect, useState, useMemo } from 'react';
import {
  Download,
  Package,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  Code2,
  Brain,
  Zap,
  Rocket,
  Cloud,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import ResourceCard from '@/components/ResourceCard';
import DetailModal from '@/components/DetailModal';
import type { Resource } from '@/types';

/* ---------- 四大资源包（主力展示） ---------- */
interface Bundle {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: typeof Package;
  gradient: string;
  iconBg: string;
  borderColor: string;
  items: { name: string; size: string; note?: string }[];
  driveLink: string; // 夸克网盘分享链接
  linkPlaceholder?: string;
  badge?: string;
}

const BUNDLES: Bundle[] = [
  {
    id: 'java-ai',
    name: 'Java 后端与 AI 知识库',
    tagline: '550+ 篇深度技术文档 · 从零到架构师',
    description:
      '覆盖 Java 基础、后端架构、MySQL/Redis、计算机网络、操作系统、系统设计、AI Agents、RAG、LangChain4j 等全栈技术栈。按 7 个学习方向分类打包，每份文档都经过 AI 辅助打磨，适合系统学习和面试备战。',
    icon: Brain,
    gradient: 'from-violet-500/30 via-purple-500/10 to-transparent',
    iconBg: 'from-violet-400 to-purple-600',
    borderColor: 'hover:border-violet-500/40',
    badge: '最全面',
    items: [
      { name: '01-Java核心基础', size: '1.3 MB', note: 'Java语法+数据结构与算法' },
      { name: '02-后端架构与中间件', size: '404 KB', note: '微服务/K8s/Kafka/MQ' },
      { name: '03-数据库', size: '340 KB', note: 'MySQL + Redis 全套' },
      { name: '04-计算机基础', size: '604 KB', note: '操作系统/网络/组成原理' },
      { name: '05-系统设计与高阶架构', size: '160 KB', note: '秒杀/IM/分布式/性能优化' },
      { name: '06-AI应用开发与Agent', size: '1.3 MB', note: 'RAG/LangChain4j/MCP' },
      { name: '07-面试题库与实战', size: '15 MB', note: '含 LeetCode 高频100题' },
    ],
    driveLink: 'QUARK_LINK_JAVA_AI', // 待替换
    linkPlaceholder: 'Java后端与AI知识库',
  },
  {
    id: 'visual-resource',
    name: '资源与视觉知识库',
    tagline: '3800+ 文件 · AI 工具全景 + 视觉素材库',
    description:
      '两大知识库打包：①资源知识库含 AI 工具全景图、Skills 大全、提示词大全、创业方向图、分类工具索引；②视觉知识库含 3679 个前端 UI 组件、动画动效、视频特效、转场效果参考，做设计和视频必备。',
    icon: Sparkles,
    gradient: 'from-pink-500/30 via-rose-500/10 to-transparent',
    iconBg: 'from-pink-400 to-rose-600',
    borderColor: 'hover:border-pink-500/40',
    badge: '4.2 MB',
    items: [
      { name: '资源知识库', size: '5 MB', note: '133 个文件 · AI工具/提示词/创业方向' },
      { name: '视觉效果知识库', size: '6 MB', note: '3679 个文件 · UI/动画/特效' },
    ],
    driveLink: 'QUARK_LINK_VISUAL',
    linkPlaceholder: '资源与视觉知识库',
  },
  {
    id: 'skills',
    name: 'AI Skills 技能库',
    tagline: '38 个蒸馏技能 · 一人公司全套 C-Suite',
    description:
      '把我实战中沉淀的 AI 工作流蒸馏成可复用的 Skill：从 CPO/CTO/CMO 等 9 个 C-Suite 角色，到小说创作、人物视角、前端视觉、微信生态、自然流量增长引擎……每个 Skill 都能让 AI 立刻变成某个领域的专家助手。',
    icon: Zap,
    gradient: 'from-amber-500/30 via-orange-500/10 to-transparent',
    iconBg: 'from-amber-400 to-orange-600',
    borderColor: 'hover:border-amber-500/40',
    badge: '228 KB',
    items: [
      { name: '一人公司 C-Suite', size: '-', note: '9 个角色：CPO/CTO/CMO/CDO/CKO...' },
      { name: '小说创作技能族', size: '-', note: '7 个：情感/悬疑/现实/段子/头条' },
      { name: '人物视角技能', size: '-', note: '雷军/毛泽东/面试官/能力蒸馏' },
      { name: '前端视觉', size: '-', note: '创意设计/PPT生成/教程视频' },
      { name: '微信生态', size: '-', note: '文章排版/爆款/社群/转化闭环' },
      { name: '自然流量增长引擎', size: '-', note: '全域流量方法论' },
    ],
    driveLink: 'QUARK_LINK_SKILLS',
    linkPlaceholder: 'AI Skills 技能库',
  },
  {
    id: 'projects',
    name: '项目源码（含部署教程）',
    tagline: '4 个完整项目 · 保姆级本地部署指南',
    description:
      '精选 4 个我自研的 AI 产品级项目，每个都配有 500-800 行的中文 README，包含技术栈说明、环境要求、安装步骤、本地运行、生产构建、常见问题排查。照着做就能跑起来，适合学习、二次开发或直接商用。',
    icon: Code2,
    gradient: 'from-emerald-500/30 via-cyan-500/10 to-transparent',
    iconBg: 'from-emerald-400 to-cyan-600',
    borderColor: 'hover:border-emerald-500/40',
    badge: '可商用',
    items: [
      { name: 'webcreate', size: '324 KB', note: 'Procreate 风格 Web 绘图工具 + CLI' },
      { name: 'AutoEdit', size: '3.0 MB', note: '浏览器端专业视频剪辑 + AI 导演' },
      { name: 'Note-Plan', size: '306 MB', note: '跨平台笔记应用 · Web/桌面/移动' },
      { name: 'material', size: '76 KB', note: '多引擎素材处理 · 截图/录屏/美化' },
    ],
    driveLink: 'QUARK_LINK_PROJECTS',
    linkPlaceholder: '项目源码（含部署教程）',
  },
];

/* ---------- 组件 ---------- */
function BundleCard({ bundle, onClick }: { bundle: Bundle; onClick: () => void }) {
  const Icon = bundle.icon;
  return (
    <button
      onClick={onClick}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br ${bundle.gradient} p-6 text-left transition-all duration-500 ${bundle.borderColor} hover:-translate-y-1 hover:shadow-2xl`}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5 blur-2xl transition-all group-hover:bg-white/10" />
      <div className="relative mb-5 flex items-start justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${bundle.iconBg} shadow-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        {bundle.badge && (
          <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
            {bundle.badge}
          </span>
        )}
      </div>
      <h3 className="relative mb-1.5 text-lg font-bold text-white">{bundle.name}</h3>
      <p className="relative mb-3 text-xs text-slate-400">{bundle.tagline}</p>
      <p className="relative mb-5 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-300/80">
        {bundle.description}
      </p>
      <div className="relative flex items-center justify-between border-t border-white/5 pt-4">
        <span className="text-xs text-slate-500">{bundle.items.length} 个资源包</span>
        <span className="flex items-center gap-1 text-xs font-semibold text-white/80 transition-all group-hover:text-white">
          查看详情
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </button>
  );
}

/* 资源包详情 Modal */
function BundleDetailModal({
  bundle,
  onClose,
}: {
  bundle: Bundle | null;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCopied(false);
  }, [bundle]);

  if (!bundle) return null;

  const Icon = bundle.icon;
  const linkReady = !bundle.driveLink.startsWith('QUARK_LINK_');

  const handleCopy = async () => {
    if (!linkReady) return;
    try {
      await navigator.clipboard.writeText(bundle.driveLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/80 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`relative bg-gradient-to-br ${bundle.gradient} p-8`}>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-black/30 p-2 text-white/70 backdrop-blur-sm transition-colors hover:bg-black/50 hover:text-white"
          >
            ×
          </button>
          <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${bundle.iconBg} shadow-lg`}>
            <Icon className="h-7 w-7 text-white" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-white">{bundle.name}</h2>
          <p className="text-sm text-slate-300/90">{bundle.tagline}</p>
        </div>

        <div className="p-8">
          <p className="mb-6 text-sm leading-relaxed text-slate-300">{bundle.description}</p>

          <div className="mb-6">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              包含内容
            </div>
            <div className="space-y-2">
              {bundle.items.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <Package className="h-4 w-4 text-slate-500" />
                    <div>
                      <div className="text-sm font-medium text-white">{item.name}</div>
                      {item.note && <div className="text-xs text-slate-500">{item.note}</div>}
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{item.size}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 下载区 */}
          <div className={`rounded-2xl border p-5 ${linkReady ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-amber-500/20 bg-amber-500/5'}`}>
            <div className="mb-3 flex items-center gap-2">
              <Cloud className={`h-4 w-4 ${linkReady ? 'text-emerald-400' : 'text-amber-400'}`} />
              <span className="text-sm font-semibold text-white">夸克网盘下载</span>
            </div>

            {linkReady ? (
              <>
                <div className="mb-3 flex items-center gap-2 rounded-lg border border-white/5 bg-slate-950/50 p-3">
                  <code className="flex-1 truncate text-xs text-slate-300">{bundle.driveLink}</code>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 rounded-md bg-white/5 px-2.5 py-1 text-xs text-white transition-colors hover:bg-white/10"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span className="text-emerald-400">已复制</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        复制
                      </>
                    )}
                  </button>
                </div>
                <a
                  href={bundle.driveLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-slate-950 transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25"
                >
                  <ExternalLink className="h-4 w-4" />
                  打开夸克网盘下载
                </a>
              </>
            ) : (
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" />
                <div className="text-xs text-slate-300">
                  <span className="font-semibold text-amber-400">分享链接准备中：</span>
                  <span className="text-slate-400">
                    请先把对应的压缩包上传到夸克网盘，创建分享链接后，替换本页面 <code className="rounded bg-slate-800 px-1 font-mono text-[10px] text-amber-300">Resources.tsx</code> 中的{' '}
                    <code className="rounded bg-slate-800 px-1 font-mono text-[10px] text-amber-300">QUARK_LINK_{bundle.id.toUpperCase().replace(/-/g, '_')}</code>{' '}
                    占位符。
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- 主页面 ---------- */
export default function Resources() {
  const { resources, init } = useStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [selected, setSelected] = useState<Resource | null>(null);
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);

  useEffect(() => {
    init();
  }, [init]);

  const categories = useMemo(() => [...new Set(resources.map((r) => r.category))], [resources]);

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      const matchSearch =
        !search ||
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = !category || r.category === category;
      return matchSearch && matchCat;
    });
  }, [resources, search, category]);

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg">
              <Download className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white sm:text-3xl">资源下载站</h1>
              <p className="text-sm text-slate-500">
                我通过 AI 沉淀的全部资产 · 夸克网盘直链 · 持续更新
              </p>
            </div>
          </div>

          {/* 公告条 */}
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-2.5">
            <Rocket className="h-4 w-4 flex-shrink-0 text-emerald-400" />
            <p className="text-xs text-emerald-100/80">
              <span className="font-semibold text-emerald-300">全部资源通过夸克网盘分享</span>
              <span className="text-emerald-200/60"> · 永久有效 · 点击卡片即可获取下载链接</span>
            </p>
          </div>
        </div>

        {/* 4 大资源包 */}
        <div className="mb-12">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-amber-400">
                · 四大资源包 ·
              </div>
              <h2 className="text-xl font-bold text-white sm:text-2xl">核心资产打包下载</h2>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {BUNDLES.map((b) => (
              <BundleCard key={b.id} bundle={b} onClick={() => setSelectedBundle(b)} />
            ))}
          </div>
        </div>

        {/* 其他资源（原有数据） */}
        {resources.length > 0 && (
          <div>
            <div className="mb-5">
              <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-500">
                · 更多资源 ·
              </div>
              <h2 className="text-xl font-bold text-white">单份资源下载</h2>
            </div>

            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="sm:w-80">
                <SearchBar
                  value={search}
                  onChange={setSearch}
                  placeholder="搜索资源名称或描述..."
                />
              </div>
              <CategoryFilter categories={categories} selected={category} onChange={setCategory} />
            </div>

            {filtered.length === 0 ? (
              <div className="py-16 text-center">
                <Download className="mx-auto mb-3 h-10 w-10 text-slate-700" />
                <p className="text-sm text-slate-500">没有找到匹配的资源</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((res) => (
                  <ResourceCard key={res.id} resource={res} onClick={() => setSelected(res)} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <DetailModal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name || ''}
        imageUrl={selected?.imageUrl || ''}
        detail={selected?.detail || ''}
        driveLink={selected?.driveLink}
        category={selected?.category || ''}
      />

      <BundleDetailModal bundle={selectedBundle} onClose={() => setSelectedBundle(null)} />
    </div>
  );
}
