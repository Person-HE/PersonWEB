/**
 * 数据加载层 —— 优先从后端 API 加载，后端不可用时回退到静态 JSON
 *
 * - 主：GET /api/resources | /api/tools | /api/services（由管理后台维护）
 * - 备：/data/*.json 静态资源（保证后端未启动时前台仍可访问）
 *
 * 管理后台对数据的增删改查会实时反映到前台（调用 reload() 即可刷新）。
 */

import { create } from 'zustand';
import type { Resource, Tool, Service } from '@/types';
import { resourcesApi, toolsApi, servicesApi } from '@/lib/api';

interface DataState {
  resources: Resource[];
  tools: Tool[];
  services: Service[];

  loading: boolean;
  loaded: boolean;
  error: string | null;
  /** 当前数据来源：api=后端 / static=静态JSON回退 */
  source: 'api' | 'static' | null;

  /** 首次加载全部数据；已加载则跳过 */
  loadAll: () => Promise<void>;
  /** 强制重新加载（管理后台保存后调用） */
  reload: () => Promise<void>;
}

/** 静态 JSON 回退 */
async function fetchStaticJson<T>(url: string): Promise<T> {
  const resp = await fetch(url, { cache: 'no-cache' });
  if (!resp.ok) throw new Error(`加载失败: ${url} (${resp.status})`);
  return (await resp.json()) as T;
}

/** 单类数据加载：优先 API，失败则回退静态 JSON */
async function loadWithFallback<T>(
  apiFn: () => Promise<T[]>,
  staticUrl: string,
): Promise<{ data: T[]; source: 'api' | 'static' }> {
  try {
    const data = await apiFn();
    return { data, source: 'api' };
  } catch (e) {
    console.warn(`[useDataStore] 后端 API 不可用，回退静态 JSON: ${staticUrl}`, e);
    const data = await fetchStaticJson<T[]>(staticUrl);
    return { data, source: 'static' };
  }
}

export const useDataStore = create<DataState>((set, get) => ({
  resources: [],
  tools: [],
  services: [],
  loading: false,
  loaded: false,
  error: null,
  source: null,

  loadAll: async () => {
    // 已加载过：静默刷新（后台拉取最新数据，不显示 loading，避免页面闪烁）
    if (get().loaded) {
      try {
        const [r, t, s] = await Promise.all([
          loadWithFallback(resourcesApi.list, '/data/resources.json'),
          loadWithFallback(toolsApi.list, '/data/tools.json'),
          loadWithFallback(servicesApi.list, '/data/services.json'),
        ]);
        const source: 'api' | 'static' =
          r.source === 'api' || t.source === 'api' || s.source === 'api' ? 'api' : 'static';
        set({ resources: r.data, tools: t.data, services: s.data, source });
      } catch {
        // 静默刷新失败时保留旧数据，不打扰用户
      }
      return;
    }
    // 正在加载中：跳过
    if (get().loading) return;

    set({ loading: true, error: null });
    try {
      const [r, t, s] = await Promise.all([
        loadWithFallback(resourcesApi.list, '/data/resources.json'),
        loadWithFallback(toolsApi.list, '/data/tools.json'),
        loadWithFallback(servicesApi.list, '/data/services.json'),
      ]);
      // 三者只要有一个走 API 即标记为 api 来源（多数情况下三者一致）
      const source: 'api' | 'static' =
        r.source === 'api' || t.source === 'api' || s.source === 'api' ? 'api' : 'static';
      set({
        resources: r.data,
        tools: t.data,
        services: s.data,
        loading: false,
        loaded: true,
        source,
      });
    } catch (e) {
      set({
        loading: false,
        loaded: true,
        error: e instanceof Error ? e.message : '数据加载失败',
        source: null,
      });
    }
  },

  reload: async () => {
    set({ loaded: false, loading: false, error: null });
    await get().loadAll();
  },
}));
