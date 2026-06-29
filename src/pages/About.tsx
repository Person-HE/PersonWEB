import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  Code2,
  Zap,
  Rocket,
  MessageCircle,
  ArrowRight,
  Github,
  BookOpen,
  Palette,
  Server,
  Cpu,
  TrendingUp,
  PenTool,
  Layers,
  Target,
  Lightbulb,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Heart,
} from 'lucide-react';

/* ---------- 技能矩阵 ---------- */
const skillGroups = [
  {
    title: '后端工程',
    icon: Server,
    gradient: 'from-violet-500 to-purple-600',
    skills: [
      { name: 'Java / Spring Boot', level: 85 },
      { name: 'MySQL / Redis', level: 80 },
      { name: '微服务 / K8s / Kafka', level: 70 },
      { name: '系统设计 / 分布式', level: 65 },
    ],
  },
  {
    title: 'AI 应用',
    icon: Cpu,
    gradient: 'from-emerald-500 to-cyan-600',
    skills: [
      { name: 'AI Agents / RAG', level: 90 },
      { name: 'LangChain4j / MCP', level: 85 },
      { name: 'Prompt Engineering', level: 90 },
      { name: 'AI 工作流设计', level: 88 },
    ],
  },
  {
    title: '前端产品',
    icon: Palette,
    gradient: 'from-pink-500 to-rose-600',
    skills: [
      { name: 'React / TypeScript', level: 80 },
      { name: 'Tailwind / UI 设计', level: 75 },
      { name: 'Vite / 工程化', level: 75 },
      { name: 'Vercel 部署', level: 85 },
    ],
  },
  {
    title: '内容创作',
    icon: PenTool,
    gradient: 'from-amber-500 to-orange-600',
    skills: [
      { name: 'AI 内容生产', level: 92 },
      { name: '自媒体运营', level: 78 },
      { name: '知识蒸馏 / Skill', level: 90 },
      { name: '技术文档写作', level: 88 },
    ],
  },
];

/* ---------- 项目精选 ---------- */
const featuredProjects = [
  {
    name: 'AutoEdit',
    desc: '浏览器端专业视频剪辑 + AI 导演引擎',
    tags: ['React', 'WebCodecs', 'AI'],
    color: 'emerald',
  },
  {
    name: 'webcreate',
    desc: 'Procreate 风格 Web 绘图工具 + CLI 工具链',
    tags: ['Canvas', 'TypeScript', 'CLI'],
    color: 'cyan',
  },
  {
    name: 'Note-Plan',
    desc: '跨平台笔记应用 · Web/桌面/Android 三端',
    tags: ['Electron', 'React Native', '全栈'],
    color: 'violet',
  },
  {
    name: 'material',
    desc: '多引擎素材处理 · 截图/录屏/图片美化',
    tags: ['多引擎', '图片处理', '自动化'],
    color: 'amber',
  },
  {
    name: 'PersonWEB',
    desc: '个人品牌站 · 工具集/资源站/导航/IP 展示',
    tags: ['React', 'Tailwind', 'Vercel'],
    color: 'pink',
  },
  {
    name: 'Chat',
    desc: '全栈即时通讯 · JWT + MySQL + WebSocket',
    tags: ['全栈', 'WebSocket', 'MySQL'],
    color: 'blue',
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', dot: 'bg-emerald-400' },
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20', dot: 'bg-cyan-400' },
  violet: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20', dot: 'bg-violet-400' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', dot: 'bg-amber-400' },
  pink: { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/20', dot: 'bg-pink-400' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', dot: 'bg-blue-400' },
};

/* ---------- 成长路径（替代旧 timeline） ---------- */
const journey = [
  {
    phase: '起点',
    title: '发现信息差',
    desc: '帮朋友和家人解决手机电脑问题时，发现很多人因为不知道免费工具的存在，花冤枉钱甚至被骗。',
    icon: Lightbulb,
  },
  {
    phase: '探索',
    title: '用 AI 武装自己',
    desc: '系统学习 Java 后端 + AI 应用技术，沉淀 550+ 技术文档，从零搭建知识体系。',
    icon: BookOpen,
  },
  {
    phase: '行动',
    title: '一个人 + AI = 一支团队',
    desc: '用 AI 做产品、写内容、蒸馏 Skills，独立完成 16+ 项目，38 个 AI 技能，4000+ 内容素材。',
    icon: Rocket,
  },
  {
    phase: '愿景',
    title: '让 AI 生产力被更多人看到',
    desc: '把工具、资源、方法论全部开源分享，帮助更多人消除信息差，用 AI 真正改变自己的生活。',
    icon: Target,
  },
];

/* ---------- 身份标签 ---------- */
const identityTags = [
  { label: 'AI 创作者', icon: Sparkles, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { label: '独立开发者', icon: Code2, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
  { label: '知识蒸馏师', icon: Brain, color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
  { label: '信息差猎手', icon: Target, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  { label: '内容工程师', icon: Layers, color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
];

/* ---------- SkillBar 组件 ---------- */
function SkillBar({ name, level }: { name: string; level: number }) {
  return (
    <div className="group">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs text-slate-300">{name}</span>
        <span className="text-[10px] font-mono text-slate-500 transition-colors group-hover:text-slate-300">
          {level}%
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-700"
          style={{ width: `${level}%` }}
        />
      </div>
    </div>
  );
}

/* ---------- 主页面 ---------- */
export default function About() {
  const [showAllProjects, setShowAllProjects] = useState(false);
  const visibleProjects = showAllProjects ? featuredProjects : featuredProjects.slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">

        {/* ===== HERO：个人品牌头部 ===== */}
        <div className="relative mb-16 overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-emerald-500/5 via-transparent to-pink-500/5 p-8 sm:p-12">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-pink-500/10 blur-3xl" />
          </div>

          <div className="relative flex flex-col items-center text-center sm:flex-row sm:text-left">
            {/* 头像区 */}
            <div className="mb-6 flex-shrink-0 sm:mb-0 sm:mr-8">
              <div className="relative">
                <div className="flex h-28 w-28 items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 shadow-2xl sm:h-32 sm:w-32">
                  <Brain className="h-14 w-14 text-emerald-400 sm:h-16 sm:w-16" />
                </div>
                <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-950 bg-emerald-500">
                  <Zap className="h-4 w-4 text-slate-950" />
                </div>
              </div>
            </div>

            <div className="flex-1">
              <h1 className="mb-2 text-3xl font-black text-white sm:text-4xl">
                用 AI 构建
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  数字生产力系统
                </span>
              </h1>
              <p className="mb-5 text-sm leading-relaxed text-slate-400 sm:text-base">
                一个人 + AI，搭起涵盖产品开发、知识体系、内容创作、自媒体运营的完整工作流。
                <br className="hidden sm:block" />
                相信"信息差"可以被消除，相信 AI 能让每个人都拥有杠杆。
              </p>
              <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                {identityTags.map((tag) => {
                  const Icon = tag.icon;
                  return (
                    <span
                      key={tag.label}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${tag.color}`}
                    >
                      <Icon className="h-3 w-3" />
                      {tag.label}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ===== 成长路径 ===== */}
        <div className="relative mb-20">
          <div className="mb-8 text-center">
            <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-emerald-400">
              · 成长路径 ·
            </div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">我是怎么走到今天的</h2>
          </div>

          <div className="relative">
            <div className="absolute left-6 top-2 bottom-2 w-px bg-gradient-to-b from-emerald-500/40 via-cyan-500/40 to-pink-500/40 sm:left-1/2" />
            <div className="space-y-8">
              {journey.map((item, i) => {
                const Icon = item.icon;
                const isEven = i % 2 === 0;
                return (
                  <div
                    key={i}
                    className={`relative flex flex-col sm:flex-row ${isEven ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}
                  >
                    <div className="absolute left-6 top-4 z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border-2 border-slate-950 bg-slate-900 sm:left-1/2">
                      <Icon className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className={`w-full sm:w-1/2 ${isEven ? 'sm:pr-12' : 'sm:pl-12'} pl-14 sm:pl-0`}>
                      <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 transition-all hover:border-white/10 hover:bg-white/[0.06]">
                        <span className="mb-2 inline-block rounded-md bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-400">
                          {item.phase}
                        </span>
                        <h3 className="mb-2 text-base font-semibold text-white">{item.title}</h3>
                        <p className="text-sm leading-relaxed text-slate-400">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ===== 技能矩阵 ===== */}
        <div className="mb-20">
          <div className="mb-8 text-center">
            <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-cyan-400">
              · 技能矩阵 ·
            </div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">我的技术栈和能力圈</h2>
            <p className="mt-2 text-sm text-slate-400">
              不只是会用 AI 聊天，而是把 AI 融入产品、内容、工作流的每个环节
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {skillGroups.map((group) => {
              const Icon = group.icon;
              return (
                <div
                  key={group.title}
                  className="group rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all hover:border-white/10 hover:bg-white/[0.04]"
                >
                  <div className="mb-5 flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${group.gradient} shadow-lg`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{group.title}</h3>
                  </div>
                  <div className="space-y-4">
                    {group.skills.map((skill) => (
                      <SkillBar key={skill.name} name={skill.name} level={skill.level} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== 项目经验 ===== */}
        <div className="mb-20">
          <div className="mb-8 text-center">
            <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-pink-400">
              · 项目经验 ·
            </div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">16+ 项目实战沉淀</h2>
            <p className="mt-2 text-sm text-slate-400">
              从产品构思到上线部署，全流程独立完成
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {visibleProjects.map((p) => {
              const c = colorMap[p.color];
              return (
                <div
                  key={p.name}
                  className={`group rounded-2xl border ${c.border} ${c.bg} p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg`}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div className={`h-2.5 w-2.5 rounded-full ${c.dot}`} />
                    <h3 className="text-base font-bold text-white">{p.name}</h3>
                  </div>
                  <p className="mb-4 text-sm text-slate-400">{p.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className={`rounded-md border border-white/5 bg-white/[0.03] px-2 py-0.5 text-[11px] ${c.text}`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {featuredProjects.length > 4 && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowAllProjects(!showAllProjects)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-300 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
              >
                {showAllProjects ? '收起' : `查看全部 ${featuredProjects.length} 个项目`}
                <ChevronRight
                  className={`h-4 w-4 transition-transform ${showAllProjects ? 'rotate-90' : ''}`}
                />
              </button>
            </div>
          )}
        </div>

        {/* ===== 数据亮点 ===== */}
        <div className="mb-20">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { value: '16+', label: '产品/项目', icon: Rocket, color: 'text-emerald-400' },
              { value: '550+', label: '技术文档', icon: BookOpen, color: 'text-cyan-400' },
              { value: '38', label: 'AI Skills', icon: Zap, color: 'text-amber-400' },
              { value: '4000+', label: '内容素材', icon: TrendingUp, color: 'text-pink-400' },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 text-center transition-all hover:border-white/10 hover:bg-white/[0.04]"
                >
                  <Icon className={`mx-auto mb-2 h-6 w-6 ${s.color}`} />
                  <div className="mb-1 text-2xl font-black text-white sm:text-3xl">{s.value}</div>
                  <div className="text-xs text-slate-500">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== 联系我 ===== */}
        <div className="rounded-3xl border border-white/5 bg-gradient-to-br from-emerald-500/5 via-cyan-500/3 to-pink-500/5 p-8 text-center sm:p-12">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15">
            <MessageCircle className="h-7 w-7 text-emerald-400" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-white">联系我</h2>
          <p className="mb-8 text-sm text-slate-400">
            合作 · 交流 · 技术咨询 · 自媒体运营 · 什么都可以聊
          </p>

          <div className="mb-8 inline-block rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex h-48 w-48 items-center justify-center rounded-xl bg-slate-800/80">
              <div className="text-center">
                <MessageCircle className="mx-auto mb-2 h-10 w-10 text-emerald-400/50" />
                <p className="text-xs text-slate-500">微信二维码</p>
                <p className="text-[10px] text-slate-600">替换为你的二维码图片</p>
              </div>
            </div>
          </div>

          <p className="mb-6 text-xs text-slate-600">
            扫描上方二维码或搜索微信号添加好友
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/resources"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition-all hover:shadow-xl hover:shadow-emerald-500/30"
            >
              <Rocket className="h-4 w-4" />
              获取全部资源
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://github.com/Person-HE"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all hover:border-white/20 hover:bg-white/10"
            >
              <Github className="h-4 w-4" />
              GitHub 主页
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
