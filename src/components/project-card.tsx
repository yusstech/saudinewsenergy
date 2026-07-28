import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { formatMeasure, formatCurrency, formatDate } from '@/lib/format';
import { regionLabel } from '@content/taxonomy';
import { getCompany } from '@content/companies';
import { getStoriesByProject } from '@/lib/content';
import { storyHref } from './story-card';
import { localisedText, type Project } from '@content/schema';
import type { Locale } from '@/i18n/config';

const STATUS_STYLE: Record<Project['status'], string> = {
  announced: 'bg-surface-sunken text-muted',
  tendered: 'bg-surface-sunken text-muted',
  awarded: 'bg-market-soft text-market',
  'under-construction': 'bg-developing-soft text-developing',
  commissioning: 'bg-live-soft text-live',
  operational: 'bg-brand-500 text-white',
};

/**
 * A project record, in one of two modes.
 *
 * Every quantity renders through `formatMeasure` or `formatCurrency`, so a
 * number can never reach the page without its unit — the card has no code path
 * that produces a bare figure.
 *
 * A project whose figures come from primary documentation says so on the card
 * itself, not only on the article. That distinction is the most useful thing
 * this card carries for a professional reader: "operational, 107 km, 279
 * towers" from a signed completion certificate is a different class of claim
 * from the same words in a press release, and the reader should be able to
 * tell which they are looking at before they click.
 *
 * **`teaser` truncates and links. `record` shows everything and does not.**
 * That split exists because the card previously did neither: it clamped the
 * summary to three lines everywhere it appeared *including on `/projects`*, and
 * carried no link at all. So the Al Jouf summary ended in an ellipsis, and
 * there was nowhere on the site — front page or projects feed — where the rest
 * of it could be read. A truncation is a promise that the full text is one
 * click away; if it isn't, the card is just withholding.
 *
 * `record` is the mode for `/projects`, where the record *is* the page content
 * and nothing should be clipped. `teaser` is for anywhere it is a pointer, and
 * it links to that record's anchor.
 */
export async function ProjectCard({
  project,
  locale,
  id,
  variant = 'record',
}: {
  project: Project;
  locale: Locale;
  id?: string;
  variant?: 'teaser' | 'record';
}) {
  const t = await getTranslations('projects');
  const ta = await getTranslations('article');
  const teaser = variant === 'teaser';

  // A record page that names a project but does not reach the reporting on it is
  // the same dead end as a clamped summary with no link. Teasers skip this: they
  // point at the record, and the record points at the coverage.
  const coverage = teaser ? [] : getStoriesByProject(locale, project.slug);

  const documented = project.sources.some((s) => s.kind === 'project-document');

  const rows: Array<[string, string]> = [];
  if (project.capacity) {
    rows.push([
      t('field.capacity'),
      formatMeasure(project.capacity.value, project.capacity.unit, locale),
    ]);
  }
  if (project.length) {
    rows.push([
      t('field.length'),
      formatMeasure(project.length.value, project.length.unit, locale),
    ]);
  }
  if (project.structures) {
    rows.push([
      t('field.structures'),
      formatMeasure(project.structures.value, project.structures.unit, locale, {
        maximumFractionDigits: 0,
      }),
    ]);
  }
  if (project.value) {
    rows.push([
      t('field.value'),
      formatCurrency(project.value.value, project.value.currency, locale),
    ]);
  }

  // The record mode carries the rest of what is known. A teaser stays to four
  // figures because it is a pointer; a record that silently drops the client,
  // the contractor, the location and the dates is not a record, and those
  // fields were in `projectSchema` and on the page nowhere.
  if (!teaser) {
    const client = project.client ? getCompany(project.client) : undefined;
    const contractor = project.contractor
      ? getCompany(project.contractor)
      : undefined;

    if (client) rows.push([t('field.client'), client.name[locale]]);
    if (contractor) rows.push([t('field.contractor'), contractor.name[locale]]);
    rows.push([t('field.location'), project.location[locale]]);
    if (project.announcedDate) {
      rows.push([t('field.announced'), formatDate(project.announcedDate, locale)]);
    }
    if (project.completedDate) {
      rows.push([t('field.completed'), formatDate(project.completedDate, locale)]);
    }
  }

  return (
    <article
      id={id ?? project.slug}
      className="flex flex-col border border-line bg-surface p-5 scroll-mt-24"
    >
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span
          className={`label rounded-[2px] px-1.5 py-0.5 ${STATUS_STYLE[project.status]}`}
        >
          {t(`status.${project.status}`)}
        </span>
        <span className="label text-faint">
          {regionLabel(project.region, locale)}
        </span>
      </div>

      <h3 className="font-display text-subhead text-strong">
        {teaser ? (
          <Link
            href={`/projects#${project.slug}`}
            className="hover:text-accent hover:underline underline-offset-4"
          >
            {project.name[locale]}
          </Link>
        ) : (
          project.name[locale]
        )}
      </h3>
      <p
        className={`mt-2 text-meta leading-relaxed text-muted ${
          teaser ? 'line-clamp-3' : ''
        }`}
      >
        {project.summary[locale]}
      </p>

      {rows.length > 0 && (
        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-line pt-3">
          {rows.map(([label, value]) => (
            <div key={label}>
              <dt className="label text-faint">{label}</dt>
              <dd className="numeric mt-0.5 text-meta font-semibold text-strong">{value}</dd>
            </div>
          ))}
        </dl>
      )}

      {!teaser && project.technology.length > 0 && (
        <div className="mt-4 border-t border-line pt-3">
          <span className="label text-faint">{t('field.technology')}</span>
          <ul className="mt-1.5 flex flex-wrap gap-x-2 gap-y-1 text-meta text-body">
            {project.technology.map((tech, i) => (
              <li key={tech}>
                {tech}
                {i < project.technology.length - 1 && (
                  <span className="ms-2 text-faint" aria-hidden="true">
                    ·
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {coverage.length > 0 && (
        <div className="mt-4 border-t border-line pt-3">
          <span className="label text-faint">{ta('relatedStories')}</span>
          <ul className="mt-1.5 space-y-1">
            {coverage.map((story) => (
              <li key={story.slug}>
                <Link
                  href={storyHref(story)}
                  className="text-meta font-medium hover:text-accent hover:underline underline-offset-4"
                >
                  {story.cardHeadline ?? story.headline}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-4 border-t border-line pt-2 text-micro leading-relaxed text-faint">
        {documented
          ? `${t('field.source')}: ${localisedText(
              project.sources.find((s) => s.kind === 'project-document')!.label,
              locale,
            )}`
          : project.sources[0]?.note
            ? localisedText(project.sources[0].note, locale)
            : ''}
      </p>

      {teaser && (
        <Link
          href={`/projects#${project.slug}`}
          className="mt-3 text-meta font-semibold text-accent hover:underline underline-offset-4"
        >
          {t('fullRecord')} <span aria-hidden="true">→</span>
        </Link>
      )}
    </article>
  );
}
