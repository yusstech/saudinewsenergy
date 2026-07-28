'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

export const THEME_KEY = 'sen_theme';

/**
 * Light ⇄ dark, as an explicit reader choice.
 *
 * The site does not follow `prefers-color-scheme`. A reader whose machine is set to dark for
 * their editor has said something about applications, not about the newspaper they just opened,
 * and a newsroom that answers by turning black reads as a terminal. Light is the default for
 * everyone; this is how someone asks for the other one.
 *
 * The choice is written to `<html data-theme>` and to `localStorage`. The inline script in the
 * layout replays it before first paint, so a returning reader never sees a flash of the theme
 * they didn't pick.
 */
export function ThemeToggle({ onDark = false }: { onDark?: boolean }) {
  const t = useTranslations('utility');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const current =
      document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
    setTheme(current);
    setReady(true);
  }, []);

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    // `light` is the default, so it is stored as the absence of the attribute.
    if (next === 'dark') document.documentElement.dataset.theme = 'dark';
    else delete document.documentElement.dataset.theme;
    try {
      window.localStorage.setItem(THEME_KEY, next);
    } catch {
      /* Storage blocked; the choice still applies for this page view. */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      // Until the effect has read the DOM, the label would be a guess. `aria-pressed`
      // is withheld rather than asserted wrongly.
      aria-pressed={ready ? theme === 'dark' : undefined}
      className={`rounded-sm p-2 ${
        onDark ? 'hover:bg-white/10' : 'hover:bg-surface-sunken'
      }`}
      title={t(theme === 'dark' ? 'themeLight' : 'themeDark')}
    >
      <span className="sr-only">
        {t(theme === 'dark' ? 'themeLight' : 'themeDark')}
      </span>
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-4" fill="currentColor" aria-hidden="true">
      <path d="M6.2 1.6a6.6 6.6 0 1 0 8.2 8.2 5.4 5.4 0 0 1-8.2-8.2Z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="3.1" />
      <path d="M8 1v1.6M8 13.4V15M15 8h-1.6M2.6 8H1M12.9 3.1l-1.1 1.1M4.2 11.8l-1.1 1.1M12.9 12.9l-1.1-1.1M4.2 4.2 3.1 3.1" />
    </svg>
  );
}
