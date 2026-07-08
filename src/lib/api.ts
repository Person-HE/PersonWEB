/**
 * 后端 API 客户端 —— 统一封装 fetch，自动携带 JWT
 *
 * 后端地址通过 Vite 环境变量 VITE_API_BASE 配置，默认同源
 */
import { useAuthStore } from '@/store/useAuthStore';

export const API_BASE = import.meta.env.VITE_API_BASE || '';

/** 鉴权失败时清理本地状态并跳转登录 */
function handleAuthFail() {
  useAuthStore.getState().clear();
  if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/admin/login')) {
    window.location.href = '/admin/login';
  }
}

/** 统一请求封装 */
export async function api<T = any>(
  path: string,
  opts: RequestInit = {},
): Promise<T> {
  const token = useAuthStore.getState().token;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers as Record<string, string> || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  let resp: Response;
  try {
    resp = await fetch(`${API_BASE}${path}`, {
      ...opts,
      headers,
    });
  } catch (e) {
    throw new Error('网络错误：无法连接到服务器');
  }

  // 401 鉴权失败
  if (resp.status === 401) {
    handleAuthFail();
    throw new Error('登录已过期');
  }

  // 解析 JSON
  let data: any = null;
  const ct = resp.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    data = await resp.json();
  } else {
    data = await resp.text();
  }

  if (!resp.ok) {
    const msg = (data && typeof data === 'object' && data.error) || `请求失败 (${resp.status})`;
    throw new Error(msg);
  }

  return data as T;
}

/** 公开接口（不带 token） */
export async function apiPublic<T = any>(
  path: string,
  opts: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers as Record<string, string> || {}),
  };
  let resp: Response;
  try {
    resp = await fetch(`${API_BASE}${path}`, { ...opts, headers });
  } catch (e) {
    throw new Error('网络错误：无法连接到服务器');
  }
  let data: any = null;
  const ct = resp.headers.get('content-type') || '';
  if (ct.includes('application/json')) data = await resp.json();
  else data = await resp.text();
  if (!resp.ok) {
    const msg = (data && typeof data === 'object' && data.error) || `请求失败 (${resp.status})`;
    throw new Error(msg);
  }
  return data as T;
}

/** 登录 */
export const authApi = {
  login: (username: string, password: string) =>
    apiPublic<{ token: string; user: { id: number; username: string } }>(
      '/api/auth/login',
      { method: 'POST', body: JSON.stringify({ username, password }) },
    ),
  me: () => api<{ user: { id: number; username: string } }>('/api/auth/me'),
  logout: () => api<{ ok: boolean }>('/api/auth/logout', { method: 'POST' }),
  changePassword: (oldPassword: string, newPassword: string) =>
    api<{ ok: boolean }>('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ oldPassword, newPassword }),
    }),
};

/** 通用 CRUD 接口工厂 */
export function crudApi<T extends { id: string }>(basePath: string) {
  return {
    list: () => apiPublic<T[]>(basePath),
    get: (id: string) => apiPublic<T>(`${basePath}/${String(id)}`),
    create: (item: T) =>
      api<T>(basePath, { method: 'POST', body: JSON.stringify({ ...item, id: String(item.id) }) }),
    update: (id: string, item: T) =>
      api<T>(`${basePath}/${String(id)}`, { method: 'PUT', body: JSON.stringify({ ...item, id: String(id) }) }),
    remove: (id: string) =>
      api<{ ok: boolean; id: string }>(`${basePath}/${String(id)}`, { method: 'DELETE' }),
    reorder: (ids: string[]) =>
      api<{ ok: boolean; count: number }>(`${basePath}/reorder`, {
        method: 'POST',
        body: JSON.stringify({ ids: ids.map(String) }),
      }),
  };
}

export const resourcesApi = crudApi<import('@/types').Resource>('/api/resources');
export const toolsApi = crudApi<import('@/types').Tool>('/api/tools');
export const servicesApi = crudApi<import('@/types').Service>('/api/services');

export const logsApi = {
  list: (limit = 100) => api<any[]>(`/api/logs?limit=${limit}`),
};
