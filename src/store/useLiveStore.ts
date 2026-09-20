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
      github: gh.status === 'fulfilled' ? gh.value : null,
      blog: blog.status === 'fulfilled' ? blog.value : null,
      loading: false,
      loaded: true,
    });
  },
}));

/** 按仓库名取活数据条目（portfolio.repo 匹配） */
export function repoOf(snapshot: GithubSnapshot | null, name: string) {
  if (!snapshot) return null;
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
