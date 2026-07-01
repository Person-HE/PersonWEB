/**
 * 管理后台 - 登录页
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { isAuthenticated, setAuth } = useAuthStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/admin', { replace: true });
  }, [isAuthenticated, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username || !password) {
      setError('请输入用户名和密码');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { token, user } = await authApi.login(username, password);
      setAuth(token, user);
      navigate('/admin', { replace: true });
    } catch (e: any) {
      setError(e.message || '登录失败');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--paper)] px-4">
      <div className="w-full max-w-sm">
        <div className="hand-card hand-card-crimson p-8" style={{ transform: 'rotate(-0.5deg)' }}>
          {/* Logo */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[var(--ink)] bg-[var(--mustard)] shadow-[3px_3px_0_var(--ink)]">
              <Lock className="h-7 w-7 text-[var(--ink)]" />
            </div>
            <h1 className="ink-title font-hand-title text-2xl font-black">管理后台</h1>
            <p className="mt-1 font-hand-body text-xs text-[var(--ink-soft)]">仅管理员可访问</p>
          </div>

          {error ? (
            <div className="mb-4 flex items-center gap-2 rounded-lg border-2 border-red-400 bg-red-50 px-3 py-2 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--ink-soft)]">用户名</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-mute)]" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  className="w-full rounded-lg border-2 border-[var(--ink)] bg-[var(--paper-light)] py-2 pl-10 pr-3 text-sm outline-none focus:border-[var(--crimson)]"
                  placeholder="请输入用户名"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--ink-soft)]">密码</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-mute)]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full rounded-lg border-2 border-[var(--ink)] bg-[var(--paper-light)] py-2 pl-10 pr-3 text-sm outline-none focus:border-[var(--crimson)]"
                  placeholder="请输入密码"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="hand-btn hand-btn-primary w-full"
            >
              {loading ? '登录中...' : '登录'}
              {!loading ? <ArrowRight className="h-4 w-4" /> : null}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center font-hand-body text-xs text-[var(--ink-mute)]">
          登录尝试受 IP 限流保护 · 10 分钟内最多 5 次
        </p>
      </div>
    </div>
  );
}
