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
import { SECTORS } from '@content/taxonomy';
import { StoryCard } from '@/components/story-card';
import { Section } from '@/components/section';
import { LiveDesk } from '@/components/live-desk';
import { LatestRail } from '@/components/latest-rail';
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

/**
 * The front page.
 *
 * Composed as a newspaper rather than a dashboard, which is the difference the previous build
 * missed. Concretely that means three things:
 *
 * **One thing dominates.** The lead story gets a display-sized serif headline and the full
 * left column. Previously the lead and its three siblings were near enough the same size that a
 * reader had to *work out* what mattered most — which is the newsroom's job, not theirs.
 *
 * **Sections differ.** Each division uses a different header weight and a different layout, so
 * the page has rhythm. Six identical caps-and-rule bands is why the old page read as one note
 * repeated.
 *
 * **Whitespace does the framing.** Story cards lost their borders; sections are separated by
 * generous space and hairlines. Outlined boxes in a grid read as an admin panel however good
 * the type inside them is.
 */
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

  // Editorial ranking, not recency alone — recency is what the Latest rail is for.
  const ranked = [...stories].sort(
    (a, b) =>
      Number(b.featured) - Number(a.featured) ||
      b.weight - a.weight ||
      Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
  );

  const [lead, ...rest] = ranked;
  if (!lead) {
    return <div className="page py-24" />;
  }

  const secondary = rest.slice(0, 3);
  const remainder = rest.slice(3);

  const sectorsWithStories = SECTORS.map((sector) => ({
    sector,
    stories: getStoriesBySector(locale, sector.slug).slice(0, 3),
  }))
    .filter((s) => s.stories.length > 0)
    .slice(0, 4);

  return (
    <div className="pb-[var(--space-section)]">
      {/* ================================================================ hero */}
      <div className="page grid gap-x-10 gap-y-[var(--space-block)] pt-[var(--space-block)] lg:grid-cols-[minmax(0,1fr)_19rem] xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div>
          <h1 className="sr-only">{t('leadTitle')}</h1>
          <StoryCard story={lead} locale={locale} variant="lead" />

          {secondary.length > 0 && (
            <div className="mt-[var(--space-block)] grid gap-8 border-t border-rule pt-[var(--space-block)] sm:grid-cols-3">
              {secondary.map((s) => (
                <StoryCard
                  key={s.slug}
                  story={s}
                  locale={locale}
                  variant="compact"
                />
              ))}
            </div>
          )}
        </div>

        {/* The rail: what is happening now, and what landed most recently. */}
        <aside className="space-y-[var(--space-block)] lg:border-s lg:border-line lg:ps-10">
          <LiveDesk stories={live} locale={locale} />
          <LatestRail stories={stories.slice(0, 6)} locale={locale} />
        </aside>
      </div>

      {/* =========================================================== dashboard */}
      <div className="mt-[var(--space-section)]">
        <SaudiDashboard locale={locale} />
      </div>

      {/* ============================================================= sectors */}
      <Section
        title={t('sectorsTitle')}
        variant="major"
        className="mt-[var(--space-section)]"
      >
        <div className="grid gap-x-8 gap-y-[var(--space-block)] sm:grid-cols-2 lg:grid-cols-4">
          {sectorsWithStories.map(({ sector, stories: list }) => (
            <div key={sector.slug}>
              <h3 className="mb-3 border-b border-line pb-1.5">
                <Link
                  href={`/sector/${sector.slug}`}
                  className="label text-accent hover:underline underline-offset-4"
                >
                  {sector.label[locale]}
                </Link>
              </h3>
              <div className="space-y-4">
                {list.map((s) => (
                  <StoryCard key={s.slug} story={s} locale={locale} variant="compact" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ============================================================ projects */}
      <Section
        title={t('projectsTitle')}
        subtitle={tp('intro')}
        href="/projects"
        hrefLabel={t('viewAll')}
        variant="major"
        className="mt-[var(--space-section)]"
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.slice(0, 3).map((p) => (
            <ProjectCard key={p.slug} project={p} locale={locale} />
          ))}
        </div>
      </Section>

      {/* ============================================================ analysis */}
      {remainder.length > 0 && (
        <Section
          title={t('analysisTitle')}
          href="/latest"
          hrefLabel={t('viewAll')}
          className="mt-[var(--space-section)]"
        >
          <div className="grid gap-x-8 gap-y-[var(--space-block)] sm:grid-cols-2 lg:grid-cols-3">
            {remainder.slice(0, 6).map((s) => (
              <StoryCard key={s.slug} story={s} locale={locale} />
            ))}
          </div>
        </Section>
      )}

      {/* =================================================== most read + desks */}
      <div className="page mt-[var(--space-section)] grid gap-x-10 gap-y-[var(--space-block)] lg:grid-cols-[minmax(0,1fr)_19rem] xl:grid-cols-[minmax(0,1fr)_21rem]">
        <section>
          <h2 className="label mb-4 border-b border-rule pb-2 text-strong">
            {t('mostReadTitle')}
          </h2>
          {/*
            Numbered in the serif at display weight. The numeral is the design here — it does
            the ranking visually so the headlines beside it can stay a uniform size.
          */}
          <ol className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {mostRead.map((s, i) => (
              <li key={s.slug} className="flex gap-4">
                <span
                  className="font-display text-[2rem] leading-none text-line-strong"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <StoryCard story={s} locale={locale} variant="compact" className="flex-1" />
              </li>
            ))}
          </ol>
        </section>

        {/*
          Companies as an editorial directory, not a row of grey pills. The old treatment read
          as a filter bar because that is what a wrapped row of bordered chips is; a ruled list
          of names with their role beside them reads as a masthead index, which is what it is.
        */}
        <aside className="lg:border-s lg:border-line lg:ps-10">
          <h2 className="label mb-3 border-b border-rule pb-2 text-strong">
            {t('companiesTitle')}
          </h2>
          <ul className="divide-y divide-line">
            {COMPANIES.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/company/${c.slug}`}
                  className="flex items-baseline justify-between gap-3 py-2 hover:text-accent"
                >
                  <span className="text-meta font-medium">{c.name[locale]}</span>
                  <span className="label shrink-0 text-faint">
                    {tc(`type.${c.type}`)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
