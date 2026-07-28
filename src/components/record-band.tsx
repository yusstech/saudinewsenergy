import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { formatMeasure, formatCurrency, formatDate } from '@/lib/format';
import { getProject } from '@content/projects';
import type { Locale } from '@/i18n/config';
import { localisedText, type Story } from '@content/schema';

/**
 * The record behind the lead story.
 *
 * This band replaced the Saudi Energy Dashboard, and the reason is worth stating. The dashboard
 * tiled a benchmark price beside two unrelated headlines — it was a summary of a newsroom that
 * did not exist yet, and once the invented market data and the prototype stories were removed
 * there was nothing left in it that was true.
 *
 * What is true is the documentation. When the lead story is about a project, the project record
 * is the most substantial thing the site can put on the front page: route length, structures,
 * contract value and dates, every one of them read from a signed document rather than a press
 * release. So the band renders that, with the document it came from named underneath.
 *
 * It generalises. Any future lead that cites a project gets the same treatment; a lead that
 * cites none renders nothing at all, and the front page closes up around it.
 *
 * The charcoal ground is kept from the dashboard. It is the one place besides the masthead where
 * the dark surface appears, and it is what gives the front page its structural beat.
 */
export async function RecordBand({
  story,
  locale,
}: {
  story: Story;
  locale: Locale;
}) {
  const project = story.projects[0] ? getProject(story.projects[0]) : undefined;
  if (!project) return null;

  const t = await getTranslations('projects');
  const th = await getTranslations('home');

  // Absent data stays absent — a field with no value is not rendered as a dash.
  const facts: Array<[string, string]> = [];
  if (project.capacity) {
    facts.push([
      t('field.capacity'),
      formatMeasure(project.capacity.value, project.capacity.unit, locale),
    ]);
  }
  if (project.length) {
    facts.push([
      t('field.length'),
      formatMeasure(project.length.value, project.length.unit, locale),
    ]);
  }
  if (project.structures) {
    facts.push([
      t('field.structures'),
      formatMeasure(project.structures.value, project.structures.unit, locale, {
        maximumFractionDigits: 0,
      }),
    ]);
  }
  if (project.value) {
    facts.push([
      t('field.value'),
      formatCurrency(project.value.value, project.value.currency, locale),
    ]);
  }
  if (project.completedDate) {
    facts.push([t('field.completed'), formatDate(project.completedDate, locale)]);
  }

  if (facts.length === 0) return null;

  // The document the figures were read from, named on the page. A quantity from a signed
  // completion certificate is a different class of claim from the same quantity in an
  // announcement, and the reader should be able to tell which they are looking at.
  const document = project.sources.find((s) => s.kind === 'project-document');

  return (
    <section className="bg-masthead py-[var(--space-block)] text-masthead-fg">
      <div className="page">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-white/15 pb-3">
          <div>
            <span className="label text-masthead-muted">{th('recordTitle')}</span>
            <h2 className="mt-1 font-display text-subhead">
              <Link
                href={`/projects#${project.slug}`}
                className="hover:text-copper-300"
              >
                {project.name[locale]}
              </Link>
            </h2>
          </div>
          <span className="label rounded-[2px] bg-white/10 px-1.5 py-0.5 text-masthead-fg">
            {t(`status.${project.status}`)}
          </span>
        </div>

        <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map(([label, value]) => (
            <div key={label}>
              <dt className="label text-masthead-muted">{label}</dt>
              <dd className="numeric mt-1 text-[1.375rem] font-semibold leading-none">
                {value}
              </dd>
            </div>
          ))}
        </dl>

        {document && (
          <p className="mt-6 border-t border-white/15 pt-3 text-micro leading-relaxed text-masthead-muted">
            {t('field.source')}: {localisedText(document.label, locale)}
          </p>
        )}
      </div>
    </section>
  );
}
