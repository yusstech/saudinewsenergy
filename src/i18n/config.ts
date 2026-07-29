/**
 * Language and edition are two independent axes, and conflating them is the
 * mistake this file exists to prevent.
 *
 * **Language** is the URL prefix (`/en`, `/ar`). It decides interface language,
 * text direction, typography and the language a story is served in.
 *
 * **Edition** is a cookie. It decides which secondary rails a reader sees —
 * which GCC, MENA or global stories surface beneath the Saudi lead. It never
 * changes the language, and it never displaces Saudi Arabia as the editorial
 * centre.
 *
 * So a reader in London can read the Saudi edition in Arabic, and a reader in
 * Riyadh can read the Global edition in English. Neither combination is a
 * special case; they fall out of keeping the two axes apart.
 */

export const LOCALES = ['en', 'ar'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

/** Text direction per locale — read once, in the root layout. */
export const DIRECTION: Record<Locale, 'ltr' | 'rtl'> = {
  en: 'ltr',
  ar: 'rtl',
};

export const LOCALE_LABEL: Record<Locale, string> = {
  en: 'English',
  ar: 'العربية',
};

/** BCP-47 tags for `hreflang`, `<html lang>` and `Intl` formatters. */
export const LOCALE_TAG: Record<Locale, string> = {
  en: 'en',
  ar: 'ar-SA',
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/* --------------------------------------------------------------- editions -- */

export const EDITIONS = ['saudi', 'gcc', 'mena', 'global'] as const;
export type Edition = (typeof EDITIONS)[number];

export const DEFAULT_EDITION: Edition = 'saudi';

export const EDITION_COOKIE = 'sen_edition';

/**
 * The reader's country, stamped by middleware so no page has to read a request
 * header to find it.
 *
 * A two-letter code and nothing more. It exists so the edition suggestion can
 * be decided on the client, which is what keeps every page under `[locale]`
 * statically rendered — see the note in `src/middleware.ts` for what reading it
 * server-side used to cost.
 */
export const GEO_COOKIE = 'sen_geo';

export function isEdition(value: string): value is Edition {
  return (EDITIONS as readonly string[]).includes(value);
}

/**
 * Country → recommended supporting edition.
 *
 * This only ever produces a *recommendation*. Detection never redirects and
 * never silently switches the reader — it surfaces a dismissible prompt, and
 * a saved preference always wins. Saudi Arabia stays the editorial centre in
 * every edition; what changes is the weighting of the secondary rails.
 */
export const COUNTRY_EDITION: Record<string, Edition> = {
  SA: 'saudi',
  AE: 'gcc',
  KW: 'gcc',
  QA: 'gcc',
  BH: 'gcc',
  OM: 'gcc',
  EG: 'mena',
  JO: 'mena',
  IQ: 'mena',
  MA: 'mena',
  DZ: 'mena',
  TN: 'mena',
  LY: 'mena',
  LB: 'mena',
};
