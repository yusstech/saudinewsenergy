# Media licences

Every image published on Saudi Energy News is recorded here with its source,
author and licence. Nothing ships without an entry.

Two rules govern this directory, and both are editorial rather than legal:

1. **An image is captioned with what it actually shows.** Where a photograph is
   not of the specific asset being reported, it is flagged `isIllustrative` in
   the story's frontmatter and the article template labels it as illustrative.
   We do not run a photograph of *a* transmission line under a story about
   *this* transmission line and let the caption imply they are the same.

2. **No photograph is captioned as being the Al Jouf line.** The source
   documentation for that project contains no site photography, so no such image
   exists in this repository and none may be represented as one.

---

## Diagrams — `diagrams/`

Original work produced in house for Saudi Energy News. No third-party rights
attach. Each is theme-aware (light and dark) and carries its own accessible
`<title>` and `<desc>`.

| File | Shows |
|---|---|
| `opgw-tower-elevation.svg` | Optical ground wire at the shield-wire position above two circuits of phase conductors on a lattice tower. |
| `opgw-cross-section.svg` | OPGW construction: aluminium-clad steel outer strands, aluminium tube, gel-filled core carrying optical fibres. |
| `teleprotection-sequence.svg` | Fault → relays at both ends measure → teleprotection signal over the fibre → coordinated breaker operation. |
| `route-schematic.svg` | The Al Jouf corridor: ~107 km route, 279 towers, 110.21 km of OPGW, 28 joint boxes, 2 fibre termination panels. Figures from the project bill of quantities. |

Schematic in every case, and each diagram says so on its face. Tower spacing,
strand counts and joint positions are illustrative; the annotated figures are
the sourced ones.

---

## Photography — `photos/`

### `transmission-corridor-dusk.jpg` — article hero

- **Depicts:** a high-voltage transmission corridor at sunset, lattice towers receding
  in a line across flat open terrain.
- **Author:** Matthew Henry (`matthewhenry`)
- **Licence:** [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) — public
  domain dedication; no attribution required, credited anyway
- **Source:** [Unsplash](https://unsplash.com/photos/yETqkLnhsUI), mirrored on
  [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Matthew_Henry_2016-09-08_(Unsplash).jpg)
- **Modifications:** resized from 5637px to 1800px on the long edge. No crop, no retouching.
- **Illustrative:** **yes.** Not the Al Jouf line, not Saudi Arabia. Chosen because it shows a
  long tower run across flat terrain — the shape of the corridor the story describes — and
  because the shield wire is visible above the phase conductors, which is the article's subject.

### `opgw-temporary-ground.jpg`

- **Depicts:** a temporary grounding point clamped to an optical ground wire
  during work on a transmission line. The stranded metallic outer layers of the
  OPGW cable are clearly visible.
- **Author:** OLC Fiber, Lakewood, Colorado, USA
- **Licence:** [CC BY 2.0](https://creativecommons.org/licenses/by/2.0)
- **Source:** [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:OPGW_ground_(4984602241).jpg)
- **Original title:** `OPGW ground (4984602241).jpg`
- **Modifications:** resized to 1280 px on the long edge. No crop, no
  retouching.
- **Illustrative:** **yes.** This is not the Al Jouf line and is not in Saudi
  Arabia. It is published to show what OPGW hardware physically looks like, and
  the caption says so.

CC BY 2.0 requires attribution, a link to the licence, and an indication of
changes. All three are rendered on the page by `components/article/figure.tsx`
from the `credit`, `license`, `licenseUrl` and `sourceUrl` fields in the story's
frontmatter — there is no code path that renders a photograph without them.

---

## Adding an image

1. Confirm the licence permits commercial use and note the exact terms.
2. Add the file here, at a sensible size, and record it above with author,
   licence, licence URL, source URL and any modifications.
3. Add it to the story's `images` (or `hero`) frontmatter with `credit`,
   `license` and truthful `alt` text.
4. If it is not a photograph of the asset being reported, set
   `isIllustrative: true` and write `depicts` to say what it really shows.
