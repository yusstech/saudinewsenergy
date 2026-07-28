import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { formatDate, formatMeasure, formatCurrency } from '@/lib/format';
import { regionLabel } from '@content/taxonomy';
import {
  localisedText,
  type Story,
  type ContextPanel as ContextPanelType,
  type SourceRef,
  type Correction,
  type Translation,
} from '@content/schema';
import type { Locale } from '@/i18n/config';

/**
 * "Key energy takeaways".
 *
 * Two audiences, one block. A professional skimming between meetings gets the
 * story in six lines; an answer engine gets six self-contained, quotable
 * assertions with their figures and units intact. Writing these so each one
 * survives being lifted out of the page on its own is the single highest-value
 * habit for citation — a takeaway that only makes sense in sequence will be
 * quoted wrongly or not at all.
 */
export async function Takeaways({ items }: { items: string[] }) {
  if (!items.length) return null;
  const t = await getTranslations('article');

  return (
    <aside className="my-10 border-s-2 border-copper-400 bg-surface-sunken p-6">
      <h2 className="label text-copper-500 dark:text-copper-300">
        {t('takeaways')}
      </h2>
      <ul className="mt-3 space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 text-[1rem] leading-relaxed">
            <span
              className="numeric mt-1 shrink-0 text-micro font-bold text-copper-400"
              aria-hidden="true"
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

/**
 * The structured context panel.
 *
 * Absent fields are omitted, never filled. A missing capacity means we do not
 * know the capacity; it does not license the template to infer one from
 * elsewhere in the story. Every quantity goes through the measure formatters,
 * so nothing reaches the page without its unit.
 */
export async function ContextPanel({
  context,
  sources,
  locale,
}: {
  context: ContextPanelType;
  sources: SourceRef[];
  locale: Locale;
}) {
  const t = await getTranslations('article');
  const tp = await getTranslations('projects');

  const rows: Array<[string, string]> = [];
  const push = (label: string, value?: string) => {
    if (value) rows.push([label, value]);
  };

  push(tp('field.client'), context.client);
  push(tp('field.contractor'), context.contractor);
  push(tp('field.location'), context.location);
  push(
    tp('field.region'),
    context.region ? regionLabel(context.region, locale) : undefined,
  );
  push(
    tp('field.capacity'),
    context.capacity &&
      formatMeasure(context.capacity.value, context.capacity.unit, locale),
  );
  push(
    tp('field.length'),
    context.length &&
      formatMeasure(context.length.value, context.length.unit, locale),
  );
  push(
    tp('field.structures'),
    context.structures &&
      formatMeasure(
        context.structures.value,
        context.structures.unit,
        locale,
        { maximumFractionDigits: 0 },
      ),
  );
  push(
    tp('field.value'),
    context.value &&
      formatCurrency(context.value.value, context.value.currency, locale),
  );
  push(tp('field.technology'), context.technology);
  push(
    tp('field.status'),
    context.status ? tp(`status.${context.status}`) : undefined,
  );
  push(
    tp('field.announced'),
    context.announcedDate ? formatDate(context.announcedDate, locale) : undefined,
  );
  push(
    tp('field.completed'),
    context.completedDate ? formatDate(context.completedDate, locale) : undefined,
  );
  push(tp('field.duration'), context.expectedMilestone);

  if (!rows.length) return null;

  const cited = sources.filter((s) => context.sourceIds.includes(s.id));

  return (
    <aside className="my-10 border border-line bg-surface">
      <h2 className="label border-b border-line px-5 py-3 text-strong">
        {t('contextPanel')}
      </h2>
      {context.project && (
        <p className="font-display border-b border-line px-5 py-3 text-subhead text-strong">
          {context.project}
        </p>
      )}
      <dl className="grid gap-x-6 gap-y-3 px-5 py-4 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt className="label text-faint">
              {label}
            </dt>
            <dd className="mt-0.5 text-meta font-medium text-strong">{value}</dd>
          </div>
        ))}
      </dl>
      {cited.length > 0 && (
        <div className="border-t border-line px-5 py-3">
          <p className="text-micro leading-relaxed text-faint">
            {tp('field.source')}:{' '}
            {cited.map((s) => localisedText(s.label, locale)).join('; ')}
          </p>
        </div>
      )}
    </aside>
  );
}

/**
 * The extractable Q&A block.
 *
 * Rendered as visible prose *and* emitted as `FAQPage` structured data. Doing
 * only the second is the common mistake: schema without matching on-page
 * content is exactly what search and answer engines penalise, and it also
 * denies the block to the human reader who benefits most from it.
 */
export async function FaqBlock({ items }: { items: Story['faq'] }) {
  if (!items.length) return null;
  const t = await getTranslations('search');

  return (
    <section className="my-12 border-t border-rule pt-7">
      <h2 className="font-display text-subhead text-strong">{t('title')}</h2>
      <dl className="mt-4 space-y-5">
        {items.map((f, i) => (
          <div key={i} id={`faq-${i + 1}`} className="scroll-mt-24">
            <dt className="font-display text-title font-semibold text-strong">{f.question}</dt>
            <dd className="mt-1.5 leading-relaxed text-muted">
              {f.answer}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/**
 * Sources, and the honest caveats attached to them.
 *
 * `kind` is shown because a figure read off a contract document is a different
 * class of claim from one in a press release, and a reader deciding whether to
 * act on a number deserves to know which they have. A source's `note` is where
 * a document's provenance limits get stated plainly instead of being quietly
 * dropped.
 */
export async function Sources({
  sources,
  sourcingNote,
  locale,
}: {
  sources: SourceRef[];
  sourcingNote?: string;
  locale: Locale;
}) {
  if (!sources.length && !sourcingNote) return null;
  const t = await getTranslations('article');

  return (
    <section className="my-10 bg-surface-sunken p-6">
      <h2 className="label text-strong">
        {t('sources')}
      </h2>

      {sources.length > 0 && (
        <ul className="mt-3 space-y-3">
          {sources.map((s) => (
            <li key={s.id} className="text-sm">
              <p className="font-medium">
                {s.url ? (
                  <a
                    href={s.url}
                    className="underline underline-offset-2"
                    rel="noopener"
                    target="_blank"
                  >
                    {localisedText(s.label, locale)}
                  </a>
                ) : (
                  localisedText(s.label, locale)
                )}
              </p>
              {s.note && (
                <p className="mt-0.5 text-xs text-muted">
                  {localisedText(s.note, locale)}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      {sourcingNote && (
        <div className="mt-4 border-t border-line-strong pt-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
            {t('sourcingNote')}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            {sourcingNote}
          </p>
        </div>
      )}
    </section>
  );
}

/**
 * Corrections and material updates.
 *
 * Append-only and always visible when non-empty. A correction that replaces the
 * original text without a note is indistinguishable from having been right all
 * along, which is the opposite of what a corrections policy is for.
 */
export async function Corrections({
  corrections,
  locale,
}: {
  corrections: Correction[];
  locale: Locale;
}) {
  if (!corrections.length) return null;
  const t = await getTranslations('article');

  return (
    <section className="my-10 border-s-2 border-developing bg-developing-soft p-6">
      <h2 className="label text-developing">
        {t('corrections')}
      </h2>
      <ol className="mt-3 space-y-2">
        {corrections.map((c, i) => (
          <li key={i} className="text-sm">
            <span className="font-semibold">
              {c.kind === 'correction'
                ? t('correctedOn', { date: formatDate(c.date, locale) })
                : t('updatedOn', { date: formatDate(c.date, locale) })}
            </span>
            {' — '}
            {c.note}
          </li>
        ))}
      </ol>
    </section>
  );
}

/**
 * Translation status.
 *
 * Original reporting says so; anything translated names the language it came
 * from and links to the source text. Silence here would let a reader assume
 * every Arabic story was written in Arabic, which is exactly the assumption
 * that makes a quotation unreliable after a round trip.
 *
 * `machine-assisted` says the editor's read has not happened yet, rather than
 * that it has. The status is a description of the review a story has had, so it
 * changes when the review does — an editor reading the Arabic Al Jouf piece
 * against the English is what promotes it to `human-translated`, and until then
 * a reader quoting from it knows to check the original.
 */
export async function TranslationStatus({
  translation,
  locale,
}: {
  translation: Translation;
  locale: Locale;
}) {
  const t = await getTranslations('article');
  if (translation.status === 'original') {
    return (
      <p className="text-micro leading-relaxed text-faint">{t('originalReporting')}</p>
    );
  }

  const from = translation.originalLocale;

  return (
    <p className="text-micro text-muted">
      {t('translatedFrom', {
        language: from === 'ar' ? 'العربية' : 'English',
      })}
      {translation.status === 'machine-assisted' && (
        <> · {t('machineTranslated')}</>
      )}
      {from && translation.originalSlug && (
        <>
          {' · '}
          <Link
            href={`/article/${translation.originalSlug}`}
            locale={from}
            className="underline underline-offset-2"
          >
            {t('readOriginal')}
          </Link>
        </>
      )}
      <span className="sr-only"> ({locale})</span>
    </p>
  );
}
