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
import { RecordBand } from '@/components/record-band';
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
 * Composed as a newspaper rather than a dashboard: one thing dominates, sections differ from
 * each other, and whitespace does the framing.
 *
 * **Every module is gated on having something to say that the module above it did not.** That
 * rule was added when the prototype stories were deleted and the page went from eight stories to
 * one — at which point the same headline appeared in five places at once: lead, latest rail,
 * sector block, most read, and the dashboard. A newsroom front page that repeats itself does not
 * look busy, it looks broken.
 *
 * The gates are thresholds, not a special case for an empty site. Nothing here is hidden behind
 * "if this is launch"; each module simply requires the material that makes it worth printing, so
 * the page fills back in on its own as stories are published. The thresholds are named in
 * `enough` below rather than inlined, so the composition can be read in one place.
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

  // A sector column with one story is that story printed twice — once in its desk column and
  // once wherever it already appeared. Two columns of two is the least that reads as a survey.
  const sectorsWithStories = SECTORS.map((sector) => ({
    sector,
    stories: getStoriesBySector(locale, sector.slug).slice(0, 3),
  }))
    .filter((s) => s.stories.length >= 2)
    .slice(0, 4);

  const enough = {
    latestRail: stories.length >= 3,
    sectors: sectorsWithStories.length >= 2,
    picks: stories.length >= 4,
  };

  const picks = enough.picks ? getMostRead(locale, 5) : [];

  // The rail column is *reserved* by the grid, so it has to be dropped from the template as
  // well as emptied of content. Leaving the track in place strands the lead in two-thirds of
  // the page with nothing beside it, which reads worse than an empty module would.
  const hasRail = live.length > 0 || enough.latestRail;

  return (
    <div className="pb-[var(--space-section)]">
      {/* ================================================================ hero */}
      <div
        className={`page grid gap-x-10 gap-y-[var(--space-block)] pt-[var(--space-block)] ${
          hasRail
            ? 'lg:grid-cols-[minmax(0,1fr)_19rem] xl:grid-cols-[minmax(0,1fr)_21rem]'
            : ''
        }`}
      >
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

        {/*
          The rail: what is happening now, and what landed most recently. Both halves are
          conditional. An empty "Live Energy Desk" heading with a "nothing running" line under it
          is a promise the site is failing to keep, printed on the front page — better to say
          nothing. And a Latest list of two, beside a lead that is one of them, is the lead again.
        */}
        {hasRail && (
          <aside className="space-y-[var(--space-block)] lg:border-s lg:border-line lg:ps-10">
            {live.length > 0 && <LiveDesk stories={live} locale={locale} />}
            {enough.latestRail && (
              <LatestRail stories={stories.slice(0, 6)} locale={locale} />
            )}
          </aside>
        )}
      </div>

      {/* ========================================================= record band */}
      <div className="mt-[var(--space-section)]">
        <RecordBand story={lead} locale={locale} />
      </div>

      {/* ============================================================= sectors */}
      {enough.sectors && (
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
      )}

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
            <ProjectCard key={p.slug} project={p} locale={locale} variant="teaser" />
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

      {/* ================================================ picks + companies */}
      <div
        className={`page mt-[var(--space-section)] grid gap-x-10 gap-y-[var(--space-block)] ${
          picks.length > 0
            ? 'lg:grid-cols-[minmax(0,1fr)_19rem] xl:grid-cols-[minmax(0,1fr)_21rem]'
            : ''
        }`}
      >
        {/*
          "Editor's picks", not "Most read". `getMostRead` sorts by editorial weight, not by
          traffic — the site has no analytics. A label claiming readership figures the
          publication does not measure is the same fault as printing a price it does not have.
        */}
        {picks.length > 0 && (
          <section>
            <h2 className="label mb-4 border-b border-rule pb-2 text-strong">
              {t('picksTitle')}
            </h2>
            {/*
              Numbered in the serif at display weight. The numeral is the design here — it does
              the ranking visually so the headlines beside it can stay a uniform size.
            */}
            <ol className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {picks.map((s, i) => (
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
        )}

        {/*
          Companies as an editorial directory, not a row of grey pills. The old treatment read
          as a filter bar because that is what a wrapped row of bordered chips is; a ruled list
          of names with their role beside them reads as a masthead index, which is what it is.

          Full width when it is the only thing here, so a single narrow column does not sit
          stranded against empty space.
        */}
        <aside
          className={
            picks.length > 0 ? 'lg:border-s lg:border-line lg:ps-10' : undefined
          }
        >
          <h2 className="label mb-3 border-b border-rule pb-2 text-strong">
            {t('companiesTitle')}
          </h2>
          <ul
            className={`divide-y divide-line ${
              picks.length > 0 ? '' : 'sm:grid sm:grid-cols-2 sm:gap-x-10 sm:divide-y-0'
            }`}
          >
            {COMPANIES.map((c) => (
              <li
                key={c.slug}
                className={picks.length > 0 ? undefined : 'border-b border-line'}
              >
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
