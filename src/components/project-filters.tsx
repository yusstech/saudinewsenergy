'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { regionLabel, sectorLabel } from '@content/taxonomy';
import type { Region, Sector, ProjectStatus } from '@content/schema';
import type { Locale } from '@/i18n/config';

export interface FilterableCard {
  slug: string;
  region: Region;
  sector: Sector;
  status: ProjectStatus;
  node: ReactNode;
}

/**
 * Region, sector and status filters over a server-rendered project list.
 *
 * The cards arrive already rendered and this component only decides which are
 * shown, so the full list is present in the HTML regardless of JavaScript. That
 * matters more than it usually would here: these are the pages an answer engine
 * is most likely to read for structured project facts, and a feed that only
 * populates after hydration is a feed a crawler sees as empty.
 *
 * Filter options are derived from the data rather than from the full taxonomy,
 * so the interface never offers a region with nothing in it.
 */
export function ProjectFilters({
  cards,
  locale,
}: {
  cards: FilterableCard[];
  locale: Locale;
}) {
  const t = useTranslations('projects');

  const [region, setRegion] = useState<string>('all');
  const [sector, setSector] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');

  const options = useMemo(
    () => ({
      regions: [...new Set(cards.map((c) => c.region))],
      sectors: [...new Set(cards.map((c) => c.sector))],
      statuses: [...new Set(cards.map((c) => c.status))],
    }),
    [cards],
  );

  const visible = cards.filter(
    (c) =>
      (region === 'all' || c.region === region) &&
      (sector === 'all' || c.sector === sector) &&
      (status === 'all' || c.status === status),
  );

  const dirty = region !== 'all' || sector !== 'all' || status !== 'all';

  const select =
    'rounded-sm border border-line-strong bg-surface px-2.5 py-1.5 text-sm';

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="f-region" className="block text-xs font-semibold uppercase tracking-wider text-muted">
            {t('filterRegion')}
          </label>
          <select
            id="f-region"
            className={`mt-1 ${select}`}
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="all">{t('allRegions')}</option>
            {options.regions.map((r) => (
              <option key={r} value={r}>
                {regionLabel(r, locale)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="f-sector" className="block text-xs font-semibold uppercase tracking-wider text-muted">
            {t('filterSector')}
          </label>
          <select
            id="f-sector"
            className={`mt-1 ${select}`}
            value={sector}
            onChange={(e) => setSector(e.target.value)}
          >
            <option value="all">{t('allSectors')}</option>
            {options.sectors.map((s) => (
              <option key={s} value={s}>
                {sectorLabel(s, locale)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="f-status" className="block text-xs font-semibold uppercase tracking-wider text-muted">
            {t('filterStatus')}
          </label>
          <select
            id="f-status"
            className={`mt-1 ${select}`}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">{t('allStatuses')}</option>
            {options.statuses.map((s) => (
              <option key={s} value={s}>
                {t(`status.${s}`)}
              </option>
            ))}
          </select>
        </div>

        {dirty && (
          <button
            type="button"
            onClick={() => {
              setRegion('all');
              setSector('all');
              setStatus('all');
            }}
            className="rounded-sm px-2.5 py-1.5 text-sm font-medium text-brand-500 hover:bg-surface-sunken"
          >
            {t('clearFilters')}
          </button>
        )}

        <p className="ms-auto text-sm text-muted" aria-live="polite">
          {t('resultCount', { count: visible.length })}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.slug} hidden={!visible.includes(c)}>
            {c.node}
          </div>
        ))}
      </div>
    </>
  );
}
