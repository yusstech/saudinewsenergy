import { ImageResponse } from 'next/og';
import { LOCALES } from '@/i18n/config';
import { SITE } from '@/lib/site';

/**
 * The share card for every page that is not a story.
 *
 * Listing pages declared `summary_large_image` and shipped no image, which is
 * the worst of both: the card reserves a large image slot and then renders it
 * blank. Stories have a hero to fall back on; the front page, the desks, the
 * editions and the project feed had nothing.
 *
 * Drawn rather than photographed, from the masthead's own tokens — the charcoal
 * ground, cream type and the copper rule that appears under the wordmark and in
 * the favicon. It reads as the publication at thumbnail size, which is the only
 * size that matters here.
 *
 * Latin glyphs only, deliberately. Satori renders with its built-in font, which
 * has no Arabic coverage, and a wordmark full of tofu is worse than an English
 * lockup. Restoring the bilingual lockup means shipping a Naskh font file to
 * this route.
 */
export const alt = SITE.name;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#17150f',
          padding: '84px 96px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 22,
              height: 22,
              backgroundColor: '#b87333',
              borderRadius: 3,
            }}
          />
          <div
            style={{
              color: '#a8a196',
              fontSize: 26,
              letterSpacing: 4,
              textTransform: 'uppercase',
            }}
          >
            Riyadh
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              color: '#fcfaf6',
              fontSize: 92,
              fontWeight: 700,
              letterSpacing: -2,
              lineHeight: 1.05,
            }}
          >
            {SITE.name}
          </div>
          <div
            style={{
              width: 168,
              height: 8,
              backgroundColor: '#b87333',
              marginTop: 34,
            }}
          />
          <div
            style={{
              color: '#c9c2b6',
              fontSize: 34,
              marginTop: 34,
              maxWidth: 860,
              lineHeight: 1.35,
            }}
          >
            {SITE.descriptor.en}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
