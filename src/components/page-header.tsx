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
    <header className="border-b border-line bg-surface-sunken">
      <div className="page py-[var(--space-block)]">
        {eyebrow && (
          <p className="label text-accent">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display mt-1.5 text-lead text-strong">
          {title}
        </h1>
        {intro && (
          <p className="mt-2.5 max-w-[58ch] text-[1.0625rem] leading-relaxed text-muted">{intro}</p>
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
    <div className="border border-dashed border-line-strong px-6 py-16 text-center">
      <p className="font-display text-subhead text-muted">{title}</p>
      {hint && <p className="mt-1.5 text-meta text-faint">{hint}</p>}
    </div>
  );
}
