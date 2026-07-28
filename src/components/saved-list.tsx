'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useSavedStories } from '@/lib/use-saved';
import { formatDate } from '@/lib/format';
import { sectorLabel } from '@content/taxonomy';
import type { Sector } from '@content/schema';
import type { Locale } from '@/i18n/config';

export interface SavedEntry {
  slug: string;
  href: string;
  headline: string;
  standfirst: string;
  publishedAt: string;
  sector: Sector;
  isSampleContent: boolean;
}

export function SavedList({
  entries,
  locale,
}: {
  entries: SavedEntry[];
  locale: Locale;
}) {
  const t = useTranslations('saved');
  const tm = useTranslations('market');
  const { slugs, remove } = useSavedStories();
  const [ready, setReady] = useState(false);

  // The list depends on localStorage, so the server cannot know it. Rendering
  // the empty state before the first read would flash "nothing saved" at a
  // reader who has saved things.
  useEffect(() => setReady(true), []);

  if (!ready) {
    return <div className="h-32" aria-hidden="true" />;
  }

  const saved = slugs
    .map((slug) => entries.find((e) => e.slug === slug))
    .filter((e) => e !== undefined);

  if (saved.length === 0) {
    return (
      <div className="rounded-sm border border-dashed border-[--color-line-strong] px-6 py-14 text-center">
        <p className="font-medium text-[--color-muted]">{t('empty')}</p>
        <p className="mt-1 text-sm text-[--color-faint]">{t('emptyHint')}</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-[--color-line]">
      {saved.map((entry) => (
        <li key={entry.slug} className="flex gap-4 py-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[--color-muted]">
                {sectorLabel(entry.sector, locale)}
              </span>
              {entry.isSampleContent && (
                <span className="rounded-sm bg-[--color-surface-sunken] px-1.5 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-[--color-muted] ring-1 ring-[--color-line-strong]">
                  {tm('sampleData')}
                </span>
              )}
            </div>
            <h2 className="mt-1 text-lg font-bold leading-snug">
              <Link href={entry.href} className="hover:underline underline-offset-4">
                {entry.headline}
              </Link>
            </h2>
            <p className="mt-1 line-clamp-2 text-sm text-[--color-muted]">
              {entry.standfirst}
            </p>
            <p className="numeric mt-1 text-xs text-[--color-faint]">
              {formatDate(entry.publishedAt, locale)}
            </p>
          </div>

          <button
            type="button"
            onClick={() => remove(entry.slug)}
            className="shrink-0 self-start rounded-sm px-2 py-1 text-xs font-medium text-[--color-muted] hover:bg-[--color-surface-sunken] hover:text-[--color-body]"
          >
            {t('remove')}
          </button>
        </li>
      ))}
    </ul>
  );
}
