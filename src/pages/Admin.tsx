import { useState } from 'react';
import { Shield, Wrench, Download, Compass, Plus, Trash2, LogOut, Lock } from 'lucide-react';
import { useStore } from '@/store/useStore';

type TabType = 'tools' | 'resources' | 'navsites';

interface FormData {
  name: string;
  description: string;
  detail: string;
  category: string;
  imageUrl: string;
  driveLink: string;
  iconUrl: string;
  url: string;
}

const emptyForm: FormData = {
  name: '',
  description: '',
  detail: '',
  category: '',
  imageUrl: '',
  driveLink: '',
  iconUrl: '',
  url: '',
};

export default function Admin() {
  const {
    isAdmin,
    login,
    logout,
    tools,
    resources,
    navSites,
    addTool,
    deleteTool,
    addResource,
    deleteResource,
    addNavSite,
    deleteNavSite,
  } = useStore();

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState<TabType>('tools');
  const [form, setForm] = useState<FormData>(emptyForm);

  const handleLogin = () => {
    if (login(password)) {
      setError('');
      setPassword('');
    } else {
      setError('密码错误');
    }
  };

  const handleAdd = () => {
    if (!form.name || !form.description) return;

    if (tab === 'tools') {
      addTool({
        name: form.name,
        description: form.description,
        detail: form.detail,
        category: form.category || '未分类',
        imageUrl: form.imageUrl,
        driveLink: form.driveLink,
      });
    } else if (tab === 'resources') {
      addResource({
        name: form.name,
        description: form.description,
        detail: form.detail,
        category: form.category || '未分类',
        imageUrl: form.imageUrl,
        driveLink: form.driveLink,
      });
    } else {
      addNavSite({
        name: form.name,
        description: form.description,
        category: form.category || '未分类',
        iconUrl: form.iconUrl,
        url: form.url,
      });
    }
    setForm(emptyForm);
  };

  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 pt-16">
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15">
              <Lock className="h-7 w-7 text-emerald-400" />
            </div>
            <h1 className="text-xl font-bold text-white">管理面板</h1>
            <p className="mt-1 text-sm text-slate-500">请输入管理密码</p>
          </div>
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="输入密码"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500/50"
            />
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button
              onClick={handleLogin}
              className="w-full rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-slate-950 transition-all hover:bg-emerald-400"
            >
              登录
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: 'tools' as TabType, label: '工具管理', icon: Wrench, count: tools.length },
    { key: 'resources' as TabType, label: '资源管理', icon: Download, count: resources.length },
    { key: 'navsites' as TabType, label: '网站管理', icon: Compass, count: navSites.length },
  ];

  const currentItems =
    tab === 'tools' ? tools : tab === 'resources' ? resources : navSites;

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15">
              <Shield className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">管理面板</h1>
              <p className="text-sm text-slate-500">添加、管理工具、资源和网站</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-400 transition-all hover:border-red-500/30 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            退出
          </button>
        </div>

        <div className="mb-6 flex gap-2">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  tab === t.key
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {t.label}
                <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-xs">{t.count}</span>
              </button>
            );
          })}
        </div>

        <div className="mb-8 rounded-2xl border border-white/5 bg-white/[0.03] p-6">
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-white">
            <Plus className="h-4 w-4 text-emerald-400" />
            添加新{tab === 'tools' ? '工具' : tab === 'resources' ? '资源' : '网站'}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">名称 *</label>
              <input
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="输入名称"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-600 outline-none focus:border-emerald-500/50"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">分类</label>
              <input
                value={form.category}
                onChange={(e) => updateField('category', e.target.value)}
                placeholder="如：图片处理、开源软件"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-600 outline-none focus:border-emerald-500/50"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-500">简介 *</label>
              <input
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="一句话描述"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-600 outline-none focus:border-emerald-500/50"
              />
            </div>
            {tab !== 'navsites' && (
              <>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-slate-500">详细描述</label>
                  <textarea
                    value={form.detail}
                    onChange={(e) => updateField('detail', e.target.value)}
                    placeholder="详细介绍..."
                    rows={3}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-600 outline-none focus:border-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">配图URL</label>
                  <input
                    value={form.imageUrl}
                    onChange={(e) => updateField('imageUrl', e.target.value)}
                    placeholder="图片链接地址"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-600 outline-none focus:border-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">网盘链接</label>
                  <input
                    value={form.driveLink}
                    onChange={(e) => updateField('driveLink', e.target.value)}
                    placeholder="网盘分享链接"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-600 outline-none focus:border-emerald-500/50"
                  />
                </div>
              </>
            )}
            {tab === 'navsites' && (
              <>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">图标URL</label>
                  <input
                    value={form.iconUrl}
                    onChange={(e) => updateField('iconUrl', e.target.value)}
                    placeholder="网站图标链接"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-600 outline-none focus:border-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">网站URL</label>
                  <input
                    value={form.url}
                    onChange={(e) => updateField('url', e.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-600 outline-none focus:border-emerald-500/50"
                  />
                </div>
              </>
            )}
          </div>
          <button
            onClick={handleAdd}
            disabled={!form.name || !form.description}
            className="mt-4 flex items-center gap-1.5 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-all hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
            添加
          </button>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.03]">
          <div className="border-b border-white/5 px-6 py-4">
            <h2 className="text-base font-semibold text-white">
              现有{tab === 'tools' ? '工具' : tab === 'resources' ? '资源' : '网站'}列表
            </h2>
          </div>
          <div className="divide-y divide-white/5">
            {currentItems.length === 0 ? (
              <div className="px-6 py-10 text-center text-sm text-slate-500">暂无数据</div>
            ) : (
              currentItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between px-6 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-sm font-medium text-white">{item.name}</h3>
                      <span className="shrink-0 rounded-md bg-white/10 px-1.5 py-0.5 text-xs text-slate-400">
                        {item.category}
                      </span>
                    </div>
                    <p className="truncate text-xs text-slate-500">{item.description}</p>
                  </div>
                  <button
                    onClick={() => {
                      if (tab === 'tools') deleteTool(item.id);
                      else if (tab === 'resources') deleteResource(item.id);
                      else deleteNavSite(item.id);
                    }}
                    className="ml-4 shrink-0 rounded-lg p-2 text-slate-600 transition-colors hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
