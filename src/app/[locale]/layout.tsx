import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { DIRECTION, LOCALE_TAG, type Locale } from '@/i18n/config';
import { inter, ibmArabic } from '../fonts';
import { SITE, siteName, siteDescriptor } from '@/lib/site';
import { baseMetadata, siteJsonLd, jsonLdScript } from '@/lib/seo';
import { resolveEdition } from '@/lib/edition';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { MobileBottomNav } from '@/components/mobile-menu';
import { MarketStrip } from '@/components/market-strip';
import { BreakingRibbon } from '@/components/breaking-ribbon';
import { EditionSuggestion } from '@/components/edition-suggestion';
import { getAlertStories } from '@/lib/content';
import { MARKET_INDICATORS } from '@content/markets';
import '../globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  return {
    ...baseMetadata(locale, '/'),
    title: {
      default: `${siteName(locale)} — ${siteDescriptor(locale)}`,
      template: `%s | ${siteName(locale)}`,
    },
    description: SITE.promise[locale],
    applicationName: SITE.name,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Required for static rendering of a localised segment.
  setRequestLocale(locale);

  const typed = locale as Locale;
  const edition = await resolveEdition();
  const t = await getTranslations('site');

  const alerts = getAlertStories(typed).map((s) => ({
    slug: s.slug,
    href: `/${s.isLive ? 'live' : 'article'}/${s.slug}`,
    headline: s.cardHeadline ?? s.headline,
    state: s.alert!,
    time: s.updatedAt ?? s.publishedAt,
  }));

  return (
    // `lang` and `dir` are set on the server, from the route. Direction that
    // arrives after hydration means a visible reflow and, worse, a screen
    // reader that has already begun announcing the page in the wrong direction.
    <html
      lang={LOCALE_TAG[typed]}
      dir={DIRECTION[typed]}
      className={`${inter.variable} ${ibmArabic.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col bg-[--color-canvas] text-[--color-body] antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(siteJsonLd(typed)) }}
        />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:start-2 focus:top-2 focus:z-[100] focus:rounded-sm focus:bg-[--color-brand-500] focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          {t('skipToContent')}
        </a>

        <NextIntlClientProvider>
          <MarketStrip indicators={MARKET_INDICATORS} locale={typed} />
          <BreakingRibbon items={alerts} />
          <SiteHeader locale={typed} edition={edition} />
          <EditionSuggestion />

          <main id="main" className="flex-1">
            {children}
          </main>

          <SiteFooter locale={typed} />
          <MobileBottomNav />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
