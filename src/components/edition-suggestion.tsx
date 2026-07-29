'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useSuggestedEdition } from '@/lib/use-edition';
import { EDITION_COOKIE, type Edition } from '@/i18n/config';

/**
 * The dismissible edition recommendation.
 *
 * This exists instead of a geo-redirect. A reader arriving from the UAE is
 * offered GCC coverage alongside their Saudi edition; they are never moved
 * there. The distinction matters editorially — Saudi Arabia stays the centre in
 * every edition — and technically, because a redirect keyed to IP means two
 * readers requesting the same URL get different pages, which breaks canonical
 * URLs and makes shared links unreliable.
 *
 * It decides on the client now, from a country code middleware stamped into a
 * cookie. It used to decide on the server, and because it sat in the `[locale]`
 * layout, that single `headers()` call made every page on the site render
 * dynamically — which is what left unknown slugs answering 200 instead of 404.
 * A banner this peripheral has no business setting the rendering mode of the
 * whole publication.
 */
export function EditionSuggestion() {
  const { suggestion, settled } = useSuggestedEdition();
  const [dismissed, setDismissed] = useState(false);
  const [, startTransition] = useTransition();
  const router = useRouter();
  const t = useTranslations('edition');

  if (!settled || !suggestion || dismissed) return null;

  function choose(next: Edition) {
    document.cookie = `${EDITION_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    setDismissed(true);
    startTransition(() => router.refresh());
  }

  return (
    <aside
      // `polite`, not `assertive`: this is an offer, and interrupting whatever
      // a screen-reader user is currently hearing to make it would be the
      // audible equivalent of a modal nobody asked for.
      aria-live="polite"
      className="border-b border-line bg-surface-sunken"
    >
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-4 gap-y-2 px-[var(--gutter)] py-2.5">
        <p className="min-w-0 flex-1 text-sm">
          <span className="font-semibold">{t('suggestionTitle')}</span>{' '}
          <span className="text-muted">
            {t('suggestionBody', {
              country: suggestion.country,
              edition: t(suggestion.edition),
            })}
          </span>
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => choose(suggestion.edition)}
            className="rounded-sm bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-600"
          >
            {t('suggestionAccept', { edition: t(suggestion.edition) })}
          </button>
          <button
            type="button"
            // Dismissing writes the default rather than only hiding the banner,
            // so the answer sticks across visits instead of being asked again.
            onClick={() => choose('saudi')}
            className="rounded-sm px-2 py-1.5 text-xs font-medium text-muted hover:text-body"
          >
            {t('suggestionDismiss')}
          </button>
        </div>
      </div>
    </aside>
  );
}
