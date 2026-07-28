import { marketIndicatorSchema, type MarketIndicator } from './schema';

/**
 * Sample market indicators.
 *
 * **Every value here is invented prototype content.** `isSample: true` is set
 * on all of them and the UI is built so that flag cannot be rendered away —
 * the strip carries a persistent "Sample data" badge, and the markets page
 * leads with the disclosure rather than footnoting it.
 *
 * This is not defensiveness for its own sake. The audience is people who trade,
 * finance and procure against these numbers. A publication that shows them an
 * invented Brent print without saying so, even once, has told them its market
 * data cannot be trusted — and they are right to conclude that. When a licensed
 * feed replaces this file, `isSample` goes to `false` and `delayMinutes` starts
 * carrying the provider's real delay; nothing else about the disclosure
 * machinery changes.
 *
 * The timestamp is fixed rather than generated at build time, so the strip
 * never implies freshness it does not have.
 */

const SAMPLE_AS_OF = '2026-07-28T14:35:00+03:00';

const raw: MarketIndicator[] = [
  {
    id: 'brent',
    label: { en: 'Brent', ar: 'برنت' },
    value: 78.42,
    unit: 'USD/bbl',
    currency: 'USD',
    change: 0.63,
    changePercent: 0.81,
    asOf: SAMPLE_AS_OF,
    delayMinutes: 15,
    isSample: true,
  },
  {
    id: 'wti',
    label: { en: 'WTI', ar: 'غرب تكساس' },
    value: 74.18,
    unit: 'USD/bbl',
    currency: 'USD',
    change: 0.51,
    changePercent: 0.69,
    asOf: SAMPLE_AS_OF,
    delayMinutes: 15,
    isSample: true,
  },
  {
    id: 'henry-hub',
    label: { en: 'Natural gas (Henry Hub)', ar: 'الغاز الطبيعي (هنري هَب)' },
    value: 3.12,
    unit: 'USD/MMBtu',
    currency: 'USD',
    change: -0.07,
    changePercent: -2.19,
    asOf: SAMPLE_AS_OF,
    delayMinutes: 15,
    isSample: true,
  },
  {
    id: 'jet-fuel-arabgulf',
    label: { en: 'Jet fuel (Arab Gulf)', ar: 'وقود الطائرات (الخليج العربي)' },
    value: 92.6,
    unit: 'USD/bbl',
    currency: 'USD',
    change: 0.34,
    changePercent: 0.37,
    asOf: SAMPLE_AS_OF,
    delayMinutes: 60,
    isSample: true,
  },
  {
    id: 'tasi-energy',
    label: { en: 'TASI Energy', ar: 'تاسي — الطاقة' },
    value: 6142.8,
    unit: 'index',
    change: -18.4,
    changePercent: -0.3,
    asOf: SAMPLE_AS_OF,
    delayMinutes: 20,
    isSample: true,
  },
  {
    id: 'sar-usd',
    label: { en: 'SAR/USD', ar: 'الريال/الدولار' },
    value: 3.75,
    unit: 'SAR per USD',
    currency: 'SAR',
    change: 0,
    changePercent: 0,
    asOf: SAMPLE_AS_OF,
    delayMinutes: 0,
    isSample: true,
  },
];

export const MARKET_INDICATORS: MarketIndicator[] = raw.map((m) =>
  marketIndicatorSchema.parse(m),
);

/** True while any indicator on the page is prototype content. */
export const MARKETS_ARE_SAMPLE = MARKET_INDICATORS.some((m) => m.isSample);
