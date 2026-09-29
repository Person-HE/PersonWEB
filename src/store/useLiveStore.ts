/**
 * 活数据 store —— GitHub 快照 + 博客目录
 *
 * 数据由服务端 cron 每小时同步到 KV，前端只读。
 * 快照不可用时（503/网络错误）置 loaded 但保留 null，
 * 消费组件（TrustBar 等）自行降级为「数据截至」静态提示。
 */
import { create } from 'zustand';
import type { GithubSnapshot, BlogFeed } from '@/types';
import { liveApi } from '@/lib/api';

interface LiveState {
  github: GithubSnapshot | null;
  blog: BlogFeed | null;
  loading: boolean;
  loaded: boolean;

  load: () => Promise<void>;
}

export const useLiveStore = create<LiveState>((set, get) => ({
  github: null,
  blog: null,
  loading: false,
  loaded: false,

  load: async () => {
    if (get().loading || get().loaded) return;
    set({ loading: true });
    const [gh, blog] = await Promise.allSettled([liveApi.github(), liveApi.blog()]);
    set({
      github: asGithubSnapshot(gh.status === 'fulfilled' ? gh.value : null),
      blog: asBlogFeed(blog.status === 'fulfilled' ? blog.value : null),
      loading: false,
      loaded: true,
    });
  },
}));

/**
 * 快照接口在函数未生效时会返回 HTML 壳（200 + text/html），
 * 直接塞进 store 会让下游 snapshot.repos.find 崩掉整页；结构不对一律降级为 null。
 */
function asGithubSnapshot(v: unknown): GithubSnapshot | null {
  return v && typeof v === 'object' && Array.isArray((v as GithubSnapshot).repos)
    ? (v as GithubSnapshot)
    : null;
}

function asBlogFeed(v: unknown): BlogFeed | null {
  return v && typeof v === 'object' && Array.isArray((v as BlogFeed).posts) ? (v as BlogFeed) : null;
}

/** 按仓库名取活数据条目（portfolio.repo 匹配）；私有项目 repo 为 null，直接不匹配 */
export function repoOf(snapshot: GithubSnapshot | null, name: string | null | undefined) {
  if (!snapshot || !name || !Array.isArray(snapshot.repos)) return null;
  return snapshot.repos.find(r => r.name.toLowerCase() === name.toLowerCase()) || null;
}

/** pushedAt → 「x 天前」 */
export function daysAgo(iso: string): string {
  const d = Math.floor((Date.now() - Date.parse(iso)) / 86400000);
  if (Number.isNaN(d)) return '未知';
  if (d <= 0) return '今天';
  if (d === 1) return '昨天';
  return `${d} 天前`;
}
