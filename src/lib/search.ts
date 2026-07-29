import 'server-only';
import type { Locale } from '@/i18n/config';
import { getStories } from './content';

export interface SearchDoc {
  slug: string;
  locale: Locale;
  href: string;
  headline: string;
  standfirst: string;
  sector: string;
  publishedAt: string;
  /** Lowercased haystack for keyword matching. */
  haystack: string;
}

/**
 * The client-side search index.
 *
 * Small enough to ship whole — one JSON payload, matched in the browser, no
 * server round trip and nothing that can be unavailable. When the corpus
 * outgrows a single payload this is the one place that has to change.
 *
 */
export function buildSearchIndex(locale: Locale): SearchDoc[] {
  return getStories(locale).map((story) => ({
    slug: story.slug,
    locale,
    href: `/${story.isLive ? 'live' : 'article'}/${story.slug}`,
    headline: story.headline,
    standfirst: story.standfirst,
    sector: story.sector,
    publishedAt: story.publishedAt,
    haystack: [
      story.headline,
      story.standfirst,
      story.topics.join(' '),
      story.takeaways.join(' '),
      story.faq.map((f) => `${f.question} ${f.answer}`).join(' '),
      story.plain,
    ]
      .join(' ')
      .toLowerCase(),
  }));
}
