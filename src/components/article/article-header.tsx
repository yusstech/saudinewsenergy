import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { AlertBadge, TypeLabel, SampleBadge } from '../status-badge';
import { ArticleToolbar } from './article-toolbar';
import { TranslationStatus } from './trust-blocks';
import { LocalTime } from './local-time';
import { formatDateTime, machineDate, readingMinutes } from '@/lib/format';
import { sectorLabel } from '@content/taxonomy';
import type { Story } from '@content/schema';
import type { Locale } from '@/i18n/config';

/**
 * The article masthead: labels, headline, standfirst, byline, timestamps.
 *
 * Both timestamps are shown when a story has been updated, not just the newer
 * one. On a developing story the gap between publication and last update is
 * itself information — it tells a reader whether they are looking at something
 * that has been revised since they last saw it.
 */
export async function ArticleHeader({
  story,
  locale,
  url,
}: {
  story: Story;
  locale: Locale;
  url: string;
}) {
  const t = await getTranslations('article');

  return (
    <header className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {story.alert && <AlertBadge state={story.alert} />}
        <Link
          href={`/sector/${story.sector}`}
          className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[--color-brand-500] hover:underline underline-offset-4"
        >
          {sectorLabel(story.sector, locale)}
        </Link>
        <TypeLabel type={story.type} />
        {story.isSampleContent && <SampleBadge />}
      </div>

      <h1 className="text-3xl font-bold leading-[1.12] tracking-tight sm:text-4xl lg:text-[2.75rem]">
        {story.headline}
      </h1>

      <p className="text-lg leading-relaxed text-[--color-muted]">
        {story.standfirst}
      </p>

      {story.isSampleContent && (
        <p className="rounded-sm border border-[--color-copper-400] bg-[--color-surface] px-3 py-2 text-sm text-[--color-copper-500] dark:text-[--color-copper-300]">
          {/*
            Stated in full on the article, not just as a chip. A reader who
            reaches the body of a story deserves an unambiguous sentence, not a
            badge they have to interpret.
          */}
          This is prototype content written to populate the interface. It is not
          reported coverage and should not be cited.
        </p>
      )}

      <div className="space-y-1 text-sm">
        <p className="font-medium">
          {t('byline', { author: story.authors.map((a) => a.name).join(', ') })}
        </p>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-[--color-faint]">
          <span>
            {t('publishedAt')}{' '}
            <time dateTime={machineDate(story.publishedAt)} className="numeric">
              {formatDateTime(story.publishedAt, locale)}
            </time>{' '}
            <span className="uppercase tracking-wider">{t('riyadhTime')}</span>
          </span>

          {story.updatedAt && story.updatedAt !== story.publishedAt && (
            <>
              <span aria-hidden="true">·</span>
              <span className="font-medium text-[--color-muted]">
                {t('updatedAt')}{' '}
                <time dateTime={machineDate(story.updatedAt)} className="numeric">
                  {formatDateTime(story.updatedAt, locale)}
                </time>
              </span>
            </>
          )}

          <span aria-hidden="true">·</span>
          <span>{t('readingTime', { minutes: readingMinutes(story.wordCount) })}</span>
        </div>

        {/* Reader-local time renders only when it actually differs from
            Riyadh — an identical second line is noise. */}
        <LocalTime
          iso={story.updatedAt ?? story.publishedAt}
          label={t('readerLocalTime')}
        />

        <TranslationStatus translation={story.translation} locale={locale} />
      </div>

      <ArticleToolbar slug={story.slug} url={url} />
    </header>
  );
}
