/**
 * 鉴权状态 —— token + 当前用户，localStorage 持久化
 *
 * 安全注意：
 * - token 存在 localStorage（前端标准做法，HttpOnly cookie 在跨域 + Vite dev 下复杂）
 * - 退出时立即清除
 * - 8h 自动过期（由 JWT 控制）
 */
import { create } from 'zustand';

const LS_KEY = 'personweb_admin_auth';

interface AuthUser {
  id: number;
  username: string;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  /** 是否已登录 */
  isAuthenticated: boolean;
  /** 从 localStorage 恢复 */
  restore: () => void;
  /** 设置登录态 */
  setAuth: (token: string, user: AuthUser) => void;
  /** 清除登录态 */
  clear: () => void;
}

function loadFromStorage(): { token: string | null; user: AuthUser | null } {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { token: null, user: null };
    const data = JSON.parse(raw);
    if (data && data.token && data.user) {
      return { token: data.token, user: data.user };
    }
  } catch {
    // ignore
  }
  return { token: null, user: null };
}

function saveToStorage(token: string, user: AuthUser) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({ token, user }));
  } catch {
    // ignore
  }
}

function clearStorage() {
  try {
    localStorage.removeItem(LS_KEY);
  } catch {
    // ignore
  }
}

const initial = loadFromStorage();

export const useAuthStore = create<AuthState>((set) => ({
  token: initial.token,
  user: initial.user,
  isAuthenticated: !!initial.token,

  restore: () => {
    const { token, user } = loadFromStorage();
    set({ token, user, isAuthenticated: !!token });
  },

  setAuth: (token, user) => {
    saveToStorage(token, user);
    set({ token, user, isAuthenticated: true });
  },

  clear: () => {
    clearStorage();
    set({ token: null, user: null, isAuthenticated: false });
  },
}));
