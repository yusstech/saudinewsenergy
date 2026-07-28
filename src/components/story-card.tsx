import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { AlertBadge, TypeLabel, SampleBadge } from './status-badge';
import { formatRelative, machineDate, readingMinutes } from '@/lib/format';
import { sectorLabel } from '@content/taxonomy';
import type { Story } from '@content/schema';
import type { Locale } from '@/i18n/config';

export function storyHref(story: Story): string {
  return `/${story.isLive ? 'live' : 'article'}/${story.slug}`;
}

type Variant = 'lead' | 'standard' | 'compact' | 'row';

/**
 * One story, at four densities.
 *
 * All four carry the same trust furniture — desk, alert state, timestamp, and
 * the prototype label where it applies — because a card in a "Most read" rail
 * is as likely to be a reader's first contact with a story as the lead is.
 * Dropping the labelling on the small variants would put the disclosure only
 * where there was room for it, which is the wrong basis for that decision.
 */
export function StoryCard({
  story,
  locale,
  variant = 'standard',
  showImage = true,
  className = '',
}: {
  story: Story;
  locale: Locale;
  variant?: Variant;
  showImage?: boolean;
  className?: string;
}) {
  const t = useTranslations('article');
  const href = storyHref(story);

  const headline = story.cardHeadline ?? story.headline;
  const hasImage = showImage && story.hero;

  const meta = (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
      {story.alert && <AlertBadge state={story.alert} />}
      <TypeLabel type={story.type} />
      <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[--color-muted]">
        {sectorLabel(story.sector, locale)}
      </span>
      {story.isSampleContent && <SampleBadge />}
    </div>
  );

  const stamp = (
    <time
      dateTime={machineDate(story.updatedAt ?? story.publishedAt)}
      className="text-xs text-[--color-faint]"
    >
      {formatRelative(story.updatedAt ?? story.publishedAt, locale)}
    </time>
  );

  if (variant === 'lead') {
    return (
      <article className={`group ${className}`}>
        {hasImage && (
          <Link href={href} className="mb-4 block overflow-hidden rounded-sm bg-[--color-surface-sunken]">
            <img
              src={story.hero!.src}
              alt={story.hero!.alt}
              className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              loading="eager"
              fetchPriority="high"
            />
          </Link>
        )}
        <div className="space-y-3">
          {meta}
          <h2 className="text-2xl font-bold leading-[1.15] tracking-tight sm:text-3xl lg:text-[2.1rem]">
            <Link href={href} className="hover:underline decoration-2 underline-offset-4">
              {headline}
            </Link>
          </h2>
          <p className="max-w-[52ch] text-[--color-muted] leading-relaxed">
            {story.standfirst}
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[--color-faint]">
            <span>{story.authors.map((a) => a.name).join(', ')}</span>
            <span aria-hidden="true">·</span>
            {stamp}
            <span aria-hidden="true">·</span>
            <span>{t('readingTime', { minutes: readingMinutes(story.wordCount) })}</span>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'row') {
    return (
      <article className={`group flex gap-3 ${className}`}>
        {hasImage && (
          <Link
            href={href}
            className="shrink-0 overflow-hidden rounded-sm bg-[--color-surface-sunken]"
          >
            <img
              src={story.hero!.src}
              alt=""
              className="size-[72px] object-cover"
              loading="lazy"
            />
          </Link>
        )}
        <div className="min-w-0 space-y-1">
          {meta}
          <h3 className="text-sm font-semibold leading-snug">
            <Link href={href} className="hover:underline underline-offset-2">
              {headline}
            </Link>
          </h3>
          {stamp}
        </div>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className={`group space-y-1 ${className}`}>
        {meta}
        <h3 className="text-[0.9375rem] font-semibold leading-snug">
          <Link href={href} className="hover:underline underline-offset-2">
            {headline}
          </Link>
        </h3>
        {stamp}
      </article>
    );
  }

  return (
    <article className={`group space-y-2.5 ${className}`}>
      {hasImage && (
        <Link href={href} className="block overflow-hidden rounded-sm bg-[--color-surface-sunken]">
          <img
            src={story.hero!.src}
            alt={story.hero!.alt}
            className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            loading="lazy"
          />
        </Link>
      )}
      {meta}
      <h3 className="text-lg font-bold leading-tight tracking-tight">
        <Link href={href} className="hover:underline decoration-2 underline-offset-4">
          {headline}
        </Link>
      </h3>
      <p className="line-clamp-3 text-sm text-[--color-muted] leading-relaxed">
        {story.standfirst}
      </p>
      {stamp}
    </article>
  );
}
