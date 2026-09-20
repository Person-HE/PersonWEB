/**
 * DemoFrame —— 在线 Demo 内嵌窗口
 *
 * 默认不加载 iframe（避免拖慢详情页），用户点击后才挂载；
 * 多数站点可能设置 X-Frame-Options 拒绝内嵌，故始终保留「新窗口打开」出口。
 */
import { useState } from 'react';
import { ExternalLink, Play, RotateCcw } from 'lucide-react';

interface Props {
  url: string;
  name: string;
  height?: number;
}

export default function DemoFrame({ url, name, height = 640 }: Props) {
  const [phase, setPhase] = useState<'idle' | 'loading' | 'ready'>('idle');

  return (
    <div className="border-2 border-[var(--ink)] bg-[var(--bg-elevated)] shadow-[2px_2px_0_var(--ink)]">
      {/* 伪窗口标题栏 */}
      <div className="flex items-center justify-between border-b-2 border-[var(--ink)] bg-[var(--bg-deep)] px-3 py-2">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 bg-[var(--accent-alt)]" />
          <span className="h-2.5 w-2.5 bg-[var(--accent)]" />
          <span className="h-2.5 w-2.5 bg-[var(--accent-cyan)]" />
          <span className="ml-2 font-mono text-[10px] text-[var(--ink-mute)]">{url}</span>
        </div>
        <div className="flex items-center gap-2">
          {phase !== 'idle' ? (
            <button
              onClick={() => setPhase('loading')}
              className="p-1 text-[var(--ink-mute)] hover:text-[var(--accent)]"
              aria-label="重新加载"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          ) : null}
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 border border-[var(--ink)] bg-[var(--bg)] px-2 py-0.5 font-mono text-[10px] text-[var(--ink)] hover:bg-[var(--accent)] hover:text-[var(--bg)]"
          >
            <ExternalLink className="h-3 w-3" /> 新窗口打开
          </a>
        </div>
      </div>

      <div style={{ height }} className="relative">
        {phase === 'idle' ? (
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <button
              onClick={() => setPhase('loading')}
              className="flex items-center gap-2 border-2 border-[var(--ink)] bg-[var(--accent)] px-6 py-3 font-display text-xl font-bold text-[var(--bg)] shadow-[3px_3px_0_var(--ink)] transition-transform hover:-translate-y-0.5"
            >
              <Play className="h-5 w-5" /> 加载 {name} 在线 Demo
            </button>
            <p className="max-w-md text-center font-mono text-[10px] leading-relaxed text-[var(--ink-mute)]">
              {'//'} 点击后才加载外部站点，数据直连生产环境。若内嵌被目标站安全策略拦截，请用「新窗口打开」。
            </p>
          </div>
        ) : (
          <>
            {phase === 'loading' ? (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--bg-elevated)] font-mono text-xs text-[var(--ink-mute)]">
                <span className="terminal-cursor">{'>'} loading…</span>
              </div>
            ) : null}
            <iframe
              key={Date.now()}
              src={url}
              title={`${name} 在线 Demo`}
              className="h-full w-full border-0"
              onLoad={() => setPhase('ready')}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </>
        )}
      </div>
    </div>
  );
}
