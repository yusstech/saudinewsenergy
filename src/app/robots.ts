import type { MetadataRoute } from 'next';
import { abs } from '@/lib/site';

/**
 * Answer-engine crawlers are allowed deliberately.
 *
 * A specialist publication's reason to exist is being the thing people cite
 * when they need to know what actually happened on a Saudi energy project.
 * Blocking GPTBot, ClaudeBot, PerplexityBot and the rest would protect the page
 * view and lose the citation — and the citation is what carries the masthead
 * into rooms the page view never reaches. `llms.txt` exists for the same
 * reason: it tells those crawlers where the substance is instead of making them
 * infer it.
 *
 * `/api/` is disallowed because it is machinery, not coverage.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: abs('/sitemap.xml'),
    host: abs('/'),
  };
}
