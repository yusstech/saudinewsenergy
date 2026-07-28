import { getTranslations } from 'next-intl/server';
import { formatMeasure, formatCurrency } from '@/lib/format';
import { regionLabel } from '@content/taxonomy';
import type { Project } from '@content/schema';
import type { Locale } from '@/i18n/config';

const STATUS_STYLE: Record<Project['status'], string> = {
  announced: 'bg-[--color-surface-sunken] text-[--color-muted]',
  tendered: 'bg-[--color-surface-sunken] text-[--color-muted]',
  awarded: 'bg-[--color-market-soft] text-[--color-market]',
  'under-construction': 'bg-[--color-developing-soft] text-[--color-developing]',
  commissioning: 'bg-[--color-live-soft] text-[--color-live]',
  operational: 'bg-[--color-brand-500] text-white',
};

/**
 * A project record.
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
 */
export async function ProjectCard({
  project,
  locale,
  id,
}: {
  project: Project;
  locale: Locale;
  id?: string;
}) {
  const t = await getTranslations('projects');

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

  return (
    <article
      id={id ?? project.slug}
      className="flex flex-col rounded-sm border border-[--color-line] bg-[--color-surface] p-4 scroll-mt-24"
    >
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-sm px-1.5 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wider ${STATUS_STYLE[project.status]}`}
        >
          {t(`status.${project.status}`)}
        </span>
        <span className="text-[0.6875rem] font-medium uppercase tracking-wider text-[--color-muted]">
          {regionLabel(project.region, locale)}
        </span>
      </div>

      <h3 className="text-base font-bold leading-snug">{project.name[locale]}</h3>
      <p className="mt-1.5 line-clamp-3 text-sm text-[--color-muted]">
        {project.summary[locale]}
      </p>

      {rows.length > 0 && (
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 border-t border-[--color-line] pt-3 text-xs">
          {rows.map(([label, value]) => (
            <div key={label}>
              <dt className="text-[--color-faint]">{label}</dt>
              <dd className="numeric font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
      )}

      <p className="mt-3 border-t border-[--color-line] pt-2 text-[0.6875rem] text-[--color-faint]">
        {documented
          ? `${t('field.source')}: ${project.sources.find((s) => s.kind === 'project-document')!.label}`
          : project.sources[0]?.note ?? ''}
      </p>
    </article>
  );
}
