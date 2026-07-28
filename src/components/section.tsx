import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';

type Variant = 'major' | 'minor' | 'rail';

/**
 * Section headers, in three weights.
 *
 * The previous build had one treatment — ALL CAPS, 2px near-black rule, repeated down the
 * homepage six times and hand-copied into four more pages. Everything shouted at the same
 * volume, so nothing outranked anything: the lead grid, the projects feed and a row of company
 * chips all announced themselves identically. That sameness is most of why the page read as an
 * interface rather than a publication.
 *
 * Three weights, used deliberately:
 *
 * - `major` — a page's principal divisions. Serif, sized up, hairline rule. Rare.
 * - `minor` — sub-sections inside a division. Small caps, hairline. The common case.
 * - `rail` — sidebar modules. Caps, no rule; the surrounding column already frames it.
 *
 * A page that uses `major` more than twice is telling the reader nothing.
 */
export function Section({
  title,
  subtitle,
  href,
  hrefLabel,
  children,
  variant = 'minor',
  className = '',
  headingLevel: H = 'h2',
  id,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  hrefLabel?: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  headingLevel?: 'h2' | 'h3';
  id?: string;
}) {
  return (
    <section id={id} className={`page ${className}`}>
      <SectionHeading
        title={title}
        subtitle={subtitle}
        href={href}
        hrefLabel={hrefLabel}
        variant={variant}
        headingLevel={H}
      />
      {children}
    </section>
  );
}

/**
 * The heading alone, for callers that own their own container.
 *
 * This exists so the four pages that previously hand-copied the header markup
 * (`live/[slug]`, `edition/[edition]`, `markets`, `company/[slug]`) can share one definition.
 * Copies are how a design system drifts: each was slightly different already.
 */
export function SectionHeading({
  title,
  subtitle,
  href,
  hrefLabel,
  variant = 'minor',
  headingLevel: H = 'h2',
  className = '',
}: {
  title: string;
  subtitle?: string;
  href?: string;
  hrefLabel?: string;
  variant?: Variant;
  headingLevel?: 'h2' | 'h3';
  className?: string;
}) {
  const major = variant === 'major';
  const rail = variant === 'rail';

  return (
    <div
      className={`mb-4 flex items-baseline justify-between gap-4 ${
        rail ? '' : 'border-b border-rule pb-2'
      } ${className}`}
    >
      <div className="min-w-0">
        <H
          className={
            major
              ? 'font-display text-subhead text-strong'
              : 'label text-strong'
          }
        >
          {title}
        </H>
        {subtitle && (
          <p className="mt-1 text-meta text-muted">{subtitle}</p>
        )}
      </div>

      {href && hrefLabel && (
        <Link
          href={href}
          className="shrink-0 text-micro font-semibold uppercase tracking-wider text-accent hover:underline underline-offset-4"
        >
          {hrefLabel}
          {/* The arrow points *forward*, so it mirrors in RTL. */}
          <span aria-hidden="true" className="mirror-in-rtl ms-1 inline-block">
            →
          </span>
        </Link>
      )}
    </div>
  );
}
