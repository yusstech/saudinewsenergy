import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import { baseMetadata } from '@/lib/seo';
import { buildSearchIndex } from '@/lib/search';
import { PageHeader } from '@/components/page-header';
import { SearchClient } from '@/components/search-client';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'search' });
  return {
    ...baseMetadata(locale, '/search'),
    title: t('title'),
    description: t('intro'),
  };
}

export default async function SearchPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('search');

  return (
    <>
      <PageHeader title={t('title')} intro={t('intro')} />
      <div className="mx-auto max-w-[1440px] px-[--spacing-gutter] py-8">
        <SearchClient index={buildSearchIndex(locale)} locale={locale} />
      </div>
    </>
  );
}
