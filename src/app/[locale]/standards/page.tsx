import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import { baseMetadata } from '@/lib/seo';
import { PageHeader } from '@/components/page-header';
import { Prose } from '@/components/prose';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'standards' });
  return { ...baseMetadata(locale, '/standards'), title: t('title') };
}

/**
 * Editorial standards.
 *
 * Written as commitments a reader can hold us to, not as a compliance page.
 * Every claim here has a corresponding mechanism in the codebase — the sourcing
 * rule is enforced by the content schema, the sample-data rule by the market
 * types, the imagery rule by the `isIllustrative` flag on every media asset.
 * A standards page that describes intentions rather than mechanisms is a
 * standards page nobody has to keep.
 */
export default async function StandardsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('standards');

  const en = locale === 'en';

  return (
    <>
      <PageHeader title={t('title')} />
      <Prose>
        {en ? (
          <>
            <h2>What we publish</h2>
            <p>
              Saudi Energy News covers the Saudi energy system: oil and gas,
              power and utilities, renewables, hydrogen, carbon management,
              petrochemicals, markets, projects and policy. Saudi Arabia is the
              editorial centre of every edition. International stories appear
              here because they affect the Kingdom, its companies, its markets
              or the wider energy system.
            </p>

            <h2>Sourcing</h2>
            <p>
              Every quantitative claim is attributed. Where a figure comes from
              project documentation rather than a public filing or a published
              statement, we say so on the story, name who supplied the
              documentation, and state what it does and does not establish. We
              do not present a document supplied by an interested party as
              though it were independently published.
            </p>
            <p>
              Where we cannot establish a figure, we leave it out. We do not
              estimate a capacity, a value or a date and present it as reporting.
            </p>

            <h2>Market data</h2>
            <p>
              Market values on this site are currently sample data used to build
              and test the interface, and are labelled as such everywhere they
              appear. When licensed data replaces them, every value will carry
              its unit, its timestamp and its delay. We will never present
              delayed data as live.
            </p>

            <h2>Images</h2>
            <p>
              Photographs are captioned with what they actually show. Where an
              image is illustrative rather than a photograph of the specific
              asset being reported, it is labelled illustrative — we do not run
              a photograph of a transmission line under a story about a
              different transmission line and let the caption imply otherwise.
              Every photograph carries its credit and licence. Diagrams marked
              as ours are produced in house.
            </p>

            <h2>Analysis, opinion and sponsored content</h2>
            <p>
              News, analysis and opinion are labelled and visually distinct.
              Sponsored content, if we carry it, is labelled as sponsored on the
              card and on the page, and is never presented in a way that could
              be mistaken for reporting.
            </p>

            <h2>Translation</h2>
            <p>
              Arabic and English are equal products. We prefer original
              reporting in both languages. A translated story says so, names the
              language it came from and links to the original. Machine-assisted
              translations are reviewed by an editor before publication and
              labelled.
            </p>

            <h2>Corrections</h2>
            <p>
              We correct errors promptly and visibly. A material correction is
              recorded on the story with its date and what changed; it is not a
              silent edit. Material updates to a developing story are recorded
              the same way.
            </p>

            <h2>Prototype content</h2>
            <p>
              This site is currently a front-end prototype. Some stories are
              placeholder content written to populate the interface. They are
              labelled on every card and on the page itself, and excluded from
              search-engine indexing.
            </p>
          </>
        ) : (
          <>
            <h2>ما ننشره</h2>
            <p>
              تغطي أخبار الطاقة السعودية منظومة الطاقة في المملكة: النفط والغاز،
              والكهرباء والمرافق، والطاقة المتجددة، والهيدروجين، وإدارة الكربون،
              والبتروكيماويات، والأسواق، والمشاريع، والسياسات. والسعودية هي
              المركز التحريري في كل نسخة. وتظهر الأخبار الدولية هنا لأنها تمسّ
              المملكة أو شركاتها أو أسواقها أو منظومة الطاقة الأوسع.
            </p>

            <h2>المصادر</h2>
            <p>
              كل رقم يُنسب إلى مصدره. وحين يأتي الرقم من وثائق مشروع لا من إفصاح
              عام أو بيان منشور، نذكر ذلك في المادة، ونسمّي الجهة التي زوّدتنا
              بالوثائق، ونوضّح ما تثبته وما لا تثبته. ولا نقدّم وثيقة قدّمها طرف
              ذو مصلحة وكأنها منشورة بشكل مستقل.
            </p>
            <p>
              وحين يتعذّر التحقق من رقم، نحذفه. ولا نقدّر سعة أو قيمة أو تاريخاً
              ثم نعرضه بوصفه تغطية.
            </p>

            <h2>بيانات السوق</h2>
            <p>
              القيم السوقية في هذا الموقع بيانات تجريبية تُستخدم لبناء الواجهة
              واختبارها، وهي موسومة بذلك أينما ظهرت. وعند استبدالها ببيانات
              مرخّصة، ستحمل كل قيمة وحدتها وتوقيتها ومدة تأخيرها. ولن نعرض
              بيانات متأخرة على أنها مباشرة.
            </p>

            <h2>الصور</h2>
            <p>
              تُوصف الصور بما تُظهره فعلاً. وحين تكون الصورة توضيحية لا صورة
              للأصل المحدد موضوع التغطية، تُوسم بأنها توضيحية — فلا ننشر صورة خط
              نقل تحت مادة عن خط نقل آخر ونترك التعليق يوحي بغير ذلك. وتحمل كل
              صورة مصدرها ورخصتها. أما الرسوم الموسومة باسمنا فهي من إعدادنا.
            </p>

            <h2>التحليل والرأي والمحتوى المموّل</h2>
            <p>
              الخبر والتحليل والرأي موسومة ومتمايزة بصرياً. والمحتوى المموّل، إن
              نشرناه، يُوسم بذلك على البطاقة وفي الصفحة، ولا يُقدَّم أبداً بصورة
              يمكن أن تُخلط بالتغطية الصحفية.
            </p>

            <h2>الترجمة</h2>
            <p>
              العربية والإنجليزية منتجان متكافئان. ونفضّل التغطية الأصلية
              باللغتين. والمادة المترجمة تذكر ذلك، وتسمّي اللغة التي تُرجمت عنها،
              وتربط بالنص الأصلي. والترجمات الآلية يراجعها محرر قبل النشر وتُوسم
              بذلك.
            </p>

            <h2>التصحيحات</h2>
            <p>
              نصحّح الأخطاء بسرعة وبشكل ظاهر. ويُسجَّل التصحيح الجوهري في المادة
              بتاريخه وبما تغيّر، لا كتعديل صامت. وتُسجَّل التحديثات الجوهرية على
              المواد المتطورة بالطريقة نفسها.
            </p>

            <h2>المحتوى التجريبي</h2>
            <p>
              هذا الموقع حالياً نموذج أولي للواجهة. وبعض المواد محتوى تجريبي
              كُتب لملء الواجهة، وهو موسوم على كل بطاقة وفي الصفحة نفسها،
              ومستبعد من فهرسة محركات البحث.
            </p>
          </>
        )}
      </Prose>
    </>
  );
}
