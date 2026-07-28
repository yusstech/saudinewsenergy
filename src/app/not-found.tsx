import Link from 'next/link';

/**
 * The root 404, for requests that never resolved to a locale — a malformed
 * prefix, or a path the middleware could not route. It cannot use next-intl
 * (there is no locale to translate into), so it is bilingual by hand.
 */
export default function RootNotFound() {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          display: 'grid',
          placeItems: 'center',
          minHeight: '100dvh',
          margin: 0,
          textAlign: 'center',
          padding: '2rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Page not found</h1>
          <p style={{ opacity: 0.7 }} lang="ar" dir="rtl">
            الصفحة غير موجودة
          </p>
          <p style={{ marginTop: '1.5rem' }}>
            <Link href="/en">English</Link>
            {' · '}
            <Link href="/ar" lang="ar">
              العربية
            </Link>
          </p>
        </div>
      </body>
    </html>
  );
}
