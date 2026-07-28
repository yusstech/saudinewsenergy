import { SITE } from '@/lib/site';
import type { Locale } from '@/i18n/config';

/**
 * The bilingual wordmark.
 *
 * Both lockups are always present; which one leads depends on the locale. The
 * secondary script stays visible at a smaller size rather than being hidden,
 * because this is one publication with two names, not an English site with an
 * Arabic mode — and a reader arriving on either side should be able to see that
 * immediately.
 */
export function Wordmark({
  locale,
  className = '',
}: {
  locale: Locale;
  className?: string;
}) {
  const arabicFirst = locale === 'ar';

  return (
    <span className={`flex flex-col leading-none ${className}`}>
      <span className="flex items-baseline gap-2">
        {arabicFirst ? (
          <>
            <span
              lang="ar"
              className="text-xl font-bold tracking-tight sm:text-2xl"
            >
              {SITE.nameAr}
            </span>
            <span
              lang="en"
              dir="ltr"
              className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[--color-muted]"
            >
              {SITE.name}
            </span>
          </>
        ) : (
          <>
            <span className="text-xl font-bold tracking-tight sm:text-2xl">
              {SITE.name}
            </span>
            <span
              lang="ar"
              dir="rtl"
              className="text-sm font-semibold text-[--color-muted]"
            >
              {SITE.nameAr}
            </span>
          </>
        )}
      </span>
      <span className="mt-1 text-[0.625rem] font-medium uppercase tracking-[0.16em] text-[--color-copper-500] dark:text-[--color-copper-300]">
        {SITE.descriptor[locale]}
      </span>
    </span>
  );
}
