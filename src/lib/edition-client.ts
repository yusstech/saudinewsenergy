'use client';

import { DEFAULT_EDITION, EDITION_COOKIE, isEdition, type Edition } from '@/i18n/config';

/**
 * The reader's edition, read from the cookie on the client.
 *
 * The server-side `resolveEdition` in `lib/edition.ts` is the source of truth for rendering.
 * This exists only for client components that need the current value without a prop drilled
 * through from a server parent — the mobile sheet being the case that exists.
 *
 * Falls back to the default during SSR, where `document` does not exist.
 */
export function resolveEditionClient(): Edition {
  if (typeof document === 'undefined') return DEFAULT_EDITION;
  const match = document.cookie.match(new RegExp(`(?:^|; )${EDITION_COOKIE}=([^;]*)`));
  const value = match?.[1];
  return value && isEdition(value) ? value : DEFAULT_EDITION;
}
