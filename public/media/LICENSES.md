# Media licences

Every image published on Saudi Energy News is recorded here with its source,
author and licence. Nothing ships without an entry.

This file is the newsroom's own record, not a page. Credits and licence terms
live in the story frontmatter and in this register; the article template renders
the caption and, for our own diagrams, says they are ours. That places one
obligation on whoever adds an image: **only use images whose licence does not
require on-page attribution.** Public-domain, CC0 and in-house work qualify.
Anything under CC BY or a similar attribution clause does not, and must not be
added to this directory.

The editorial rules that follow are absolute:

1. **An image is captioned with what it actually shows.** A caption never
   implies that a photograph is the specific asset being reported when it is
   not.

2. **No photograph is captioned as being the Al Jouf line.** No site photography
   of that project exists in this repository, and none may be represented as
   one.

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
| `route-schematic.svg` | The Al Jouf corridor: ~107 km route, 279 towers, 110.21 km of OPGW, 28 joint boxes, 2 fibre termination panels. |

Schematic in every case, and each diagram says so on its face. Tower spacing,
strand counts and joint positions are illustrative; the annotated figures are
the reported ones.

---

## Photography — `photos/`

### `transmission-corridor-dusk.jpg` — article hero

- **Depicts:** a high-voltage transmission corridor at sunset, lattice towers receding
  in a line across flat open terrain.
- **Author:** Matthew Henry (`matthewhenry`)
- **Licence:** [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) — public
  domain dedication; no attribution required
- **Source:** [Unsplash](https://unsplash.com/photos/yETqkLnhsUI), mirrored on
  [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Matthew_Henry_2016-09-08_(Unsplash).jpg)
- **Modifications:** resized from 5637px to 1800px on the long edge. No crop, no retouching.
- **Note:** chosen because it shows a long tower run across flat terrain — the shape of the
  corridor the story describes — and because the shield wire is visible above the phase
  conductors, which is the article's subject. The caption describes the corridor generically
  and does not claim it is the Al Jouf line.

### Removed

`opgw-temporary-ground.jpg` (OLC Fiber, CC BY 2.0) was withdrawn from the Al Jouf
article and deleted from this directory. Its licence requires visible attribution
and an indication of changes, which the article template no longer renders.

---

## Adding an image

1. Confirm the licence permits commercial use **and** requires no on-page
   attribution. If it requires attribution, do not use it.
2. Add the file here, at a sensible size, and record it above with author,
   licence, licence URL, source URL and any modifications.
3. Add it to the story's `images` (or `hero`) frontmatter with `credit`,
   `license` and truthful `alt` text.
4. Write the caption to describe what the photograph actually shows.
