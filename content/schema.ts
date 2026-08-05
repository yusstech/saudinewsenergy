import { z } from 'zod';

/**
 * The content contract for Syrian Energy News.
 *
 * This file exists to answer one question in advance: when a CMS is eventually
 * connected, what must it produce? Specialist publications get flattened by
 * generic CMSs — a story becomes title, image, description, and everything that
 * made it *energy* reporting (the operator, the capacity, the status, the
 * source, the correction history) is dropped because nothing declared it
 * required. Declaring it here, and validating at build time, means a backend
 * cannot quietly reduce this publication to a blog.
 *
 * Two rules run through the schemas below:
 *
 * - **A measured value is never a bare number.** Every quantity carries its
 *   unit, and every money figure carries its currency. Values and units drift
 *   apart when they live in separate fields, and a figure quoted onward without
 *   its unit is how a 110 km fibre run becomes a 110 mile one.
 *
 * - **An absent fact stays absent.** Every quantitative field is optional and
 *   the templates omit what is missing. A capacity we do not have is a field
 *   left empty, never a number inferred from somewhere else on the page.
 */

/* ------------------------------------------------------------ vocabulary -- */

export const localeSchema = z.enum(['en', 'ar']);
export type ContentLocale = z.infer<typeof localeSchema>;

export const editionSchema = z.enum(['syria', 'levant', 'mena', 'global']);
export type ContentEdition = z.infer<typeof editionSchema>;

/** Editorial desks. These are the spine of the publication, per concept §6. */
export const sectorSchema = z.enum([
  'syria',
  'oil-gas',
  'power',
  'renewables',
  'hydrogen',
  'carbon',
  'petrochemicals',
  'technology',
  'markets',
  'projects',
  'policy',
  'companies',
]);
export type Sector = z.infer<typeof sectorSchema>;

/** Syrian governorates, plus supra-national scopes. */
export const regionSchema = z.enum([
  'damascus',
  'rural-damascus',
  'aleppo',
  'homs',
  'hama',
  'latakia',
  'tartus',
  'idlib',
  'daraa',
  'as-suwayda',
  'quneitra',
  'deir-ez-zor',
  'raqqa',
  'al-hasakah',
  'nationwide',
  'levant',
  'mena',
  'global',
]);
export type Region = z.infer<typeof regionSchema>;

/**
 * Alert states. These map one-to-one onto the reserved status colours in
 * globals.css, and the mapping is why neither list may grow casually: a sixth
 * state with no colour of its own would have to borrow one, and borrowing
 * breaks the promise that red always means Breaking.
 */
export const alertStateSchema = z.enum([
  'breaking',
  'developing',
  'live',
  'market-move',
  'project-update',
]);
export type AlertState = z.infer<typeof alertStateSchema>;

/**
 * Story type. Kept separate from sector because the concept requires News,
 * Analysis, Opinion and Sponsored to be *visually* separable — that separation
 * needs a field to hang off, not a convention.
 */
export const storyTypeSchema = z.enum([
  'news',
  'analysis',
  'opinion',
  'explainer',
  'investigation',
  'interview',
  'sponsored',
]);
export type StoryType = z.infer<typeof storyTypeSchema>;

export const projectStatusSchema = z.enum([
  'announced',
  'tendered',
  'awarded',
  'under-construction',
  'commissioning',
  'operational',
]);
export type ProjectStatus = z.infer<typeof projectStatusSchema>;

export const companyTypeSchema = z.enum([
  'government',
  'state-owned',
  'listed',
  'private',
  'utility',
  'developer',
  'contractor',
  'institution',
]);

/* ------------------------------------------------------------ primitives -- */

const slugSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be lowercase-kebab-case');

const isoDateSchema = z
  .string()
  .refine((v) => !Number.isNaN(Date.parse(v)), 'must be an ISO 8601 timestamp');

/**
 * A quantity and its unit, inseparable.
 *
 * `{ value: 110.21, unit: 'km' }` rather than a `lengthKm` number, because the
 * unit then survives into the rendered page, the structured data and anything
 * an answer engine lifts out of it.
 */
export const measureSchema = z.object({
  value: z.number(),
  unit: z.string().min(1),
  /** Optional qualifier, e.g. "double-circuit" or "gross". */
  note: z.string().optional(),
});
export type Measure = z.infer<typeof measureSchema>;

export const moneySchema = z.object({
  value: z.number(),
  /** ISO 4217. */
  currency: z.string().length(3),
});
export type Money = z.infer<typeof moneySchema>;

/**
 * Text that may be written once or written twice.
 *
 * An article is a single-language file, so a source label inside one is already
 * in that article's language and a plain string is the honest shape. A project
 * or company record is *shared* by both locales, and there a plain string means
 * whichever language it happens to be written in shows up under the other one's
 * chrome — which is how "Ministry of Energy letter of award, ref
 * MOE/LOA/2021/0801" came to sit in the middle of the Arabic front page.
 *
 * So both shapes are legal, and `localisedText` below resolves either one. The
 * union is deliberately not an object-only schema: forcing every article to
 * supply a translation it does not need would be a worse contract than the
 * problem it fixes.
 */
export const localisedTextSchema = z.union([
  z.string().min(1),
  z.object({ en: z.string().min(1), ar: z.string().min(1) }),
]);
export type LocalisedText = z.infer<typeof localisedTextSchema>;

/** Resolve either shape for display. A plain string is returned as written. */
export function localisedText(
  value: LocalisedText,
  locale: ContentLocale,
): string {
  return typeof value === 'string' ? value : value[locale];
}

/**
 * A media asset.
 *
 * `credit` and `license` are required on every asset with no default. They are
 * the newsroom's own record of where a picture came from and on what terms —
 * kept in the frontmatter so no image can enter the site unaccounted for, and
 * consulted before anything third-party is used rather than after.
 */
export const mediaAssetSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  caption: z.string().optional(),
  credit: z.string().min(1),
  license: z.string().min(1),
  licenseUrl: z.string().url().optional(),
  sourceUrl: z.string().url().optional(),
  /** Original diagrams produced in-house; no third-party rights attach. */
  isDiagram: z.boolean().default(false),
});
export type MediaAsset = z.infer<typeof mediaAssetSchema>;

export const authorSchema = z.object({
  id: slugSchema,
  name: z.string().min(1),
  role: z.string().optional(),
  bio: z.string().optional(),
});
export type Author = z.infer<typeof authorSchema>;

/**
 * Translation status.
 *
 * `original` is the honest default and the one this newsroom prefers. Anything
 * else must name the language it came from, so the reader is never left
 * guessing whether a quotation survived a round trip. There is no third state:
 * nothing publishes in either language until an editor has read it, so the
 * label describes the pairing rather than a pending review.
 */
export const translationSchema = z.object({
  status: z.enum(['original', 'human-translated']),
  originalLocale: localeSchema.optional(),
  /** Slug of the source-language story, when one is published. */
  originalSlug: z.string().optional(),
  reviewedBy: z.string().optional(),
});
export type Translation = z.infer<typeof translationSchema>;

export const correctionSchema = z.object({
  date: isoDateSchema,
  kind: z.enum(['correction', 'update', 'clarification']),
  note: z.string().min(1),
});
export type Correction = z.infer<typeof correctionSchema>;

/**
 * A structured context panel for a project or market story.
 *
 * Every field is optional and the renderer omits what is absent. That is the
 * concept's rule made mechanical: *only display fields supported by the
 * reporting, never fill a gap with inference.* An empty capacity field means we
 * do not know the capacity — it does not mean the template should guess one.
 */
export const contextPanelSchema = z.object({
  organisation: z.string().optional(),
  client: z.string().optional(),
  contractor: z.string().optional(),
  project: z.string().optional(),
  location: z.string().optional(),
  region: regionSchema.optional(),
  capacity: measureSchema.optional(),
  length: measureSchema.optional(),
  structures: measureSchema.optional(),
  value: moneySchema.optional(),
  technology: z.string().optional(),
  status: projectStatusSchema.optional(),
  announcedDate: isoDateSchema.optional(),
  completedDate: isoDateSchema.optional(),
  expectedMilestone: z.string().optional(),
});
export type ContextPanel = z.infer<typeof contextPanelSchema>;

/** One timestamped entry on a live blog or the Live Energy Desk. */
export const liveUpdateSchema = z.object({
  id: z.string().min(1),
  time: isoDateSchema,
  headline: z.string().min(1),
  body: z.string().optional(),
  state: alertStateSchema.optional(),
});
export type LiveUpdate = z.infer<typeof liveUpdateSchema>;

/**
 * An extractable question and answer.
 *
 * This is the AEO surface. Answer engines cite self-contained question/answer
 * pairs far more readily than they cite prose, and these also become
 * `FAQPage` structured data. The answer must stand alone — if it only makes
 * sense after reading three paragraphs above it, it will be quoted wrongly.
 */
export const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});
export type Faq = z.infer<typeof faqSchema>;

/* ---------------------------------------------------------------- story -- */

export const storyFrontmatterSchema = z.object({
  slug: slugSchema,
  locale: localeSchema,
  headline: z.string().min(1),
  /** Short display headline for cards, when the full one is too long. */
  cardHeadline: z.string().optional(),
  standfirst: z.string().min(1),
  /** Meta description. Falls back to the standfirst when absent. */
  seoDescription: z.string().optional(),

  type: storyTypeSchema.default('news'),
  sector: sectorSchema,
  secondarySectors: z.array(sectorSchema).default([]),
  region: regionSchema.default('nationwide'),
  editions: z.array(editionSchema).min(1).default(['syria']),

  publishedAt: isoDateSchema,
  updatedAt: isoDateSchema.optional(),

  authors: z.array(authorSchema).min(1),

  alert: alertStateSchema.optional(),
  isLive: z.boolean().default(false),
  liveUpdates: z.array(liveUpdateSchema).default([]),

  hero: mediaAssetSchema.optional(),
  images: z.array(mediaAssetSchema).default([]),

  takeaways: z.array(z.string()).default([]),
  faq: z.array(faqSchema).default([]),
  context: contextPanelSchema.optional(),

  translation: translationSchema.default({ status: 'original' }),
  corrections: z.array(correctionSchema).default([]),

  /** Slugs of related project and company records. */
  projects: z.array(slugSchema).default([]),
  companies: z.array(slugSchema).default([]),
  topics: z.array(z.string()).default([]),

  featured: z.boolean().default(false),
  /** Higher sorts earlier within the lead grid. */
  weight: z.number().int().default(0),

});

export type StoryFrontmatter = z.infer<typeof storyFrontmatterSchema>;

export type Story = StoryFrontmatter & {
  /** Raw MDX body. */
  body: string;
  /** Plain-text body, for search indexing. */
  plain: string;
  wordCount: number;
};

/* --------------------------------------------------------------- project -- */

export const projectSchema = z.object({
  slug: slugSchema,
  name: z.object({ en: z.string().min(1), ar: z.string().min(1) }),
  /**
   * The other names this project is genuinely known by.
   *
   * Not keyword padding — these are emitted as `alternateName` on the project
   * entity, and their job is entity *resolution*: letting a search or answer
   * engine recognise that "the Tabuk 380 kV line", "Tabuk double-circuit
   * transmission line" and the full formal name are one asset rather than
   * three. Only list names a person would actually use.
   */
  alternateNames: z.array(z.string()).default([]),
  summary: z.object({ en: z.string(), ar: z.string() }),
  sector: sectorSchema,
  region: regionSchema,
  location: z.object({ en: z.string(), ar: z.string() }),
  status: projectStatusSchema,
  client: slugSchema.optional(),
  contractor: slugSchema.optional(),
  capacity: measureSchema.optional(),
  length: measureSchema.optional(),
  structures: measureSchema.optional(),
  value: moneySchema.optional(),
  technology: z.array(z.string()).default([]),
  announcedDate: isoDateSchema.optional(),
  completedDate: isoDateSchema.optional(),
});
export type Project = z.infer<typeof projectSchema>;

/* --------------------------------------------------------------- company -- */

export const companySchema = z.object({
  slug: slugSchema,
  name: z.object({ en: z.string().min(1), ar: z.string().min(1) }),
  type: companyTypeSchema,
  summary: z.object({ en: z.string(), ar: z.string() }),
  sectors: z.array(sectorSchema).default([]),
  /**
   * The organisation's own site. This doubles as the entity identifier in
   * schema.org `mentions` / `about`, which is why it is a URL and not a name.
   */
  url: z.string().url().optional(),
  headquarters: z.string().optional(),
});
export type Company = z.infer<typeof companySchema>;

/* --------------------------------------------------------------- markets -- */

/**
 * A market indicator.
 *
 * RESERVED, AND CURRENTLY UNUSED. Nothing on the site renders market data: the
 * rail, the `/markets` page and the dashboard's price tile were removed along
 * with the invented numbers that fed them, because a prototype rendering made-up
 * prices as though they were reference data is the single fastest way for a new
 * publication to lose professional readers. Labelling them "sample" was not
 * enough — the numbers themselves were the problem.
 *
 * The contract is kept because it is the part worth keeping. When a licensed
 * feed exists, this is what it has to satisfy, and the two disclosure fields are
 * the reason: `isSample` and `delayMinutes` have no defaults that could hide
 * them, so the type system makes the disclosure mandatory rather than trusting a
 * template to remember it.
 */
export const marketIndicatorSchema = z.object({
  id: slugSchema,
  label: z.object({ en: z.string().min(1), ar: z.string().min(1) }),
  value: z.number(),
  unit: z.string().min(1),
  currency: z.string().length(3).optional(),
  change: z.number(),
  changePercent: z.number(),
  asOf: isoDateSchema,
  /** Minutes behind real time. 0 means real time. */
  delayMinutes: z.number().int().nonnegative(),
  /** True while this is prototype content rather than licensed market data. */
  isSample: z.boolean(),
  href: z.string().optional(),
});
export type MarketIndicator = z.infer<typeof marketIndicatorSchema>;

/* ---------------------------------------------------------------- policy -- */

export const policySchema = z.object({
  slug: slugSchema,
  title: z.object({ en: z.string(), ar: z.string() }),
  authority: z.string(),
  date: isoDateSchema,
  summary: z.object({ en: z.string(), ar: z.string() }),
  url: z.string().url().optional(),
});
export type Policy = z.infer<typeof policySchema>;

/* ------------------------------------------------------------- user prefs -- */

export const userPreferencesSchema = z.object({
  locale: localeSchema,
  edition: editionSchema,
  readerSize: z.enum(['normal', 'large', 'xlarge']).default('normal'),
  savedStories: z.array(z.string()).default([]),
});
export type UserPreferences = z.infer<typeof userPreferencesSchema>;
