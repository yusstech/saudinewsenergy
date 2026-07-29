'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { SECTORS } from '@content/taxonomy';
import { LocaleEditionControls } from './locale-edition-controls';
import type { Locale } from '@/i18n/config';

/**
 * The mobile menu, and the bottom bar that opens it.
 *
 * The bar is `md:hidden` and the desktop nav is the reverse, so exactly one
 * navigation surface exists at any width. Body scroll is locked while the sheet
 * is open — without it, a touch reader scrolling the page behind an open sheet
 * loses their position in the article they were reading.
 */
export function MobileMenu() {
  const t = useTranslations('nav');
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Any navigation closes the sheet. Without this, tapping a link inside it
  // leaves the overlay covering the page the reader just asked for.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        className="rounded-sm p-2 hover:bg-surface-sunken md:hidden"
      >
        <span className="sr-only">{t('openMenu')}</span>
        <svg viewBox="0 0 16 16" className="size-5" fill="currentColor" aria-hidden="true">
          <path d="M1.5 3.5h13v1.6h-13V3.5Zm0 3.7h13v1.6h-13V7.2Zm0 3.7h13v1.6h-13v-1.6Z" />
        </svg>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t('menu')}
          className="fixed inset-0 z-50 flex flex-col bg-surface md:hidden"
        >
          <div className="flex items-center justify-between border-b border-line px-[var(--gutter)] py-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider">
              {t('sections')}
            </h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-sm p-2 hover:bg-surface-sunken"
            >
              <span className="sr-only">{t('close')}</span>
              <svg viewBox="0 0 16 16" className="size-5" fill="currentColor" aria-hidden="true">
                <path d="m8 6.9 4.5-4.5 1.1 1.1L9.1 8l4.5 4.5-1.1 1.1L8 9.1l-4.5 4.5-1.1-1.1L6.9 8 2.4 3.5l1.1-1.1L8 6.9Z" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-[var(--gutter)] py-4">
            <ul className="space-y-0.5">
              <li>
                <Link href="/latest" className="block rounded-sm py-2.5 text-base font-semibold">
                  {t('latest')}
                </Link>
              </li>
              {SECTORS.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/sector/${s.slug}`}
                    className="block rounded-sm py-2.5 text-base font-semibold"
                  >
                    {s.label[locale]}
                  </Link>
                </li>
              ))}
              <li className="pt-3">
                <Link href="/projects" className="block rounded-sm py-2.5 text-base font-semibold">
                  {t('projects')}
                </Link>
              </li>
              <li>
                <Link href="/saved" className="block rounded-sm py-2.5 text-base font-semibold">
                  {t('saved')}
                </Link>
              </li>
              <li>
                <Link href="/search" className="block rounded-sm py-2.5 text-base font-semibold">
                  {t('search')}
                </Link>
              </li>
            </ul>

            {/* The masthead hides these below `md`; they live here instead so a phone
                reader can still change language or edition. */}
            <div className="rule-hair mt-4 pt-4">
              <LocaleEditionControls />
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

/** The persistent bottom navigation on small screens. */
export function MobileBottomNav() {
  const t = useTranslations('nav');

  const items = [
    { href: '/', label: t('home'), icon: HomeIcon },
    { href: '/latest', label: t('latest'), icon: LatestIcon },
    { href: '/projects', label: t('projects'), icon: ProjectsIcon },
    { href: '/saved', label: t('saved'), icon: SavedIcon },
    { href: '/search', label: t('search'), icon: SearchIcon },
  ] as const;

  return (
    <nav
      aria-label={t('primary')}
      className="no-print sticky bottom-0 z-30 border-t border-line bg-surface md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="mx-auto flex max-w-[1440px]">
        {items.map(({ href, label, icon: Icon }) => (
          <li key={href} className="flex-1">
            <Link
              href={href}
              className="flex flex-col items-center gap-0.5 py-2 text-[0.625rem] font-medium text-muted hover:text-body"
            >
              <Icon />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

const icon = 'size-5';

function HomeIcon() {
  return (
    <svg viewBox="0 0 20 20" className={icon} fill="currentColor" aria-hidden="true">
      <path d="M10 2.5 2.5 8.4V17h5v-4.6h5V17h5V8.4L10 2.5Z" />
    </svg>
  );
}
function LatestIcon() {
  return (
    <svg viewBox="0 0 20 20" className={icon} fill="currentColor" aria-hidden="true">
      <path d="M3 4h14v2H3V4Zm0 5h14v2H3V9Zm0 5h9v2H3v-2Z" />
    </svg>
  );
}
// A map pin, not the old trend line: this slot points at the project tracker, which is
// a map of built things, not a price series.
function ProjectsIcon() {
  return (
    <svg viewBox="0 0 20 20" className={icon} fill="currentColor" aria-hidden="true">
      <path d="M10 1.5a5.5 5.5 0 0 0-5.5 5.5c0 4 5.5 11 5.5 11s5.5-7 5.5-11A5.5 5.5 0 0 0 10 1.5Zm0 7.6A2.1 2.1 0 1 1 10 4.9a2.1 2.1 0 0 1 0 4.2Z" />
    </svg>
  );
}
function SavedIcon() {
  return (
    <svg viewBox="0 0 20 20" className={icon} fill="currentColor" aria-hidden="true">
      <path d="M5 2.5h10v15l-5-3.7-5 3.7v-15Z" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg viewBox="0 0 20 20" className={icon} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="8.75" cy="8.75" r="5.25" />
      <path d="m13 13 4.5 4.5" strokeLinecap="round" />
    </svg>
  );
}
