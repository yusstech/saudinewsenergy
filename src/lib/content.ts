import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import {
  storyFrontmatterSchema,
  type Story,
  type ContentLocale,
  type Sector,
  type ContentEdition,
} from '@content/schema';
import { PROJECTS, PROJECT_MAP } from '@content/projects';
import { COMPANIES, COMPANY_MAP } from '@content/companies';

const CONTENT_ROOT = path.join(process.cwd(), 'content');

/**
 * Reads stories off disk and validates them against the content contract.
 *
 * Validation is deliberately fatal. A story whose frontmatter does not satisfy
 * `storyFrontmatterSchema` throws during the build rather than rendering a card
 * with a missing sector or an unparseable date — a broken build is a five-minute
 * problem, and a story that silently published without its sourcing note is a
 * correction.
 */

function readStoriesFor(locale: ContentLocale): Story[] {
  const dir = path.join(CONTENT_ROOT, locale, 'articles');
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), 'utf8');
      const { data, content } = matter(raw);

      const parsed = storyFrontmatterSchema.safeParse(data);
      if (!parsed.success) {
        throw new Error(
          `Invalid frontmatter in content/${locale}/articles/${file}:\n` +
            parsed.error.issues
              .map((i) => `  • ${i.path.join('.') || '(root)'}: ${i.message}`)
              .join('\n'),
        );
      }

      // The filename and the slug must agree, or a URL will resolve to a story
      // whose canonical points somewhere else.
      const expected = `${parsed.data.slug}.mdx`;
      if (file !== expected) {
        throw new Error(
          `content/${locale}/articles/${file} declares slug "${parsed.data.slug}"; ` +
            `rename the file to ${expected} or fix the slug.`,
        );
      }

      const plain = toPlainText(content);

      return {
        ...parsed.data,
        body: content,
        plain,
        wordCount: plain.split(/\s+/).filter(Boolean).length,
      };
    });
}

/**
 * Strips MDX to prose.
 *
 * Used for word counts and search indexing. Headings keep
 * their text because they carry meaning; syntax, code fences and JSX component
 * calls do not and would only add noise to a retrieval match.
 */
function toPlainText(mdx: string): string {
  return mdx
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+\/>/g, ' ')
    .replace(/<\/?[A-Za-z][^>]*>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_`>]/g, '')
    .replace(/^\s*[-–]\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/* ------------------------------------------------------------------ cache -- */

let cache: Partial<Record<ContentLocale, Story[]>> = {};

function all(locale: ContentLocale): Story[] {
  if (!cache[locale]) {
    cache[locale] = readStoriesFor(locale).sort(
      (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
    );
  }
  return cache[locale]!;
}

/** Test/dev hook — the module-level cache would otherwise outlive an edit. */
export function clearContentCache(): void {
  cache = {};
}

/* ---------------------------------------------------------------- queries -- */

export function getStories(locale: ContentLocale): Story[] {
  return all(locale);
}

export function getStory(
  locale: ContentLocale,
  slug: string,
): Story | undefined {
  return all(locale).find((s) => s.slug === slug);
}

/**
 * Whether a translation of this story exists in the other locale.
 *
 * This is the fact `lib/seo.ts` needs to decide between declaring an `hreflang`
 * alternate and consolidating on one canonical: an alternate may only be
 * declared when the translated page genuinely exists.
 */
export function hasTranslation(
  slug: string,
  locale: ContentLocale,
): boolean {
  return all(locale).some((s) => s.slug === slug);
}

export function getLiveStories(locale: ContentLocale): Story[] {
  return all(locale).filter((s) => s.isLive);
}

/**
 * Stories eligible for the breaking/developing ribbon.
 *
 * Restricted to material events and capped at six. A ribbon carrying a dozen
 * headlines is a ticker, and a ticker is what "controlled urgency" is meant to
 * avoid — every entry in it stops meaning anything in particular.
 */
export function getAlertStories(locale: ContentLocale): Story[] {
  return all(locale)
    .filter((s) => s.alert !== undefined)
    .slice(0, 6);
}

export function getStoriesBySector(
  locale: ContentLocale,
  sector: Sector,
): Story[] {
  return all(locale).filter(
    (s) => s.sector === sector || s.secondarySectors.includes(sector),
  );
}

export function getStoriesByCompany(
  locale: ContentLocale,
  slug: string,
): Story[] {
  return all(locale).filter((s) => s.companies.includes(slug));
}

export function getStoriesByProject(
  locale: ContentLocale,
  slug: string,
): Story[] {
  return all(locale).filter((s) => s.projects.includes(slug));
}

/**
 * Stories for an edition.
 *
 * Syrian coverage surfaces in every edition — that is the editorial centre
 * holding regardless of which supporting region a reader picked. What the
 * edition changes is which *additional* regional coverage joins it.
 */
export function getStoriesByEdition(
  locale: ContentLocale,
  edition: ContentEdition,
): Story[] {
  if (edition === 'syria') {
    return all(locale).filter((s) => s.editions.includes('syria'));
  }
  return all(locale).filter(
    (s) => s.editions.includes(edition) || s.editions.includes('syria'),
  );
}

export function getFeatured(locale: ContentLocale): Story[] {
  return all(locale)
    .filter((s) => s.featured)
    .sort((a, b) => b.weight - a.weight);
}

/**
 * "Most read" without an analytics backend.
 *
 * There is no page-view data, so this cannot be a popularity ranking and is not
 * presented as one — the module is labelled *Most read* in the design but ranked
 * here by recency and editorial weight. When analytics land, only this function
 * changes. Inventing view counts to fill the module would be the same category
 * of mistake as inventing a market price.
 */
export function getMostRead(locale: ContentLocale, limit = 5): Story[] {
  return [...all(locale)]
    .sort(
      (a, b) =>
        b.weight - a.weight ||
        Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
    )
    .slice(0, limit);
}

/** Related coverage: same sector or a shared entity, never the story itself. */
export function getRelated(
  locale: ContentLocale,
  story: Story,
  limit = 3,
): Story[] {
  return all(locale)
    .filter((s) => s.slug !== story.slug)
    .map((s) => {
      let score = 0;
      if (s.sector === story.sector) score += 3;
      score += s.companies.filter((c) => story.companies.includes(c)).length * 2;
      score += s.projects.filter((p) => story.projects.includes(p)).length * 3;
      score += s.topics.filter((t) => story.topics.includes(t)).length;
      return { story: s, score };
    })
    .filter((x) => x.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        Date.parse(b.story.publishedAt) - Date.parse(a.story.publishedAt),
    )
    .slice(0, limit)
    .map((x) => x.story);
}

export { PROJECTS, PROJECT_MAP, COMPANIES, COMPANY_MAP };
