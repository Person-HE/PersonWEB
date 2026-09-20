/**
 * 类型定义 —— 严格遵循《网站需求文档与功能清单》中各数据的 Schema
 */

/** 资源大类 */
export type ResourceCategory = '个人产品' | '教程资料' | 'AI资料';

/** AI工具导航分类标识 */
export type ToolCategory =
  | 'chat-writing'
  | 'image'
  | 'video-audio'
  | 'productivity'
  | 'dev-tools'
  | 'other';

/** 工具访问类型 */
export type AccessType = '国内可用' | '需中转' | '需翻墙';

/** 工具定价类型 */
export type Pricing = '免费' | '部分免费' | '付费';

/** 服务类型 */
export type ServiceType =
  | 'tool-config'
  | 'ai-output'
  | 'custom'
  | 'product-pro'
  | 'enterprise'
  | 'product'
  | 'automation';

/** 资源 */
export interface Resource {
  id: string;
  title: string;
  category: ResourceCategory;
  subCategory: string;
  description: string;
  icon: string;
  coverImage: string | null;
  videoUrl: string | null;
  fileCount: number;
  fileList: string[];
  linkUrl: string | null;
  linkPassword: string | null;
  /** 旧字段兼容 */
  productUrl?: string | null;
  downloadUrl?: string | null;
  updatedAt: string;
  createdAt: string;
  tags: string[];
  isHot: boolean;
  isNew: boolean;
  /** 截图画廊（多张） */
  screenshots: string[];
  /** 在线Demo链接 */
  demoUrl: string | null;
}

/** AI工具 */
export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  url: string;
  accessType: AccessType;
  pricing: Pricing;
  icon: string;
  rating: number;
  tags: string[];
  addedAt: string;
  isRecommended: boolean;
  recommendReason: string | null;
}

/** 服务交付信息 */
export interface ServiceDelivery {
  method: string;
  time: string;
  revisions: number;
}

/** 服务案例研究 */
export interface ServiceCaseStudy {
  /** 案例标题 */
  title: string;
  /** 背景痛点 */
  background: string;
  /** 解决方案 */
  solution: string;
  /** 成果数据 */
  result: string;
  /** 技术栈 */
  techStack: string[];
}

/** 量化指标 */
export interface ServiceMetric {
  label: string;
  value: string;
}

/** 服务 */
export interface Service {
  id: string;
  type: ServiceType;
  name: string;
  price: string;
  priceRange: string;
  description: string;
  details: string;
  delivery: ServiceDelivery;
  guarantee: string;
  orderMethod: string;
  applicableScene: string | null;
  expectedEffect: string | null;
  maintenancePeriod: string | null;
  /** 自研产品链接（product 类型用） */
  productUrl: string | null;
  /** 标签 */
  tags: string[];
  /** 服务封面图（案例效果图） */
  coverImage: string | null;
  /** 案例截图画廊（多张） */
  screenshots: string[];
  /** 演示视频链接 */
  videoUrl: string | null;
  /** 在线Demo链接 */
  liveDemoUrl: string | null;
  /** 案例研究 */
  caseStudy: ServiceCaseStudy | null;
  /** 量化指标 */
  metrics: ServiceMetric[];
  /** 是否为招牌展示案例 */
  isFeatured: boolean;
}

/** AI工具导航分类元数据 */
export interface ToolCategoryMeta {
  id: ToolCategory;
  name: string;
  description: string;
}

/** 服务类型元数据 */
export interface ServiceTypeMeta {
  id: ServiceType;
  name: string;
  description: string;
  priceRange: string;
}

// ==================== 作品集（后台可管理） ====================

export type PortfolioStatus = '已上线' | '维护中' | '已完成' | '归档';
export type PortfolioCategory = 'web-app' | 'desktop' | 'cli' | 'backend' | 'ai' | 'site';

export interface CaseHighlight {
  title: string;
  desc: string;
}

/** 关键技术决策：问题 → 选择 → 理由 */
export interface TechDecision {
  question: string;
  choice: string;
  reason: string;
}

/** 成果数据指标，source 为可复现出处（无出处不渲染） */
export interface CaseMetric {
  label: string;
  value: string;
  source: string;
}

/** 外部深链（关联文章 / 代码直达） */
export interface RelatedLink {
  label: string;
  url: string;
}

export interface Portfolio {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  status: PortfolioStatus;
  category: PortfolioCategory;
  /** GitHub 仓库名（用于与 /api/github 活数据按名匹配），无仓库留空 */
  repo: string;
  demoUrl: string | null;
  coverImage: string | null;
  screenshots: string[];
  techStack: string[];
  role: string;
  period: string;
  /** 挑战 */
  problem: string;
  /** 方案与架构 */
  solution: string;
  highlights: CaseHighlight[];
  decisions: TechDecision[];
  metrics: CaseMetric[];
  /** 关联博客文章 */
  relatedPosts: RelatedLink[];
  /** 代码直达（链到具体文件而非仓库首页） */
  relatedFiles: RelatedLink[];
  /** 底部 CTA 关联的服务 id */
  ctaServiceId: string | null;
  isFeatured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

// ==================== 个人画像（单文档，后台可管理） ====================

export interface TimelineEntry {
  date: string;
  title: string;
  desc: string;
}

export interface CapabilityEntry {
  title: string;
  desc: string;
  evidenceLabel: string;
  evidenceUrl: string;
}

/** 精力分配模型（45/35/15/5） */
export interface EffortLayer {
  layer: string;
  percent: number;
  focus: string;
}

export interface Profile {
  id: 'me';
  /** 对外称呼 */
  nickname: string;
  realName: string;
  avatarUrl: string | null;
  /** IP 品牌与 slogan */
  brand: string;
  slogan: string;
  /** 一句话身份定位 */
  identity: string;
  location: string;
  /** 主攻方向 */
  focus: string;
  /** 个人故事（关于页） */
  story: string;
  timeline: TimelineEntry[];
  capabilities: CapabilityEntry[];
  effortModel: EffortLayer[];
  /** 价值观标签 */
  values: string[];
  githubUrl: string;
  blogUrl: string;
  updatedAt: string;
}

// ==================== 需求报价表单 ====================

export type QuoteStatus = '待处理' | '已回复' | '已成交' | '无效';

export interface Quote {
  id: string;
  name: string;
  contact: string;
  serviceType: string;
  budget: string;
  deadline: string;
  /** 来源渠道（GitHub/博客/搜索…） */
  channel: string;
  message: string;
  /** 来源页面引用（如 portfolio slug / 服务 id），用于归因 */
  ref: string;
  status: QuoteStatus;
  createdAt: string;
}

// ==================== 活数据快照（API 只读，非后台管理） ====================

export interface RepoInfo {
  name: string;
  description: string;
  language: string | null;
  pushedAt: string;
  htmlUrl: string;
  topics: string[];
}

/** /api/github：cron 定时拉取 GitHub API 后写入 KV 的快照 */
export interface GithubSnapshot {
  fetchedAt: string;
  user: { login: string; publicRepos: number };
  repos: RepoInfo[];
  /** 距最近一次 push 的天数 */
  lastPushDays: number | null;
}

export interface BlogPost {
  title: string;
  url: string;
  date: string;
  summary: string;
}

/** /api/blog：cron 定时解析 Hexo atom.xml 后写入 KV 的快照 */
export interface BlogFeed {
  fetchedAt: string;
  posts: BlogPost[];
}
