import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/config';
import { baseMetadata } from '@/lib/seo';
import { resolveEdition } from '@/lib/edition';
import {
  getStoriesByEdition,
  getLiveStories,
  getMostRead,
  getStoriesBySector,
} from '@/lib/content';
import { PROJECTS } from '@content/projects';
import { COMPANIES } from '@content/companies';
import { SECTORS, regionLabel } from '@content/taxonomy';
import { StoryCard, storyHref } from '@/components/story-card';
import { Section } from '@/components/section';
import { LiveDesk } from '@/components/live-desk';
import { EnergyPulse, type PulseItem } from '@/components/energy-pulse';
import { SaudiDashboard } from '@/components/saudi-dashboard';
import { ProjectCard } from '@/components/project-card';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return baseMetadata(locale, '/');
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('home');
  const tp = await getTranslations('projects');
  const tc = await getTranslations('company');

  const edition = await resolveEdition();
  const stories = getStoriesByEdition(locale, edition);
  const live = getLiveStories(locale);
  const mostRead = getMostRead(locale, 5);

  // The lead is the highest-weighted featured story; the rest of the grid
  // follows it in published order. Editorial ranking, not recency alone —
  // recency is what the Pulse tabs above are for.
  const ranked = [...stories].sort(
    (a, b) =>
      Number(b.featured) - Number(a.featured) ||
      b.weight - a.weight ||
      Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
  );

  const [lead, ...rest] = ranked;
  const secondary = rest.slice(0, 3);
  const remainder = rest.slice(3);

  if (!lead) {
    return (
      <div className="mx-auto max-w-[1440px] px-[--spacing-gutter] py-16">
        <p className="text-[--color-muted]">—</p>
      </div>
    );
  }

  const pulse: PulseItem[] = [
    ...stories.slice(0, 6).map((s) => ({
      slug: `latest-${s.slug}`,
      href: storyHref(s),
      headline: s.cardHeadline ?? s.headline,
      time: s.publishedAt,
      tab: 'latest' as const,
    })),
    ...getStoriesBySector(locale, 'markets')
      .slice(0, 6)
      .map((s) => ({
        slug: `markets-${s.slug}`,
        href: storyHref(s),
        headline: s.cardHeadline ?? s.headline,
        time: s.publishedAt,
        tab: 'markets' as const,
      })),
    ...getStoriesBySector(locale, 'projects')
      .slice(0, 6)
      .map((s) => ({
        slug: `projects-${s.slug}`,
        href: storyHref(s),
        headline: s.cardHeadline ?? s.headline,
        time: s.publishedAt,
        tab: 'projects' as const,
      })),
    ...mostRead.map((s) => ({
      slug: `mostread-${s.slug}`,
      href: storyHref(s),
      headline: s.cardHeadline ?? s.headline,
      time: s.publishedAt,
      tab: 'mostRead' as const,
    })),
    ...stories
      .filter((s) => s.editions.includes('gcc'))
      .slice(0, 6)
      .map((s) => ({
        slug: `gcc-${s.slug}`,
        href: storyHref(s),
        headline: s.cardHeadline ?? s.headline,
        time: s.publishedAt,
        tab: 'gcc' as const,
      })),
    ...stories
      .filter((s) => s.editions.includes('global'))
      .slice(0, 6)
      .map((s) => ({
        slug: `global-${s.slug}`,
        href: storyHref(s),
        headline: s.cardHeadline ?? s.headline,
        time: s.publishedAt,
        tab: 'global' as const,
      })),
  ];

  const sectorsWithStories = SECTORS.map((sector) => ({
    sector,
    stories: getStoriesBySector(locale, sector.slug).slice(0, 3),
  })).filter((s) => s.stories.length > 0);

  return (
    <div className="space-y-10 pb-4">
      <EnergyPulse items={pulse} locale={locale} />

      {/* ------------------------------------------- lead grid + live desk */}
      <div className="mx-auto max-w-[1440px] px-[--spacing-gutter]">
        <h1 className="sr-only">{t('leadTitle')}</h1>
        <div className="grid gap-8 lg:grid-cols-[3fr_2fr] xl:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
          <div className="space-y-8">
            <StoryCard story={lead} locale={locale} variant="lead" />

            {secondary.length > 0 && (
              <div className="grid gap-6 border-t border-[--color-line] pt-6 sm:grid-cols-3">
                {secondary.map((s) => (
                  <StoryCard
                    key={s.slug}
                    story={s}
                    locale={locale}
                    variant="standard"
                    showImage={false}
                  />
                ))}
              </div>
            )}
          </div>

          <LiveDesk stories={live} locale={locale} />
        </div>
      </div>

      {/* --------------------------------------------- Saudi energy dashboard */}
      <SaudiDashboard locale={locale} />

      {/* ------------------------------------------------------------ sectors */}
      <Section title={t('sectorsTitle')}>
        <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {sectorsWithStories.slice(0, 4).map(({ sector, stories: list }) => (
            <div key={sector.slug}>
              <h3 className="mb-3 border-b border-[--color-line] pb-1.5 text-sm font-bold uppercase tracking-wider">
                <Link href={`/sector/${sector.slug}`} className="hover:text-[--color-brand-500]">
                  {sector.label[locale]}
                </Link>
              </h3>
              <div className="space-y-4">
                {list.map((s) => (
                  <StoryCard
                    key={s.slug}
                    story={s}
                    locale={locale}
                    variant="compact"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ----------------------------------------------------------- projects */}
      <Section
        title={t('projectsTitle')}
        href="/projects"
        hrefLabel={t('viewAll')}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.slice(0, 3).map((p) => (
            <ProjectCard key={p.slug} project={p} locale={locale} />
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------- companies */}
      <Section title={t('companiesTitle')}>
        <ul className="flex flex-wrap gap-2">
          {COMPANIES.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/company/${c.slug}`}
                className="inline-flex items-center gap-2 rounded-sm border border-[--color-line] bg-[--color-surface] px-3 py-1.5 text-sm font-medium hover:border-[--color-line-strong]"
              >
                {c.name[locale]}
                <span className="text-[0.625rem] uppercase tracking-wider text-[--color-faint]">
                  {tc(`type.${c.type}`)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* -------------------------------------------------- remaining stories */}
      {remainder.length > 0 && (
        <Section title={t('analysisTitle')} href="/latest" hrefLabel={t('viewAll')}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {remainder.slice(0, 6).map((s) => (
              <StoryCard key={s.slug} story={s} locale={locale} />
            ))}
          </div>
        </Section>
      )}

      {/* ---------------------------------------------------------- most read */}
      <Section title={t('mostReadTitle')}>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {mostRead.map((s, i) => (
            <li key={s.slug} className="flex gap-3">
              <span
                className="numeric text-2xl font-bold leading-none text-[--color-line-strong]"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <StoryCard story={s} locale={locale} variant="compact" />
            </li>
          ))}
        </ol>
      </Section>

      {/* ------------------------------------------------- regional footprint */}
      <Section title={tp('title')} subtitle={tp('intro')}>
        <ul className="flex flex-wrap gap-2">
          {[...new Set(PROJECTS.map((p) => p.region))].map((r) => (
            <li
              key={r}
              className="rounded-sm bg-[--color-surface-sunken] px-3 py-1.5 text-sm font-medium"
            >
              {regionLabel(r, locale)}
              <span className="numeric ms-2 text-xs text-[--color-faint]">
                {PROJECTS.filter((p) => p.region === r).length}
              </span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
