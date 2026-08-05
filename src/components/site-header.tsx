import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { LocaleEditionControls } from './locale-edition-controls';
import { MobileMenu } from './mobile-menu';
import { Wordmark } from './wordmark';
import { ThemeToggle } from './theme-toggle';
import { PRIMARY_SECTORS, MORE_SECTORS } from '@content/taxonomy';
import { formatDate, formatTime } from '@/lib/format';
import type { Locale } from '@/i18n/config';

/**
 * Two bands, where there used to be five.
 *
 * The previous header was a utility bar, a masthead and a nav stacked as three separate rules —
 * and above them sat a market marquee and an alert ribbon, so a reader met roughly 290px of
 * dense small text before the first headline. On a laptop that is a third of the screen spent
 * before the publication says anything.
 *
 * Now: one charcoal masthead band carrying the wordmark and every utility, then one nav rule.
 * The charcoal is spent here and almost nowhere else — it is what anchors the page and makes it
 * read as a publication rather than an application.
 */
export async function SiteHeader({ locale }: { locale: Locale }) {
  const t = await getTranslations('nav');
  const tu = await getTranslations('utility');
  const now = new Date().toISOString();

  return (
    <header>
      {/* ------------------------------------------------------- masthead band */}
      <div className="bg-masthead text-masthead-fg">
        <div className="page flex items-center gap-4 py-3.5 sm:py-4">
          <Link href="/" className="shrink-0" aria-label={t('home')}>
            <Wordmark locale={locale} />
          </Link>

          {/* The newsroom clock. Every timestamp on the site is Damascus time, so showing the
              newsroom's own clock in the masthead is what makes a story stamped 14:20
              unambiguous to a reader in London without them doing the arithmetic. */}
          <p className="ms-auto hidden text-meta text-masthead-muted lg:block">
            <span className="font-medium text-masthead-fg">
              {tu('damascusTime')}
            </span>{' '}
            <time className="numeric" dateTime={now}>
              {formatTime(now, locale)}
            </time>
            <span className="mx-2 opacity-40" aria-hidden="true">
              ·
            </span>
            <time dateTime={now}>{formatDate(now, locale)}</time>
          </p>

          {/* Utilities collapse below `md`. There is not room for the wordmark and four
              controls on a 390px screen, and letting them overflow clipped the language
              picker off the edge entirely. Language and edition move into the mobile
              sheet rather than disappearing. */}
          <div className="ms-auto flex items-center gap-1 lg:ms-0">
            <div className="hidden md:block">
              <LocaleEditionControls onDark />
            </div>

            <span
              className="mx-1 hidden h-4 w-px bg-white/15 md:block"
              aria-hidden="true"
            />

            <Link
              href="/saved"
              className="hidden rounded-sm px-2 py-1.5 text-meta font-medium text-masthead-fg hover:bg-white/10 md:block"
            >
              {t('saved')}
            </Link>
            <Link
              href="/search"
              className="rounded-sm p-2 text-masthead-fg hover:bg-white/10"
              aria-label={t('search')}
            >
              <SearchIcon />
            </Link>
            <div className="text-masthead-fg">
              <ThemeToggle onDark />
            </div>
            <MobileMenu />
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- nav rule */}
      <nav
        aria-label={t('mainNavigation')}
        className="sticky top-0 z-30 border-b border-line bg-canvas/95 backdrop-blur supports-[backdrop-filter]:bg-canvas/80"
      >
        <div className="page scroll-x">
          {/* `shrink-0` on every item is load-bearing: flex children shrink below their content
              width by default, and with `whitespace-nowrap` the text then overflows its own box
              and overlaps the next item rather than wrapping. */}
          <ul className="-mx-2.5 flex items-center whitespace-nowrap">
            <li className="shrink-0">
              <Link
                href="/latest"
                className="inline-block px-2.5 py-3 text-meta font-semibold text-strong hover:text-accent"
              >
                {t('latest')}
              </Link>
            </li>
            {PRIMARY_SECTORS.map((s) => (
              <li key={s.slug} className="shrink-0">
                <Link
                  href={`/sector/${s.slug}`}
                  className="inline-block px-2.5 py-3 text-meta font-medium text-body hover:text-accent"
                >
                  {s.label[locale]}
                </Link>
              </li>
            ))}
            <li className="relative shrink-0">
              {/* A CSS-driven disclosure: no JS, so it works before hydration. */}
              <details className="group inline-block">
                <summary className="cursor-pointer list-none px-2.5 py-3 text-meta font-medium text-body hover:text-accent">
                  {t('more')}
                </summary>
                <ul className="absolute start-0 top-full z-40 min-w-[15rem] border border-line bg-surface py-1 shadow-raise">
                  {MORE_SECTORS.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/sector/${s.slug}`}
                        className="block px-3.5 py-2 text-meta hover:bg-surface-sunken"
                      >
                        {s.label[locale]}
                      </Link>
                    </li>
                  ))}
                  <li className="rule-hair mt-1 pt-1">
                    <Link
                      href="/projects"
                      className="block px-3.5 py-2 text-meta hover:bg-surface-sunken"
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
    <svg
      viewBox="0 0 16 16"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <circle cx="7" cy="7" r="4.5" />
      <path d="m10.5 10.5 3.5 3.5" strokeLinecap="round" />
    </svg>
  );
}
