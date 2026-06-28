import { Heart, MessageCircle, Coffee, ArrowRight } from 'lucide-react';

const timeline = [
  {
    period: '起因',
    title: '发现信息差',
    desc: '在帮助朋友和家人解决手机、电脑问题时，发现很多人不知道有免费的优质工具和资源可用，经常花冤枉钱或者被骗。',
  },
  {
    period: '初心',
    title: '让好东西被看见',
    desc: '决定把自己收集和整理的工具、资源分享出来，让更多人能零门槛获取，不再因为信息差而吃亏。',
  },
  {
    period: '行动',
    title: '搭建百宝箱',
    desc: '开始系统性地整理工具、资源和网站，分类归档，编写详细说明，确保每个人都能轻松找到并使用。',
  },
  {
    period: '愿景',
    title: '持续更新，帮助更多人',
    desc: '这个站点会持续更新，不断添加新的工具和资源。如果你觉得有用，欢迎分享给身边的朋友和家人。',
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-500/15">
            <Heart className="h-8 w-8 text-pink-400" />
          </div>
          <h1 className="mb-3 text-3xl font-bold text-white">关于我</h1>
          <p className="text-slate-400">为什么做这个站点，以及如何联系我</p>
        </div>

        <div className="relative mb-16">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-pink-500/50 via-emerald-500/50 to-cyan-500/50 sm:left-1/2" />
          <div className="space-y-8">
            {timeline.map((item, i) => (
              <div
                key={i}
                className={`relative flex flex-col sm:flex-row ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}
              >
                <div className="absolute left-4 top-3 z-10 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-slate-950 bg-emerald-400 sm:left-1/2" />
                <div className={`w-full sm:w-1/2 ${i % 2 === 0 ? 'sm:pr-12' : 'sm:pl-12'} pl-10 sm:pl-0`}>
                  <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 transition-all hover:border-white/10 hover:bg-white/[0.06]">
                    <span className="mb-2 inline-block rounded-md bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-400">
                      {item.period}
                    </span>
                    <h3 className="mb-2 text-base font-semibold text-white">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-400">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 p-8 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15">
            <MessageCircle className="h-7 w-7 text-emerald-400" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-white">加我微信</h2>
          <p className="mb-6 text-sm text-slate-400">
            有任何问题、建议或合作意向，欢迎通过微信联系我
          </p>
          <div className="mb-6 inline-block rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex h-48 w-48 items-center justify-center rounded-xl bg-slate-800">
              <div className="text-center">
                <MessageCircle className="mx-auto mb-2 h-10 w-10 text-emerald-400/50" />
                <p className="text-xs text-slate-500">微信二维码</p>
                <p className="text-xs text-slate-600">替换为你的二维码图片</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-600">
            扫描上方二维码或搜索微信号添加好友
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="/tools"
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 transition-all hover:bg-emerald-400"
          >
            <Coffee className="h-4 w-4" />
            开始使用工具
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
