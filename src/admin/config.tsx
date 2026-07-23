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
 * - gallery: 图片URL数组（多行输入，带预览）
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
  | 'url'
  | 'gallery';

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
    icon: '',
    coverImage: null,
    videoUrl: null,
    fileCount: 0,
    fileList: [],
    linkUrl: null,
    linkPassword: null,
    updatedAt: new Date().toISOString().slice(0, 10),
    createdAt: new Date().toISOString().slice(0, 10),
    tags: [],
    isHot: false,
    isNew: true,
    screenshots: [],
    demoUrl: null,
  }),
  fields: [
    { key: 'id', label: 'ID（英文唯一）', type: 'text', required: true, placeholder: '如 sd-local-deploy', readOnly: true },
    { key: 'title', label: '标题', type: 'text', required: true, full: true },
    { key: 'category', label: '分类', type: 'select', options: ['个人产品', '教程资料', 'AI资料'] as ResourceCategory[], required: true },
    { key: 'subCategory', label: '子分类', type: 'text' },
    { key: 'isHot', label: '热门', type: 'boolean' },
    { key: 'isNew', label: '新', type: 'boolean' },
    { key: 'description', label: '简介', type: 'textarea', full: true, required: true },
    { key: 'icon', label: '图标（emoji 或文字）', type: 'text', placeholder: '如 📦 或 SD' },
    { key: 'coverImage', label: '封面图 URL', type: 'url', full: true, placeholder: 'https://...' },
    { key: 'linkUrl', label: '网盘链接', type: 'url', full: true, placeholder: 'https://pan.baidu.com/...' },
    { key: 'linkPassword', label: '提取码', type: 'text', placeholder: '如 abc123（也可自动从链接 ?pwd= 中解析）' },
    { key: 'fileCount', label: '文件数量', type: 'number' },
    { key: 'fileList', label: '文件列表（每行一个）', type: 'tags', full: true },
    { key: 'tags', label: '标签（每行一个）', type: 'tags', full: true },
    { key: 'videoUrl', label: '抖音视频分享链接', type: 'url', full: true, placeholder: 'https://v.douyin.com/...' },
    { key: 'screenshots', label: '截图画廊（每行一个URL）', type: 'gallery', full: true, placeholder: 'https://...' },
    { key: 'demoUrl', label: '在线Demo链接', type: 'url', full: true, placeholder: 'https://...' },
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
    productUrl: null,
    tags: [],
    coverImage: null,
    screenshots: [],
    videoUrl: null,
    liveDemoUrl: null,
    caseStudy: null,
    metrics: [],
    isFeatured: false,
  }),
  fields: [
    { key: 'id', label: 'ID（英文唯一）', type: 'text', required: true },
    { key: 'name', label: '服务名', type: 'text', required: true, full: true },
    { key: 'type', label: '类型', type: 'select', options: ['tool-config', 'ai-output', 'custom', 'product-pro', 'product', 'automation', 'enterprise'] as ServiceType[], required: true },
    { key: 'isFeatured', label: '招牌展示案例', type: 'boolean' },
    { key: 'price', label: '价格', type: 'text', placeholder: '如 9.9 元' },
    { key: 'priceRange', label: '价格区间', type: 'text', placeholder: '如 9.9 - 99 元' },
    { key: 'orderMethod', label: '下单方式', type: 'text' },
    { key: 'guarantee', label: '保障承诺', type: 'text', full: true },
    { key: 'description', label: '简介', type: 'textarea', full: true, required: true },
    { key: 'details', label: '详细说明', type: 'textarea', full: true, required: true },
    { key: 'coverImage', label: '封面图 URL（案例效果图）', type: 'url', full: true, placeholder: 'https://...' },
    { key: 'screenshots', label: '案例截图画廊（每行一个URL）', type: 'gallery', full: true, placeholder: 'https://...' },
    { key: 'videoUrl', label: '演示视频链接', type: 'url', full: true, placeholder: 'https://... 或抖音分享链接' },
    { key: 'liveDemoUrl', label: '在线Demo链接', type: 'url', full: true, placeholder: 'https://...' },
    { key: 'productUrl', label: '产品链接（product 类型用）', type: 'url', full: true },
    { key: 'metrics', label: '量化指标（JSON数组）', type: 'json', full: true, placeholder: '[{"label":"GitHub Star","value":"9k+"}]' },
    { key: 'caseStudy', label: '案例研究（JSON对象）', type: 'json', full: true },
    { key: 'delivery.method', label: '交付方式', type: 'text', path: 'delivery.method' },
    { key: 'delivery.time', label: '交付时间', type: 'text', path: 'delivery.time' },
    { key: 'delivery.revisions', label: '修改次数', type: 'number', path: 'delivery.revisions' },
    { key: 'applicableScene', label: '适用场景', type: 'textarea', full: true },
    { key: 'expectedEffect', label: '预期效果', type: 'textarea', full: true },
    { key: 'maintenancePeriod', label: '维护期', type: 'text' },
    { key: 'tags', label: '标签（每行一个）', type: 'tags', full: true },
  ],
};

export const CRUD_CONFIGS = {
  resources: resourceConfig,
  tools: toolConfig,
  services: serviceConfig,
} as const;

export type CrudConfigKey = keyof typeof CRUD_CONFIGS;
