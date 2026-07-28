import 'server-only';
import { cookies, headers } from 'next/headers';
import {
  DEFAULT_EDITION,
  EDITION_COOKIE,
  COUNTRY_EDITION,
  isEdition,
  type Edition,
} from '@/i18n/config';

/**
 * Resolving the reader's edition.
 *
 * The order is a saved preference first, then a geographic *recommendation*,
 * then Saudi Arabia. Detection deliberately never becomes a redirect: the
 * concept is explicit that location may influence supporting content but must
 * not turn Saudi Energy News into a different country's publication, and a
 * silent geo-redirect does exactly that — it also breaks canonical URLs, since
 * two readers requesting the same address would be served different pages.
 *
 * So geography only ever produces a dismissible suggestion. `suggested` below
 * returns what we would offer; `resolveEdition` returns what we actually serve.
 */
export async function resolveEdition(): Promise<Edition> {
  const store = await cookies();
  const saved = store.get(EDITION_COOKIE)?.value;
  if (saved && isEdition(saved)) return saved;
  return DEFAULT_EDITION;
}

/**
 * The edition we would suggest based on where the request came from, or null
 * when there is nothing worth suggesting.
 *
 * Returns null when the reader has already chosen, when the country maps to
 * the default anyway, or when we cannot tell — a prompt offering the edition
 * someone is already reading is noise.
 */
export async function suggestedEdition(): Promise<{
  edition: Edition;
  country: string;
} | null> {
  const store = await cookies();
  if (store.get(EDITION_COOKIE)) return null;

  const h = await headers();
  const country =
    h.get('x-vercel-ip-country') ?? h.get('cf-ipcountry') ?? null;
  if (!country) return null;

  const edition = COUNTRY_EDITION[country.toUpperCase()];
  if (!edition || edition === DEFAULT_EDITION) return null;

  return { edition, country: country.toUpperCase() };
}
