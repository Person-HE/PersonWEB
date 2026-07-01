/**
 * 管理后台 - 修改密码
 */
import { useState } from 'react';
import { KeyRound, Check, AlertCircle } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

export default function AdminPassword() {
  const { clear } = useAuthStore();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('请填写所有字段');
      return;
    }
    if (newPassword.length < 8) {
      setError('新密码至少 8 位');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('两次输入的新密码不一致');
      return;
    }
    if (oldPassword === newPassword) {
      setError('新密码不能与原密码相同');
      return;
    }

    setLoading(true);
    try {
      await authApi.changePassword(oldPassword, newPassword);
      setSuccess(true);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      // 5 秒后强制重新登录（旧 token 仍然有效，但建议重新登录）
      setTimeout(() => {
        clear();
        window.location.href = '/admin/login';
      }, 3000);
    } catch (e: any) {
      setError(e.message || '修改失败');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="mb-6 font-hand-title text-2xl text-[var(--ink)]">修改密码</h1>

      <div className="hand-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-[var(--ink)] bg-[var(--mustard)] shadow-[1px_1px_0_var(--ink)]">
            <KeyRound className="h-4 w-4 text-[var(--ink)]" />
          </div>
          <p className="text-sm text-[var(--ink-soft)]">密码至少 8 位，建议包含字母、数字、符号</p>
        </div>

        {error ? (
          <div className="mb-4 flex items-center gap-2 rounded-lg border-2 border-red-400 bg-red-50 px-3 py-2 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}

        {success ? (
          <div className="mb-4 flex items-center gap-2 rounded-lg border-2 border-[var(--teal)] bg-[var(--teal)]/10 px-3 py-2 text-sm text-[var(--teal)]">
            <Check className="h-4 w-4 shrink-0" />
            <span>密码修改成功，3 秒后跳转登录页...</span>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--ink-soft)]">原密码</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full rounded-lg border-2 border-[var(--ink)] bg-[var(--paper-light)] px-3 py-2 text-sm outline-none focus:border-[var(--crimson)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--ink-soft)]">新密码</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full rounded-lg border-2 border-[var(--ink)] bg-[var(--paper-light)] px-3 py-2 text-sm outline-none focus:border-[var(--crimson)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--ink-soft)]">确认新密码</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full rounded-lg border-2 border-[var(--ink)] bg-[var(--paper-light)] px-3 py-2 text-sm outline-none focus:border-[var(--crimson)]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="hand-btn hand-btn-primary w-full"
          >
            {loading ? '修改中...' : '确认修改'}
          </button>
        </form>
      </div>
    </div>
  );
}
