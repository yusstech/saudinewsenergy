'use client';

import { useEffect, useState } from 'react';
import {
  DEFAULT_EDITION,
  EDITION_COOKIE,
  GEO_COOKIE,
  COUNTRY_EDITION,
  isEdition,
  type Edition,
} from '@/i18n/config';

function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1];
}

/**
 * The reader's chosen edition, read on the client.
 *
 * This used to be resolved in the `[locale]` layout with `cookies()`, and that
 * one call is what made every page on the site render dynamically — no
 * prerendering, no CDN cache, and an unknown slug answering 200 instead of 404
 * because `dynamicParams` had nothing static left to guard.
 *
 * A saved preference is a client concern, so it is read on the client. The
 * first paint uses the default, which is also what the server rendered, so
 * there is no hydration mismatch — a reader who has chosen another edition sees
 * the control settle onto it a frame later. That is a fair price for pages that
 * are static, cacheable and honest about their status codes.
 */
export function useEdition(): Edition {
  const [edition, setEdition] = useState<Edition>(DEFAULT_EDITION);

  useEffect(() => {
    const saved = readCookie(EDITION_COOKIE);
    if (saved && isEdition(saved)) setEdition(saved);
  }, []);

  return edition;
}

/**
 * The edition we would offer this reader, or null when there is nothing worth
 * offering.
 *
 * Null when they have already chosen, when we cannot tell where they are, or
 * when their country maps to the edition they are already reading — a prompt
 * offering someone the edition they already have is noise.
 *
 * `settled` distinguishes "no suggestion" from "not yet checked", so the banner
 * can stay out of the first paint instead of flashing in and back out.
 */
export function useSuggestedEdition(): {
  suggestion: { edition: Edition; country: string } | null;
  settled: boolean;
} {
  const [state, setState] = useState<{
    suggestion: { edition: Edition; country: string } | null;
    settled: boolean;
  }>({ suggestion: null, settled: false });

  useEffect(() => {
    // A saved preference ends the question.
    if (readCookie(EDITION_COOKIE)) {
      setState({ suggestion: null, settled: true });
      return;
    }

    const country = readCookie(GEO_COOKIE)?.toUpperCase();
    if (!country) {
      setState({ suggestion: null, settled: true });
      return;
    }

    const edition = COUNTRY_EDITION[country];
    setState({
      suggestion:
        edition && edition !== DEFAULT_EDITION ? { edition, country } : null,
      settled: true,
    });
  }, []);

  return state;
}
