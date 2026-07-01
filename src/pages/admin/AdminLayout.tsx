/**
 * 管理后台 - 布局（侧栏 + 内容）
 *
 * 鉴权守卫：未登录跳转 /admin/login
 */
import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Compass,
  Wrench,
  ScrollText,
  KeyRound,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { authApi } from '@/lib/api';
import { siteConfig } from '@/config/site.config';

const NAV_ITEMS = [
  { to: '/admin', label: '概览', icon: LayoutDashboard, end: true },
  { to: '/admin/resources', label: '资源管理', icon: FileText },
  { to: '/admin/tools', label: '工具管理', icon: Compass },
  { to: '/admin/services', label: '服务管理', icon: Wrench },
  { to: '/admin/logs', label: '操作日志', icon: ScrollText },
  { to: '/admin/password', label: '修改密码', icon: KeyRound },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { isAuthenticated, user, clear } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  async function handleLogout() {
    try {
      await authApi.logout();
    } catch {
      // 忽略登出失败
    }
    clear();
    navigate('/admin/login', { replace: true });
  }

  return (
    <div className="min-h-screen bg-[var(--paper)]">
      {/* 顶部栏（移动端） */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--ink)]/20 bg-[var(--paper-light)] px-4 py-2 lg:hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-lg border border-[var(--ink)]/30 p-1.5"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <span className="font-hand-title text-base">管理后台</span>
        <button onClick={handleLogout} className="text-[var(--ink-mute)]">
          <LogOut className="h-5 w-5" />
        </button>
      </header>

      <div className="flex">
        {/* 侧栏 */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-60 transform border-r border-[var(--ink)]/20 bg-[var(--paper-light)] transition-transform lg:static lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="border-b border-[var(--ink)]/20 px-5 py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[var(--ink)] bg-[var(--crimson)] shadow-[2px_2px_0_var(--ink)]">
                  <span className="font-hand-title text-base font-black text-[var(--paper-light)]">
                    {siteConfig.owner.slice(0, 1)}
                  </span>
                </div>
                <div>
                  <div className="font-hand-title text-sm font-bold text-[var(--ink)]">管理后台</div>
                  <div className="text-xs text-[var(--ink-mute)]">{user?.username}</div>
                </div>
              </div>
            </div>

            {/* 导航 */}
            <nav className="flex-1 space-y-1 p-3">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                        isActive
                          ? 'bg-[var(--crimson)] text-white'
                          : 'text-[var(--ink-soft)] hover:bg-[var(--paper)]'
                      }`
                    }
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>

            {/* 底部 */}
            <div className="space-y-2 border-t border-[var(--ink)]/20 p-3">
              <Link
                to="/"
                target="_blank"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--ink-soft)] hover:bg-[var(--paper)]"
              >
                <ExternalLink className="h-4 w-4" />
                访问前台
              </Link>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                退出登录
              </button>
            </div>
          </div>
        </aside>

        {/* 遮罩（移动端） */}
        {sidebarOpen ? (
          <div
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        ) : null}

        {/* 内容区 */}
        <main className="min-w-0 flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
