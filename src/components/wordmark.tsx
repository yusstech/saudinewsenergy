import { SITE } from '@/lib/site';
import type { Locale } from '@/i18n/config';

/**
 * The bilingual wordmark.
 *
 * Both lockups are always present; the locale decides which leads. The secondary script stays
 * visible rather than hidden, because this is one publication with two names — not an English
 * site with an Arabic mode — and a reader arriving on either side should see that immediately.
 *
 * Set in the serif at display weight. The wordmark is the one place the masthead gets to sound
 * like a newspaper rather than a product.
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
    <span className={`flex items-baseline gap-2.5 ${className}`}>
      {arabicFirst ? (
        <>
          <span
            lang="ar"
            className="font-display text-[1.2rem] leading-none tracking-tight sm:text-[1.6rem] lg:text-[1.9rem]"
            style={{ fontFamily: 'var(--font-naskh)' }}
          >
            {SITE.nameAr}
          </span>
          <span
            lang="en"
            dir="ltr"
            className="label hidden text-masthead-muted sm:inline"
          >
            {SITE.name}
          </span>
        </>
      ) : (
        <>
          <span className="font-display text-[1.2rem] leading-none tracking-tight sm:text-[1.6rem] lg:text-[1.9rem]">
            {SITE.name}
          </span>
          <span
            lang="ar"
            dir="rtl"
            className="hidden text-[0.95rem] text-masthead-muted sm:inline"
            style={{ fontFamily: 'var(--font-naskh)' }}
          >
            {SITE.nameAr}
          </span>
        </>
      )}
    </span>
  );
}
