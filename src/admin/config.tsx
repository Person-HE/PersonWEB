/**
 * 管理后台 - 三类数据的字段配置
 *
 * 用于通用 CRUD 页面动态渲染表单：
 * - text: 单行文本
 * - textarea: 多行文本
 * - number: 数字
 * - select: 下拉选择
 * - tags: 标签数组（逗号分隔输入）
 * - boolean: 布尔
 * - json: JSON 编辑（小对象）
 * - url: URL（带验证）
 */
import type { Resource, Tool, Service, ResourceCategory, ToolCategory, AccessType, Pricing, ServiceType } from '@/types';

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'tags'
  | 'boolean'
  | 'json'
  | 'url';

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  options?: (string | number)[];
  required?: boolean;
  placeholder?: string;
  /** 嵌套对象的字段路径，如 'delivery.method' */
  path?: string;
  full?: boolean; // 在表单中占整行
  readOnly?: boolean; // 编辑时只读（不可修改）
}

export interface CrudConfig<T> {
  name: string;          // 资源 / 工具 / 服务
  basePath: string;      // /admin/resources 等
  titleKey: string;      // 列表显示用的标题字段
  fields: FieldDef[];
  /** 创建时的默认对象 */
  defaultItem: () => T;
}

// ===== 资源字段 =====
export const resourceConfig: CrudConfig<Resource> = {
  name: '资源',
  basePath: '/admin/resources',
  titleKey: 'title',
  defaultItem: () => ({
    id: '',
    title: '',
    category: 'AI资料',
    subCategory: '',
    description: '',
    videoRef: null,
    productUrl: null,
    updatedAt: new Date().toISOString().slice(0, 10),
    createdAt: new Date().toISOString().slice(0, 10),
    tags: [],
    isHot: false,
    isNew: true,
  }),
  fields: [
    { key: 'id', label: 'ID（英文唯一）', type: 'text', required: true, placeholder: '如 sd-local-deploy', readOnly: true },
    { key: 'title', label: '标题', type: 'text', required: true, full: true },
    { key: 'category', label: '分类', type: 'select', options: ['个人产品', '教程资料', 'AI资料'] as ResourceCategory[], required: true },
    { key: 'subCategory', label: '子分类', type: 'text' },
    { key: 'isHot', label: '热门', type: 'boolean' },
    { key: 'isNew', label: '新', type: 'boolean' },
    { key: 'description', label: '简介', type: 'textarea', full: true, required: true },
    { key: 'productUrl', label: '产品链接（如果是个人产品）', type: 'url', full: true },
    { key: 'tags', label: '标签（逗号分隔）', type: 'tags', full: true },
    { key: 'videoRef', label: '对应视频（JSON: title/url/platform）', type: 'json', full: true },
    { key: 'createdAt', label: '创建日期', type: 'text' },
    { key: 'updatedAt', label: '更新日期', type: 'text' },
  ],
};

// ===== 工具字段 =====
export const toolConfig: CrudConfig<Tool> = {
  name: '工具',
  basePath: '/admin/tools',
  titleKey: 'name',
  defaultItem: () => ({
    id: '',
    name: '',
    description: '',
    category: 'chat-writing',
    url: '',
    accessType: '国内可用',
    pricing: '免费',
    icon: '',
    rating: 4,
    tags: [],
    addedAt: new Date().toISOString().slice(0, 10),
    isRecommended: false,
    recommendReason: null,
  }),
  fields: [
    { key: 'id', label: 'ID（英文唯一）', type: 'text', required: true, placeholder: '如 deepseek' },
    { key: 'name', label: '工具名', type: 'text', required: true },
    { key: 'category', label: '分类', type: 'select', options: ['chat-writing', 'image', 'video-audio', 'productivity', 'dev-tools', 'other'] as ToolCategory[], required: true },
    { key: 'accessType', label: '访问类型', type: 'select', options: ['国内可用', '需中转', '需翻墙'] as AccessType[] },
    { key: 'pricing', label: '定价', type: 'select', options: ['免费', '部分免费', '付费'] as Pricing[] },
    { key: 'rating', label: '评分（0-5）', type: 'number' },
    { key: 'isRecommended', label: '推荐', type: 'boolean' },
    { key: 'url', label: '官网链接', type: 'url', required: true, full: true },
    { key: 'icon', label: '图标 URL', type: 'url', full: true },
    { key: 'description', label: '描述', type: 'textarea', full: true, required: true },
    { key: 'tags', label: '标签（逗号分隔）', type: 'tags', full: true },
    { key: 'recommendReason', label: '推荐理由（推荐时填）', type: 'textarea', full: true },
    { key: 'addedAt', label: '收录日期', type: 'text' },
  ],
};

// ===== 服务字段 =====
export const serviceConfig: CrudConfig<Service> = {
  name: '服务',
  basePath: '/admin/services',
  titleKey: 'name',
  defaultItem: () => ({
    id: '',
    type: 'tool-config',
    name: '',
    price: '',
    priceRange: '',
    description: '',
    details: '',
    delivery: { method: '远程', time: '1-2 天', revisions: 1 },
    guarantee: '搞不定不收费',
    orderMethod: '微信下单',
    applicableScene: null,
    expectedEffect: null,
    maintenancePeriod: null,
  }),
  fields: [
    { key: 'id', label: 'ID（英文唯一）', type: 'text', required: true },
    { key: 'name', label: '服务名', type: 'text', required: true, full: true },
    { key: 'type', label: '类型', type: 'select', options: ['tool-config', 'ai-output', 'custom', 'product-pro', 'enterprise'] as ServiceType[], required: true },
    { key: 'price', label: '价格', type: 'text', placeholder: '如 9.9 元' },
    { key: 'priceRange', label: '价格区间', type: 'text', placeholder: '如 9.9 - 99 元' },
    { key: 'orderMethod', label: '下单方式', type: 'text' },
    { key: 'guarantee', label: '保障承诺', type: 'text', full: true },
    { key: 'description', label: '简介', type: 'textarea', full: true, required: true },
    { key: 'details', label: '详细说明', type: 'textarea', full: true, required: true },
    { key: 'delivery.method', label: '交付方式', type: 'text', path: 'delivery.method' },
    { key: 'delivery.time', label: '交付时间', type: 'text', path: 'delivery.time' },
    { key: 'delivery.revisions', label: '修改次数', type: 'number', path: 'delivery.revisions' },
    { key: 'applicableScene', label: '适用场景', type: 'textarea', full: true },
    { key: 'expectedEffect', label: '预期效果', type: 'textarea', full: true },
    { key: 'maintenancePeriod', label: '维护期', type: 'text' },
  ],
};

export const CRUD_CONFIGS = {
  resources: resourceConfig,
  tools: toolConfig,
  services: serviceConfig,
} as const;

export type CrudConfigKey = keyof typeof CRUD_CONFIGS;
