import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { formatRelative, machineDate } from '@/lib/format';
import { sectorLabel } from '@content/taxonomy';
import type { Story } from '@content/schema';
import type { Locale } from '@/i18n/config';

/**
 * The Latest rail — what replaced the Energy Pulse tabs.
 *
 * The Pulse was six tabs (Latest / Markets / Projects / Most Read / GCC / Global) sitting in a
 * band of their own beneath the nav. Two problems: every tab duplicated a destination already in
 * the nav a few pixels above, and five of the six panels were hidden at any moment, so the
 * module cost a full horizontal band to show one list.
 *
 * A rail beside the lead story shows that same list permanently, costs no vertical band, and is
 * the pattern every newsroom converged on for a reason — a returning reader checking what has
 * moved since this morning wants a scannable column, not a tab bar.
 */
export async function LatestRail({
  stories,
  locale,
}: {
  stories: Story[];
  locale: Locale;
}) {
  const t = await getTranslations('pulse');
  const th = await getTranslations('home');
  if (!stories.length) return null;

  return (
    <section aria-labelledby="latest-rail">
      <div className="mb-3 flex items-baseline justify-between gap-3 border-b border-rule pb-2">
        <h2 id="latest-rail" className="label text-strong">
          {t('latest')}
        </h2>
        <Link
          href="/latest"
          className="text-micro font-semibold text-accent hover:underline underline-offset-4"
        >
          {th('viewAll')}
        </Link>
      </div>

      <ol className="divide-y divide-line">
        {stories.map((s) => (
          <li key={s.slug} className="py-2.5">
            <div className="flex items-baseline gap-2">
              <time
                dateTime={machineDate(s.publishedAt)}
                className="numeric shrink-0 text-micro text-faint"
              >
                {formatRelative(s.publishedAt, locale)}
              </time>
              <span className="label text-faint">
                {sectorLabel(s.sector, locale)}
              </span>
            </div>
            <p className="mt-0.5 text-[0.9375rem] font-medium leading-snug">
              <Link
                href={`/${s.isLive ? 'live' : 'article'}/${s.slug}`}
                className="hover:underline underline-offset-2 decoration-copper-400"
              >
                {s.cardHeadline ?? s.headline}
              </Link>
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
