import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LOCALES, type Locale } from '@/i18n/config';
import { getStory, getStories } from '@/lib/content';
import { storyMetadata, storyJsonLd, jsonLdScript, articleCanonical } from '@/lib/seo';
import { sectorLabel } from '@content/taxonomy';
import { COMPANY_MAP } from '@content/companies';
import { formatTime, formatDate, machineDate } from '@/lib/format';
import { ArticleHeader } from '@/components/article/article-header';
import { ArticleBody } from '@/components/article/mdx';
import { AlertBadge } from '@/components/status-badge';
import { Takeaways, Sources, Corrections } from '@/components/article/trust-blocks';

/**
 * Every valid slug is enumerated by generateStaticParams, so anything else is
 * genuinely not a page here. Without this, an unknown slug renders on demand,
 * hits `notFound()` and returns the 404 *body* with a 200 status — a soft 404
 * that search engines will happily index as a real page.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    getStories(locale)
      .filter((s) => s.isLive)
      .map((s) => ({ locale, slug: s.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const story = getStory(locale, slug);
  if (!story) return {};
  return storyMetadata(story);
}

/**
 * A live / developing story.
 *
 * Updates run newest first, each with its own anchor so a single entry can be
 * linked and quoted. The rail on the homepage links straight to those anchors,
 * which is why the ids come from the content rather than being generated.
 *
 * Market-reaction entries carry their own badge, kept visually distinct from
 * entries reporting a decision. During a live session the two arrive
 * interleaved, and a price move rendered in the same style as an announcement
 * is how a market reaction gets quoted onward as a fact.
 */
export default async function LiveArticlePage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const story = getStory(locale, slug);
  if (!story || !story.isLive) notFound();

  const t = await getTranslations('article');
  const section = sectorLabel(story.sector, locale);

  const about = story.companies
    .map((s) => COMPANY_MAP.get(s))
    .filter((c) => c !== undefined)
    .map((c) => ({ name: c.name.en, url: c.url }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(storyJsonLd(story, { about, sectionName: section })),
        }}
      />

      <article className="mx-auto max-w-[1440px] px-[var(--gutter)] py-6">
        <div className="mx-auto max-w-[68ch]">
          <ArticleHeader story={story} locale={locale} url={articleCanonical(story)} />
          <Takeaways items={story.takeaways} />
        </div>

        <div className="mx-auto mt-8 grid max-w-[1100px] gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
          {/* ------------------------------------------------ live updates */}
          <section>
            <div className="mb-4 flex items-center gap-2 border-b border-rule pb-2">
              <span
                className="live-dot inline-block size-2 rounded-full bg-live"
                aria-hidden="true"
              />
              <h2 className="text-lg font-bold uppercase tracking-wide">
                {t('liveUpdates')}
              </h2>
              <span className="ms-auto text-xs text-faint">
                {t('newestFirst')}
              </span>
            </div>

            <ol className="space-y-6">
              {story.liveUpdates.map((update) => (
                <li
                  key={update.id}
                  id={update.id}
                  className="scroll-mt-24 border-s-2 border-line ps-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <time
                      dateTime={machineDate(update.time)}
                      className="numeric text-sm font-bold text-live"
                    >
                      {formatTime(update.time, locale)}
                    </time>
                    <span className="text-xs text-faint">
                      {formatDate(update.time, locale)}
                    </span>
                    {update.state && <AlertBadge state={update.state} />}
                    <a
                      href={`#${update.id}`}
                      className="ms-auto text-xs text-faint hover:text-body"
                      aria-label={`Link to ${update.headline}`}
                    >
                      #
                    </a>
                  </div>
                  <h3 className="mt-1.5 text-lg font-bold leading-snug">
                    {update.headline}
                  </h3>
                  {update.body && (
                    <p className="mt-1.5 leading-relaxed text-muted">
                      {update.body}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </section>

          {/* -------------------------------------------------- standing copy */}
          <aside className="lg:border-s lg:border-line lg:ps-8">
            <div className="prose-article text-[0.9375rem]">
              <ArticleBody source={story.body} images={story.images} />
            </div>
            <Sources
              sources={story.sources}
              sourcingNote={story.sourcingNote}
              locale={locale}
            />
            <Corrections corrections={story.corrections} locale={locale} />
          </aside>
        </div>
      </article>
    </>
  );
}
