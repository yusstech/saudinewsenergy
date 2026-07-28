import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { formatNumber, formatChange, formatTime, machineDate, direction } from '@/lib/format';
import type { MarketIndicator } from '@content/schema';
import type { Locale } from '@/i18n/config';

const TREND = {
  up: 'text-brand-500 dark:text-brand-400',
  down: 'text-breaking',
  flat: 'text-muted',
} as const;

/**
 * The market rail.
 *
 * Was a marquee above the masthead, competing with a second marquee. Now a static row inside
 * the page, below the nav, where an energy publication's readers expect it — Argus and Platts
 * both lead with prices, and for this audience it is genuinely useful rather than decoration.
 *
 * Static beats scrolling for one blunt reason: you can read it. A price that slides out of view
 * before you have parsed the unit is worse than no price. It also removes an entire class of
 * accessibility problem — no motion means no pause control to implement and nothing for
 * `prefers-reduced-motion` to suppress.
 *
 * Every value still carries its unit, its direction, its delay and — while these are invented
 * numbers — a sample-data flag rendered *before* the figures. Disclosure that arrives after the
 * number has been read is not disclosure, and this audience prices and procures against figures
 * like these.
 */
export async function MarketStrip({
  indicators,
  locale,
}: {
  indicators: MarketIndicator[];
  locale: Locale;
}) {
  if (!indicators.length) return null;

  const t = await getTranslations('market');
  const anySample = indicators.some((i) => i.isSample);
  const first = indicators[0]!;

  return (
    <section
      aria-label={t('stripLabel')}
      className="border-b border-line bg-surface-sunken"
    >
      <div className="page flex items-center gap-4 py-2">
        {anySample && (
          <p className="label flex shrink-0 items-center gap-1.5 text-copper-500 dark:text-copper-300">
            <svg viewBox="0 0 16 16" className="size-3" fill="currentColor" aria-hidden="true">
              <path d="M8 1.5 15 14H1L8 1.5Zm0 4.2a.8.8 0 0 0-.8.8v2.8a.8.8 0 0 0 1.6 0V6.5a.8.8 0 0 0-.8-.8Zm0 5.3a.9.9 0 1 0 0 1.8.9.9 0 0 0 0-1.8Z" />
            </svg>
            <span className="hidden sm:inline">{t('sampleData')}</span>
          </p>
        )}

        <div className="scroll-x min-w-0 flex-1">
          <ul className="flex items-baseline gap-5 whitespace-nowrap">
            {indicators.map((m) => {
              const dir = direction(m.change);
              return (
                <li key={m.id} className="flex shrink-0 items-baseline gap-1.5">
                  <span className="text-micro font-medium text-muted">
                    {m.label[locale]}
                  </span>
                  <span className="numeric text-meta font-semibold text-strong">
                    {formatNumber(m.value, locale, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <span className="text-micro text-faint">{m.unit}</span>
                  <span className={`numeric text-micro font-medium ${TREND[dir]}`}>
                    {formatChange(m.change, locale)}
                    <span className="sr-only"> {t(dir)}</span>
                  </span>
                  {m.delayMinutes > 0 && (
                    <span className="text-micro text-faint">
                      {t('delayed', { minutes: m.delayMinutes })}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <Link
          href="/markets"
          className="hidden shrink-0 text-micro font-semibold text-accent hover:underline underline-offset-4 lg:block"
        >
          <time className="numeric" dateTime={machineDate(first.asOf)}>
            {t('asOf', { time: formatTime(first.asOf, locale) })}
          </time>
        </Link>
      </div>

      {anySample && <p className="sr-only">{t('sampleDataNotice')}</p>}
    </section>
  );
}
