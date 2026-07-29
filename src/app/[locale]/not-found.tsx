import { Link } from '@/i18n/navigation';

/**
 * The 404 for a request that resolved to a locale but not to a page.
 *
 * This file is what makes the status code correct. Without it, a `notFound()`
 * raised inside `[locale]` — an unknown article slug, a company that does not
 * exist — falls all the way through to `app/not-found.tsx`, which sits outside
 * the statically generated `[locale]` segment. Next then serves that page
 * *dynamically*, and a dynamic render has no 404 to return: the reader saw
 * "Page not found" over a **200 OK**, which is a soft 404 and exactly the thing
 * a crawler will index as a real page.
 *
 * Catching it at the locale boundary keeps the response inside the static
 * segment, so the status matches the words on the page.
 *
 * Written bilingually by hand rather than through next-intl. A not-found file
 * receives no `params`, so there is no locale to resolve messages against, and
 * guessing one would put the wrong language in front of half the readers who
 * hit it.
 */
export default function LocaleNotFound() {
  return (
    <div className="page flex min-h-[52vh] flex-col items-center justify-center py-16 text-center">
      <p className="label text-faint">404</p>

      <h1 className="font-display mt-3 text-display text-strong">
        Page not found
      </h1>
      <p lang="ar" dir="rtl" className="font-display mt-1 text-title text-muted">
        الصفحة غير موجودة
      </p>

      <p className="mt-5 max-w-[46ch] leading-relaxed text-muted">
        That page doesn&rsquo;t exist, or it may have moved.
      </p>
      <p
        lang="ar"
        dir="rtl"
        className="mt-1 max-w-[46ch] leading-relaxed text-muted"
      >
        هذه الصفحة غير موجودة أو ربما نُقلت.
      </p>

      <p className="mt-7 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-meta font-semibold">
        <Link
          href="/"
          locale="en"
          className="text-accent hover:underline underline-offset-4"
        >
          Back to the front page
        </Link>
        <span aria-hidden="true" className="text-faint">
          ·
        </span>
        <Link
          href="/"
          locale="ar"
          lang="ar"
          className="text-accent hover:underline underline-offset-4"
        >
          العودة إلى الصفحة الرئيسية
        </Link>
      </p>
    </div>
  );
}
