/**
 * QuoteForm —— 需求报价表单（公开提交，无需登录）
 *
 * 后端 /api/quote：蜜罐 `_hp` + IP 限流（5 次/小时）+ 字段裁剪。
 * 提交成功进后台队列（管理端「需求工单」处理），同时引导急单走微信。
 */
import { useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import { quoteSubmitApi } from '@/lib/api';
import { useWechatModal } from '@/components/WeChatModal';

const SERVICE_TYPES = ['网站/落地页', 'Web应用/小程序', '自动化脚本', 'AI工作流', '企业AI落地', '工具安装配置', '其他'];
const BUDGETS = ['500 以内', '500 - 2000', '2000 - 5000', '5000 - 2万', '2万以上', '企业预算待定'];
const CHANNELS = ['直接找到', 'GitHub', '博客', '微信/朋友圈', '搜索', '其他'];

const inputCls =
  'w-full border-2 border-[var(--ink)] bg-[var(--bg)] px-3 py-2 font-mono text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-mute)] focus:border-[var(--accent)]';

interface Props {
  /** 来源页面归因（如 portfolio slug / 服务 id / 'contact'） */
  quoteRef: string;
  defaultServiceType?: string;
}

export default function QuoteForm({ quoteRef, defaultServiceType }: Props) {
  const { open } = useWechatModal();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    contact: '',
    serviceType: defaultServiceType && SERVICE_TYPES.includes(defaultServiceType) ? defaultServiceType : SERVICE_TYPES[0],
    budget: BUDGETS[1],
    deadline: '',
    channel: CHANNELS[0],
    message: '',
    _hp: '',
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.contact.trim() || !form.message.trim()) {
      setError('称呼、联系方式和需求描述为必填。');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const { _hp, ...payload } = form;
      const res = await quoteSubmitApi.create({ ...payload, _hp, ref: quoteRef });
      setDone(res.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : '提交失败，请稍后再试或直接加微信。');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="border-2 border-[var(--accent)] bg-[var(--bg-elevated)] p-6 shadow-[3px_3px_0_var(--accent)]">
        <div className="font-display text-2xl font-bold text-[var(--accent)]">
          {'>'} 已收到，工单号 {done}
        </div>
        <p className="mt-2 font-mono text-xs leading-relaxed text-[var(--ink-soft)]">
          我会尽快评估需求并回复。急单或想深入沟通，直接加微信更快。
        </p>
        <button
          onClick={() => open('default')}
          className="mt-4 border-2 border-[var(--ink)] bg-[var(--accent-cyan)] px-4 py-2 font-mono text-xs text-[var(--bg)] shadow-[2px_2px_0_var(--ink)] hover:-translate-y-0.5"
        >
          加微信沟通
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* 蜜罐：视觉隐藏，机器人填写则后端静默丢弃 */}
      <input
        type="text"
        name="_hp"
        value={form._hp}
        onChange={set('_hp')}
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-[var(--ink-soft)]">
            {'>'} 怎么称呼你 *
          </span>
          <input className={inputCls} value={form.name} onChange={set('name')} maxLength={40} placeholder="昵称即可" />
        </label>
        <label className="block">
          <span className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-[var(--ink-soft)]">
            {'>'} 微信 / 联系方式 *
          </span>
          <input className={inputCls} value={form.contact} onChange={set('contact')} maxLength={80} placeholder="回复你用什么联系" />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-[var(--ink-soft)]">{'>'} 需求类型</span>
          <select className={inputCls} value={form.serviceType} onChange={set('serviceType')}>
            {SERVICE_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-[var(--ink-soft)]">{'>'} 预算区间</span>
          <select className={inputCls} value={form.budget} onChange={set('budget')}>
            {BUDGETS.map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-[var(--ink-soft)]">{'>'} 期望交付</span>
          <input className={inputCls} value={form.deadline} onChange={set('deadline')} maxLength={20} placeholder="如：两周内" />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-[var(--ink-soft)]">
          {'>'} 需求描述 *（做什么、给谁用、现在卡在哪）
        </span>
        <textarea
          className={`${inputCls} min-h-[120px] resize-y`}
          value={form.message}
          onChange={set('message')}
          maxLength={2000}
          placeholder="描述越具体，报价越准。可以贴上你现在的流程截图/文档链接。"
        />
      </label>

      <label className="block">
        <span className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-[var(--ink-soft)]">{'>'} 从哪找到我的</span>
        <select className={inputCls} value={form.channel} onChange={set('channel')}>
          {CHANNELS.map((t) => <option key={t}>{t}</option>)}
        </select>
      </label>

      {error ? (
        <div className="border-2 border-[var(--accent-alt)] bg-[var(--bg-elevated)] px-3 py-2 font-mono text-xs text-[var(--accent-alt)]">
          {'!'} {error}
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-[10px] text-[var(--ink-mute)]">
          {'//'} 提交直达我的后台，不经过任何第三方。
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 border-2 border-[var(--ink)] bg-[var(--accent)] px-6 py-2.5 font-display text-lg font-bold text-[var(--bg)] shadow-[3px_3px_0_var(--ink)] transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {submitting ? '提交中…' : '提交需求'}
        </button>
      </div>
    </form>
  );
}
