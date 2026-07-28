'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSavedStories } from '@/lib/use-saved';

type Size = 'normal' | 'large' | 'xlarge';
const SIZES: Size[] = ['normal', 'large', 'xlarge'];
const SIZE_KEY = 'sen_reader_size';

/**
 * Save, share, text size and print.
 *
 * The text-size control writes a `data-reader-size` attribute on `<html>` and
 * lets CSS do the resizing, so nothing re-renders and the choice persists
 * across navigations. It is stored in `localStorage` rather than a cookie
 * because it never needs to reach the server — a preference the server does not
 * use has no business in every request header.
 *
 * Reading it back happens in an effect rather than during render: touching
 * `localStorage` while rendering would produce different markup on the server
 * and the client, and a hydration mismatch on the article toolbar is a
 * flickering control on every story.
 */
export function ArticleToolbar({ slug, url }: { slug: string; url: string }) {
  const t = useTranslations('article');
  const { isSaved, toggle } = useSavedStories();
  const [size, setSize] = useState<Size>('normal');
  const [copied, setCopied] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(SIZE_KEY) as Size | null;
    if (stored && SIZES.includes(stored)) {
      setSize(stored);
      document.documentElement.dataset.readerSize = stored;
    }
    setReady(true);
  }, []);

  function chooseSize(next: Size) {
    setSize(next);
    document.documentElement.dataset.readerSize = next;
    window.localStorage.setItem(SIZE_KEY, next);
  }

  async function share() {
    // The native sheet where it exists; a clipboard copy where it does not.
    // Both paths end with the reader holding the link.
    if (navigator.share) {
      try {
        await navigator.share({ url });
        return;
      } catch {
        // A dismissed share sheet is a normal outcome, not an error.
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard blocked; nothing useful to say about it. */
    }
  }

  const saved = ready && isSaved(slug);
  const btn =
    'inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-xs font-medium hover:bg-[--color-surface-sunken]';

  return (
    <div className="no-print flex flex-wrap items-center gap-1 border-y border-[--color-line] py-2">
      <button
        type="button"
        onClick={() => toggle(slug)}
        aria-pressed={saved}
        className={btn}
      >
        <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden="true" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6">
          <path d="M4 2h8v12l-4-3-4 3V2Z" />
        </svg>
        {saved ? t('saved') : t('save')}
      </button>

      <button type="button" onClick={share} className={btn}>
        <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M8 10V2m0 0L5 5m3-3 3 3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 9v4h10V9" strokeLinecap="round" />
        </svg>
        {copied ? t('linkCopied') : t('share')}
      </button>

      <button type="button" onClick={() => window.print()} className={btn}>
        <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M4 6V2h8v4M4 12H2V6h12v6h-2M4 10h8v4H4v-4Z" />
        </svg>
        {t('print')}
      </button>

      <div
        role="group"
        aria-label={t('textSize')}
        className="ms-auto flex items-center gap-0.5"
      >
        {SIZES.map((s, i) => (
          <button
            key={s}
            type="button"
            onClick={() => chooseSize(s)}
            aria-pressed={size === s}
            title={t(
              s === 'normal'
                ? 'textSizeNormal'
                : s === 'large'
                  ? 'textSizeLarge'
                  : 'textSizeXLarge',
            )}
            className={`rounded-sm px-2 py-1 font-serif leading-none transition-colors ${
              size === s
                ? 'bg-[--color-body] text-[--color-canvas]'
                : 'hover:bg-[--color-surface-sunken]'
            }`}
            style={{ fontSize: `${0.75 + i * 0.18}rem` }}
          >
            A
            <span className="sr-only">
              {t(
                s === 'normal'
                  ? 'textSizeNormal'
                  : s === 'large'
                    ? 'textSizeLarge'
                    : 'textSizeXLarge',
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Reading progress.
 *
 * Purely decorative, so it is `aria-hidden` — a screen reader already knows
 * where it is in the document and does not need a percentage narrated at it.
 */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0);
    };
    const onScroll = () => {
      // Coalesce to one measurement per frame; a scroll handler that reads
      // layout on every event is the classic way to make a long article janky.
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div
      className="no-print fixed start-0 top-0 z-40 h-0.5 w-full bg-transparent"
      aria-hidden="true"
    >
      <div
        className="h-full bg-[--color-copper-400] transition-[width] duration-75"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
