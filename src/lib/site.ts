import type { Locale } from '@/i18n/config';

/**
 * The canonical origin, with no trailing slash.
 *
 * Everything that identifies a page to the outside world — canonicals, hreflang
 * alternates, sitemap entries, JSON-LD `@id`s, OG URLs — is built from this one
 * value, so it is read in exactly one place.
 *
 * **`VERCEL_ENV`, not `VERCEL_URL`, decides.** This is the part that was wrong
 * and it was wrong in the expensive direction. `VERCEL_URL` is set on *every*
 * Vercel deployment, production included — it is the immutable per-deployment
 * hostname, not a preview marker. Branching on its presence therefore published
 * a production sitemap of 34 `…-dz98cadim-….vercel.app` URLs, every one of them
 * behind deployment protection and so unfetchable by any crawler. Google's
 * verdict was "Couldn't fetch", and it was right.
 *
 * So a preview build is identified by `VERCEL_ENV === 'preview'`, which is the
 * only value that actually means it. Everything else — production, a local
 * build, a CI build with no Vercel env at all — resolves to the real origin.
 * The failure mode of a missing variable is now correct URLs rather than
 * unreachable ones.
 *
 * `www` is the canonical host: the apex 308-redirects to it, so a canonical on
 * the apex would point at a URL that immediately moves. Changing this after the
 * site is indexed means a full re-index, so treat it as fixed.
 */
export const PRODUCTION_ORIGIN = 'https://www.energysyria.online';

export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, '');

  // Previews only. A preview that claimed the production origin would hand
  // crawlers canonicals pointing at pages it does not serve.
  if (process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return PRODUCTION_ORIGIN;
}

/** Absolute URL for a site-relative path. */
export function abs(path: string): string {
  return `${siteUrl()}${path.startsWith('/') ? path : `/${path}`}`;
}

export const SITE = {
  name: 'Syrian Energy News',
  nameAr: 'أخبار الطاقة السورية',
  descriptor: {
    en: "Syria's live energy newsroom.",
    ar: 'غرفة أخبار الطاقة السورية المباشرة.',
  },
  promise: {
    en: 'Timely, trusted coverage of Syrian energy, markets, projects, policy, and the reconstruction shaping the country’s grid.',
    ar: 'تغطية موثوقة وفي وقتها لقطاع الطاقة السوري والأسواق والمشاريع والسياسات وإعادة الإعمار التي تشكّل شبكة البلاد.',
  },
  /** Damascus is the newsroom clock. */
  timeZone: 'Asia/Damascus',
  contact: 'newsroom@energysyria.online',
} as const;

export function siteName(locale: Locale): string {
  return locale === 'ar' ? SITE.nameAr : SITE.name;
}

export function siteDescriptor(locale: Locale): string {
  return SITE.descriptor[locale];
}
