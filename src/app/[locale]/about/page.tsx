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
              We are publishing. Everything on this site is reporting: one
              story so far, on the Al Jouf 380 kV transmission line, sourced from
              the project documentation and available in both languages. The
              placeholder stories the interface was built against have been
              deleted rather than left in place, and the site carries no market
              data. It is a small publication that says only what it can source,
              which is the version worth growing.
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
              نحن ننشر. وكل ما في هذا الموقع تغطية صحفية: مادة واحدة حتى الآن،
              عن خط نقل الجوف جهد 380 كيلوفولت، مصدرها وثائق المشروع، ومتاحة
              باللغتين. أما المواد التجريبية التي بُنيت عليها الواجهة فقد حُذفت
              بدل أن تُترك في مكانها، ولا يحمل الموقع أي بيانات سوقية. إنها منصة
              صغيرة لا تقول إلا ما تستطيع إسناده، وهذه هي النسخة الجديرة
              بالنمو.
            </p>
          </>
        )}
      </Prose>
    </>
  );
}
