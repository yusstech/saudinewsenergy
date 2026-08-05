import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { formatTime, machineDate } from '@/lib/format';
import { AlertBadge } from './status-badge';
import type { Story } from '@content/schema';
import type { Locale } from '@/i18n/config';

/**
 * The Live Energy Desk.
 *
 * Freshness comes from timestamps, not motion. The rail is deliberately static — with the
 * marquees gone from the chrome, the single pulsing dot beside the heading is now the only
 * moving thing on the page, which is exactly how much movement "live" needs.
 *
 * Times are absolute Damascus clock times rather than relative. A "4 min ago" rendered at build
 * time and then cached is a lie with a short half-life; an absolute stamp stays true however
 * long the page sits.
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
    .flatMap((story) => story.liveUpdates.map((update) => ({ story, update })))
    .sort((a, b) => Date.parse(b.update.time) - Date.parse(a.update.time))
    .slice(0, 6);

  return (
    <section aria-labelledby="live-desk">
      <div className="mb-3 flex items-center gap-2 border-b border-rule pb-2">
        <span
          className="live-dot inline-block size-1.5 rounded-full bg-live"
          aria-hidden="true"
        />
        <h2 id="live-desk" className="label text-strong">
          {t('liveDeskTitle')}
        </h2>
      </div>

      {entries.length === 0 ? (
        <p className="py-4 text-meta text-muted">{t('liveDeskEmpty')}</p>
      ) : (
        <ol className="divide-y divide-line">
          {entries.map(({ story, update }) => (
            <li key={`${story.slug}-${update.id}`} className="py-2.5">
              <div className="flex items-baseline gap-2">
                <time
                  dateTime={machineDate(update.time)}
                  className="numeric shrink-0 text-micro font-semibold text-live"
                >
                  {formatTime(update.time, locale)}
                </time>
                {update.state && <AlertBadge state={update.state} />}
              </div>
              <p className="mt-0.5 text-[0.9375rem] font-medium leading-snug">
                <Link
                  href={`/live/${story.slug}#${update.id}`}
                  className="hover:underline underline-offset-2 decoration-copper-400"
                >
                  {update.headline}
                </Link>
              </p>
            </li>
          ))}
        </ol>
      )}

      <p className="mt-2.5 border-t border-line pt-2 text-micro text-faint">
        {ta('damascusTime')}
      </p>
    </section>
  );
}
