import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { LocaleEditionControls } from './locale-edition-controls';
import { MobileMenu } from './mobile-menu';
import { Wordmark } from './wordmark';
import { PRIMARY_SECTORS, MORE_SECTORS } from '@content/taxonomy';
import { formatTime } from '@/lib/format';
import type { Locale, Edition } from '@/i18n/config';

/**
 * The utility bar and masthead.
 *
 * The Riyadh clock in the utility bar is not decoration. This publication
 * timestamps everything in Riyadh time, and showing the newsroom clock in the
 * chrome is what makes a story stamped "14:20" unambiguous to a reader in
 * London without them having to work out the offset.
 */
export async function SiteHeader({
  locale,
  edition,
}: {
  locale: Locale;
  edition: Edition;
}) {
  const t = await getTranslations('nav');
  const tu = await getTranslations('utility');

  return (
    <header className="border-b border-[--color-line] bg-[--color-surface]">
      {/* ------------------------------------------------------ utility bar */}
      <div className="border-b border-[--color-line]">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-[--spacing-gutter] py-1.5">
          <p className="text-xs text-[--color-muted]">
            <span className="font-medium">{tu('riyadhTime')}</span>{' '}
            <time className="numeric">{formatTime(new Date().toISOString(), locale)}</time>
          </p>

          <div className="flex items-center gap-2">
            <LocaleEditionControls edition={edition} />
            <Link
              href="/search"
              className="rounded-sm p-1.5 hover:bg-[--color-surface-sunken]"
              aria-label={t('search')}
            >
              <SearchIcon />
            </Link>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------- masthead */}
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-[--spacing-gutter] py-4">
        <Link href="/" className="shrink-0">
          <Wordmark locale={locale} />
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/saved"
            className="hidden rounded-sm px-2 py-1.5 text-sm font-medium hover:bg-[--color-surface-sunken] sm:block"
          >
            {t('saved')}
          </Link>
          <MobileMenu />
        </div>
      </div>

      {/* ------------------------------------------------------- navigation */}
      <nav
        aria-label={t('mainNavigation')}
        className="border-t border-[--color-line]"
      >
        <div className="scroll-x mx-auto max-w-[1440px] px-[--spacing-gutter]">
          <ul className="flex items-center gap-1 whitespace-nowrap">
            <li>
              <Link
                href="/latest"
                className="inline-block px-2.5 py-2.5 text-sm font-semibold hover:text-[--color-brand-500]"
              >
                {t('latest')}
              </Link>
            </li>
            {PRIMARY_SECTORS.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/sector/${s.slug}`}
                  className="inline-block px-2.5 py-2.5 text-sm font-semibold hover:text-[--color-brand-500]"
                >
                  {s.label[locale]}
                </Link>
              </li>
            ))}
            <li className="group relative">
              {/* CSS-driven disclosure: no JS needed for a hover/focus menu,
                  and it stays usable if the bundle has not hydrated yet. */}
              <details className="inline-block">
                <summary className="cursor-pointer list-none px-2.5 py-2.5 text-sm font-semibold hover:text-[--color-brand-500]">
                  {t('more')}
                </summary>
                <ul className="absolute start-0 top-full z-40 min-w-[14rem] rounded-sm border border-[--color-line] bg-[--color-surface] py-1 shadow-lg">
                  {MORE_SECTORS.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/sector/${s.slug}`}
                        className="block px-3 py-1.5 text-sm hover:bg-[--color-surface-sunken]"
                      >
                        {s.label[locale]}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/projects"
                      className="block px-3 py-1.5 text-sm hover:bg-[--color-surface-sunken]"
                    >
                      {t('projects')}
                    </Link>
                  </li>
                </ul>
              </details>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <circle cx="7" cy="7" r="4.5" />
      <path d="m10.5 10.5 3.5 3.5" strokeLinecap="round" />
    </svg>
  );
}
