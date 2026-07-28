import { defineRouting } from 'next-intl/routing';
import { LOCALES, DEFAULT_LOCALE } from './config';

export const routing = defineRouting({
  locales: [...LOCALES],
  defaultLocale: DEFAULT_LOCALE,
  // Every locale is explicit in the URL (/en, /ar). Arabic and English are
  // equal products here, not a default plus a translation — an unprefixed
  // default would quietly make English the "real" site and Arabic the variant.
  // Explicit prefixes also give hreflang a stable URL per language.
  localePrefix: 'always',
  localeCookie: {
    name: 'NEXT_LOCALE',
    maxAge: 60 * 60 * 24 * 365,
  },
});
