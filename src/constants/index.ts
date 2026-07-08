/**
 * 常量定义 —— AI工具分类、服务类型、服务流程等 UI 配置
 * 注意：这些是 UI 层固定配置，不是业务数据，业务数据从 /data/*.json 加载
 */

import type { ServiceType, ToolCategory, ToolCategoryMeta, ServiceTypeMeta } from '@/types';

/** AI工具导航分类 */
export const TOOL_CATEGORIES: ToolCategoryMeta[] = [
  { id: 'chat-writing', name: 'AI对话/写作', description: 'ChatGPT、Claude 等对话类 + 文案写作类' },
  { id: 'image', name: 'AI绘画/图像', description: 'Midjourney、DALL-E 等图像生成/编辑类' },
  { id: 'video-audio', name: 'AI视频/音频', description: '视频生成、语音合成、音乐生成类' },
  { id: 'productivity', name: 'AI效率工具', description: '翻译、OCR、思维导图、笔记类' },
  { id: 'dev-tools', name: '开发者工具', description: '代码辅助、API平台、部署工具类' },
  { id: 'other', name: '其他/新发现', description: '暂未归类或跨类别的工具' },
];

/** 服务类型 */
export const SERVICE_TYPES: ServiceTypeMeta[] = [
  {
    id: 'tool-config',
    name: '工具配置服务',
    description: '远程帮你安装、配置、调试各种AI工具。你不用折腾，我来搞定。',
    priceRange: '9.9 - 29.9 元',
  },
  {
    id: 'ai-output',
    name: 'AI成品代做',
    description: '你说需求，我出成品。不教你用AI，直接给你AI做好的东西。',
    priceRange: '9.9 - 99 元/件',
  },
  {
    id: 'custom',
    name: '定制服务',
    description: '针对你的具体场景，量身定制AI解决方案。不是通用模板，是为你量身打造的。',
    priceRange: '29.9 元起',
  },
  {
    id: 'product-pro',
    name: '产品付费版',
    description: '免费工具觉得好用？付费解锁更多功能。先免费试用，满意再升级。',
    priceRange: '按产品定价',
  },
  {
    id: 'product',
    name: '自研产品',
    description: '我自己做的AI产品，解决具体场景问题。不是套壳，是真用得上的工具。',
    priceRange: '按产品定价',
  },
  {
    id: 'automation',
    name: 'AI自动化',
    description: '把你的重复性工作交给AI自动完成。从内容生产到工作流，全程自动化。',
    priceRange: '99 - 999 元',
  },
  {
    id: 'skills',
    name: 'Skills/提示词',
    description: '经过实测的Prompt模板和Skills，拿来就能用，覆盖主流创作场景。',
    priceRange: '9.9 - 39.9 元',
  },
  {
    id: 'enterprise',
    name: '企业AI落地搭建',
    description: '帮企业真正把AI用起来。不是概念，不是PPT，是落到工位上、每天能用的工具。',
    priceRange: '3,000 - 20,000 元/项目',
  },
];

/** 服务类型 → 图标 key 映射（供组件选取 lucide 图标） */
export const SERVICE_TYPE_ICON: Record<ServiceType, string> = {
  'tool-config': 'wrench',
  'ai-output': 'wand',
  custom: 'puzzle',
  'product-pro': 'crown',
  product: 'box',
  automation: 'workflow',
  skills: 'sparkles',
  enterprise: 'building',
};

/** 企业服务合作流程 */
export const ENTERPRISE_PROCESS = [
  { step: 1, name: '免费咨询', desc: '加微信聊需求，评估可行性，不收费' },
  { step: 2, name: '需求调研', desc: '深入了解业务场景，梳理具体需求' },
  { step: 3, name: '方案报价', desc: '给出详细技术方案和明确报价' },
  { step: 4, name: '开发交付', desc: '按方案开发，定期同步进度' },
  { step: 5, name: '验收维护', desc: '验收通过后提供免费维护期' },
];

/** 企业服务优势 */
export const ENTERPRISE_ADVANTAGES = [
  { title: '实战经验', desc: '不是理论派，每个方案都经过实际验证' },
  { title: '透明报价', desc: '一口价，不玩套路，报价即最终价' },
  { title: '快速交付', desc: '小项目1-2周，大项目不超过1个月' },
  { title: '售后保障', desc: '免费维护期内有问题随时找我' },
];

/** 企业服务痛点 */
export const ENTERPRISE_PAINS = [
  { title: 'AI很火但不知道怎么用', desc: '看了很多案例，但都是大厂才能做的，自己的业务不知道从哪入手' },
  { title: '买了一堆AI账号不会用', desc: '员工不会用，沦为摆设，钱花了却没产生价值' },
  { title: '外包做完没人维护', desc: '请外包公司做了个AI项目，交付后没人维护，最后还是用不起来' },
  { title: '不知道效果能到什么程度', desc: '担心投入产出比，怕钱花了却看不到实际效果' },
];

/** 企业服务 FAQ */
export const ENTERPRISE_FAQS = [
  { q: '你们团队有几个人？', a: '目前是个人开发者，小项目一人搞定，大项目会协调合作开发者。' },
  { q: '可以签正规合同吗？', a: '可以，支持签合同和对公转账。' },
  { q: '做出来不满意怎么办？', a: '按阶段验收，每个阶段确认后再推进下一步。验收不通过不收取尾款。' },
  { q: '维护期过了怎么办？', a: '可选续约维护，也可以自己维护，我会提供完整文档。' },
  { q: '可以先做个Demo看看效果吗？', a: '部分服务可以提供演示Demo，具体加微信聊。' },
];

/** 站长技术栈（关于页展示用） */
export const TECH_STACK = [
  { group: '前端', items: ['React', 'TypeScript', 'Vue', 'Tailwind CSS'] },
  { group: '后端', items: ['Node.js', 'Python', 'Spring Boot', 'MySQL', 'Redis'] },
  { group: 'AI相关', items: ['LangChain', 'RAG', 'Prompt Engineering', '各类AI API'] },
  { group: '工具/运维', items: ['Docker', 'Git', 'Vite', 'Vercel'] },
];

/** 获取工具分类名称 */
export function getToolCategoryName(id: ToolCategory): string {
  return TOOL_CATEGORIES.find((c) => c.id === id)?.name ?? id;
}

/** 获取服务类型元数据 */
export function getServiceTypeMeta(id: ServiceType): ServiceTypeMeta | undefined {
  return SERVICE_TYPES.find((s) => s.id === id);
}
