import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { formatTime, machineDate } from '@/lib/format';
import type { AlertState } from '@content/schema';
import type { Locale } from '@/i18n/config';

export interface RibbonItem {
  slug: string;
  href: string;
  headline: string;
  state: AlertState;
  time: string;
}

/**
 * The breaking alert.
 *
 * Two changes from what this was, both of them the point:
 *
 * **It is conditional.** Previously it rendered on every page whatever the news, which made it
 * furniture. An alert that is always on is not an alert — a reader learns within a day that the
 * red bar means nothing and stops seeing it. It now appears only for `breaking` and
 * `developing`, the two states that describe a material event still in motion. Live coverage,
 * market moves and project updates have their own surfaces and do not belong in an alert.
 *
 * **It is static.** It used to be a marquee, stacked above a second marquee. Moving text you
 * cannot finish reading is worse than static text, so the top item simply sits there, at a size
 * you can actually read, with the rest reachable behind a count. No animation means no pause
 * control to get wrong and nothing for `prefers-reduced-motion` to suppress.
 */
export async function BreakingRibbon({
  items,
  locale,
}: {
  items: RibbonItem[];
  locale: Locale;
}) {
  const alerts = items.filter(
    (i) => i.state === 'breaking' || i.state === 'developing',
  );
  if (!alerts.length) return null;

  const t = await getTranslations('status');
  const [lead, ...rest] = alerts;
  if (!lead) return null;

  const breaking = lead.state === 'breaking';

  return (
    <aside
      aria-label={t(breaking ? 'breaking' : 'developing')}
      className={`border-b ${
        breaking
          ? 'border-breaking bg-breaking-soft'
          : 'border-developing bg-developing-soft'
      }`}
    >
      <div className="page flex items-baseline gap-3 py-2.5">
        <span
          className={`label shrink-0 ${
            breaking ? 'text-breaking' : 'text-developing'
          }`}
        >
          {t(breaking ? 'breaking' : 'developing')}
        </span>

        <p className="min-w-0 flex-1 text-title font-medium leading-snug">
          <Link href={lead.href} className="hover:underline underline-offset-4">
            {lead.headline}
          </Link>
        </p>

        <time
          dateTime={machineDate(lead.time)}
          className="numeric hidden shrink-0 text-micro text-muted sm:block"
        >
          {formatTime(lead.time, locale)}
        </time>

        {rest.length > 0 && (
          <Link
            href="/latest"
            className="hidden shrink-0 text-micro font-semibold text-muted hover:text-body sm:block"
          >
            +{rest.length}
          </Link>
        )}
      </div>
    </aside>
  );
}
