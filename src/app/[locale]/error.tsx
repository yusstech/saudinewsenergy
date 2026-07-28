'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('common');

  useEffect(() => {
    // The digest is the only handle on the server-side stack once this reaches
    // production, so it goes to the console rather than being swallowed.
    console.error('Route error', error.digest ?? error.message);
  }, [error]);

  return (
    <div className="mx-auto max-w-[1440px] px-[--spacing-gutter] py-24 text-center">
      <h1 className="text-2xl font-bold tracking-tight">{t('error')}</h1>
      <p className="mt-2 text-[--color-muted]">{t('errorBody')}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-sm bg-[--color-brand-500] px-4 py-2 text-sm font-semibold text-white hover:bg-[--color-brand-600]"
      >
        {t('retry')}
      </button>
    </div>
  );
}
