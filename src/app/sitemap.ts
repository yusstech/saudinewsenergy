import type { MetadataRoute } from 'next';
import { LOCALES, LOCALE_TAG, EDITIONS, type Locale } from '@/i18n/config';
import { abs } from '@/lib/site';
import { getStories } from '@/lib/content';
import { SECTORS } from '@content/taxonomy';
import { COMPANIES } from '@content/companies';

/**
 * The sitemap declares the same language relationships the pages themselves
 * declare, because a sitemap that disagrees with a page's `hreflang` is worse
 * than one that omits the information: a crawler reconciling two conflicting
 * claims trusts neither.
 *
 * Prototype stories are excluded. They carry `noindex` on the page, and listing
 * a `noindex` URL in a sitemap is a contradictory instruction.
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

  const listingPaths = [
    { path: '', priority: 1.0, frequency: 'hourly' as const },
    { path: '/latest', priority: 0.9, frequency: 'hourly' as const },
    { path: '/projects', priority: 0.7, frequency: 'daily' as const },
    { path: '/search', priority: 0.4, frequency: 'monthly' as const },
    { path: '/standards', priority: 0.4, frequency: 'yearly' as const },
    { path: '/corrections', priority: 0.4, frequency: 'weekly' as const },
    { path: '/about', priority: 0.4, frequency: 'yearly' as const },
    { path: '/contact', priority: 0.3, frequency: 'yearly' as const },
    ...SECTORS.map((s) => ({
      path: `/sector/${s.slug}`,
      priority: 0.6,
      frequency: 'daily' as const,
    })),
    ...EDITIONS.map((e) => ({
      path: `/edition/${e}`,
      priority: 0.6,
      frequency: 'daily' as const,
    })),
    // Projects live as anchored records on the single /projects feed rather
    // than as their own routes, so there is nothing per-project to list here.
    ...COMPANIES.map((c) => ({
      path: `/company/${c.slug}`,
      priority: 0.5,
      frequency: 'weekly' as const,
    })),
  ];

  const seen = new Set<string>();
  for (const locale of LOCALES) {
    for (const { path, priority, frequency } of listingPaths) {
      const url = abs(`/${locale}${path}`);
      if (seen.has(url)) continue;
      seen.add(url);
      entries.push({
        url,
        lastModified: now,
        changeFrequency: frequency,
        priority,
        alternates: localised(path),
      });
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
