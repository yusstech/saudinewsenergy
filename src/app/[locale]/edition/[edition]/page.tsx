import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LOCALES, EDITIONS, isEdition, type Locale } from '@/i18n/config';
import { baseMetadata, coverageRobots } from '@/lib/seo';
import { getStoriesByEdition } from '@/lib/content';
import { EDITION_LABEL } from '@content/taxonomy';
import { StoryCard } from '@/components/story-card';
import { SectionHeading } from '@/components/section';
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
    EDITIONS.map((edition) => ({ locale, edition })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; edition: string }>;
}): Promise<Metadata> {
  const { locale, edition } = await params;
  if (!isEdition(edition)) return {};
  return {
    ...baseMetadata(locale, `/edition/${edition}`),
    title: EDITION_LABEL[edition][locale],
    robots: coverageRobots(getStoriesByEdition(locale, edition).length > 0),
  };
}

/**
 * An edition view.
 *
 * Syrian coverage appears in every edition. What changes is the regional
 * coverage joining it, which is why the page separates the two explicitly
 * rather than presenting one merged feed: a reader on the Global edition should
 * be able to see that the Syria desk is still the spine of what they are
 * reading.
 */
export default async function EditionPage({
  params,
}: {
  params: Promise<{ locale: Locale; edition: string }>;
}) {
  const { locale, edition } = await params;
  setRequestLocale(locale);

  if (!isEdition(edition)) notFound();

  const t = await getTranslations('edition');
  const tu = await getTranslations('utility');
  const tc = await getTranslations('common');
  const th = await getTranslations('home');

  const stories = getStoriesByEdition(locale, edition);
  const syria = stories.filter((s) => s.editions.includes('syria'));
  const regional =
    edition === 'syria'
      ? []
      : stories.filter(
          (s) => s.editions.includes(edition) && !s.editions.includes('syria'),
        );

  return (
    <>
      <PageHeader
        eyebrow={tu('edition')}
        title={EDITION_LABEL[edition][locale]}
        intro={tu('editionExplainer')}
      />

      <div className="page space-y-[var(--space-section)] py-[var(--space-block)]">
        <section>
          <SectionHeading title={t('syria')} />
          {syria.length === 0 ? (
            <EmptyState title={tc('empty')} />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {syria.map((s) => (
                <StoryCard key={s.slug} story={s} locale={locale} />
              ))}
            </div>
          )}
        </section>

        {regional.length > 0 && (
          <section>
            <SectionHeading title={th('globalTitle')} />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {regional.map((s) => (
                <StoryCard key={s.slug} story={s} locale={locale} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
