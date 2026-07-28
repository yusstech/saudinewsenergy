import {
  Inter,
  Newsreader,
  IBM_Plex_Sans_Arabic,
  Noto_Naskh_Arabic,
} from 'next/font/google';

/**
 * Four families, two per script, each doing one job.
 *
 * **The pairing is the identity.** A specialist publication's visual authority comes from type
 * before it comes from colour or layout — it is what makes the FT look like the FT at a glance,
 * from across a room, before you read a word. The previous build used one sans at varying sizes
 * and had no voice at all as a result.
 *
 * The split is editorial: a serif carries the reporting, a sans carries the interface. That
 * distinction is legible even to a reader who never notices type — headlines feel *written*,
 * timestamps and market values feel *measured*.
 */

/** Latin display and article body. */
export const newsreader = Newsreader({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-newsreader',
  style: ['normal', 'italic'],
  // Newsreader carries an optical-size axis, which is the reason to choose it over a
  // conventional serif. Letterforms thicken and open at small sizes and refine at display
  // sizes, so one family stays sturdy in a 13px card headline and elegant at 48px. A static
  // serif has to compromise at one end or the other.
  //
  // No `weight` here on purpose: declaring `axes` loads the variable font, which then carries
  // its whole weight range. The two options are mutually exclusive — naming weights would pin
  // it to static instances and throw the axis away.
  axes: ['opsz'],
});

/** Latin interface, metadata and data. */
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

/**
 * Arabic display.
 *
 * Arabic has no serif/sans division — the equivalent register is Naskh, the calligraphic hand
 * used for centuries of printed books and still the voice of authority in Arabic publishing.
 * Pairing a Latin serif with a Naskh display face is what makes "Arabic and English are equal
 * products" true at the level readers actually feel. Giving Arabic the interface font while
 * English gets a beautiful one is the exact failure the concept warned against.
 */
export const notoNaskh = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-naskh',
  weight: ['400', '500', '600', '700'],
});

/** Arabic interface, metadata and data. */
export const ibmArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-ibm-arabic',
  weight: ['400', '500', '600', '700'],
});

/** Every font variable, for the `<html>` class. */
export const fontVariables = [
  newsreader.variable,
  inter.variable,
  notoNaskh.variable,
  ibmArabic.variable,
].join(' ');
