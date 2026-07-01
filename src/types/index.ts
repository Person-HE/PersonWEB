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
  | 'enterprise';

/** 视频引用 */
export interface VideoRef {
  title: string;
  url: string;
  platform: '抖音' | 'B站' | 'YouTube';
}

/** 资源 */
export interface Resource {
  id: string;
  title: string;
  category: ResourceCategory;
  subCategory: string;
  description: string;
  icon: string;
  coverImage: string | null;
  videoRef: VideoRef | null;
  fileCount: number;
  fileList: string[];
  downloadUrl: string | null;
  productUrl: string | null;
  updatedAt: string;
  createdAt: string;
  tags: string[];
  isHot: boolean;
  isNew: boolean;
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
