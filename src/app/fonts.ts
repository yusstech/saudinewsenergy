import { Inter, IBM_Plex_Sans_Arabic } from 'next/font/google';

/**
 * Two families, chosen to sit at the same optical weight so a headline carries
 * equal authority in either script. IBM Plex Sans Arabic is a contemporary
 * screen face with a full weight range and, critically, well-drawn Arabic
 * numerals — this publication renders a lot of capacities, prices and lengths,
 * and a family that treats digits as an afterthought shows it immediately in a
 * data table.
 */

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const ibmArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-ibm-arabic',
});
