import { LOCALE_TAG, type Locale } from '@/i18n/config';
import { SITE } from './site';

/**
 * Dates, times, numbers and units — decided once, here.
 *
 * **The numeral decision.** Arabic copy on this site renders digits as Latin
 * numerals (`1,250`), not Arabic-Indic (`١٬٢٥٠`). That is deliberate and it is
 * an editorial call, not a technical shortcut: Saudi energy, finance and
 * engineering documentation — ministry releases, Tadawul filings, EPC bills of
 * quantities, IEC standards — is written with Latin digits, and the
 * professionals this publication is designed for read capacities, prices and
 * kilovolt ratings that way. Rendering `٣٨٠ ك.ف` would be linguistically
 * defensible and practically wrong for the audience. Prose is fully Arabic;
 * the numbers match the industry.
 *
 * Every formatter forces `-u-nu-latn` so this holds even where a platform
 * default would otherwise switch.
 */

const ARABIC_NUMERIC_TAG = 'ar-SA-u-nu-latn';

function numericTag(locale: Locale): string {
  return locale === 'ar' ? ARABIC_NUMERIC_TAG : LOCALE_TAG[locale];
}

/* ----------------------------------------------------------------- time -- */

/**
 * A date stamp in Riyadh time.
 *
 * Riyadh is the newsroom clock: a story is published at a Saudi time, and that
 * is the time of record regardless of where it is read. Reader-local time is
 * shown *alongside* it on article pages where the difference matters, never
 * instead of it — a reader who sees only their own timezone cannot tell
 * whether an announcement landed before or after a Saudi market session.
 */
export function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(numericTag(locale), {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: SITE.timeZone,
  }).format(new Date(iso));
}

export function formatDateTime(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(numericTag(locale), {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: SITE.timeZone,
  }).format(new Date(iso));
}

/** Clock time only — for the Live Energy Desk, where the date is the column. */
export function formatTime(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(numericTag(locale), {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: SITE.timeZone,
  }).format(new Date(iso));
}

/**
 * "12 min ago" — freshness at a glance.
 *
 * Deliberately gives up and returns an absolute date past ~5 days. "3 weeks
 * ago" reads as vague filler on a story whose exact date is the point.
 */
export function formatRelative(
  iso: string,
  locale: Locale,
  now: Date = new Date(),
): string {
  const then = new Date(iso);
  const diffMs = now.getTime() - then.getTime();
  const minutes = Math.round(diffMs / 60_000);

  const rtf = new Intl.RelativeTimeFormat(numericTag(locale), {
    numeric: 'auto',
    style: 'short',
  });

  if (minutes < 1) return rtf.format(0, 'minute');
  if (minutes < 60) return rtf.format(-minutes, 'minute');

  const hours = Math.round(minutes / 60);
  if (hours < 24) return rtf.format(-hours, 'hour');

  const days = Math.round(hours / 24);
  if (days <= 5) return rtf.format(-days, 'day');

  return formatDate(iso, locale);
}

/** `datetime` attribute for `<time>` — always the untouched ISO string. */
export function machineDate(iso: string): string {
  return new Date(iso).toISOString();
}

/* --------------------------------------------------------------- numbers -- */

export function formatNumber(
  value: number,
  locale: Locale,
  options: Intl.NumberFormatOptions = {},
): string {
  return new Intl.NumberFormat(numericTag(locale), options).format(value);
}

/**
 * A money figure with its currency always visible.
 *
 * There is no bare-number path on purpose. A contract value without its
 * currency is the kind of ambiguity that gets quoted onward and becomes wrong.
 */
export function formatCurrency(
  value: number,
  currency: string,
  locale: Locale,
  options: Intl.NumberFormatOptions = {},
): string {
  return new Intl.NumberFormat(numericTag(locale), {
    style: 'currency',
    currency,
    currencyDisplay: 'code',
    maximumFractionDigits: 0,
    ...options,
  }).format(value);
}

/**
 * A measured quantity and its unit, as one inseparable string.
 *
 * Same reasoning as currency: "110.21" is not a fact, "110.21 km" is. Keeping
 * them together in one formatter is what stops a value and its unit drifting
 * apart across a redesign — and it is also what makes the figure safely
 * quotable by an answer engine lifting it out of the page.
 */
/**
 * Unit words, translated. Unit *symbols* are not.
 *
 * `km`, `MW` and `GW` are SI symbols — international, written in Latin script in
 * Arabic technical and industry usage, and left alone here for the same reason
 * the numerals are. `towers` is not a symbol, it is an English noun, and leaving
 * it untranslated put "279 towers" in the middle of an otherwise Arabic page.
 *
 * A unit absent from this map falls through unchanged, so adding a symbol needs
 * no entry and adding a word needs one line.
 */
const UNIT_WORDS: Record<string, { en: string; ar: string }> = {
  towers: { en: 'towers', ar: 'برجاً' },
};

export function formatMeasure(
  value: number,
  unit: string,
  locale: Locale,
  options: Intl.NumberFormatOptions = {},
): string {
  const n = formatNumber(value, locale, {
    maximumFractionDigits: 2,
    ...options,
  });
  return `${n} ${UNIT_WORDS[unit]?.[locale] ?? unit}`;
}

/** A signed change, for market moves. Sign is always explicit. */
export function formatChange(value: number, locale: Locale): string {
  return new Intl.NumberFormat(numericTag(locale), {
    signDisplay: 'always',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number, locale: Locale): string {
  return new Intl.NumberFormat(numericTag(locale), {
    style: 'percent',
    signDisplay: 'always',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
}

export type Direction = 'up' | 'down' | 'flat';

export function direction(change: number): Direction {
  if (change > 0) return 'up';
  if (change < 0) return 'down';
  return 'flat';
}

/** Reading time, floored at one minute. */
export function readingMinutes(wordCount: number): number {
  return Math.max(1, Math.round(wordCount / 220));
}
