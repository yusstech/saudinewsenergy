import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';

/**
 * A homepage module.
 *
 * Every section on the front page is one of these, which is what keeps a
 * deliberately information-dense page scannable: the reader learns one heading
 * shape and one "view all" position, and can then skim past whole modules
 * without re-reading their structure. Density without repetition is clutter.
 */
export function Section({
  title,
  subtitle,
  href,
  hrefLabel,
  children,
  className = '',
  headingLevel: H = 'h2',
}: {
  title: string;
  subtitle?: string;
  href?: string;
  hrefLabel?: string;
  children: ReactNode;
  className?: string;
  headingLevel?: 'h2' | 'h3';
}) {
  return (
    <section className={`mx-auto max-w-[1440px] px-[--spacing-gutter] ${className}`}>
      <div className="mb-4 flex items-end justify-between gap-4 border-b-2 border-[--color-body] pb-2">
        <div>
          <H className="text-lg font-bold uppercase tracking-wide">{title}</H>
          {subtitle && (
            <p className="mt-0.5 text-sm text-[--color-muted]">{subtitle}</p>
          )}
        </div>
        {href && hrefLabel && (
          <Link
            href={href}
            className="shrink-0 text-xs font-semibold uppercase tracking-wider text-[--color-brand-500] hover:underline underline-offset-4"
          >
            {hrefLabel}
            <span aria-hidden="true" className="mirror-in-rtl ms-1 inline-block">
              →
            </span>
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
