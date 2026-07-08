/**
 * 管理后台 - 通用 CRUD 页面
 *
 * 根据 CrudConfig 动态渲染列表 + 编辑抽屉，支持：
 * - 列表展示（标题 + 关键字段）
 * - 新建 / 编辑 / 删除
 * - 内联表单（根据 fields 配置自动渲染）
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Plus, Pencil, Trash2, X, Search, RefreshCw } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useDataStore } from '@/store/useDataStore';
import { crudApi } from '@/lib/api';
import type { CrudConfig, FieldDef } from '@/admin/config';

interface Props {
  config: CrudConfig<any>;
  apiBase: string;
}

type Item = { id: string } & Record<string, any>;

/** 模块级缓存：apiBase → { data, ts }。切换菜单时先回显缓存，再后台静默刷新 */
const listCache = new Map<string, { data: Item[]; ts: number }>();
const CACHE_TTL = 30_000; // 30 秒内不重复请求

export default function AdminCrudPage({ config, apiBase }: Props) {
  const api = useMemo(() => crudApi<Item>(apiBase), [apiBase]);
  const cached = listCache.get(apiBase);
  const [list, setList] = useState<Item[]>(cached?.data ?? []);
  const [loading, setLoading] = useState(!cached); // 无缓存时才显示 loading
  const [refreshing, setRefreshing] = useState(false); // 后台静默刷新标识
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // 编辑状态
  const [editing, setEditing] = useState<Item | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  // 防止StrictMode/快速切换导致竞态：只认最后一次请求
  const reqIdRef = useRef(0);

  const load = useCallback(
    async (opts: { silent?: boolean } = {}) => {
      const silent = opts.silent ?? !!listCache.get(apiBase);
      const reqId = ++reqIdRef.current;
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      try {
        const data = await api.list();
        if (reqId !== reqIdRef.current) return; // 已被覆盖，丢弃
        setList(data);
        listCache.set(apiBase, { data, ts: Date.now() });
      } catch (e: any) {
        if (reqId !== reqIdRef.current) return;
        setError(e.message || '加载失败');
      } finally {
        if (reqId === reqIdRef.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [api, apiBase],
  );

  // 关键：依赖 apiBase，切换菜单时重新加载
  useEffect(() => {
    const hit = listCache.get(apiBase);
    if (hit && Date.now() - hit.ts < CACHE_TTL) {
      // 缓存未过期，直接用缓存，不请求
      setList(hit.data);
      setLoading(false);
      setRefreshing(false);
      return;
    }
    if (hit) {
      // 缓存过期：先回显旧数据，再静默刷新
      setList(hit.data);
      setLoading(false);
      load({ silent: true });
    } else {
      load({ silent: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase]);

  const filtered = useMemo(() => {
    if (!search.trim()) return list;
    const kw = search.trim().toLowerCase();
    return list.filter((item: any) => {
      return Object.values(item).some((v) => {
        if (v == null) return false;
        if (typeof v === 'object') return JSON.stringify(v).toLowerCase().includes(kw);
        return String(v).toLowerCase().includes(kw);
      });
    });
  }, [list, search]);

  function handleNew() {
    setEditing(config.defaultItem());
    setIsNew(true);
  }

  function handleEdit(item: Item) {
    setEditing({ ...item, id: String(item.id) });
    setIsNew(false);
  }

  async function handleSave() {
    if (!editing) return;
    const id = String(editing.id);
    if (!id) {
      setError('ID 不能为空');
      return;
    }
    const item = { ...editing, id };
    setSaving(true);
    setError(null);
    try {
      if (isNew) {
        const created = await api.create(item);
        setList((prev) => {
          const next = [...prev, created];
          listCache.set(apiBase, { data: next, ts: Date.now() });
          return next;
        });
      } else {
        const updated = await api.update(id, item);
        setList((prev) => {
          const next = prev.map((it) => (String(it.id) === String(updated.id) ? updated : it));
          listCache.set(apiBase, { data: next, ts: Date.now() });
          return next;
        });
      }
      setEditing(null);
      // 同步刷新前台数据缓存
      useDataStore.getState().reload();
    } catch (e: any) {
      setError(e.message || '保存失败');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(`确认删除？此操作不可撤销。`)) return;
    const sid = String(id);
    try {
      await api.remove(sid);
      setList((prev) => {
        const next = prev.filter((it) => String(it.id) !== sid);
        listCache.set(apiBase, { data: next, ts: Date.now() });
        return next;
      });
      // 同步刷新前台数据缓存
      useDataStore.getState().reload();
    } catch (e: any) {
      setError(e.message || '删除失败');
    }
  }

  return (
    <div>
      {/* 顶部操作栏 */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h1 className="font-hand-title text-2xl text-[var(--ink)]">{config.name}管理</h1>
        <span className="rounded-md border border-[var(--ink)]/30 bg-[var(--paper-light)] px-2 py-0.5 text-xs text-[var(--ink-soft)]">
          共 {list.length} 条
        </span>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--ink-mute)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索..."
              className="w-48 rounded-lg border border-[var(--ink)]/40 bg-white px-7 py-1.5 text-sm outline-none focus:border-[var(--crimson)]"
            />
          </div>
          <button
            onClick={() => load({ silent: false })}
            className="rounded-lg border border-[var(--ink)]/40 bg-white px-3 py-1.5 text-sm hover:bg-[var(--paper-light)]"
            title="刷新"
          >
            <RefreshCw className={`h-4 w-4 ${loading || refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleNew}
            className="inline-flex items-center gap-1 rounded-lg bg-[var(--crimson)] px-3 py-1.5 text-sm font-medium text-white hover:bg-[var(--crimson)]/90"
          >
            <Plus className="h-4 w-4" /> 新建
          </button>
        </div>
      </div>

      {error ? (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {/* 列表 */}
      <div className="overflow-hidden rounded-xl border border-[var(--ink)]/20 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--paper-light)] text-xs text-[var(--ink-soft)]">
            <tr>
              <th className="px-3 py-2 font-medium">ID</th>
              <th className="px-3 py-2 font-medium">标题</th>
              <th className="px-3 py-2 font-medium">分类/类型</th>
              <th className="px-3 py-2 font-medium">更新时间</th>
              <th className="px-3 py-2 text-right font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {loading && list.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-[var(--ink-mute)]">加载中...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-[var(--ink-mute)]">暂无数据</td>
              </tr>
            ) : (
              filtered.map((item: any) => (
                <tr key={item.id} className="border-t border-[var(--ink)]/10 hover:bg-[var(--paper-light)]/50">
                  <td className="px-3 py-2 font-mono text-xs text-[var(--ink-soft)]">{item.id}</td>
                  <td className="px-3 py-2 font-medium text-[var(--ink)]">{item[config.titleKey] || '—'}</td>
                  <td className="px-3 py-2 text-[var(--ink-soft)]">
                    {item.category || item.type || '—'}
                  </td>
                  <td className="px-3 py-2 text-xs text-[var(--ink-mute)]">
                    {item.updatedAt || item.addedAt || '—'}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      onClick={() => handleEdit(item)}
                      className="mr-1 inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-[var(--indigo)] hover:bg-[var(--indigo)]/10"
                    >
                      <Pencil className="h-3 w-3" /> 编辑
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" /> 删除
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 编辑抽屉 */}
      {editing ? (
        <EditDrawer
          config={config}
          item={editing}
          isNew={isNew}
          saving={saving}
          onChange={setEditing}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      ) : null}
    </div>
  );
}

/** 编辑抽屉 */
function EditDrawer({
  config,
  item,
  isNew,
  saving,
  onChange,
  onSave,
  onClose,
}: {
  config: CrudConfig<any>;
  item: Item;
  isNew: boolean;
  saving: boolean;
  onChange: (v: Item) => void;
  onSave: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex">
      {/* 遮罩 */}
      <div className="flex-1 bg-black/40" onClick={onClose} />

      {/* 抽屉 */}
      <div className="w-full max-w-2xl overflow-y-auto bg-[var(--paper)] shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-[var(--ink)]/20 bg-[var(--paper-light)] px-6 py-3">
          <h2 className="font-hand-title text-lg text-[var(--ink)]">
            {isNew ? `新建${config.name}` : `编辑${config.name}`}
          </h2>
          <button onClick={onClose} className="text-[var(--ink-mute)] hover:text-[var(--ink)]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-6">
          <FormFields config={config} item={item} isNew={isNew} onChange={onChange} />
        </div>

        <div className="sticky bottom-0 flex items-center justify-end gap-2 border-t border-[var(--ink)]/20 bg-[var(--paper-light)] px-6 py-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-[var(--ink)]/40 bg-white px-4 py-1.5 text-sm hover:bg-[var(--paper-light)]"
          >
            取消
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="rounded-lg bg-[var(--crimson)] px-4 py-1.5 text-sm font-medium text-white hover:bg-[var(--crimson)]/90 disabled:opacity-50"
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    </div>
  );
}

/** 表单字段渲染 */
function FormFields({
  config,
  item,
  isNew,
  onChange,
}: {
  config: CrudConfig<any>;
  item: Item;
  isNew: boolean;
  onChange: (v: Item) => void;
}) {
  /** 取值（支持 path 嵌套） */
  function getValue(key: string, path?: string): any {
    if (path) {
      return path.split('.').reduce((acc, k) => (acc == null ? acc : acc[k]), item as any);
    }
    return (item as any)[key];
  }

  /** 设值（支持 path 嵌套，返回新对象触发渲染） */
  function setValue(key: string, path: string | undefined, value: any) {
    const next = { ...item } as any;
    if (path) {
      const parts = path.split('.');
      let cur = next;
      for (let i = 0; i < parts.length - 1; i++) {
        cur[parts[i]] = { ...cur[parts[i]] };
        cur = cur[parts[i]];
      }
      cur[parts[parts.length - 1]] = value;
    } else {
      next[key] = value;
    }
    onChange(next);
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {config.fields.map((f) => (
        <FieldRenderer
          key={f.key}
          field={f}
          value={getValue(f.key, f.path)}
          disabled={!!f.readOnly && !isNew}
          onChange={(v) => setValue(f.key, f.path, v)}
        />
      ))}
    </div>
  );
}

function FieldRenderer({
  field,
  value,
  disabled,
  onChange,
}: {
  field: FieldDef;
  value: any;
  disabled?: boolean;
  onChange: (v: any) => void;
}) {
  const colSpan = field.full ? 'col-span-2' : '';
  const labelEl = (
    <label className="mb-1 block text-xs font-medium text-[var(--ink-soft)]">
      {field.label}
      {field.required ? <span className="ml-0.5 text-red-500">*</span> : null}
      {disabled ? <span className="ml-1 text-[10px] text-[var(--ink-mute)]">(不可修改)</span> : null}
    </label>
  );

  const inputCls =
    'w-full rounded-lg border border-[var(--ink)]/30 bg-white px-3 py-1.5 text-sm outline-none focus:border-[var(--crimson)]';
  const disabledCls = disabled ? ' cursor-not-allowed bg-[var(--paper-light)] text-[var(--ink-mute)]' : '';

  if (field.type === 'text' || field.type === 'url') {
    return (
      <div className={colSpan}>
        {labelEl}
        <input
          type="text"
          value={value ?? ''}
          placeholder={field.placeholder}
          readOnly={disabled}
          onChange={(e) => !disabled && onChange(e.target.value || null)}
          className={`${inputCls}${disabledCls}`}
        />
      </div>
    );
  }

  if (field.type === 'textarea') {
    return (
      <div className={colSpan}>
        {labelEl}
        <textarea
          value={value ?? ''}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value || null)}
          rows={3}
          className={inputCls}
        />
      </div>
    );
  }

  if (field.type === 'number') {
    return (
      <div className={colSpan}>
        {labelEl}
        <input
          type="number"
          value={value ?? 0}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className={inputCls}
        />
      </div>
    );
  }

  if (field.type === 'select') {
    return (
      <div className={colSpan}>
        {labelEl}
        <select
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
        >
          {(field.options || []).map((opt) => (
            <option key={String(opt)} value={String(opt)}>{String(opt)}</option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === 'boolean') {
    return (
      <div className={colSpan}>
        {labelEl}
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4"
          />
          <span className="text-sm text-[var(--ink-soft)]">{value ? '是' : '否'}</span>
        </label>
      </div>
    );
  }

  if (field.type === 'tags') {
    // tags 数组以换行分隔输入
    const text = Array.isArray(value) ? value.join('\n') : '';
    return (
      <div className={colSpan}>
        {labelEl}
        <textarea
          value={text}
          onChange={(e) => onChange(e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))}
          rows={Math.max(2, Math.min(8, text.split('\n').length))}
          className={inputCls}
          placeholder={field.placeholder || '每行一个'}
        />
      </div>
    );
  }

  if (field.type === 'json') {
    const text = value == null ? '' : JSON.stringify(value, null, 2);
    return (
      <div className={colSpan}>
        {labelEl}
        <textarea
          value={text}
          onChange={(e) => {
            try {
              const v = e.target.value.trim();
              onChange(v ? JSON.parse(v) : null);
            } catch {
              // 解析失败时不更新，让用户继续编辑
            }
          }}
          rows={4}
          className={`${inputCls} font-mono text-xs`}
        />
      </div>
    );
  }

  return null;
}
