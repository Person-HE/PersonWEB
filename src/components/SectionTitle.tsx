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
  align = 'left',
}: SectionTitleProps) {
  const isCenter = align === 'center';
  return (
    <div
      className={
        isCenter
          ? 'mb-12 text-center'
          : 'mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'
      }
    >
      <div className={isCenter ? 'mx-auto max-w-3xl' : 'max-w-3xl'}>
        {eyebrow ? (
          <div className="text-eyebrow mb-3 terminal-cursor">{eyebrow}</div>
        ) : null}
        <h2
          className={`text-headline font-black text-[var(--ink)] ${
            isCenter ? 'hand-underline inline-block' : ''
          }`}
        >
          {title}
        </h2>
        {subtitle ? (
          <p
            className={
              isCenter
                ? 'mx-auto mt-4 max-w-2xl font-body text-base text-[var(--ink-soft)]'
                : 'mt-3 max-w-2xl font-body text-base text-[var(--ink-soft)]'
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
    <div className="mb-10">
      <h1 className="text-headline font-black text-[var(--ink)]">{title}</h1>
      {description ? (
        <p className="mt-4 max-w-2xl font-body text-base text-[var(--ink-soft)]">
          {description}
        </p>
      ) : null}
      {children ? <div className="mt-6">{children}</div> : null}
    </div>
  );
}
