'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { formatDate } from '@/lib/format';
import { sectorLabel } from '@content/taxonomy';
import type { SearchDoc } from '@/lib/search';
import type { Sector } from '@content/schema';
import type { Locale } from '@/i18n/config';

/**
 * Search.
 *
 * The index ships with the page and matching runs locally, so results appear as
 * the reader types and there is no server round trip, no request queue and
 * nothing to be unavailable. The corpus is small enough that this is simply the
 * right shape for it; when it outgrows a single payload, this component is the
 * only thing that has to change.
 */
export function SearchClient({
  index,
  locale,
}: {
  index: SearchDoc[];
  locale: Locale;
}) {
  const t = useTranslations('search');
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];

    const terms = q.split(/\s+/).filter(Boolean);

    return index
      .map((doc) => {
        let score = 0;
        const headline = doc.headline.toLowerCase();
        for (const term of terms) {
          if (!doc.haystack.includes(term)) continue;
          // A term in the headline is a far stronger signal than the same term
          // buried in the body, and a headline containing every term is almost
          // certainly the story being looked for.
          score += headline.includes(term) ? 8 : 1;
        }
        if (terms.every((term) => headline.includes(term))) score += 12;
        return { doc, score };
      })
      .filter((r) => r.score > 0)
      .sort(
        (a, b) =>
          b.score - a.score ||
          Date.parse(b.doc.publishedAt) - Date.parse(a.doc.publishedAt),
      )
      .slice(0, 25)
      .map((r) => r.doc);
  }, [index, query]);

  const typed = query.trim().length >= 2;

  return (
    <div className="space-y-8">
      <form onSubmit={(e) => e.preventDefault()} role="search">
        <label htmlFor="q" className="sr-only">
          {t('placeholder')}
        </label>
        <input
          id="q"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('placeholder')}
          className="w-full rounded-sm border border-[--color-line-strong] bg-[--color-surface] px-3 py-2.5 text-base"
          autoComplete="off"
          autoFocus
        />
      </form>

      <section>
        <div className="mb-3 flex items-baseline justify-between gap-4 border-b border-[--color-line] pb-1.5">
          <h2 className="text-sm font-bold uppercase tracking-wider">
            {t('keywordTitle')}
          </h2>
          {typed && (
            <p className="text-sm text-[--color-muted]" aria-live="polite">
              {t('resultCount', { count: results.length })}
            </p>
          )}
        </div>

        {!typed ? (
          <p className="py-8 text-sm text-[--color-faint]">{t('placeholder')}</p>
        ) : results.length === 0 ? (
          <div className="py-8">
            <p className="font-medium text-[--color-muted]">{t('noResults')}</p>
            <p className="mt-1 text-sm text-[--color-faint]">{t('tryAgain')}</p>
          </div>
        ) : (
          <ul className="divide-y divide-[--color-line]">
            {results.map((doc) => (
              <li key={doc.slug} className="py-3.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[--color-muted]">
                    {sectorLabel(doc.sector as Sector, locale)}
                  </span>
                  {doc.isSampleContent && (
                    <span className="rounded-sm bg-[--color-surface-sunken] px-1.5 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wider text-[--color-muted] ring-1 ring-[--color-line-strong]">
                      {t('sampleLabel')}
                    </span>
                  )}
                  <span className="numeric text-xs text-[--color-faint]">
                    {formatDate(doc.publishedAt, locale)}
                  </span>
                </div>
                <h3 className="mt-1 font-bold leading-snug">
                  <Link href={doc.href} className="hover:underline underline-offset-4">
                    {doc.headline}
                  </Link>
                </h3>
                <p className="mt-0.5 line-clamp-2 text-sm text-[--color-muted]">
                  {doc.standfirst}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
