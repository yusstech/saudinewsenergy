import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { formatMeasure, formatCurrency, formatDate } from '@/lib/format';
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
  const tp = await getTranslations('projects');

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

        {/* Three tiles, not four. The fourth was a benchmark crude price we do not have a
            licensed feed for — a placed number, however carefully labelled. A dashboard that
            is one column narrower is a smaller claim, and a true one. */}
        <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
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
  href,
  foot,
  children,
}: {
  label: string;
  href: string;
  foot?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="group block">
      <span className="label mb-2 block text-masthead-muted">{label}</span>
      <div className="group-hover:text-copper-300">{children}</div>
      {foot && (
        <p className="numeric mt-1.5 text-micro text-masthead-muted">{foot}</p>
      )}
    </Link>
  );
}
