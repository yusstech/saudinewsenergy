import type { Locale } from '@/i18n/config';

/**
 * The canonical origin, with no trailing slash.
 *
 * Everything that identifies a page to the outside world — canonicals,
 * hreflang alternates, sitemap entries, JSON-LD `@id`s, OG URLs — is built from
 * this one value, so it is read in exactly one place. On Vercel preview builds
 * the env var is usually unset; falling back to the deployment URL keeps
 * previews self-consistent rather than silently pointing at production.
 *
 * The last resort is the production origin, not localhost. These values are
 * baked into a static build and are expensive to correct once indexed, so the
 * failure mode of a forgotten env var has to be "correct URLs" rather than
 * "a sitemap full of localhost". Local development overrides it in `.env.local`
 * when it needs to; nothing about a wrong canonical matters on a dev machine.
 */
export const PRODUCTION_ORIGIN = 'https://saudienergynews.com';

export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, '');

  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;

  return PRODUCTION_ORIGIN;
}

/** Absolute URL for a site-relative path. */
export function abs(path: string): string {
  return `${siteUrl()}${path.startsWith('/') ? path : `/${path}`}`;
}

export const SITE = {
  name: 'Saudi Energy News',
  nameAr: 'أخبار الطاقة السعودية',
  descriptor: {
    en: "Saudi Arabia's live energy newsroom.",
    ar: 'غرفة أخبار الطاقة السعودية المباشرة.',
  },
  promise: {
    en: 'Timely, trusted coverage of Saudi energy, markets, projects, policy, and the transition shaping the Kingdom’s future.',
    ar: 'تغطية موثوقة وفي وقتها لقطاع الطاقة السعودي والأسواق والمشاريع والسياسات وتحوّل الطاقة الذي يشكّل مستقبل المملكة.',
  },
  /** Riyadh is the newsroom clock. */
  timeZone: 'Asia/Riyadh',
  contact: 'newsroom@saudienergynews.com',
} as const;

export function siteName(locale: Locale): string {
  return locale === 'ar' ? SITE.nameAr : SITE.name;
}

export function siteDescriptor(locale: Locale): string {
  return SITE.descriptor[locale];
}
