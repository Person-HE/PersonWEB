/**
 * 管理后台 - 操作日志
 */
import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { logsApi } from '@/lib/api';

export default function AdminLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(100);

  async function load() {
    setLoading(true);
    try {
      const data = await logsApi.list(limit);
      setLogs(data);
    } catch (e: any) {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [limit]);

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <h1 className="font-hand-title text-2xl text-[var(--ink)]">操作日志</h1>
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="rounded-lg border border-[var(--ink)]/30 bg-white px-2 py-1 text-sm"
        >
          <option value={50}>最近 50 条</option>
          <option value={100}>最近 100 条</option>
          <option value={200}>最近 200 条</option>
          <option value={500}>最近 500 条</option>
        </select>
        <button
          onClick={load}
          className="ml-auto inline-flex items-center gap-1 rounded-lg border border-[var(--ink)]/40 bg-white px-3 py-1.5 text-sm hover:bg-[var(--paper-light)]"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          刷新
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--ink)]/20 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--paper-light)] text-xs text-[var(--ink-soft)]">
            <tr>
              <th className="px-3 py-2 font-medium">时间</th>
              <th className="px-3 py-2 font-medium">动作</th>
              <th className="px-3 py-2 font-medium">对象</th>
              <th className="px-3 py-2 font-medium">详情</th>
              <th className="px-3 py-2 font-medium">IP</th>
            </tr>
          </thead>
          <tbody>
            {loading && logs.length === 0 ? (
              <tr><td colSpan={5} className="px-3 py-8 text-center text-[var(--ink-mute)]">加载中...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={5} className="px-3 py-8 text-center text-[var(--ink-mute)]">暂无日志</td></tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="border-t border-[var(--ink)]/10">
                  <td className="whitespace-nowrap px-3 py-2 text-xs text-[var(--ink-mute)]">
                    {log.createdAt?.replace('T', ' ').slice(0, 19)}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className="inline-flex rounded px-2 py-0.5 text-xs font-medium"
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
                  </td>
                  <td className="px-3 py-2 text-xs text-[var(--ink-soft)]">
                    {log.targetType ? `${log.targetType}` : ''}
                    {log.targetId ? ` / ${log.targetId}` : ''}
                  </td>
                  <td className="max-w-md truncate px-3 py-2 text-xs text-[var(--ink-mute)]">
                    {log.detail || '—'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 font-mono text-xs text-[var(--ink-mute)]">
                    {log.ip || '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
