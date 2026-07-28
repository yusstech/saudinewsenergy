import type { ReactNode } from 'react';

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-[1440px] px-[--spacing-gutter] py-8">
      <div className="prose-article">{children}</div>
    </div>
  );
}
