import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LOCALES, type Locale } from '@/i18n/config';
import { baseMetadata } from '@/lib/seo';
import { getStoriesBySector } from '@/lib/content';
import { SECTORS, SECTOR_MAP } from '@content/taxonomy';
import { sectorSchema } from '@content/schema';
import { StoryCard } from '@/components/story-card';
import { PageHeader, EmptyState } from '@/components/page-header';

/**
 * Every valid slug is enumerated by generateStaticParams, so anything else is
 * genuinely not a page here. Without this, an unknown slug renders on demand,
 * hits `notFound()` and returns the 404 *body* with a 200 status — a soft 404
 * that search engines will happily index as a real page.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    SECTORS.map((s) => ({ locale, sector: s.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; sector: string }>;
}): Promise<Metadata> {
  const { locale, sector } = await params;
  const parsed = sectorSchema.safeParse(sector);
  if (!parsed.success) return {};

  const entry = SECTOR_MAP.get(parsed.data);
  return {
    ...baseMetadata(locale, `/sector/${sector}`),
    title: entry?.label[locale],
    description: entry?.blurb[locale],
  };
}

export default async function SectorPage({
  params,
}: {
  params: Promise<{ locale: Locale; sector: string }>;
}) {
  const { locale, sector } = await params;
  setRequestLocale(locale);

  const parsed = sectorSchema.safeParse(sector);
  if (!parsed.success) notFound();

  const entry = SECTOR_MAP.get(parsed.data);
  if (!entry) notFound();

  const tc = await getTranslations('common');
  const th = await getTranslations('home');
  const stories = getStoriesBySector(locale, parsed.data);

  const [lead, ...rest] = stories;

  return (
    <>
      <PageHeader
        eyebrow={th('sectorsTitle')}
        title={entry.label[locale]}
        intro={entry.blurb[locale]}
      />

      <div className="mx-auto max-w-[1440px] px-[--spacing-gutter] py-8">
        {!lead ? (
          <EmptyState title={tc('empty')} />
        ) : (
          <div className="space-y-10">
            <StoryCard story={lead} locale={locale} variant="lead" />
            {rest.length > 0 && (
              <div className="grid gap-6 border-t border-[--color-line] pt-8 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((s) => (
                  <StoryCard key={s.slug} story={s} locale={locale} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
