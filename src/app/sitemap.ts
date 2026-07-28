import type { MetadataRoute } from 'next';
import { LOCALES, LOCALE_TAG, EDITIONS, type Locale } from '@/i18n/config';
import { abs } from '@/lib/site';
import {
  getStories,
  getStoriesBySector,
  getStoriesByEdition,
  getStoriesByCompany,
} from '@/lib/content';
import { SECTORS } from '@content/taxonomy';
import { COMPANIES } from '@content/companies';

/**
 * The sitemap declares the same language relationships the pages themselves
 * declare, because a sitemap that disagrees with a page's `hreflang` is worse
 * than one that omits the information: a crawler reconciling two conflicting
 * claims trusts neither.
 *
 * **A listing page appears only where it lists something.** The taxonomy
 * describes the desks and regions this publication intends to cover, which is
 * larger than what it has published so far — 13 sectors, 4 editions and 9
 * companies against, at the time of writing, one story. Submitting the empty
 * remainder would be offering a crawler dozens of pages that say "nothing here
 * yet" and asking it to treat them as content. Those pages still exist, still
 * render, and are still crawlable through the navigation; they carry `noindex`
 * until they have coverage, and this file agrees with them.
 *
 * The filter is per-locale for the same reason the alternates are: a desk with
 * English coverage and no Arabic coverage is a real English page and an empty
 * Arabic one.
 */

function localised(path: string): MetadataRoute.Sitemap[number]['alternates'] {
  return {
    languages: Object.fromEntries(
      LOCALES.map((l) => [LOCALE_TAG[l], abs(`/${l}${path}`)]),
    ),
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  // Static pages: always listed. They are about the publication rather than its
  // output, so they say something whether or not anything has been published.
  const staticPaths = [
    { path: '', priority: 1.0, frequency: 'hourly' as const },
    { path: '/latest', priority: 0.9, frequency: 'hourly' as const },
    { path: '/projects', priority: 0.7, frequency: 'daily' as const },
    { path: '/search', priority: 0.4, frequency: 'monthly' as const },
    { path: '/standards', priority: 0.4, frequency: 'yearly' as const },
    { path: '/corrections', priority: 0.4, frequency: 'weekly' as const },
    { path: '/about', priority: 0.4, frequency: 'yearly' as const },
    { path: '/contact', priority: 0.3, frequency: 'yearly' as const },
  ];

  const seen = new Set<string>();

  function push(
    locale: Locale,
    path: string,
    priority: number,
    frequency: MetadataRoute.Sitemap[number]['changeFrequency'],
  ) {
    const url = abs(`/${locale}${path}`);
    if (seen.has(url)) return;
    seen.add(url);
    entries.push({
      url,
      lastModified: now,
      changeFrequency: frequency,
      priority,
      alternates: localised(path),
    });
  }

  for (const locale of LOCALES as readonly Locale[]) {
    for (const { path, priority, frequency } of staticPaths) {
      push(locale, path, priority, frequency);
    }

    for (const sector of SECTORS) {
      if (getStoriesBySector(locale, sector.slug).length === 0) continue;
      push(locale, `/sector/${sector.slug}`, 0.6, 'daily');
    }

    for (const edition of EDITIONS) {
      if (getStoriesByEdition(locale, edition).length === 0) continue;
      push(locale, `/edition/${edition}`, 0.6, 'daily');
    }

    // Projects live as anchored records on the single /projects feed rather
    // than as their own routes, so there is nothing per-project to list here.
    for (const company of COMPANIES) {
      if (getStoriesByCompany(locale, company.slug).length === 0) continue;
      push(locale, `/company/${company.slug}`, 0.5, 'weekly');
    }
  }

  // Stories are listed only under the locale they were written in — the same
  // consolidation rule the canonicals apply.
  for (const locale of LOCALES as readonly Locale[]) {
    for (const story of getStories(locale)) {
      if (story.isSampleContent) continue;
      const segment = story.isLive ? 'live' : 'article';
      entries.push({
        url: abs(`/${locale}/${segment}/${story.slug}`),
        lastModified: new Date(story.updatedAt ?? story.publishedAt),
        changeFrequency: story.isLive ? 'hourly' : 'weekly',
        priority: story.featured ? 0.9 : 0.7,
      });
    }
  }

  return entries;
}
