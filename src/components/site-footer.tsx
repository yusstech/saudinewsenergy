import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { SECTORS, EDITION_LABEL } from '@content/taxonomy';
import { EDITIONS, LOCALES, LOCALE_LABEL } from '@/i18n/config';
import { SITE } from '@/lib/site';
import type { Locale } from '@/i18n/config';

export async function SiteFooter({ locale }: { locale: Locale }) {
  const t = await getTranslations('footer');
  const tn = await getTranslations('nav');
  const ts = await getTranslations('standards');

  return (
    <footer className="mt-16 border-t border-[--color-line] bg-[--color-surface]">
      {/* ------------------------------------------------------ newsletters */}
      <section className="border-b border-[--color-line]">
        <div className="mx-auto max-w-[1440px] px-[--spacing-gutter] py-8">
          <h2 className="text-lg font-bold tracking-tight">{t('newsletters')}</h2>
          <p className="mt-1 text-sm text-[--color-muted]">{t('newsletterIntro')}</p>

          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {(['daily', 'weekly', 'markets', 'transition'] as const).map((k) => (
              <li
                key={k}
                className="rounded-sm border border-[--color-line] px-3 py-2.5 text-sm font-medium"
              >
                {t(k)}
              </li>
            ))}
          </ul>

          <form className="mt-4 flex max-w-md gap-2">
            <label htmlFor="newsletter-email" className="sr-only">
              {t('emailPlaceholder')}
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder={t('emailPlaceholder')}
              className="min-w-0 flex-1 rounded-sm border border-[--color-line-strong] bg-[--color-canvas] px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="rounded-sm bg-[--color-brand-500] px-4 py-2 text-sm font-semibold text-white hover:bg-[--color-brand-600]"
            >
              {t('subscribe')}
            </button>
          </form>
        </div>
      </section>

      {/* ----------------------------------------------------------- links */}
      <div className="mx-auto grid max-w-[1440px] gap-8 px-[--spacing-gutter] py-10 sm:grid-cols-2 lg:grid-cols-4">
        <nav aria-labelledby="footer-sections">
          <h2 id="footer-sections" className="text-xs font-semibold uppercase tracking-wider text-[--color-muted]">
            {t('sections')}
          </h2>
          <ul className="mt-3 space-y-1.5 text-sm">
            {SECTORS.map((s) => (
              <li key={s.slug}>
                <Link href={`/sector/${s.slug}`} className="hover:underline underline-offset-4">
                  {s.label[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-editorial">
          <h2 id="footer-editorial" className="text-xs font-semibold uppercase tracking-wider text-[--color-muted]">
            {t('editorial')}
          </h2>
          <ul className="mt-3 space-y-1.5 text-sm">
            <li>
              <Link href="/standards" className="hover:underline underline-offset-4">
                {ts('title')}
              </Link>
            </li>
            <li>
              <Link href="/corrections" className="hover:underline underline-offset-4">
                {ts('corrections')}
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:underline underline-offset-4">
                {ts('about')}
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline underline-offset-4">
                {ts('contact')}
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-labelledby="footer-editions">
          <h2 id="footer-editions" className="text-xs font-semibold uppercase tracking-wider text-[--color-muted]">
            {t('editions')}
          </h2>
          <ul className="mt-3 space-y-1.5 text-sm">
            {EDITIONS.map((e) => (
              <li key={e}>
                <Link href={`/edition/${e}`} className="hover:underline underline-offset-4">
                  {EDITION_LABEL[e][locale]}
                </Link>
              </li>
            ))}
          </ul>

          <h2 className="mt-5 text-xs font-semibold uppercase tracking-wider text-[--color-muted]">
            {t('languages')}
          </h2>
          <ul className="mt-3 space-y-1.5 text-sm">
            {LOCALES.map((l) => (
              <li key={l}>
                <Link
                  href="/"
                  locale={l}
                  lang={l === 'ar' ? 'ar' : 'en'}
                  className="hover:underline underline-offset-4"
                >
                  {LOCALE_LABEL[l]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[--color-muted]">
            {tn('home')}
          </h2>
          <p className="mt-3 max-w-[32ch] text-sm text-[--color-muted]">
            {SITE.promise[locale]}
          </p>
          <p className="mt-3 text-sm">
            <a
              href={`mailto:${SITE.contact}`}
              className="hover:underline underline-offset-4"
            >
              {SITE.contact}
            </a>
          </p>
        </div>
      </div>

      {/* --------------------------------------------------------- bottom */}
      <div className="border-t border-[--color-line]">
        <div className="mx-auto max-w-[1440px] space-y-2 px-[--spacing-gutter] py-5">
          {/*
            The prototype disclosure sits in the footer of every page, not only
            on the pages showing sample content. A reader who lands directly on
            an article should be able to find out what this site currently is
            without navigating anywhere.
          */}
          <p className="text-xs text-[--color-copper-500] dark:text-[--color-copper-300]">
            {t('prototypeNotice')}
          </p>
          <p className="text-xs text-[--color-faint]">
            {t('rights', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}
