/**
 * 管理后台 - 个人画像编辑器（单文档，全站「关于/首页」的数据源）
 *
 * 数组字段（时间线/能力/精力模型/价值观）用 JSON 编辑，
 * 保存后同步刷新前台 store，页面立即生效。
 */
import { useEffect, useState } from 'react';
import { Save, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { profileApi } from '@/lib/api';
import { useDataStore } from '@/store/useDataStore';
import type { Profile } from '@/types';

const inputCls =
  'w-full border-2 border-[var(--ink)] bg-[var(--bg)] px-3 py-2 font-mono text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)]';

const SCALAR_FIELDS: { key: keyof Profile; label: string; multiline?: boolean }[] = [
  { key: 'nickname', label: '对外称呼（昵称）' },
  { key: 'realName', label: '真实姓名（是否对外显示由你决定）' },
  { key: 'brand', label: 'IP 品牌' },
  { key: 'slogan', label: 'Slogan' },
  { key: 'identity', label: '一句话身份定位' },
  { key: 'location', label: '所在地' },
  { key: 'focus', label: '主攻方向（Hero 副标题）' },
  { key: 'story', label: '个人故事（关于页正文）', multiline: true },
  { key: 'githubUrl', label: 'GitHub 链接' },
  { key: 'blogUrl', label: '博客链接' },
  { key: 'avatarUrl', label: '头像 URL' },
];

const JSON_FIELDS: { key: keyof Profile; label: string; placeholder: string }[] = [
  {
    key: 'timeline',
    label: '时间线 timeline',
    placeholder: '[{"date":"2026.06","title":"...","desc":"..."}]',
  },
  {
    key: 'capabilities',
    label: '能力清单 capabilities（每条挂证据链接）',
    placeholder:
      '[{"title":"...","desc":"...","evidenceLabel":"案例：xxx","evidenceUrl":"/portfolio/xxx"}]',
  },
  {
    key: 'effortModel',
    label: '精力分配模型 effortModel',
    placeholder: '[{"layer":"...","percent":45,"focus":"..."}]',
  },
  { key: 'values', label: '价值观 values', placeholder: '["实证优先","反编造"]' },
];

export default function AdminProfile() {
  const reload = useDataStore((s) => s.reload);
  const [text, setText] = useState<Record<string, string>>({});
  const [jsonText, setJsonText] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        let p: Profile | null = null;
        try {
          p = await profileApi.get();
        } catch {
          p = await fetch('/data/profile.json').then((r) => r.json());
        }
        if (cancelled || !p) return;
        const t: Record<string, string> = {};
        for (const f of SCALAR_FIELDS) t[f.key as string] = (p[f.key] as string | null) ?? '';
        setText(t);
        const j: Record<string, string> = {};
        for (const f of JSON_FIELDS) j[f.key as string] = JSON.stringify(p[f.key], null, 2);
        setJsonText(j);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    let arrays: Record<string, unknown>;
    try {
      arrays = {};
      for (const f of JSON_FIELDS) {
        const parsed = JSON.parse(jsonText[f.key as string] || 'null');
        if (!Array.isArray(parsed)) throw new Error(`${f.label} 必须是 JSON 数组`);
        arrays[f.key as string] = parsed;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'JSON 格式错误');
      return;
    }

    const existing = useDataStore.getState().profile;
    const profile = {
      ...(existing || ({} as Profile)),
      id: 'me' as const,
      ...Object.fromEntries(
        SCALAR_FIELDS.map((f) => [f.key as string, (text[f.key as string] || '').trim()]),
      ),
      ...arrays,
    } as Profile;

    if (!profile.nickname) {
      setError('「对外称呼」必填');
      return;
    }

    setSaving(true);
    try {
      await profileApi.save(profile);
      await reload();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="font-mono text-sm text-[var(--ink-mute)]">{'>'} loading…</div>;
  }

  return (
    <div className="max-w-3xl">
      <h1 className="mb-2 font-display text-2xl font-bold text-[var(--ink)]">
        <span className="text-[var(--accent)]">{'>'}</span> 个人画像
      </h1>
      <p className="mb-6 font-mono text-xs text-[var(--ink-mute)]">
        首页 Hero、关于页、跑马灯全部读取这份文档。保存后前台即时生效。
      </p>

      <form onSubmit={handleSave} className="space-y-4">
        {error ? (
          <div className="flex items-center gap-2 border-2 border-[var(--accent-alt)] px-3 py-2 font-mono text-sm text-[var(--accent-alt)]">
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          </div>
        ) : null}
        {success ? (
          <div className="flex items-center gap-2 border-2 border-[var(--accent)] px-3 py-2 font-mono text-sm text-[var(--accent)]">
            <Check className="h-4 w-4 shrink-0" /> 已保存，前台已更新
          </div>
        ) : null}

        {SCALAR_FIELDS.map((f) => (
          <label key={f.key as string} className="block">
            <span className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-[var(--ink-soft)]">
              {'>'} {f.label}
            </span>
            {f.multiline ? (
              <textarea
                className={`${inputCls} min-h-[120px] resize-y`}
                value={text[f.key as string] || ''}
                onChange={(e) => setText((t) => ({ ...t, [f.key as string]: e.target.value }))}
              />
            ) : (
              <input
                className={inputCls}
                value={text[f.key as string] || ''}
                onChange={(e) => setText((t) => ({ ...t, [f.key as string]: e.target.value }))}
              />
            )}
          </label>
        ))}

        {JSON_FIELDS.map((f) => (
          <label key={f.key as string} className="block">
            <span className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-[var(--ink-soft)]">
              {'>'} {f.label}（JSON）
            </span>
            <textarea
              className={`${inputCls} min-h-[140px] resize-y`}
              value={jsonText[f.key as string] || ''}
              placeholder={f.placeholder}
              onChange={(e) => setJsonText((t) => ({ ...t, [f.key as string]: e.target.value }))}
            />
          </label>
        ))}

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 border-2 border-[var(--ink)] bg-[var(--accent)] px-6 py-2.5 font-display text-lg font-bold text-[var(--bg)] shadow-[3px_3px_0_var(--ink)] transition-transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? '保存中…' : '保存画像'}
        </button>
      </form>
    </div>
  );
}
