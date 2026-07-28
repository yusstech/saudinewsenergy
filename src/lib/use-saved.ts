'use client';

import { useCallback, useEffect, useState } from 'react';

const KEY = 'sen_saved_stories';
const EVENT = 'sen:saved-changed';

/**
 * Saved stories, on this device.
 *
 * `localStorage` rather than an account, because there is no backend and
 * pretending otherwise would mean a reader losing their saved list at the first
 * browser they switch to without warning. The saved page says plainly that this
 * is device-local; when accounts arrive, this hook is the only thing that
 * changes.
 *
 * The custom event keeps multiple mounted consumers — the toolbar on an article
 * and the counter in the header — in step without a store. `storage` alone
 * would not do it: browsers fire that event only in *other* tabs.
 */
function read(): string[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === 'string') : [];
  } catch {
    // Corrupt or unavailable storage (private mode, quota) behaves as empty
    // rather than throwing on every render of every article.
    return [];
  }
}

export function useSavedStories() {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    setSlugs(read());
    const sync = () => setSlugs(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const write = useCallback((next: string[]) => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* Storage full or blocked; the in-memory list still updates. */
    }
    setSlugs(next);
    window.dispatchEvent(new Event(EVENT));
  }, []);

  const toggle = useCallback(
    (slug: string) => {
      const current = read();
      write(
        current.includes(slug)
          ? current.filter((s) => s !== slug)
          : [slug, ...current],
      );
    },
    [write],
  );

  const remove = useCallback(
    (slug: string) => write(read().filter((s) => s !== slug)),
    [write],
  );

  const isSaved = useCallback((slug: string) => slugs.includes(slug), [slugs]);

  return { slugs, toggle, remove, isSaved };
}
