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
              Syrian Energy News is a Syria-first, bilingual specialist energy
              newsroom. It is built for people who need to understand what is
              happening across the country&rsquo;s energy sector: what changed
              today, which projects, policies, companies and markets are
              affected, and how a Syrian development connects to the Levant and
              the wider energy system.
            </p>
            <h2>Why a specialist publication</h2>
            <p>
              The Syrian energy system is integrated — hydrocarbons, electricity,
              renewables and the reconstruction of the grid are managed as one
              remit. General news coverage tends to split those apart and report
              whichever piece is loudest that week. This publication treats them
              as the single system they are.
            </p>
            <h2>Arabic and English</h2>
            <p>
              Both languages are first-class products, with their own typography,
              search and editorial presentation. Language and edition are
              separate choices: a reader in London can follow the Syria edition
              in Arabic, and a reader in Damascus can follow global energy in
              English.
            </p>
            <h2>What we cover</h2>
            <p>
              Oil and gas, power and utilities, renewables, hydrogen, carbon
              management, petrochemicals, markets, projects and policy. Syria is
              the editorial centre of every edition; international stories appear
              here because they affect the country, its companies, its markets or
              the wider energy system. Where we cannot establish a figure, we
              leave it out.
            </p>
          </>
        ) : (
          <>
            <p>
              أخبار الطاقة السورية غرفة أخبار متخصصة في الطاقة، سورية أولاً
              وثنائية اللغة. صُممت لمن يحتاجون إلى فهم ما يجري في قطاع الطاقة في
              البلاد: ما الذي تغيّر اليوم، وأي المشاريع والسياسات والشركات
              والأسواق تأثرت، وكيف يرتبط التطور السوري ببلاد الشام ومنظومة الطاقة
              الأوسع.
            </p>
            <h2>لماذا منصة متخصصة</h2>
            <p>
              منظومة الطاقة السورية متكاملة؛ فالهيدروكربونات والكهرباء والطاقة
              المتجددة وإعادة إعمار الشبكة تُدار ضمن اختصاص واحد. والتغطية العامة
              تميل إلى تفكيك هذه العناصر وتناول أكثرها ضجيجاً في الأسبوع. أما هذه
              المنصة فتتعامل معها بوصفها المنظومة الواحدة التي هي عليها.
            </p>
            <h2>العربية والإنجليزية</h2>
            <p>
              اللغتان منتجان من الدرجة الأولى، لكل منهما طباعته وبحثه وعرضه
              التحريري. واللغة والنسخة خياران منفصلان: يمكن لقارئ في لندن متابعة
              النسخة السورية بالعربية، ولقارئ في دمشق متابعة الطاقة عالمياً
              بالإنجليزية.
            </p>
            <h2>ما نغطيه</h2>
            <p>
              النفط والغاز، والكهرباء والمرافق، والطاقة المتجددة، والهيدروجين،
              وإدارة الكربون، والبتروكيماويات، والأسواق، والمشاريع، والسياسات.
              وسوريا هي المركز التحريري في كل نسخة، وتظهر الأخبار الدولية هنا
              لأنها تمسّ البلاد أو شركاتها أو أسواقها أو منظومة الطاقة الأوسع.
              وحين يتعذّر إثبات رقم، نحذفه.
            </p>
          </>
        )}
      </Prose>
    </>
  );
}
