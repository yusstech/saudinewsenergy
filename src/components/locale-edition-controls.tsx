'use client';

import { useState, useTransition } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import {
  LOCALES,
  LOCALE_LABEL,
  EDITIONS,
  EDITION_COOKIE,
  type Locale,
  type Edition,
} from '@/i18n/config';

/**
 * Language and edition, presented as two separate controls.
 *
 * Every instinct in a bilingual regional product pushes toward merging these
 * into one "Saudi Arabia — العربية" picker, and that merge is precisely what
 * makes such products unusable for the readers they most want. A Saudi
 * professional who prefers to read in English, and a researcher in London
 * following the Kingdom in Arabic, both become impossible the moment the two
 * axes share a control.
 *
 * So they are two menus with two explanations, and each explanation says what
 * the *other* control does not do. Switching language preserves the edition;
 * switching edition preserves the language.
 */
export function LocaleEditionControls({
  edition,
  onDark = false,
}: {
  edition: Edition;
  /** Rendered inside the charcoal masthead band, so hover and text invert. */
  onDark?: boolean;
}) {
  const t = useTranslations('utility');
  const te = useTranslations('edition');
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState<'lang' | 'edition' | null>(null);

  function chooseLocale(next: Locale) {
    setOpen(null);
    // Same path, different locale — the reader stays where they were reading.
    startTransition(() => router.replace(pathname, { locale: next }));
  }

  function chooseEdition(next: Edition) {
    setOpen(null);
    // Edition is a preference, not a route, so it lives in a cookie and
    // survives navigation without ever appearing in a canonical URL.
    document.cookie = `${EDITION_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    startTransition(() => router.refresh());
  }

  const button = `inline-flex items-center gap-1 rounded-sm px-2 py-1.5 text-meta font-medium ${
    onDark ? 'hover:bg-white/10' : 'hover:bg-surface-sunken'
  }`;

  return (
    <div className="flex items-center gap-1" data-pending={pending || undefined}>
      {/* -------------------------------------------------------- language */}
      <div className="relative">
        <button
          type="button"
          className={button}
          aria-expanded={open === 'lang'}
          aria-haspopup="menu"
          onClick={() => setOpen((o) => (o === 'lang' ? null : 'lang'))}
        >
          <span className="sr-only">{t('changeLanguage')}</span>
          <span lang={locale === 'ar' ? 'ar' : 'en'}>{LOCALE_LABEL[locale]}</span>
          <Chevron />
        </button>

        {open === 'lang' && (
          <Menu onClose={() => setOpen(null)} label={t('changeLanguage')}>
            <p className="px-3 pb-2 pt-1 text-[0.6875rem] leading-snug text-muted">
              {t('languageExplainer')}
            </p>
            {LOCALES.map((l) => (
              <button
                key={l}
                type="button"
                role="menuitemradio"
                aria-checked={l === locale}
                onClick={() => chooseLocale(l)}
                className="flex w-full items-center justify-between px-3 py-1.5 text-start text-sm hover:bg-surface-sunken"
              >
                <span lang={l === 'ar' ? 'ar' : 'en'}>{LOCALE_LABEL[l]}</span>
                {l === locale && <Check />}
              </button>
            ))}
          </Menu>
        )}
      </div>

      <span
        className={`hidden h-3 w-px sm:block ${onDark ? 'bg-white/15' : 'bg-line-strong'}`}
        aria-hidden="true"
      />

      {/* --------------------------------------------------------- edition */}
      <div className="relative">
        <button
          type="button"
          className={button}
          aria-expanded={open === 'edition'}
          aria-haspopup="menu"
          onClick={() => setOpen((o) => (o === 'edition' ? null : 'edition'))}
        >
          <span className="sr-only">{t('changeEdition')}</span>
          <span>{te(edition)}</span>
          <Chevron />
        </button>

        {open === 'edition' && (
          <Menu onClose={() => setOpen(null)} label={t('changeEdition')}>
            <p className="px-3 pb-2 pt-1 text-[0.6875rem] leading-snug text-muted">
              {t('editionExplainer')}
            </p>
            {EDITIONS.map((e) => (
              <button
                key={e}
                type="button"
                role="menuitemradio"
                aria-checked={e === edition}
                onClick={() => chooseEdition(e)}
                className="flex w-full items-center justify-between px-3 py-1.5 text-start text-sm hover:bg-surface-sunken"
              >
                <span>{te(e)}</span>
                {e === edition && <Check />}
              </button>
            ))}
          </Menu>
        )}
      </div>
    </div>
  );
}

function Menu({
  children,
  onClose,
  label,
}: {
  children: React.ReactNode;
  onClose: () => void;
  label: string;
}) {
  return (
    <>
      {/* Click-away. Sits behind the menu, not over it. */}
      <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden="true" />
      <div
        role="menu"
        aria-label={label}
        className="absolute start-0 top-full z-50 mt-1 min-w-[15rem] rounded-sm border border-line bg-surface py-1 shadow-lg"
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose();
        }}
      >
        {children}
      </div>
    </>
  );
}

function Chevron() {
  return (
    <svg viewBox="0 0 12 12" className="size-2.5 opacity-60" fill="currentColor" aria-hidden="true">
      <path d="M2 4.5 6 8.5l4-4H2Z" />
    </svg>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 12 12" className="size-3" fill="currentColor" aria-hidden="true">
      <path d="M10.3 2.6 4.5 8.4 1.7 5.6.6 6.7l3.9 3.9 6.9-6.9-1.1-1.1Z" />
    </svg>
  );
}
