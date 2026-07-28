import type { ReactNode } from 'react';

export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <header className="border-b border-[--color-line] bg-[--color-surface]">
      <div className="mx-auto max-w-[1440px] px-[--spacing-gutter] py-8">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-wider text-[--color-brand-500]">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h1>
        {intro && (
          <p className="mt-2 max-w-[60ch] text-[--color-muted]">{intro}</p>
        )}
        {children}
      </div>
    </header>
  );
}

export function EmptyState({
  title,
  hint,
}: {
  title: string;
  hint?: string;
}) {
  return (
    <div className="rounded-sm border border-dashed border-[--color-line-strong] px-6 py-14 text-center">
      <p className="font-medium text-[--color-muted]">{title}</p>
      {hint && <p className="mt-1 text-sm text-[--color-faint]">{hint}</p>}
    </div>
  );
}
