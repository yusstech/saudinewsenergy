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
 * Editorial context, not a trading terminal — that distinction is the concept's and it decides
 * what belongs. Each tile answers "what changed today, and where do I read about it", so every
 * one links somewhere. A tile that is only a number is a widget; a number plus the story behind
 * it is journalism.
 *
 * Rendered as a charcoal band, the one other place besides the masthead where the dark ground
 * appears. That is deliberate: it divides the page in two, marks the dashboard as a different
 * kind of content from the reporting around it, and gives the front page a structural beat it
 * otherwise lacked.
 */
export async function SaudiDashboard({ locale }: { locale: Locale }) {
  const t = await getTranslations('home');
  const tm = await getTranslations('market');
  const tp = await getTranslations('projects');

  const brent = MARKET_INDICATORS.find((m) => m.id === 'brent');
  const featuredProject = PROJECTS[0];
  const policyStory =
    getStoriesBySector(locale, 'policy')[0] ?? getStoriesBySector(locale, 'power')[0];
  const transitionStory =
    getStoriesBySector(locale, 'renewables')[0] ?? getStoriesBySector(locale, 'hydrogen')[0];
  const companyStory = getStoriesBySector(locale, 'oil-gas')[0];
  const secondary = transitionStory ?? companyStory;

  return (
    <section className="bg-masthead py-[var(--space-block)] text-masthead-fg">
      <div className="page">
        <div className="mb-5 flex items-baseline justify-between gap-4 border-b border-white/15 pb-3">
          <div>
            <h2 className="font-display text-subhead">{t('dashboardTitle')}</h2>
            <p className="mt-0.5 text-meta text-masthead-muted">
              {t('dashboardSubtitle')}
            </p>
          </div>
        </div>

        <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {brent && (
            <Tile
              label={brent.label[locale]}
              badge={brent.isSample ? tm('sampleData') : undefined}
              href="/markets"
              foot={tm('delayed', { minutes: brent.delayMinutes })}
            >
              <p className="numeric text-[2rem] font-semibold leading-none">
                {formatNumber(brent.value, locale, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                <span className="ms-1.5 text-micro font-normal text-masthead-muted">
                  {brent.unit}
                </span>
              </p>
            </Tile>
          )}

          {featuredProject && (
            <Tile
              label={tp('title')}
              href={`/projects#${featuredProject.slug}`}
              foot={[
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
            >
              <p className="font-display text-[1.0625rem] leading-snug">
                {featuredProject.name[locale]}
              </p>
            </Tile>
          )}

          {policyStory && (
            <Tile
              label={t('leadTitle')}
              href={storyHref(policyStory)}
              foot={formatDate(policyStory.publishedAt, locale)}
            >
              <p className="font-display text-[1.0625rem] leading-snug">
                {policyStory.cardHeadline ?? policyStory.headline}
              </p>
            </Tile>
          )}

          {secondary && (
            <Tile
              label={t('transitionTitle')}
              href={storyHref(secondary)}
              foot={formatDate(secondary.publishedAt, locale)}
            >
              <p className="font-display text-[1.0625rem] leading-snug">
                {secondary.cardHeadline ?? secondary.headline}
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
  foot,
  children,
}: {
  label: string;
  badge?: string;
  href: string;
  foot?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="group block">
      <div className="mb-2 flex items-center gap-2">
        <span className="label text-masthead-muted">{label}</span>
        {badge && (
          <span className="label rounded-[2px] px-1 py-px text-copper-300 ring-1 ring-inset ring-white/20">
            {badge}
          </span>
        )}
      </div>
      <div className="group-hover:text-copper-300">{children}</div>
      {foot && (
        <p className="numeric mt-1.5 text-micro text-masthead-muted">{foot}</p>
      )}
    </Link>
  );
}
