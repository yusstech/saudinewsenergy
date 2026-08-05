import Link from 'next/link';

/**
 * The 404 for the whole site.
 *
 * Every unknown URL lands here, and that is a change worth recording. It used
 * to be reached only by paths that never resolved to a locale, because an
 * unknown *slug* — `/en/article/does-not-exist` — never 404'd at all: the
 * `[locale]` subtree rendered dynamically, so `dynamicParams = false` had no
 * static generation to guard, and the not-found body was served under a 200.
 * With the subtree prerendered again, the router rejects unknown params before
 * any locale segment renders, and this file is what a reader gets.
 *
 * That is also why it cannot use next-intl: rejection happens above the locale,
 * so there is no locale to translate into and no message catalogue loaded. It
 * is bilingual by hand, and it carries the masthead's own type and colour
 * inline rather than reaching for the stylesheet — a 404 that arrives looking
 * like a server default reads as a broken site rather than a wrong address.
 */
export default function RootNotFound() {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100dvh',
          display: 'grid',
          placeItems: 'center',
          padding: '2rem',
          textAlign: 'center',
          background: '#17150f',
          color: '#fcfaf6',
          fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
        }}
      >
        <main>
          <div
            style={{
              width: 34,
              height: 5,
              background: '#b87333',
              margin: '0 auto 1.75rem',
            }}
          />

          <p
            style={{
              margin: 0,
              fontSize: '0.6875rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#9d968a',
            }}
          >
            Syrian Energy News
          </p>

          <h1 style={{ margin: '0.85rem 0 0', fontSize: '1.75rem', fontWeight: 600 }}>
            Page not found
          </h1>
          <p
            lang="ar"
            dir="rtl"
            style={{ margin: '0.3rem 0 0', fontSize: '1.375rem', color: '#c9c2b6' }}
          >
            الصفحة غير موجودة
          </p>

          <p style={{ margin: '1.1rem auto 0', maxWidth: '40ch', color: '#9d968a', lineHeight: 1.6 }}>
            That page doesn&rsquo;t exist, or it may have moved.
          </p>

          <p style={{ marginTop: '2rem', fontSize: '0.9375rem', fontWeight: 600 }}>
            <Link href="/en" style={{ color: '#e0a878' }}>
              English
            </Link>
            <span style={{ color: '#5d574c', margin: '0 0.7rem' }} aria-hidden="true">
              ·
            </span>
            <Link href="/ar" lang="ar" style={{ color: '#e0a878' }}>
              العربية
            </Link>
          </p>
        </main>
      </body>
    </html>
  );
}
