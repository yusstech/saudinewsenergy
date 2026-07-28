import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import { baseMetadata } from '@/lib/seo';
import { SITE } from '@/lib/site';
import { PageHeader } from '@/components/page-header';
import { Prose } from '@/components/prose';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'standards' });
  return { ...baseMetadata(locale, '/contact'), title: t('contact') };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('standards');

  return (
    <>
      <PageHeader title={t('contact')} />
      <Prose>
        {locale === 'en' ? (
          <>
            <p>
              Newsroom: <a href={`mailto:${SITE.contact}`}>{SITE.contact}</a>
            </p>
            <p>
              For corrections, please include the story headline and the specific
              claim you are querying. For project information, we are able to
              report figures we can attribute to a document or a named source.
            </p>
          </>
        ) : (
          <>
            <p>
              غرفة الأخبار: <a href={`mailto:${SITE.contact}`}>{SITE.contact}</a>
            </p>
            <p>
              للتصحيحات، يُرجى ذكر عنوان المادة والادعاء المحدد موضع الاستفسار.
              وبالنسبة لمعلومات المشاريع، يمكننا نشر الأرقام التي نستطيع نسبتها
              إلى وثيقة أو مصدر مُسمّى.
            </p>
          </>
        )}
      </Prose>
    </>
  );
}
