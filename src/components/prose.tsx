import type { ReactNode } from 'react';

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="page py-[var(--space-block)]">
      <div className="prose-article">{children}</div>
    </div>
  );
}
