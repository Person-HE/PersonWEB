import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
}

/** 空状态：手绘虚线卡片 */
export default function EmptyState({
  icon,
  title = '暂无内容',
  description = '数据尚未录入，请稍后再来。',
  action,
}: EmptyStateProps) {
  return (
    <div className="hand-empty">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-dashed border-[var(--ink)] bg-[var(--paper)] text-[var(--ink-mute)]">
        {icon ?? <Inbox className="h-7 w-7" />}
      </div>
      <h3 className="mb-1.5 font-hand-title text-base text-[var(--ink)]">{title}</h3>
      <p className="mb-5 max-w-sm font-hand-body text-sm text-[var(--ink-mute)]">{description}</p>
      {action}
    </div>
  );
}
