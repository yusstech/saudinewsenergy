import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Everything except Next internals, the API routes, and files with an
  // extension (media, sitemap.xml, robots.txt, llms.txt …).
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
