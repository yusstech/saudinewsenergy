import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import { baseMetadata } from '@/lib/seo';
import { getStories } from '@/lib/content';
import { StoryCard } from '@/components/story-card';
import { PageHeader, EmptyState } from '@/components/page-header';
import { formatDate } from '@/lib/format';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'latest' });
  return {
    ...baseMetadata(locale, '/latest'),
    title: t('title'),
    description: t('intro'),
  };
}

export default async function LatestPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('latest');
  const tc = await getTranslations('common');
  const stories = getStories(locale);

  // Grouped by publication day. A flat reverse-chronological list stops being
  // navigable the moment there is more than a screenful — day headings give a
  // returning reader a place to stop rather than making them scan timestamps.
  const byDay = new Map<string, typeof stories>();
  for (const story of stories) {
    const day = story.publishedAt.slice(0, 10);
    byDay.set(day, [...(byDay.get(day) ?? []), story]);
  }

  return (
    <>
      <PageHeader title={t('title')} intro={t('intro')} />

      <div className="mx-auto max-w-[1440px] px-[var(--gutter)] py-8">
        {stories.length === 0 ? (
          <EmptyState title={tc('empty')} />
        ) : (
          <div className="space-y-10">
            {[...byDay.entries()].map(([day, list]) => (
              <section key={day}>
                <h2 className="mb-4 border-b border-line pb-1.5 text-sm font-bold uppercase tracking-wider text-muted">
                  <time dateTime={day}>{formatDate(day, locale)}</time>
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((s) => (
                    <StoryCard key={s.slug} story={s} locale={locale} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
