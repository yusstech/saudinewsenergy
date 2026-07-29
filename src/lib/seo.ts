import 'server-only';
import type { Metadata } from 'next';
import { LOCALES, LOCALE_TAG, type Locale } from '@/i18n/config';
import { abs, siteUrl, SITE, siteName } from './site';
import { hasTranslation } from './content';
import type { Story, Project } from '@content/schema';

/**
 * Canonicals, hreflang and structured data.
 *
 * Two different problems live here and they need opposite answers.
 *
 * **Listing pages** — home, latest, a sector, an edition — genuinely differ per
 * locale. The navigation, labels and section headings are translated, so each
 * is a language variant of the same page. Those self-canonicalise and declare
 * each other with `hreflang`.
 *
 * **Articles do not, unless a translation actually exists.** A story written in
 * English and served under Arabic chrome at `/ar/article/x` is the same English
 * body inside a different shell. Declaring that as an `hreflang` alternate
 * would be a false claim — `hreflang` means "the same content, translated", and
 * nothing there is translated. They are duplicates, so both locales
 * canonicalise to the article's own language and the ranking signals
 * consolidate on one URL instead of splitting in two.
 *
 * The Arabic Al Jouf piece is published under the same slug as the English, so
 * that pair is a genuine alternate and this file declares it. Nothing was
 * configured to make that happen: `articleAlternates` asks `hasTranslation`
 * rather than assuming, so publishing the translation is what turned the bare
 * canonical into an hreflang pair.
 */

/* ------------------------------------------------------------- canonicals -- */

/**
 * `noindex, follow` for a listing page with nothing on it.
 *
 * The taxonomy describes what this publication intends to cover, which is
 * necessarily wider than what it has published. A desk page reading "nothing
 * here yet" is a real page for a reader who navigated to it and thin content
 * for a crawler that indexed it, and those want different answers: keep it
 * reachable and crawlable, keep it out of the index until it has coverage.
 *
 * `follow` is the load-bearing half. `noindex, nofollow` would strand the links
 * out of the page as well, which is the opposite of what an empty listing page
 * is for.
 */
export function coverageRobots(hasCoverage: boolean): Metadata['robots'] {
  return hasCoverage ? undefined : { index: false, follow: true };
}

/** Self-canonical plus every locale as an alternate. For listing pages. */
export function listingAlternates(
  locale: Locale,
  path: string,
): Metadata['alternates'] {
  const suffix = path === '/' ? '' : path;
  return {
    canonical: abs(`/${locale}${suffix}`),
    languages: {
      ...Object.fromEntries(
        LOCALES.map((l) => [LOCALE_TAG[l], abs(`/${l}${suffix}`)]),
      ),
      'x-default': abs(`/en${suffix}`),
    },
  };
}

/** The one canonical URL for a story, in the language it was written in. */
export function articleCanonical(story: Story): string {
  const segment = story.isLive ? 'live' : 'article';
  return abs(`/${story.locale}/${segment}/${story.slug}`);
}

/**
 * Alternates for a story.
 *
 * Only locales where a translation genuinely exists are declared. A story
 * published in one language gets a bare canonical and no `languages` map at
 * all, which is the honest signal: there is one version of this page.
 */
export function articleAlternates(story: Story): Metadata['alternates'] {
  const segment = story.isLive ? 'live' : 'article';
  const translated = LOCALES.filter(
    (l) => l === story.locale || hasTranslation(story.slug, l),
  );

  if (translated.length < 2) {
    return { canonical: articleCanonical(story) };
  }

  return {
    canonical: articleCanonical(story),
    languages: {
      ...Object.fromEntries(
        translated.map((l) => [
          LOCALE_TAG[l],
          abs(`/${l}/${segment}/${story.slug}`),
        ]),
      ),
      'x-default': abs(`/en/${segment}/${story.slug}`),
    },
  };
}

/* -------------------------------------------------------------- metadata -- */

export function baseMetadata(locale: Locale, path: string): Metadata {
  const name = siteName(locale);
  return {
    metadataBase: new URL(siteUrl()),
    alternates: listingAlternates(locale, path),
    openGraph: {
      siteName: name,
      locale: LOCALE_TAG[locale],
      type: 'website',
      url: abs(`/${locale}${path === '/' ? '' : path}`),
    },
    twitter: { card: 'summary_large_image' },
  };
}

export function storyMetadata(story: Story): Metadata {
  const url = articleCanonical(story);
  const description = story.seoDescription ?? story.standfirst;
  const image = story.hero ? absoluteMedia(story.hero.src) : undefined;

  return {
    metadataBase: new URL(siteUrl()),
    title: story.headline,
    description,
    alternates: articleAlternates(story),
    openGraph: {
      type: 'article',
      title: story.headline,
      description,
      url,
      siteName: siteName(story.locale),
      locale: LOCALE_TAG[story.locale],
      publishedTime: story.publishedAt,
      modifiedTime: story.updatedAt ?? story.publishedAt,
      authors: story.authors.map((a) => a.name),
      ...(image ? { images: [image] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: story.headline,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

/**
 * Media paths in structured data must be absolute.
 *
 * Local assets yield site-relative paths ("/media/…"). Structured data is
 * consumed away from the page, where a relative URL resolves against whatever
 * host is reading it — or not at all.
 */
function absoluteMedia(src: string): string {
  return src.startsWith('/') ? abs(src) : src;
}

/* ------------------------------------------------------------- structured -- */

/**
 * `Organization` and `WebSite`, emitted once in the root layout.
 *
 * Both carry a stable `@id` so every per-article `publisher` can reference this
 * node instead of restating it. That is what lets a consumer resolve every
 * story on the site to one publisher entity rather than to N copies of a name.
 */
export function siteJsonLd(locale: Locale) {
  const base = siteUrl();
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'NewsMediaOrganization'],
        '@id': `${base}/#organization`,
        name: SITE.name,
        alternateName: SITE.nameAr,
        url: base,
        description: SITE.promise[locale],
        knowsLanguage: ['en', 'ar'],
        // Consumers that build a publisher entity want a mark to attach to it.
        // This is the masthead favicon, which is the only logo that exists;
        // swap it for a raster lockup when there is one.
        logo: {
          '@type': 'ImageObject',
          url: abs('/icon.svg'),
        },
        correctionsPolicy: abs(`/${locale}/corrections`),
      },
      {
        '@type': 'WebSite',
        '@id': `${base}/#website`,
        name: siteName(locale),
        url: abs(`/${locale}`),
        publisher: { '@id': `${base}/#organization` },
        inLanguage: LOCALE_TAG[locale],
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: abs(`/${locale}/search?q={search_term_string}`),
          },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };
}

export interface EntityRef {
  name: string;
  url?: string;
}

/**
 * Reads the organisations a story cites out of the story itself.
 *
 * Answer engines lean on `mentions` to decide what a page is *about* rather
 * than inferring it from prose — but populating it normally means a per-story
 * entity field, an editor UI for it, and a writer who remembers to fill it in.
 *
 * The story already contains the answer. When a writer links the words
 * "Saudi Electricity Company" to `se.com.sa`, that anchor text *is* the entity
 * name and the href *is* its canonical identifier; that is what an editorial
 * link means. So the markup is derived from the body rather than duplicated
 * beside it, and it cannot drift from what the page actually says.
 *
 * External links only: an internal link points at this site, which is already
 * the publisher.
 */
export function entitiesFromBody(body: string): EntityRef[] {
  const found = new Map<string, EntityRef>();
  const linkPattern = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;

  for (const match of body.matchAll(linkPattern)) {
    const [, text, href] = match;
    if (!text || !href) continue;
    if (href.startsWith(siteUrl())) continue;
    // First mention wins: the first time a writer links an entity is where
    // they introduce it by its full name.
    if (!found.has(href)) found.set(href, { name: text.trim(), url: href });
  }

  return [...found.values()];
}

const org = (e: EntityRef) => ({
  '@type': 'Organization',
  name: e.name,
  ...(e.url ? { url: e.url } : {}),
});

/**
 * `NewsArticle` + `BreadcrumbList` for one story, plus `FAQPage` when the story
 * carries extractable question/answer pairs.
 *
 * `about` and `mentions` are the levers that matter for answer engines: they
 * state, in machine-readable form, which organisations this page is *about*
 * rather than leaving a retrieval model to infer it from prose.
 */
export function storyJsonLd(
  story: Story,
  opts: { about?: EntityRef[]; sectionName?: string } = {},
) {
  const base = siteUrl();
  const url = articleCanonical(story);
  const mentions = entitiesFromBody(story.body);
  const hero = story.hero ? absoluteMedia(story.hero.src) : undefined;

  const graph: Record<string, unknown>[] = [
    {
      // NewsArticle rather than Article: this is a newsroom, and the more
      // specific type is what news surfaces look for.
      '@type': story.isLive ? 'LiveBlogPosting' : 'NewsArticle',
      '@id': `${url}#article`,
      headline: story.headline,
      description: story.seoDescription ?? story.standfirst,
      datePublished: story.publishedAt,
      dateModified: story.updatedAt ?? story.publishedAt,
      inLanguage: LOCALE_TAG[story.locale],
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      url,
      ...(hero ? { image: [hero] } : {}),
      ...(opts.sectionName ? { articleSection: opts.sectionName } : {}),
      ...(story.topics.length ? { keywords: story.topics.join(', ') } : {}),
      wordCount: story.wordCount,
      // A byline is a person, even when the account behind it is a desk —
      // except when it genuinely is a desk. Typing a desk as a Person would
      // claim an individual author who does not exist; typing a named
      // journalist as an Organization would collapse the author into the
      // publisher, which is the opposite of the distinction an E-E-A-T
      // assessment is looking for.
      author: story.authors.map((a) =>
        a.id.startsWith('desk-')
          ? { '@type': 'Organization', name: a.name, '@id': `${base}/#organization` }
          : { '@type': 'Person', name: a.name, ...(a.role ? { jobTitle: a.role } : {}) },
      ),
      publisher: { '@id': `${base}/#organization` },
      isAccessibleForFree: true,
      ...(opts.about?.length ? { about: opts.about.map(org) } : {}),
      ...(mentions.length ? { mentions: mentions.map(org) } : {}),
      ...(story.isLive && story.liveUpdates.length
        ? {
            liveBlogUpdate: story.liveUpdates.map((u) => ({
              '@type': 'BlogPosting',
              '@id': `${url}#${u.id}`,
              headline: u.headline,
              datePublished: u.time,
              ...(u.body ? { articleBody: u.body } : {}),
            })),
          }
        : {}),
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumbs`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: siteName(story.locale),
          item: abs(`/${story.locale}`),
        },
        ...(opts.sectionName
          ? [
              {
                '@type': 'ListItem',
                position: 2,
                name: opts.sectionName,
                item: abs(`/${story.locale}/sector/${story.sector}`),
              },
            ]
          : []),
        {
          '@type': 'ListItem',
          position: opts.sectionName ? 3 : 2,
          name: story.headline,
          item: url,
        },
      ],
    },
  ];

  // The FAQ block is the most citable thing on the page — self-contained
  // question/answer pairs are what answer engines lift. Emitting it as
  // structured data as well as prose is what makes that lift unambiguous.
  if (story.faq.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      inLanguage: LOCALE_TAG[story.locale],
      mainEntity: story.faq.map((f, i) => ({
        '@type': 'Question',
        '@id': `${url}#faq-${i + 1}`,
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

/**
 * A project as a structured record.
 *
 * schema.org has no good type for "an EPC infrastructure project", so this uses
 * `CreativeWork` with explicit `additionalProperty` entries rather than
 * stretching a type that does not fit. Each property carries its unit, because
 * a `PropertyValue` with a bare number is exactly the ambiguity the content
 * schema exists to prevent.
 */
export function projectJsonLd(project: Project, locale: Locale) {
  const url = abs(`/${locale}/projects#${project.slug}`);
  const props: Record<string, unknown>[] = [];

  const measure = (name: string, m?: { value: number; unit: string }) => {
    if (!m) return;
    props.push({
      '@type': 'PropertyValue',
      name,
      value: m.value,
      unitText: m.unit,
    });
  };

  measure('Route length', project.length);
  measure('Structures', project.structures);
  measure('Capacity', project.capacity);

  if (project.value) {
    props.push({
      '@type': 'PropertyValue',
      name: 'Contract value',
      value: project.value.value,
      unitText: project.value.currency,
    });
  }

  props.push({
    '@type': 'PropertyValue',
    name: 'Status',
    value: project.status,
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${url}#project`,
    name: project.name[locale],
    description: project.summary[locale],
    url,
    inLanguage: LOCALE_TAG[locale],
    ...(project.announcedDate ? { dateCreated: project.announcedDate } : {}),
    ...(project.completedDate ? { datePublished: project.completedDate } : {}),
    contentLocation: {
      '@type': 'Place',
      name: project.location[locale],
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'SA',
        addressRegion: project.region,
      },
    },
    additionalProperty: props,
    publisher: { '@id': `${siteUrl()}/#organization` },
  };
}

/** Renders a JSON-LD block. Kept in one place so escaping is handled once. */
export function jsonLdScript(data: unknown): string {
  // `<` is escaped so a value containing "</script>" cannot break out of the
  // block. JSON-LD consumers unescape < transparently.
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
