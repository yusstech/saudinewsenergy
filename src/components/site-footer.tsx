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
    <footer className="mt-[var(--space-section)] border-t border-rule bg-surface-sunken">
      {/* ------------------------------------------------------ newsletters */}
      <section className="border-b border-line">
        <div className="page py-[var(--space-block)]">
          <h2 className="font-display text-subhead text-strong">{t('newsletters')}</h2>
          <p className="mt-1 text-meta text-muted">{t('newsletterIntro')}</p>

          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {(['daily', 'weekly', 'markets', 'transition'] as const).map((k) => (
              <li
                key={k}
                className="border border-line bg-surface px-3 py-2.5 text-meta font-medium"
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
              className="min-w-0 flex-1 border border-line-strong bg-surface px-3 py-2 text-meta"
            />
            <button
              type="submit"
              className="bg-masthead px-4 py-2 text-meta font-semibold text-masthead-fg hover:bg-ink-800"
            >
              {t('subscribe')}
            </button>
          </form>
        </div>
      </section>

      {/* ----------------------------------------------------------- links */}
      <div className="page grid gap-8 py-[var(--space-block)] sm:grid-cols-2 lg:grid-cols-4">
        <nav aria-labelledby="footer-sections">
          <h2 id="footer-sections" className="label text-strong">
            {t('sections')}
          </h2>
          <ul className="mt-3 space-y-1.5 text-meta">
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
          <h2 id="footer-editorial" className="label text-strong">
            {t('editorial')}
          </h2>
          <ul className="mt-3 space-y-1.5 text-meta">
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
          <h2 id="footer-editions" className="label text-strong">
            {t('editions')}
          </h2>
          <ul className="mt-3 space-y-1.5 text-meta">
            {EDITIONS.map((e) => (
              <li key={e}>
                <Link href={`/edition/${e}`} className="hover:underline underline-offset-4">
                  {EDITION_LABEL[e][locale]}
                </Link>
              </li>
            ))}
          </ul>

          <h2 className="label mt-5 text-strong">
            {t('languages')}
          </h2>
          <ul className="mt-3 space-y-1.5 text-meta">
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
          <h2 className="label text-strong">
            {tn('home')}
          </h2>
          <p className="mt-3 max-w-[32ch] text-meta leading-relaxed text-muted">
            {SITE.promise[locale]}
          </p>
          <p className="mt-3 text-meta">
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
      <div className="border-t border-line">
        <div className="page space-y-2 py-5">
          {/*
            The prototype disclosure sits in the footer of every page, not only
            on the pages showing sample content. A reader who lands directly on
            an article should be able to find out what this site currently is
            without navigating anywhere.
          */}
          <p className="text-micro leading-relaxed text-copper-500 dark:text-copper-300">
            {t('prototypeNotice')}
          </p>
          <p className="text-micro text-faint">
            {t('rights', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}
