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
  return {
    ...baseMetadata(locale, '/about'),
    title: t('about'),
    description: SITE.promise[locale],
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('standards');

  return (
    <>
      <PageHeader title={t('about')} intro={SITE.promise[locale]} />
      <Prose>
        {locale === 'en' ? (
          <>
            <p>
              Saudi Energy News is a Saudi-first, bilingual specialist energy
              newsroom. It is built for people who need to understand what is
              happening across the Kingdom&rsquo;s energy sector: what changed
              today, which projects, policies, companies and markets are
              affected, and how a Saudi development connects to the GCC and the
              wider energy system.
            </p>
            <h2>Why a specialist publication</h2>
            <p>
              The Saudi energy system is integrated — hydrocarbons, electricity,
              renewables, clean hydrogen and carbon management are managed as one
              remit. General news coverage tends to split those apart and report
              whichever piece is loudest that week. This publication treats them
              as the single system they are.
            </p>
            <h2>Arabic and English</h2>
            <p>
              Both languages are first-class products, with their own typography,
              search and editorial presentation. Language and edition are
              separate choices: a reader in London can follow the Saudi edition
              in Arabic, and a reader in Riyadh can follow global energy in
              English.
            </p>
            <h2>Current status</h2>
            <p>
              This site is a front-end prototype. The interface, content model
              and editorial machinery are real; some of the stories and all of
              the market values are sample content, labelled wherever they
              appear.
            </p>
          </>
        ) : (
          <>
            <p>
              أخبار الطاقة السعودية غرفة أخبار متخصصة في الطاقة، سعودية أولاً
              وثنائية اللغة. صُممت لمن يحتاجون إلى فهم ما يجري في قطاع الطاقة في
              المملكة: ما الذي تغيّر اليوم، وأي المشاريع والسياسات والشركات
              والأسواق تأثرت، وكيف يرتبط التطور السعودي بالخليج ومنظومة الطاقة
              الأوسع.
            </p>
            <h2>لماذا منصة متخصصة</h2>
            <p>
              منظومة الطاقة السعودية متكاملة؛ فالهيدروكربونات والكهرباء والطاقة
              المتجددة والهيدروجين النظيف وإدارة الكربون تُدار ضمن اختصاص واحد.
              والتغطية العامة تميل إلى تفكيك هذه العناصر وتناول أكثرها ضجيجاً في
              الأسبوع. أما هذه المنصة فتتعامل معها بوصفها المنظومة الواحدة التي
              هي عليها.
            </p>
            <h2>العربية والإنجليزية</h2>
            <p>
              اللغتان منتجان من الدرجة الأولى، لكل منهما طباعته وبحثه وعرضه
              التحريري. واللغة والنسخة خياران منفصلان: يمكن لقارئ في لندن متابعة
              النسخة السعودية بالعربية، ولقارئ في الرياض متابعة الطاقة عالمياً
              بالإنجليزية.
            </p>
            <h2>الوضع الحالي</h2>
            <p>
              هذا الموقع نموذج أولي للواجهة. الواجهة ونموذج المحتوى والأدوات
              التحريرية حقيقية؛ أما بعض المواد وجميع القيم السوقية فمحتوى تجريبي
              موسوم أينما ظهر.
            </p>
          </>
        )}
      </Prose>
    </>
  );
}
