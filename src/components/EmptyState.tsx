import type { ReactNode } from 'react';
import { SignalZero } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
}

/** 空状态：信号丢失 CRT 雪花屏风格 */
export default function EmptyState({
  icon,
  title = '暂无内容',
  description = '数据尚未录入，请稍后再来。',
  action,
}: EmptyStateProps) {
  return (
    <div className="hand-empty relative overflow-hidden">
      {/* 雪花屏背景 */}
      <div className="signal-noise pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />
      <div className="relative">
        <div className="mb-4 flex h-14 w-14 items-center justify-center border-2 border-dashed border-[var(--ink-mute)] bg-[var(--bg)] text-[var(--accent)]">
          {icon ?? <SignalZero className="h-7 w-7" />}
        </div>
        <h3 className="mb-1.5 font-display text-base text-[var(--ink)]">
          <span className="text-[var(--accent)]">{'>'}</span> {title}
        </h3>
        <p className="mb-5 max-w-sm font-mono text-xs text-[var(--ink-mute)]">{description}</p>
        {action}
      </div>
    </div>
  );
}
