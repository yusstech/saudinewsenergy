# Saudi Energy News

Saudi Arabia's live energy newsroom — أخبار الطاقة السعودية

A Saudi-first, bilingual (Arabic/English) specialist energy newsroom. Front end
only: stories are published from files in this repository, with no CMS and no
database behind it.

```bash
pnpm install
cp .env.example .env.local     # set NEXT_PUBLIC_SITE_URL
pnpm dev
```

---

## What's here

Next.js 15 (App Router) · TypeScript · Tailwind v4 · next-intl · Zod · MDX.
Every page is statically generated. No API routes, no runtime services.

```
content/
  schema.ts          Zod content contracts — the single source of truth
  taxonomy.ts        desks, regions, editions
  projects.ts        project records (Al Jouf from primary documentation)
  companies.ts       entity records
  en/articles/*.mdx  English stories
  ar/articles/*.mdx  Arabic stories
src/
  app/[locale]/      13 MVP page types
  components/        newsroom UI
  lib/               content loading, SEO, search, formatting
public/media/        diagrams, licensed photography, LICENSES.md
```

**Page types:** home · edition · latest · sector · article · live article ·
projects · company · search · saved · standards / corrections / about / contact,
in both locales.

---

## Publishing a story

Add an `.mdx` file under `content/{en,ar}/articles/`. The filename must match
the `slug` in the frontmatter, and the frontmatter must satisfy
`storyFrontmatterSchema`.

Validation is fatal by design: a story with a malformed date or a missing sector
fails `pnpm build` rather than rendering a broken card. A red build is a
five-minute problem; a story that published without its sourcing note is a
correction.

Reference figures from the frontmatter `images` array in the body with
`<Figure id="1" />` (1-indexed). There is deliberately no way to put a raw
`<img>` in a story body — every asset must carry the alt text, credit and
licence the schema requires.

---

## Four rules the code enforces

These are editorial commitments with mechanisms behind them, not conventions.

**A measured value never appears without its unit.** `{ value: 110.21, unit:
'km' }`, never a bare `lengthKm`. `formatMeasure` and `formatCurrency` are the
only ways a quantity reaches the page. A figure quoted onward without its unit is
how a 110 km fibre run becomes a 110 mile one.

**Sample data says so, everywhere.** `isSampleContent` on stories drives
labelling the templates cannot omit, plus `noindex` and exclusion from
`llms.txt`.

**The site carries no market data at all.** It used to: a rail on every page, a
`/markets` table and a Brent tile on the dashboard, each fed by invented numbers
and each carefully labelled "sample". The labelling was not the point. This
audience prices and procures against figures like those, and a placed number that
looks like a reference price is a liability however it is captioned — so the
numbers are gone rather than annotated. `marketIndicatorSchema` stays in
`content/schema.ts`, unused, as the contract a licensed feed would have to
satisfy; its `isSample` and `delayMinutes` fields have no defaults, so disclosure
stays mandatory the day one is wired up.

**An image is captioned with what it actually shows.** `isIllustrative` forces
an explicit label and `depicts` states the truth. No photograph may be captioned
as the Al Jouf line — the source documentation contains no site photography, so
no such image exists here.

**Absent data stays absent.** Every quantitative field on the context panel is
optional and omitted when missing. A blank capacity means we do not know it; it
does not license the template to infer one.

---

## SEO and discoverability

**Canonicals vs hreflang** (`lib/seo.ts`) — listing pages are genuinely
translated, so they self-canonicalise and declare each other. Articles do not: a
story written in English served under Arabic chrome is a duplicate, not a
translation, so both locales consolidate on one canonical. When a real
translation is published, the pair becomes a genuine alternate automatically.

**Structured data** — `Organization` + `WebSite` once with stable `@id`s;
`NewsArticle` (or `LiveBlogPosting`) + `BreadcrumbList` per story; `FAQPage`
where a story carries extractable Q&A. `mentions` is derived from the editorial
links in the body, so the markup cannot drift from what the page says.

**`/llms.txt`** — a plain-text index for answer engines, carrying the sourcing
position and excluding prototype content entirely. Answer-engine crawlers are
allowed in `robots.ts` deliberately: a specialist publication's reason to exist
is being the thing people cite, and the citation carries the masthead into rooms
the page view never reaches.

**Search** is keyword matching over an index that ships with the page. No server
round trip and nothing that can be unavailable.

---

## Design system

Warm sandstone canvas, charcoal reserved for the masthead band and the Saudi Energy Dashboard,
copper for rules and data. Status colour is reserved: red = Breaking, amber = Developing,
teal = Live, copper = Market Move, never decorative.

**Typography carries the identity.** Newsreader (variable, optical-size axis) for headlines and
article body; Inter for interface, metadata and figures. Arabic gets the same serif/sans split
via Noto Naskh Arabic for headlines and IBM Plex Sans Arabic for UI — Arabic has no serif, and
Naskh is its authority register, so pairing it with a Latin serif is what makes "equal products"
true at the level readers feel.

**Light is the default for everyone.** The site deliberately does *not* follow
`prefers-color-scheme`: a reader whose laptop is dark for their editor has expressed a
preference about applications, not about the newspaper they just opened, and a newsroom that
answers by turning black reads as a terminal. Dark is available from the masthead toggle,
stored in `localStorage` and replayed by an inline script before first paint.

**Chrome is two bands** — masthead, then a sticky nav — with a *conditional* breaking alert
below. It was six stacked bands and two competing marquees; a reader now meets ~155px before
the first headline instead of ~290px, and nothing moves except one live-status dot.

### Two Tailwind v4 traps this codebase hit

Both cost real debugging time and are easy to repeat:

1. **Theme keys mint utilities, so key names can collide.** `--spacing-block` generated an
   `inline-block` utility meaning `inline-size` that collided with the *display* utility of the
   same name, pinning every inline-block element to one width. Rhythm tokens now live in
   `:root`, outside `@theme`, since they are only ever read via `var()`.

2. **`bg-[--color-x]` is not valid in v4.3** — it emits `background-color: --color-x`, which is
   invalid CSS and silently drops. Use the generated utility (`bg-canvas`) for theme keys, or
   `[var(--x)]` for anything else. Relatedly, `@theme` cannot be nested inside `@media`: it is
   hoisted, so a dark block written that way applies unconditionally. Dark overrides are a plain
   `:root` rule inside the media query.

---

## Bilingual and RTL

Language and edition are independent axes. **Language** is the URL prefix
(`/en`, `/ar`) and sets interface language, direction and typography.
**Edition** is a cookie and re-weights which regional coverage joins the Saudi
core. A reader in London can follow the Saudi edition in Arabic.

`lang` and `dir` are set on the server from the route. Layout uses logical
properties throughout — `ms-*`, `ps-*`, `border-s-*`, `start-*`, never `ml-*` or
`left-*`. Geographic detection only ever produces a dismissible suggestion; it
never redirects, because a redirect keyed to IP means two readers requesting the
same URL get different pages.

**Numerals:** Arabic copy uses Latin digits (`1,250`), not Arabic-Indic. This is
an editorial call — Saudi energy, finance and engineering documentation is
written with Latin digits, and this publication's readers read capacities and
kilovolt ratings that way. See the note at the top of `lib/format.ts`.

---

## Scripts

| | |
|---|---|
| `pnpm dev` | development server |
| `pnpm build` | production build (validates all content) |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | ESLint |

## Environment

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | yes | Canonical origin. Every canonical, hreflang, sitemap entry and JSON-LD `@id` derives from it. **Set this to the production domain before the site is indexed.** |

---

## Known issue

**Unknown slugs under a matched dynamic route return the 404 page with a 200
status.** `/en/article/does-not-exist` renders the not-found page correctly but
responds `200` instead of `404`; a path that matches no route at all
(`/en/nonexistent-page`) does return a real `404`.

This survives `dynamicParams = false`, a nested `[locale]/not-found.tsx` (which
Next never registers — it was removed as dead code), and removing the root
not-found entirely. It appears to be a Next.js 15.5 interaction between a
dynamic `[locale]` segment and nested dynamic routes.

Practical impact is small — these URLs are unlinked and absent from the sitemap,
so nothing directs a crawler at them — but a soft 404 is still wrong. **Re-test
on Vercel before launch:** static hosting may return a hard 404 for paths absent
from the build output, in which case this is a `next start` artifact only.

---

## Current status

A front-end prototype. The interface, content model and editorial machinery are
real. The Al Jouf story is reported from primary documentation; the remaining
stories are sample content, labelled wherever they appear. No market data is
published.
