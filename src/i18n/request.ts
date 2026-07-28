import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';
import { LOCALE_TAG, type Locale } from './config';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale: Locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    // Riyadh time is the newsroom clock. Every published/updated stamp is
    // authored and rendered against it; reader-local time is shown alongside
    // it where that helps, never instead of it.
    timeZone: 'Asia/Riyadh',
    formats: {
      dateTime: {
        stamp: { day: 'numeric', month: 'short', year: 'numeric' },
        stampWithTime: {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        },
      },
    },
    getMessageFallback: ({ key }) => key,
    onError() {
      // A missing string must not blank a page in production. It renders as its
      // key, which is visible in review but harmless to a reader.
    },
  };
});

export { LOCALE_TAG };
