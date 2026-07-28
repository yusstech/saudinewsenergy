'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { formatRelative, machineDate } from '@/lib/format';
import type { Locale } from '@/i18n/config';

export interface PulseItem {
  slug: string;
  href: string;
  headline: string;
  time: string;
  tab: PulseTab;
}

export type PulseTab =
  | 'latest'
  | 'markets'
  | 'projects'
  | 'mostRead'
  | 'gcc'
  | 'global';

const TABS: PulseTab[] = ['latest', 'markets', 'projects', 'mostRead', 'gcc', 'global'];

/**
 * The Energy Pulse — fast access without flattening the editorial ranking.
 *
 * This is a *shortcut*, sitting above the lead grid rather than replacing it.
 * The distinction is the whole reason the module exists: a reader checking back
 * for the fourth time today wants a list, while a reader arriving for the first
 * time needs the newsroom's judgement about what matters most. Making the tabs
 * reorder the main grid would serve the first reader by disserving the second.
 *
 * Every tab's content is rendered server-side and toggled with CSS, so the
 * panels are in the HTML for a crawler and for a reader whose JS never arrives.
 */
export function EnergyPulse({
  items,
  locale,
}: {
  items: PulseItem[];
  locale: Locale;
}) {
  const t = useTranslations('pulse');
  const [active, setActive] = useState<PulseTab>('latest');

  const available = TABS.filter((tab) => items.some((i) => i.tab === tab));
  if (!available.length) return null;

  return (
    <section
      aria-label={t('title')}
      className="border-y border-[--color-line] bg-[--color-surface]"
    >
      <div className="mx-auto max-w-[1440px] px-[--spacing-gutter] py-3">
        <div className="scroll-x -mb-px">
          <div role="tablist" aria-label={t('title')} className="flex gap-1 whitespace-nowrap">
            {available.map((tab) => (
              <button
                key={tab}
                role="tab"
                id={`pulse-tab-${tab}`}
                aria-selected={active === tab}
                aria-controls={`pulse-panel-${tab}`}
                onClick={() => setActive(tab)}
                className={`rounded-sm px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  active === tab
                    ? 'bg-[--color-body] text-[--color-canvas]'
                    : 'text-[--color-muted] hover:bg-[--color-surface-sunken] hover:text-[--color-body]'
                }`}
              >
                {t(tab)}
              </button>
            ))}
          </div>
        </div>

        {available.map((tab) => {
          const panelItems = items.filter((i) => i.tab === tab).slice(0, 6);
          return (
            <div
              key={tab}
              role="tabpanel"
              id={`pulse-panel-${tab}`}
              aria-labelledby={`pulse-tab-${tab}`}
              hidden={active !== tab}
              className="mt-3"
            >
              <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
                {panelItems.map((item) => (
                  <li key={item.slug} className="flex items-baseline gap-2 text-sm">
                    <time
                      dateTime={machineDate(item.time)}
                      className="shrink-0 text-xs text-[--color-faint]"
                    >
                      {formatRelative(item.time, locale)}
                    </time>
                    <Link
                      href={item.href}
                      className="min-w-0 font-medium hover:underline underline-offset-2"
                    >
                      {item.headline}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
