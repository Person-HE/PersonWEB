/**
 * 站点全局配置
 */

export const siteConfig = {
  /** 站点名称 */
  name: '阿维',
  /** 站点一句话定位 */
  tagline: '拒绝套壳 · 真实提效 —— 在线产品 / 作品集 / 技术服务',
  /** 站长称呼 */
  owner: '阿维',
  /** 站长一句话定位 */
  ownerTitle: '软件工程专业大三学生 · 全栈开发者，一个人一支队伍',
  /** 版权年份 */
  copyrightYear: 2026,

  /** 个人微信号（用于弹窗展示，留空表示尚未填写） */
  wechatId: 'HHX3090425323',
  /** 个人微信二维码图片路径 */
  wechatQrUrl: '/qrcode-wechat.jpg',
  /** 微信公众号二维码图片路径 */
  wechatOfficialQrUrl: '/qrcode-official.jpg',
  /** 抖音二维码图片路径 */
  douyinQrUrl: '/qrcode-douyin.jpg',

  /** 自媒体统一账号名（B站/小红书/快手/抖音） */
  socialBrand: '阿维AI实验室',
  /** IP 品牌 */
  brand: '真效 AI (ZHENXIAO AI)',
  /** 抖音主页链接（留空表示尚未填写） */
  douyinUrl: '',
  /** B站主页链接（留空表示尚未填写） */
  bilibiliUrl: '',
  /** 小红书主页链接（留空表示尚未填写） */
  xiaohongshuUrl: '',
  /** 快手主页链接（留空表示尚未填写） */
  kuaishouUrl: '',
  /** GitHub 主页链接 */
  githubUrl: 'https://github.com/Person-HE',
  /** 个人博客（Hexo） */
  blogUrl: 'https://person-he.github.io/',
};

/** 微信咨询场景对应的备注文案 */
export const wechatScenes = {
  'tool-config': '添加时请备注"装工具"',
  'ai-output': '添加时请备注"代做+具体需求"',
  custom: '添加时请备注"定制+需求"',
  'product-pro': '添加时请备注"产品咨询"',
  product: '添加时请备注"自研产品+产品名"',
  automation: '添加时请备注"自动化+需求"',
  enterprise: '添加时请备注"企业咨询+公司名"',
  default: '添加时请备注"来自网站"，方便我通过好友请求',
} as const;

export type WechatScene = keyof typeof wechatScenes;
