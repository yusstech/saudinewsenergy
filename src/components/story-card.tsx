import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { AlertBadge, TypeLabel } from './status-badge';
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
 * Headlines are set in the serif — that single change does more for how this reads as a
 * publication than any amount of border and shadow work. The cards themselves have *lost* their
 * borders: a grid of outlined boxes reads as a dashboard, while whitespace and a hairline read
 * as a page. Borders are kept only where a card is genuinely a discrete object you might act on,
 * which is the project record, not a story teaser.
 *
 * All four variants carry the same trust furniture — desk, alert state, timestamp, and the
 * prototype label where it applies. A card in a "Most read" rail is as likely to be a reader's
 * first contact with a story as the lead is, so dropping the labelling on the small variants
 * would put disclosure only where there happened to be room for it.
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
      <span className="label text-faint">
        {sectorLabel(story.sector, locale)}
      </span>
    </div>
  );

  const stamp = (
    <time
      dateTime={machineDate(story.updatedAt ?? story.publishedAt)}
      className="text-micro text-faint"
    >
      {formatRelative(story.updatedAt ?? story.publishedAt, locale)}
    </time>
  );

  const headlineLink = (extra: string) => (
    <Link
      href={href}
      className={`font-display text-strong decoration-copper-400 decoration-2 underline-offset-[6px] hover:underline ${extra}`}
    >
      {headline}
    </Link>
  );

  /* ------------------------------------------------------------------ lead */
  if (variant === 'lead') {
    /*
     * Words first, then the picture.
     *
     * An image-led hero pushed the headline to ~730px — below the fold on a laptop, so a reader
     * arriving at the front page saw a diagram and had to scroll to find out what the story
     * was. Leading with the headline puts it around 190px instead. It is also simply how a
     * broadsheet works: the headline is the story's claim on your attention, and the photograph
     * supports it rather than the other way round.
     */
    return (
      <article className={`group ${className}`}>
        <div className="space-y-4">
          {meta}
          <h2 className="text-display">{headlineLink('')}</h2>
          <p className="max-w-[46ch] text-[1.0625rem] leading-relaxed text-muted">
            {story.standfirst}
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-micro text-faint">
            <span className="font-medium text-muted">
              {story.authors.map((a) => a.name).join(', ')}
            </span>
            <Dot />
            {stamp}
            <Dot />
            <span>{t('readingTime', { minutes: readingMinutes(story.wordCount) })}</span>
          </div>
        </div>

        {hasImage && (
          <Link href={href} className="mt-5 block overflow-hidden bg-surface-sunken">
            <img
              src={story.hero!.src}
              alt={story.hero!.alt}
              // Intrinsic dimensions on every card image, not just article
              // figures. The CSS aspect ratio fixes the box once the stylesheet
              // has applied; these fix it in the HTML, which is what stops the
              // headline below jumping when the image arrives.
              width={story.hero!.width}
              height={story.hero!.height}
              className="aspect-[16/9] w-full object-cover transition-transform duration-700 group-hover:scale-[1.015]"
              loading="eager"
              fetchPriority="high"
            />
          </Link>
        )}
      </article>
    );
  }

  /* ------------------------------------------------------------------- row */
  if (variant === 'row') {
    return (
      <article className={`group flex gap-3 ${className}`}>
        {hasImage && (
          <Link href={href} className="shrink-0 overflow-hidden bg-surface-sunken">
            <img
              src={story.hero!.src}
              alt=""
              width={76}
              height={76}
              className="size-[76px] object-cover"
              loading="lazy"
            />
          </Link>
        )}
        <div className="min-w-0 space-y-1">
          {meta}
          <h3 className="text-title">{headlineLink('font-semibold')}</h3>
          {stamp}
        </div>
      </article>
    );
  }

  /* --------------------------------------------------------------- compact */
  if (variant === 'compact') {
    return (
      <article className={`group space-y-1.5 ${className}`}>
        {meta}
        <h3 className="text-title">{headlineLink('')}</h3>
        {stamp}
      </article>
    );
  }

  /* -------------------------------------------------------------- standard */
  return (
    <article className={`group space-y-3 ${className}`}>
      {hasImage && (
        <Link href={href} className="block overflow-hidden bg-surface-sunken">
          <img
            src={story.hero!.src}
            alt={story.hero!.alt}
            width={story.hero!.width}
            height={story.hero!.height}
            className="aspect-[16/9] w-full object-cover transition-transform duration-700 group-hover:scale-[1.015]"
            loading="lazy"
          />
        </Link>
      )}
      {meta}
      <h3 className="text-headline">{headlineLink('')}</h3>
      <p className="line-clamp-3 text-meta leading-relaxed text-muted">
        {story.standfirst}
      </p>
      {stamp}
    </article>
  );
}

function Dot() {
  return (
    <span aria-hidden="true" className="text-line-strong">
      ·
    </span>
  );
}
