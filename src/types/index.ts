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
