import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { formatTime, machineDate } from '@/lib/format';
import { AlertBadge } from './status-badge';
import type { Story } from '@content/schema';
import type { Locale } from '@/i18n/config';

/**
 * The Live Energy Desk.
 *
 * Freshness here comes from timestamps, not from motion. The rail is
 * deliberately static while the ribbon above it moves — if both animated, a
 * reader would have two competing claims on their attention and no way to tell
 * which one carried the more important thing.
 *
 * Times are Riyadh clock times, absolute rather than relative, because a
 * "4 min ago" that was rendered at build time and then cached is a lie with a
 * short half-life. An absolute stamp stays true however long the page sits.
 */
export async function LiveDesk({
  stories,
  locale,
}: {
  stories: Story[];
  locale: Locale;
}) {
  const t = await getTranslations('home');
  const ta = await getTranslations('article');

  const entries = stories
    .flatMap((story) =>
      story.liveUpdates.map((update) => ({ story, update })),
    )
    .sort((a, b) => Date.parse(b.update.time) - Date.parse(a.update.time))
    .slice(0, 8);

  return (
    <aside className="rounded-sm border border-[--color-line] bg-[--color-surface]">
      <div className="flex items-center gap-2 border-b border-[--color-line] px-4 py-2.5">
        <span
          className="live-dot inline-block size-2 rounded-full bg-[--color-live]"
          aria-hidden="true"
        />
        <h2 className="text-sm font-bold uppercase tracking-wide">
          {t('liveDeskTitle')}
        </h2>
      </div>

      {entries.length === 0 ? (
        <p className="px-4 py-6 text-sm text-[--color-muted]">
          {t('liveDeskEmpty')}
        </p>
      ) : (
        <ol className="divide-y divide-[--color-line]">
          {entries.map(({ story, update }) => (
            <li key={`${story.slug}-${update.id}`} className="px-4 py-3">
              <div className="flex items-baseline gap-2">
                <time
                  dateTime={machineDate(update.time)}
                  className="numeric shrink-0 text-xs font-semibold text-[--color-live]"
                >
                  {formatTime(update.time, locale)}
                </time>
                {update.state && <AlertBadge state={update.state} />}
              </div>
              <p className="mt-1 text-sm font-medium leading-snug">
                <Link
                  href={`/live/${story.slug}#${update.id}`}
                  className="hover:underline underline-offset-2"
                >
                  {update.headline}
                </Link>
              </p>
            </li>
          ))}
        </ol>
      )}

      <p className="border-t border-[--color-line] px-4 py-2 text-[0.6875rem] text-[--color-faint]">
        {ta('riyadhTime')}
      </p>
    </aside>
  );
}
