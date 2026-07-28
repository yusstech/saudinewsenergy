import { getTranslations } from 'next-intl/server';
import { formatMeasure, formatCurrency } from '@/lib/format';
import { regionLabel } from '@content/taxonomy';
import type { Project } from '@content/schema';
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

      <h3 className="font-display text-subhead text-strong">{project.name[locale]}</h3>
      <p className="mt-2 line-clamp-3 text-meta leading-relaxed text-muted">
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

      <p className="mt-4 border-t border-line pt-2 text-micro leading-relaxed text-faint">
        {documented
          ? `${t('field.source')}: ${project.sources.find((s) => s.kind === 'project-document')!.label}`
          : project.sources[0]?.note ?? ''}
      </p>
    </article>
  );
}
