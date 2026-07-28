'use client';

import { useState, useTransition } from 'react';
import { useRouter } from '@/i18n/navigation';
import { EDITION_COOKIE, type Edition } from '@/i18n/config';

export function EditionSuggestionClient({
  edition,
  title,
  body,
  accept,
  dismiss,
}: {
  edition: Edition;
  title: string;
  body: string;
  accept: string;
  dismiss: string;
}) {
  const [visible, setVisible] = useState(true);
  const [, startTransition] = useTransition();
  const router = useRouter();

  if (!visible) return null;

  function set(next: Edition) {
    document.cookie = `${EDITION_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    setVisible(false);
    startTransition(() => router.refresh());
  }

  return (
    <aside
      // `polite`, not `assertive`: this is an offer, and interrupting whatever
      // a screen-reader user is currently hearing to make it would be the
      // audible equivalent of a modal nobody asked for.
      aria-live="polite"
      className="border-b border-[--color-line] bg-[--color-surface-sunken]"
    >
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-4 gap-y-2 px-[--spacing-gutter] py-2.5">
        <p className="min-w-0 flex-1 text-sm">
          <span className="font-semibold">{title}</span>{' '}
          <span className="text-[--color-muted]">{body}</span>
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => set(edition)}
            className="rounded-sm bg-[--color-brand-500] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[--color-brand-600]"
          >
            {accept}
          </button>
          <button
            type="button"
            // Dismissing writes the default rather than only hiding the banner,
            // so the answer sticks across visits instead of being asked again.
            onClick={() => set('saudi')}
            className="rounded-sm px-2 py-1.5 text-xs font-medium text-[--color-muted] hover:text-[--color-body]"
          >
            {dismiss}
          </button>
        </div>
      </div>
    </aside>
  );
}
