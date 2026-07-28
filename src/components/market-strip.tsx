'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { formatNumber, formatChange, machineDate, formatTime } from '@/lib/format';
import type { MarketIndicator } from '@content/schema';
import type { Locale } from '@/i18n/config';

const TREND = {
  up: 'text-[--color-brand-500] dark:text-[--color-brand-400]',
  down: 'text-[--color-breaking]',
  flat: 'text-[--color-muted]',
} as const;

function trend(change: number): keyof typeof TREND {
  if (change > 0) return 'up';
  if (change < 0) return 'down';
  return 'flat';
}

/**
 * The market signal strip.
 *
 * Every value carries four things, and none of them is optional: the unit, the
 * direction, the timestamp, and — while these are prototype numbers — a
 * persistent "Sample data" badge that is rendered before the values rather than
 * after them.
 *
 * The badge sits first because disclosure that arrives after the number has
 * already been read is not disclosure. This audience prices, finances and
 * procures against figures like these; showing them an invented Brent print
 * without saying so, even once, is how a new publication establishes that its
 * market data cannot be relied on.
 *
 * Delay is stated per indicator rather than as a blanket footnote, because
 * delays genuinely differ per feed and a single "delayed" note would be wrong
 * for whichever one is real time.
 */
export function MarketStrip({
  indicators,
  locale,
}: {
  indicators: MarketIndicator[];
  locale: Locale;
}) {
  const t = useTranslations('market');
  const tc = useTranslations('common');
  const [paused, setPaused] = useState(false);

  if (!indicators.length) return null;

  const anySample = indicators.some((i) => i.isSample);
  const duration = Math.max(60, indicators.length * 14);

  const cell = (indicator: MarketIndicator, hidden: boolean) => {
    const dir = trend(indicator.change);
    return (
      <li
        key={`${hidden ? 'dup-' : ''}${indicator.id}`}
        className="flex shrink-0 items-baseline gap-2 border-e border-[--color-line] px-4"
      >
        <span className="text-xs font-medium text-[--color-muted]">
          {indicator.label[locale]}
        </span>
        <span className="numeric text-sm font-semibold">
          {formatNumber(indicator.value, locale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
        <span className="text-[0.6875rem] text-[--color-faint]">{indicator.unit}</span>
        <span className={`numeric text-xs font-medium ${TREND[dir]}`}>
          {formatChange(indicator.change, locale)}
          <span className="sr-only"> {t(dir)}</span>
        </span>
        {indicator.delayMinutes > 0 && (
          <span className="text-[0.625rem] text-[--color-faint]">
            {t('delayed', { minutes: indicator.delayMinutes })}
          </span>
        )}
      </li>
    );
  };

  return (
    <section
      aria-label={t('stripLabel')}
      className="border-b border-[--color-line] bg-[--color-surface-sunken]"
    >
      <div className="mx-auto flex max-w-[1440px] items-center gap-2 px-[--spacing-gutter]">
        {anySample && (
          <p className="flex shrink-0 items-center gap-1.5 py-1.5 text-[0.625rem] font-semibold uppercase tracking-wider text-[--color-copper-500] dark:text-[--color-copper-300]">
            <svg viewBox="0 0 16 16" className="size-3" fill="currentColor" aria-hidden="true">
              <path d="M8 1.5 15 14H1L8 1.5Zm0 4.2a.8.8 0 0 0-.8.8v2.8a.8.8 0 0 0 1.6 0V6.5a.8.8 0 0 0-.8-.8Zm0 5.3a.9.9 0 1 0 0 1.8.9.9 0 0 0 0-1.8Z" />
            </svg>
            {t('sampleData')}
          </p>
        )}

        <div className="marquee min-w-0 flex-1 overflow-hidden" data-paused={paused}>
          <div
            className="marquee-track flex w-max py-1.5"
            style={{ ['--marquee-duration' as string]: `${duration}s` }}
          >
            <ul className="flex shrink-0 items-center">
              {indicators.map((i) => cell(i, false))}
            </ul>
            <ul className="flex shrink-0 items-center" aria-hidden="true">
              {indicators.map((i) => cell(i, true))}
            </ul>
          </div>
        </div>

        <p className="hidden shrink-0 text-[0.625rem] text-[--color-faint] sm:block">
          {t('asOf', {
            time: formatTime(indicators[0]!.asOf, locale),
          })}
        </p>

        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          className="shrink-0 rounded-sm p-1 text-[--color-muted] hover:bg-[--color-surface] hover:text-[--color-body]"
        >
          <span className="sr-only">
            {paused ? 'Resume market ticker' : 'Pause market ticker'}
          </span>
          {paused ? (
            <svg viewBox="0 0 16 16" className="size-3" fill="currentColor" aria-hidden="true">
              <path d="M4 2.5v11l9-5.5-9-5.5Z" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" className="size-3" fill="currentColor" aria-hidden="true">
              <path d="M4 2.5h3v11H4v-11Zm5 0h3v11H9v-11Z" />
            </svg>
          )}
        </button>
      </div>

      {/* Machine-readable timestamp for the whole strip; the visible one above
          is abbreviated for space. */}
      <time className="sr-only" dateTime={machineDate(indicators[0]!.asOf)}>
        {t('asOf', { time: formatTime(indicators[0]!.asOf, locale) })}
      </time>
      {anySample && <p className="sr-only">{t('sampleDataNotice')}</p>}
      <span className="sr-only">{tc('more')}</span>
    </section>
  );
}
