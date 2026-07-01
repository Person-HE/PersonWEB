import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionTo?: string;
  align?: 'left' | 'center';
}

export default function SectionTitle({
  eyebrow,
  title,
  subtitle,
  actionLabel,
  actionTo,
  align = 'center',
}: SectionTitleProps) {
  const isCenter = align === 'center';
  return (
    <div
      className={
        isCenter
          ? 'mb-10 text-center'
          : 'mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'
      }
    >
      <div>
        {eyebrow ? (
          <div className="mb-2 font-hand-title text-xs uppercase tracking-widest text-[var(--crimson)]">
            · {eyebrow} ·
          </div>
        ) : null}
        <h2 className={`font-hand-title text-2xl text-[var(--ink)] sm:text-3xl ${isCenter ? 'hand-underline inline-block' : ''}`}>
          {title}
        </h2>
        {subtitle ? (
          <p
            className={
              isCenter
                ? 'mx-auto mt-3 max-w-2xl font-hand-body text-sm text-[var(--ink-soft)]'
                : 'mt-2 max-w-2xl font-hand-body text-sm text-[var(--ink-soft)]'
            }
          >
            {subtitle}
          </p>
        ) : null}
      </div>
      {actionLabel && actionTo ? (
        <Link
          to={actionTo}
          className="hand-btn inline-flex shrink-0 items-center gap-1 text-sm"
        >
          {actionLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-8">
      <h1 className="font-hand-title text-3xl text-[var(--ink)] sm:text-4xl">{title}</h1>
      {description ? (
        <p className="mt-3 max-w-2xl font-hand-body text-sm text-[var(--ink-soft)]">{description}</p>
      ) : null}
      {children ? <div className="mt-5">{children}</div> : null}
    </div>
  );
}
