'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { AlertState } from '@content/schema';

export interface RibbonItem {
  slug: string;
  href: string;
  headline: string;
  state: AlertState;
  time: string;
}

const DOT: Record<AlertState, string> = {
  breaking: 'bg-[--color-breaking]',
  developing: 'bg-[--color-developing]',
  live: 'bg-[--color-live]',
  'market-move': 'bg-[--color-market]',
  'project-update': 'bg-[--color-line-strong]',
};

const KEY: Record<AlertState, string> = {
  breaking: 'breaking',
  developing: 'developing',
  live: 'live',
  'market-move': 'marketMove',
  'project-update': 'projectUpdate',
};

/**
 * The breaking and developing ribbon.
 *
 * Motion here is a signal, and signals have to be escapable. Three separate
 * mechanisms stop it: hovering, focusing anything inside it with a keyboard,
 * and an explicit pause button — and `prefers-reduced-motion` removes the
 * animation entirely rather than merely slowing it. WCAG 2.2.2 requires a pause
 * mechanism for anything that moves for more than five seconds, and a
 * hover-only pause silently excludes every keyboard and touch reader, which is
 * why the button exists even though it looks redundant on a desktop mouse.
 *
 * The track is duplicated so the loop closes without a visible jump. The copy
 * is `aria-hidden` — a screen reader that announced every headline twice would
 * be describing an implementation detail.
 */
export function BreakingRibbon({ items }: { items: RibbonItem[] }) {
  const t = useTranslations('status');
  const tc = useTranslations('common');
  const [paused, setPaused] = useState(false);

  if (!items.length) return null;

  // Slow enough to read at a glance, and scaled to the amount of content so a
  // two-item ribbon does not race past.
  const duration = Math.max(45, items.length * 16);

  const row = (hidden: boolean) => (
    <ul
      className="flex shrink-0 items-center"
      aria-hidden={hidden || undefined}
    >
      {items.map((item) => (
        <li key={`${hidden ? 'dup-' : ''}${item.slug}`} className="flex items-center">
          <span
            className={`mx-3 inline-block size-1.5 shrink-0 rounded-full ${DOT[item.state]} ${
              item.state === 'live' ? 'live-dot' : ''
            }`}
            aria-hidden="true"
          />
          <Link
            href={item.href}
            tabIndex={hidden ? -1 : undefined}
            className="whitespace-nowrap text-sm hover:underline underline-offset-4"
          >
            <span className="font-semibold uppercase tracking-wider text-[0.6875rem]">
              {t(KEY[item.state])}
            </span>
            <span className="mx-2 text-[--color-faint]" aria-hidden="true">
              /
            </span>
            {item.headline}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="border-b border-[--color-line] bg-[--color-surface]">
      <div className="mx-auto flex max-w-[1440px] items-center gap-3 px-[--spacing-gutter]">
        <h2 className="sr-only">{t('breaking')}</h2>

        <div
          className="marquee relative min-w-0 flex-1 overflow-hidden py-2"
          data-paused={paused}
        >
          <div
            className="marquee-track flex w-max"
            style={{ ['--marquee-duration' as string]: `${duration}s` }}
          >
            {row(false)}
            {row(true)}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          className="shrink-0 rounded-sm p-1.5 text-[--color-muted] hover:bg-[--color-surface-sunken] hover:text-[--color-body]"
          title={paused ? tc('retry') : tc('dismiss')}
        >
          <span className="sr-only">
            {paused ? 'Resume headline ticker' : 'Pause headline ticker'}
          </span>
          {paused ? (
            <svg viewBox="0 0 16 16" className="size-3.5" fill="currentColor" aria-hidden="true">
              <path d="M4 2.5v11l9-5.5-9-5.5Z" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" className="size-3.5" fill="currentColor" aria-hidden="true">
              <path d="M4 2.5h3v11H4v-11Zm5 0h3v11H9v-11Z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
