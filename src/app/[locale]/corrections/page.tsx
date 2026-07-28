import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/config';
import { baseMetadata } from '@/lib/seo';
import { getStories } from '@/lib/content';
import { formatDate } from '@/lib/format';
import { PageHeader, EmptyState } from '@/components/page-header';
import { Prose } from '@/components/prose';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'standards' });
  return { ...baseMetadata(locale, '/corrections'), title: t('corrections') };
}

/**
 * The corrections log.
 *
 * Assembled from the corrections recorded on individual stories rather than
 * maintained by hand, so this page cannot drift out of step with the notes
 * readers see in place. A corrections page that has to be remembered separately
 * is a corrections page that eventually is not.
 */
export default async function CorrectionsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('standards');
  const ta = await getTranslations('article');
  const tc = await getTranslations('common');

  const entries = getStories(locale)
    .flatMap((story) => story.corrections.map((c) => ({ story, correction: c })))
    .sort(
      (a, b) => Date.parse(b.correction.date) - Date.parse(a.correction.date),
    );

  return (
    <>
      <PageHeader title={t('corrections')} />
      <div className="mx-auto max-w-[1440px] px-[--spacing-gutter] py-8">
        {entries.length === 0 ? (
          <EmptyState title={tc('empty')} />
        ) : (
          <ol className="divide-y divide-[--color-line]">
            {entries.map(({ story, correction }, i) => (
              <li key={`${story.slug}-${i}`} className="py-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-[--color-developing]">
                  {correction.kind === 'correction'
                    ? ta('correctedOn', { date: formatDate(correction.date, locale) })
                    : ta('updatedOn', { date: formatDate(correction.date, locale) })}
                </p>
                <h2 className="mt-1 font-bold">
                  <Link
                    href={`/${story.isLive ? 'live' : 'article'}/${story.slug}`}
                    className="hover:underline underline-offset-4"
                  >
                    {story.headline}
                  </Link>
                </h2>
                <p className="mt-1 text-sm text-[--color-muted]">{correction.note}</p>
              </li>
            ))}
          </ol>
        )}
      </div>
      <Prose>
        {locale === 'en' ? (
          <p className="text-sm text-[--color-muted]">
            Spotted an error? Write to the newsroom and we will look at it.
            Material corrections are recorded on the story and listed here.
          </p>
        ) : (
          <p className="text-sm text-[--color-muted]">
            هل لاحظت خطأً؟ راسل غرفة الأخبار وسننظر فيه. وتُسجَّل التصحيحات
            الجوهرية في المادة نفسها وتُدرج هنا.
          </p>
        )}
      </Prose>
    </>
  );
}
