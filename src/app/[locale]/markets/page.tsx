import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import { baseMetadata } from '@/lib/seo';
import { MARKET_INDICATORS, MARKETS_ARE_SAMPLE } from '@content/markets';
import { getStoriesBySector } from '@/lib/content';
import { StoryCard } from '@/components/story-card';
import { PageHeader } from '@/components/page-header';
import {
  formatNumber,
  formatChange,
  formatPercent,
  formatDateTime,
  machineDate,
  direction,
} from '@/lib/format';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'market' });
  return {
    ...baseMetadata(locale, '/markets'),
    title: t('overviewTitle'),
    description: t('overviewIntro'),
    // Sample prices must not be indexed. A search result showing an invented
    // Brent figure under this masthead is a liability regardless of what the
    // page itself says.
    ...(MARKETS_ARE_SAMPLE ? { robots: { index: false, follow: true } } : {}),
  };
}

const TREND = {
  up: 'text-[--color-brand-500] dark:text-[--color-brand-400]',
  down: 'text-[--color-breaking]',
  flat: 'text-[--color-muted]',
} as const;

export default async function MarketsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('market');
  const stories = getStoriesBySector(locale, 'markets');

  return (
    <>
      <PageHeader title={t('overviewTitle')} intro={t('overviewIntro')} />

      <div className="mx-auto max-w-[1440px] space-y-10 px-[--spacing-gutter] py-8">
        {/*
          The disclosure leads the page. Putting it below the table would mean
          a reader forms a view of the numbers before learning what they are.
        */}
        {MARKETS_ARE_SAMPLE && (
          <p className="rounded-sm border border-[--color-copper-400] bg-[--color-surface] px-4 py-3 text-sm font-medium text-[--color-copper-500] dark:text-[--color-copper-300]">
            {t('sampleDataNotice')}
          </p>
        )}

        <div className="scroll-x">
          <table className="w-full min-w-[42rem] border-collapse text-sm">
            <caption className="sr-only">{t('overviewTitle')}</caption>
            <thead>
              <tr className="border-b-2 border-[--color-body] text-start">
                <th scope="col" className="py-2 text-start font-semibold">
                  {t('stripLabel')}
                </th>
                <th scope="col" className="py-2 text-end font-semibold">
                  {t('overviewTitle')}
                </th>
                <th scope="col" className="py-2 text-end font-semibold">
                  {t('unit')}
                </th>
                <th scope="col" className="py-2 text-end font-semibold">
                  {t('change')}
                </th>
                <th scope="col" className="py-2 text-end font-semibold">
                  %
                </th>
                <th scope="col" className="py-2 text-end font-semibold">
                  {t('asOf', { time: '' }).trim()}
                </th>
              </tr>
            </thead>
            <tbody>
              {MARKET_INDICATORS.map((m) => {
                const dir = direction(m.change);
                return (
                  <tr key={m.id} className="border-b border-[--color-line]">
                    <th scope="row" className="py-2.5 text-start font-medium">
                      {m.label[locale]}
                      {m.isSample && (
                        <span className="ms-2 rounded-sm bg-[--color-surface-sunken] px-1 py-px text-[0.5625rem] font-semibold uppercase tracking-wider text-[--color-copper-500] ring-1 ring-[--color-line-strong] dark:text-[--color-copper-300]">
                          {t('sampleData')}
                        </span>
                      )}
                    </th>
                    <td className="numeric py-2.5 text-end font-semibold">
                      {formatNumber(m.value, locale, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-2.5 text-end text-xs text-[--color-faint]">
                      {m.unit}
                    </td>
                    <td className={`numeric py-2.5 text-end ${TREND[dir]}`}>
                      {formatChange(m.change, locale)}
                      <span className="sr-only"> {t(dir)}</span>
                    </td>
                    <td className={`numeric py-2.5 text-end ${TREND[dir]}`}>
                      {formatPercent(m.changePercent, locale)}
                    </td>
                    <td className="py-2.5 text-end text-xs text-[--color-faint]">
                      <time dateTime={machineDate(m.asOf)} className="numeric">
                        {formatDateTime(m.asOf, locale)}
                      </time>
                      {m.delayMinutes > 0 && (
                        <span className="block">
                          {t('delayed', { minutes: m.delayMinutes })}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {stories.length > 0 && (
          <section>
            <h2 className="mb-4 border-b-2 border-[--color-body] pb-1.5 text-lg font-bold uppercase tracking-wide">
              {t('overviewTitle')}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {stories.map((s) => (
                <StoryCard key={s.slug} story={s} locale={locale} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
