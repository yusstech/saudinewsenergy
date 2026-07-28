import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { formatNumber, formatMeasure, formatCurrency, formatDate } from '@/lib/format';
import { MARKET_INDICATORS } from '@content/markets';
import { PROJECTS } from '@content/projects';
import { getStoriesBySector } from '@/lib/content';
import { storyHref } from './story-card';
import type { Locale } from '@/i18n/config';

/**
 * The Saudi Energy Dashboard.
 *
 * Editorial context, not a trading terminal — that distinction is the concept's
 * and it decides what belongs here. Each tile answers "what changed today, and
 * where do I read about it", so every one links somewhere. A tile that is only
 * a number is a widget; a tile that is a number plus the story behind it is
 * journalism.
 *
 * The market tile inherits the same sample-data labelling as the strip, because
 * the same invented figure is no more honest for being displayed larger.
 */
export async function SaudiDashboard({ locale }: { locale: Locale }) {
  const t = await getTranslations('home');
  const tm = await getTranslations('market');
  const tp = await getTranslations('projects');

  const brent = MARKET_INDICATORS.find((m) => m.id === 'brent');
  const featuredProject = PROJECTS[0];
  const policyStory = getStoriesBySector(locale, 'policy')[0]
    ?? getStoriesBySector(locale, 'power')[0];
  const transitionStory =
    getStoriesBySector(locale, 'renewables')[0] ??
    getStoriesBySector(locale, 'hydrogen')[0];
  const companyStory = getStoriesBySector(locale, 'oil-gas')[0];

  return (
    <section className="mx-auto max-w-[1440px] px-[--spacing-gutter]">
      <div className="rounded-sm border border-[--color-line] bg-[--color-surface]">
        <div className="border-b border-[--color-line] px-4 py-3">
          <h2 className="text-lg font-bold uppercase tracking-wide">
            {t('dashboardTitle')}
          </h2>
          <p className="text-sm text-[--color-muted]">{t('dashboardSubtitle')}</p>
        </div>

        <div className="grid divide-y divide-[--color-line] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
          {/* ------------------------------------------------ market move */}
          {brent && (
            <Tile
              label={brent.label[locale]}
              badge={brent.isSample ? tm('sampleData') : undefined}
              href="/markets"
            >
              <p className="numeric text-2xl font-bold">
                {formatNumber(brent.value, locale, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                <span className="ms-1.5 text-xs font-normal text-[--color-faint]">
                  {brent.unit}
                </span>
              </p>
              <p className="mt-0.5 text-xs text-[--color-muted]">
                {tm('delayed', { minutes: brent.delayMinutes })}
              </p>
            </Tile>
          )}

          {/* --------------------------------------------- featured project */}
          {featuredProject && (
            <Tile
              label={tp('title')}
              href={`/projects#${featuredProject.slug}`}
            >
              <p className="text-sm font-bold leading-snug">
                {featuredProject.name[locale]}
              </p>
              <p className="numeric mt-1 text-xs text-[--color-muted]">
                {[
                  featuredProject.length &&
                    formatMeasure(
                      featuredProject.length.value,
                      featuredProject.length.unit,
                      locale,
                    ),
                  featuredProject.value &&
                    formatCurrency(
                      featuredProject.value.value,
                      featuredProject.value.currency,
                      locale,
                      { notation: 'compact' },
                    ),
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            </Tile>
          )}

          {/* ------------------------------------------------ policy / grid */}
          {policyStory && (
            <Tile
              label={t('leadTitle')}
              href={storyHref(policyStory)}
              dateLabel={formatDate(policyStory.publishedAt, locale)}
            >
              <p className="text-sm font-bold leading-snug">
                {policyStory.cardHeadline ?? policyStory.headline}
              </p>
            </Tile>
          )}

          {/* ------------------------------------------ transition indicator */}
          {(transitionStory ?? companyStory) && (
            <Tile
              label={t('transitionTitle')}
              href={storyHref((transitionStory ?? companyStory)!)}
              dateLabel={formatDate(
                (transitionStory ?? companyStory)!.publishedAt,
                locale,
              )}
            >
              <p className="text-sm font-bold leading-snug">
                {(transitionStory ?? companyStory)!.cardHeadline ??
                  (transitionStory ?? companyStory)!.headline}
              </p>
            </Tile>
          )}
        </div>
      </div>
    </section>
  );
}

function Tile({
  label,
  badge,
  href,
  dateLabel,
  children,
}: {
  label: string;
  badge?: string;
  href: string;
  dateLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group block p-4 transition-colors hover:bg-[--color-surface-sunken] sm:border-e sm:border-[--color-line] sm:last:border-e-0"
    >
      <div className="mb-1.5 flex items-center gap-2">
        <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[--color-muted]">
          {label}
        </span>
        {badge && (
          <span className="rounded-sm bg-[--color-surface-sunken] px-1 py-px text-[0.5625rem] font-semibold uppercase tracking-wider text-[--color-copper-500] ring-1 ring-[--color-line-strong] dark:text-[--color-copper-300]">
            {badge}
          </span>
        )}
      </div>
      {children}
      {dateLabel && (
        <p className="numeric mt-1 text-xs text-[--color-faint]">{dateLabel}</p>
      )}
    </Link>
  );
}
