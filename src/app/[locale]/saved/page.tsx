import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import { baseMetadata } from '@/lib/seo';
import { getStories } from '@/lib/content';
import { PageHeader } from '@/components/page-header';
import { SavedList, type SavedEntry } from '@/components/saved-list';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'saved' });
  return {
    ...baseMetadata(locale, '/saved'),
    title: t('title'),
    description: t('intro'),
    // Device-local and per-reader. There is nothing here for a crawler and
    // nothing that should ever appear in a search result.
    robots: { index: false, follow: true },
  };
}

/**
 * Saved stories.
 *
 * The whole catalogue is passed to the client and filtered there against
 * `localStorage`. That is only reasonable because the corpus is small; it also
 * keeps the reader's saved list off the server entirely, which is the right
 * default for a preference nobody has been asked to hand over.
 */
export default async function SavedPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('saved');

  const entries: SavedEntry[] = getStories(locale).map((s) => ({
    slug: s.slug,
    href: `/${s.isLive ? 'live' : 'article'}/${s.slug}`,
    headline: s.cardHeadline ?? s.headline,
    standfirst: s.standfirst,
    publishedAt: s.publishedAt,
    sector: s.sector,
  }));

  return (
    <>
      <PageHeader title={t('title')} intro={t('intro')} />
      <div className="mx-auto max-w-[1440px] px-[var(--gutter)] py-8">
        <SavedList entries={entries} locale={locale} />
        <p className="mt-6 text-xs text-faint">{t('deviceOnly')}</p>
      </div>
    </>
  );
}
