import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { LOCALES, type Locale } from '@/i18n/config';
import { getStory, getStories, getRelated } from '@/lib/content';
import { storyMetadata, storyJsonLd, jsonLdScript, articleCanonical } from '@/lib/seo';
import { sectorLabel, regionLabel } from '@content/taxonomy';
import { COMPANY_MAP } from '@content/companies';
import { PROJECT_MAP } from '@content/projects';
import { ArticleHeader } from '@/components/article/article-header';
import { ArticleBody } from '@/components/article/mdx';
import { Figure } from '@/components/article/figure';
import {
  Takeaways,
  ContextPanel,
  FaqBlock,
  Sources,
  Corrections,
} from '@/components/article/trust-blocks';
import { ReadingProgress } from '@/components/article/article-toolbar';
import { StoryCard } from '@/components/story-card';

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
      .filter((s) => !s.isLive)
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

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const story = getStory(locale, slug);
  if (!story || story.isLive) notFound();

  const t = await getTranslations('article');
  const th = await getTranslations('home');

  const related = getRelated(locale, story, 3);
  const section = sectorLabel(story.sector, locale);

  const about = [
    ...story.companies
      .map((s) => COMPANY_MAP.get(s))
      .filter((c) => c !== undefined)
      .map((c) => ({ name: c.name.en, url: c.url })),
  ];

  return (
    <>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(storyJsonLd(story, { about, sectionName: section })),
        }}
      />

      <article className="mx-auto max-w-[1440px] px-[var(--gutter)] py-6">
        <div className="mx-auto max-w-[68ch]">
          <ArticleHeader story={story} locale={locale} url={articleCanonical(story)} />
        </div>

        {story.hero && (
          <div className="mx-auto my-6 max-w-[min(100%,1100px)]">
            <Figure asset={story.hero} priority />
          </div>
        )}

        <div className="mx-auto max-w-[68ch]">
          <Takeaways items={story.takeaways} />

          <ArticleBody source={story.body} images={story.images} />

          {story.context && (
            <ContextPanel
              context={story.context}
              sources={story.sources}
              locale={locale}
            />
          )}

          <FaqBlock items={story.faq} />

          <Sources
            sources={story.sources}
            sourcingNote={story.sourcingNote}
            locale={locale}
          />

          <Corrections corrections={story.corrections} locale={locale} />

          {/* ------------------------------------------------- entity links */}
          {(story.companies.length > 0 || story.projects.length > 0) && (
            <section className="my-8 border-t border-line pt-5">
              {story.companies.length > 0 && (
                <>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-muted">
                    {t('relatedCompanies')}
                  </h2>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {story.companies.map((s) => {
                      const c = COMPANY_MAP.get(s);
                      if (!c) return null;
                      return (
                        <li key={s}>
                          <Link
                            href={`/company/${s}`}
                            className="inline-block rounded-sm border border-line px-2.5 py-1 text-sm hover:border-line-strong"
                          >
                            {c.name[locale]}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}

              {story.projects.length > 0 && (
                <>
                  <h2 className="mt-4 text-xs font-bold uppercase tracking-wider text-muted">
                    {t('relatedProjects')}
                  </h2>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {story.projects.map((s) => {
                      const p = PROJECT_MAP.get(s);
                      if (!p) return null;
                      return (
                        <li key={s}>
                          <Link
                            href={`/projects#${s}`}
                            className="inline-block rounded-sm border border-line px-2.5 py-1 text-sm hover:border-line-strong"
                          >
                            {p.name[locale]}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}

              <p className="mt-4 text-xs text-faint">
                {sectorLabel(story.sector, locale)} ·{' '}
                {regionLabel(story.region, locale)}
              </p>
            </section>
          )}
        </div>

        {/* ---------------------------------------------------- related */}
        {related.length > 0 && (
          <section className="mt-12 border-t-2 border-body pt-5">
            <h2 className="mb-4 text-lg font-bold uppercase tracking-wide">
              {t('relatedStories')}
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {related.map((s) => (
                <StoryCard key={s.slug} story={s} locale={locale} />
              ))}
            </div>
          </section>
        )}

        <p className="sr-only">{th('leadTitle')}</p>
      </article>
    </>
  );
}
