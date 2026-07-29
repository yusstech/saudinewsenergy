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
      {/*
        The newsletter block, minus the newsletter.

        This was four named briefings and an email field. None of the four exists, and the form
        had no action and no handler — submitting it reloaded the page and dropped the address.
        Collecting a reader's email for a mailing list nobody runs is the same fault as printing
        a price nobody licensed, and it is worse in one respect: the reader gives something up.

        What is left is the true version. The desk has a working address, so that is what is
        offered, as a `mailto:` that actually goes somewhere. It becomes a subscribe form again
        when there is something to subscribe to.
      */}
      <section className="border-b border-line">
        <div className="page py-[var(--space-block)]">
          <p className="font-display text-subhead text-strong">{t('newsletters')}</p>
          <p className="mt-1 max-w-prose text-meta leading-relaxed text-muted">
            {t('newsletterIntro')}
          </p>
          <a
            href={`mailto:${SITE.contact}`}
            className="mt-3 inline-block text-meta font-semibold text-accent hover:underline underline-offset-4"
          >
            {SITE.contact}
          </a>
        </div>
      </section>

      {/* ----------------------------------------------------------- links */}
      <div className="page grid gap-8 py-[var(--space-block)] sm:grid-cols-2 lg:grid-cols-4">
        {/*
          Landmark labels, not headings.

          These were <h2>s, and six of them appeared on every page — so an
          article with eight real section headings shipped fourteen, and a
          passage extractor reading the outline saw "Newsletters, Sections,
          Editorial" before it saw the reporting. `aria-labelledby` names a
          landmark from any element, so the accessible name survives and the
          document outline goes back to describing the article.
        */}
        <nav aria-labelledby="footer-sections">
          <p id="footer-sections" className="label text-strong">
            {t('sections')}
          </p>
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
          <p id="footer-editorial" className="label text-strong">
            {t('editorial')}
          </p>
          <ul className="mt-3 space-y-1.5 text-meta">
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
          <p id="footer-editions" className="label text-strong">
            {t('editions')}
          </p>
          <ul className="mt-3 space-y-1.5 text-meta">
            {EDITIONS.map((e) => (
              <li key={e}>
                <Link href={`/edition/${e}`} className="hover:underline underline-offset-4">
                  {EDITION_LABEL[e][locale]}
                </Link>
              </li>
            ))}
          </ul>

          <p className="label mt-5 text-strong">
            {t('languages')}
          </p>
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
          <p className="label text-strong">
            {tn('home')}
          </p>
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
          <p className="text-micro text-faint">
            {t('rights', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}
