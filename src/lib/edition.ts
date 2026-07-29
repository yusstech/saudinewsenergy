import 'server-only';
import { cookies } from 'next/headers';
import { DEFAULT_EDITION, EDITION_COOKIE, isEdition, type Edition } from '@/i18n/config';

/**
 * The reader's saved edition, on the server.
 *
 * **Calling this makes the calling route dynamic.** That is the whole cost, and
 * it is why exactly one page does it: the front page, whose lead and rails are
 * genuinely selected by edition. Everything else — articles, projects,
 * companies, desks — is the same page for every reader and stays static.
 *
 * This used to be called in the `[locale]` layout, where it applied that cost to
 * every page on the site at once. Nothing prerendered, nothing cached at the
 * edge, and `dynamicParams = false` had no static generation left to guard, so
 * an unknown article slug rendered the not-found body under a 200. One cookie
 * read in the wrong file is what a soft 404 across the whole publication looks
 * like.
 *
 * Anything that only needs the value for display reads it on the client
 * instead — see `useEdition` in `src/lib/use-edition.ts`.
 */
export async function resolveEdition(): Promise<Edition> {
  const store = await cookies();
  const saved = store.get(EDITION_COOKIE)?.value;
  return saved && isEdition(saved) ? saved : DEFAULT_EDITION;
}
