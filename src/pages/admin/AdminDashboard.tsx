/**
 * 管理后台 - 概览
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Compass, Wrench, Rocket, Inbox, ArrowRight, Activity, RefreshCw } from 'lucide-react';
import { apiPublic, logsApi, liveApi } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useDataStore } from '@/store/useDataStore';
import type { Resource, Tool, Service, Portfolio, Quote } from '@/types';

interface LogEntry {
  id?: string;
  action?: string;
  targetType?: string;
  targetId?: string;
  detail?: string;
  createdAt?: string;
}

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const reload = useDataStore((s) => s.reload);
  const [counts, setCounts] = useState({ resources: 0, tools: 0, services: 0, portfolio: 0, quotes: 0 });
  const [liveInfo, setLiveInfo] = useState<{ github: string | null; blog: string | null }>({ github: null, blog: null });
  const [refreshing, setRefreshing] = useState<'github' | 'blog' | null>(null);
  const [recentLogs, setRecentLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [resources, tools, services, portfolio, quotes, logs] = await Promise.all([
          apiPublic<Resource[]>('/api/resources'),
          apiPublic<Tool[]>('/api/tools'),
          apiPublic<Service[]>('/api/services'),
          apiPublic<Portfolio[]>('/api/portfolio'),
          apiPublic<Quote[]>('/api/quote'),
          logsApi.list(10).catch(() => [] as LogEntry[]),
        ]);
        setCounts({
          resources: resources.length,
          tools: tools.length,
          services: services.length,
          portfolio: portfolio.length,
          quotes: quotes.length,
        });
        setRecentLogs(logs);
      } catch {
        // 概览拉取失败时保持 0 值展示
      } finally {
        setLoading(false);
      }
      const [gh, blog] = await Promise.allSettled([liveApi.github(), liveApi.blog()]);
      setLiveInfo({
        github: gh.status === 'fulfilled' ? gh.value.fetchedAt : null,
        blog: blog.status === 'fulfilled' ? blog.value.fetchedAt : null,
      });
    })();
  }, []);

  async function handleRefresh(kind: 'github' | 'blog') {
    setRefreshing(kind);
    try {
      if (kind === 'github') {
        const snap = await liveApi.refreshGithub();
        setLiveInfo((v) => ({ ...v, github: snap.fetchedAt }));
      } else {
        const feed = await liveApi.refreshBlog();
        setLiveInfo((v) => ({ ...v, blog: feed.fetchedAt }));
      }
      await reload();
    } catch {
      // 静默失败，快照时间不变即代表未刷新成功
    } finally {
      setRefreshing(null);
    }
  }

  const cards = [
    { label: '作品集', count: counts.portfolio, to: '/admin/portfolio', icon: Rocket, color: 'var(--accent)' },
    { label: '需求工单', count: counts.quotes, to: '/admin/quotes', icon: Inbox, color: 'var(--accent-alt)' },
    { label: '服务', count: counts.services, to: '/admin/services', icon: Wrench, color: 'var(--crimson)' },
    { label: '资源', count: counts.resources, to: '/admin/resources', icon: FileText, color: 'var(--indigo)' },
    { label: '工具', count: counts.tools, to: '/admin/tools', icon: Compass, color: 'var(--teal)' },
  ];

  return (
    <div>
      <h1 className="mb-6 font-hand-title text-2xl text-[var(--ink)]">
        欢迎回来，{user?.username}
      </h1>

      {/* 数据卡片 */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
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

      {/* 活数据快照：cron 每小时自动同步，这里可手动触发 */}
      <div className="hand-card mb-8 flex flex-wrap items-center gap-6 p-5">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-[var(--accent-cyan)]" />
          <h2 className="font-hand-title text-base text-[var(--ink)]">活数据快照（cron 每小时）</h2>
        </div>
        <div className="flex flex-wrap items-center gap-6 text-sm">
          <span className="text-[var(--ink-soft)]">
            GitHub：{liveInfo.github ? liveInfo.github.replace('T', ' ').slice(0, 16) + ' UTC' : '未同步'}
            <button
              onClick={() => handleRefresh('github')}
              disabled={refreshing !== null}
              className="ml-2 inline-flex items-center gap-1 border border-[var(--ink)] px-2 py-0.5 text-xs hover:bg-[var(--accent)]"
            >
              <RefreshCw className={`h-3 w-3 ${refreshing === 'github' ? 'animate-spin' : ''}`} /> 立即刷新
            </button>
          </span>
          <span className="text-[var(--ink-soft)]">
            博客目录：{liveInfo.blog ? liveInfo.blog.replace('T', ' ').slice(0, 16) + ' UTC' : '未同步'}
            <button
              onClick={() => handleRefresh('blog')}
              disabled={refreshing !== null}
              className="ml-2 inline-flex items-center gap-1 border border-[var(--ink)] px-2 py-0.5 text-xs hover:bg-[var(--accent)]"
            >
              <RefreshCw className={`h-3 w-3 ${refreshing === 'blog' ? 'animate-spin' : ''}`} /> 立即刷新
            </button>
          </span>
        </div>
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
