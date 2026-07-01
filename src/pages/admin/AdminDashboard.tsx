/**
 * 管理后台 - 概览
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Compass, Wrench, ArrowRight, Activity } from 'lucide-react';
import { apiPublic, logsApi } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const [counts, setCounts] = useState({ resources: 0, tools: 0, services: 0 });
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [resources, tools, services, logs] = await Promise.all([
          apiPublic<any[]>('/api/resources'),
          apiPublic<any[]>('/api/tools'),
          apiPublic<any[]>('/api/services'),
          logsApi.list(10).catch(() => []),
        ]);
        setCounts({
          resources: resources.length,
          tools: tools.length,
          services: services.length,
        });
        setRecentLogs(logs);
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const cards = [
    { label: '资源', count: counts.resources, to: '/admin/resources', icon: FileText, color: 'var(--indigo)' },
    { label: '工具', count: counts.tools, to: '/admin/tools', icon: Compass, color: 'var(--teal)' },
    { label: '服务', count: counts.services, to: '/admin/services', icon: Wrench, color: 'var(--crimson)' },
  ];

  return (
    <div>
      <h1 className="mb-6 font-hand-title text-2xl text-[var(--ink)]">
        欢迎回来，{user?.username}
      </h1>

      {/* 数据卡片 */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.label}
              to={c.to}
              className="hand-card ink-spread group flex items-center gap-4 p-5"
              style={{ transform: `rotate(${(i % 2 ? 1 : -1) * 0.4}deg)` }}
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[var(--ink)] shadow-[2px_2px_0_var(--ink)]"
                style={{ background: c.color }}
              >
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-hand-title text-3xl font-black text-[var(--ink)]">
                  {loading ? '—' : c.count}
                </div>
                <div className="text-xs text-[var(--ink-mute)]">{c.label}总数</div>
              </div>
              <ArrowRight className="h-4 w-4 text-[var(--ink-mute)] transition-transform group-hover:translate-x-1" />
            </Link>
          );
        })}
      </div>

      {/* 最近操作 */}
      <div className="hand-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <Activity className="h-4 w-4 text-[var(--crimson)]" />
          <h2 className="font-hand-title text-base text-[var(--ink)]">最近操作</h2>
        </div>
        {recentLogs.length === 0 ? (
          <p className="py-6 text-center text-sm text-[var(--ink-mute)]">暂无操作记录</p>
        ) : (
          <ul className="space-y-2">
            {recentLogs.map((log) => (
              <li
                key={log.id}
                className="flex items-center gap-3 border-b border-[var(--ink)]/10 pb-2 text-sm last:border-0"
              >
                <span className="inline-flex shrink-0 items-center rounded px-2 py-0.5 text-xs font-medium text-white"
                  style={{
                    background:
                      log.action === 'login' ? 'var(--teal)'
                      : log.action === 'login_failed' || log.action === 'delete' ? 'var(--crimson)'
                      : log.action === 'create' ? 'var(--indigo)'
                      : log.action === 'update' ? 'var(--mustard)'
                      : 'var(--ink-mute)',
                    color: log.action === 'update' ? 'var(--ink)' : 'white',
                  }}
                >
                  {log.action}
                </span>
                <span className="flex-1 truncate text-[var(--ink-soft)]">
                  {log.targetType ? `[${log.targetType}]` : ''}{' '}
                  {log.targetId || ''}
                  {log.detail ? ` · ${log.detail.slice(0, 80)}` : ''}
                </span>
                <span className="shrink-0 text-xs text-[var(--ink-mute)]">
                  {log.createdAt?.replace('T', ' ').slice(0, 19)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
