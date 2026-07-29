import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import { GEO_COOKIE } from './i18n/config';

const intl = createMiddleware(routing);

/**
 * Locale routing, plus the one piece of request state the pages are not allowed
 * to read for themselves.
 *
 * The edition suggestion needs to know which country a request came from, and
 * that only exists in a request header. Reading it inside a layout — which is
 * what `suggestedEdition()` used to do — opted the entire `[locale]` subtree
 * into dynamic rendering, and the cost of that was not a slower page. It was
 * correctness: nothing under `[locale]` was prerendered, so `dynamicParams =
 * false` had nothing left to enforce, and an unknown article slug rendered the
 * not-found body with a **200**. That is the soft 404 this site has been
 * carrying since launch.
 *
 * So geography is resolved here, once, and handed forward as a readable cookie.
 * Middleware already runs on every request, so this costs no round trip, and it
 * lets every page under `[locale]` go back to being genuinely static.
 *
 * The cookie is deliberately not `httpOnly`: the client component that shows
 * the suggestion is its only consumer. It carries a two-letter country code and
 * nothing else — no address, no coordinates, nothing identifying a reader.
 */
export default function middleware(request: NextRequest) {
  const response = intl(request);

  const country =
    request.headers.get('x-vercel-ip-country') ??
    request.headers.get('cf-ipcountry');

  // Written once and only when known. Re-stamping on every request would send a
  // `Set-Cookie` with every navigation for no gain.
  if (country && !request.cookies.has(GEO_COOKIE)) {
    response.cookies.set(GEO_COOKIE, country.toUpperCase(), {
      path: '/',
      maxAge: 60 * 60 * 24,
      sameSite: 'lax',
    });
  }

  return response;
}

export const config = {
  // Everything except Next internals, the API routes, and files with an
  // extension (media, sitemap.xml, robots.txt, llms.txt …).
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
