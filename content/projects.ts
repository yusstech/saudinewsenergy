import { projectSchema, type Project } from './schema';

/**
 * Project records.
 *
 * Two classes of record live here and they are not interchangeable:
 *
 * - **Al Jouf** is built from primary project documentation supplied by the
 *   contractor (a Ministry of Energy letter of award, a completion
 *   confirmation, and the bill of quantities attached to it). Its figures are
 *   exact because the document is exact, and its `sources` say precisely that.
 *
 * - The remaining records carry **publicly announced** headline figures for
 *   well-reported Saudi projects. They are here so the projects feed, filters
 *   and entity pages have realistic shape. Their capacities are the announced
 *   round numbers, not derived estimates, and none of them claims a precision
 *   the public record does not support.
 *
 * Nothing in this file is invented. If a figure is not known, the field is
 * absent rather than filled — the schema makes every quantitative field
 * optional for exactly that reason.
 */

// Records are shared by both locales, so their prose is written twice. Document
// reference numbers are identifiers rather than prose and stay as issued.
const ALJOUF_DOCS = [
  {
    id: 'moe-loa-2021',
    label: {
      en: 'Ministry of Energy letter of award, ref MOE/LOA/2021/0801, 1 August 2021',
      ar: 'خطاب ترسية من وزارة الطاقة، المرجع MOE/LOA/2021/0801، بتاريخ 1 أغسطس 2021',
    },
    kind: 'project-document' as const,
    publisher: 'Ministry of Energy, Kingdom of Saudi Arabia',
    date: '2021-08-01',
    note: {
      en: 'Project documentation provided by Samaya Group Company Ltd. Not independently published by the ministry.',
      ar: 'وثائق مشروع مقدَّمة من شركة مجموعة سمايا المحدودة. لم تنشرها الوزارة بصورة مستقلة.',
    },
  },
  {
    id: 'moe-completion-2023',
    label: {
      en: 'Ministry of Energy project completion confirmation, ref MOE/TRANSMISSION/2023/0930, 30 September 2023, with appendix 1 (scope of work and bill of quantities)',
      ar: 'تأكيد إنجاز مشروع من وزارة الطاقة، المرجع MOE/TRANSMISSION/2023/0930، بتاريخ 30 سبتمبر 2023، مع الملحق 1 (نطاق العمل وجدول الكميات)',
    },
    kind: 'project-document' as const,
    publisher: 'Ministry of Energy, Kingdom of Saudi Arabia',
    date: '2023-09-30',
    note: {
      en: 'Project documentation provided by Samaya Group Company Ltd. Quantities cited in coverage are read from the attached bill of quantities.',
      ar: 'وثائق مشروع مقدَّمة من شركة مجموعة سمايا المحدودة. والكميات الواردة في التغطية مقروءة من جدول الكميات المرفق.',
    },
  },
];

const raw: Project[] = [
  {
    slug: 'al-jouf-380kv-transmission-line',
    name: {
      en: 'Al Jouf 380 kV double-circuit overhead transmission line',
      ar: 'خط الجوف الهوائي مزدوج الدائرة جهد 380 كيلوفولت',
    },
    summary: {
      en: 'An approximately 107-kilometre double-circuit overhead transmission line on 279 steel towers across the Tabarjal area of the Al Jouf region, delivered as an EPC package including optical ground wire, fibre-optic communications, protection and control systems, and grid integration.',
      ar: 'خط نقل هوائي مزدوج الدائرة بطول نحو 107 كيلومترات على 279 برجاً فولاذياً عبر منطقة طبرجل في الجوف، نُفّذ كحزمة هندسة وتوريد وإنشاء شملت سلك الأرضي الضوئي والاتصالات بالألياف البصرية وأنظمة الحماية والتحكم والربط بالشبكة.',
    },
    sector: 'power',
    region: 'al-jouf',
    location: { en: 'Tabarjal, Al Jouf Region', ar: 'طبرجل، منطقة الجوف' },
    status: 'operational',
    client: 'ministry-of-energy',
    contractor: 'samaya-group',
    length: { value: 107, unit: 'km', note: 'approximate route length' },
    structures: { value: 279, unit: 'towers' },
    value: { value: 201_612_900, currency: 'SAR' },
    technology: [
      '380 kV double-circuit overhead line',
      'ACSR twin bundle conductor',
      'Optical ground wire (OPGW)',
      'Fibre-optic communications',
      'Teleprotection and SCADA integration',
    ],
    announcedDate: '2021-08-01',
    completedDate: '2023-09-30',
    sources: ALJOUF_DOCS,
  },
  {
    slug: 'sakaka-solar-pv',
    name: { en: 'Sakaka solar PV plant', ar: 'محطة سكاكا للطاقة الشمسية' },
    summary: {
      en: 'The Kingdom’s first utility-scale solar plant procured under the National Renewable Energy Program, in the Al Jouf region.',
      ar: 'أول محطة شمسية بمقياس المرافق في المملكة ضمن البرنامج الوطني للطاقة المتجددة، في منطقة الجوف.',
    },
    sector: 'renewables',
    region: 'al-jouf',
    location: { en: 'Sakaka, Al Jouf Region', ar: 'سكاكا، منطقة الجوف' },
    status: 'operational',
    capacity: { value: 300, unit: 'MW' },
    technology: ['Solar photovoltaic'],
    sources: [
      {
        id: 'public-announced',
        label: {
          en: 'Publicly announced project figures',
          ar: 'أرقام المشروع المعلنة علناً',
        },
        kind: 'publication',
        note: {
          en: 'Headline capacity as publicly announced. Not verified against project documentation.',
          ar: 'السعة المعلنة كما أُعلنت علناً. غير متحقَّق منها مقابل وثائق المشروع.',
        },
      },
    ],
  },
  {
    slug: 'sudair-solar-pv',
    name: { en: 'Sudair solar PV plant', ar: 'محطة سدير للطاقة الشمسية' },
    summary: {
      en: 'A large-scale photovoltaic plant in Sudair Industrial City, among the largest single-site solar developments in the Kingdom.',
      ar: 'محطة كهروضوئية واسعة النطاق في مدينة سدير للصناعة والأعمال، من أكبر مشاريع الطاقة الشمسية في موقع واحد بالمملكة.',
    },
    sector: 'renewables',
    region: 'riyadh',
    location: { en: 'Sudair, Riyadh Region', ar: 'سدير، منطقة الرياض' },
    status: 'operational',
    capacity: { value: 1500, unit: 'MW' },
    technology: ['Solar photovoltaic'],
    sources: [
      {
        id: 'public-announced',
        label: {
          en: 'Publicly announced project figures',
          ar: 'أرقام المشروع المعلنة علناً',
        },
        kind: 'publication',
        note: {
          en: 'Headline capacity as publicly announced. Not verified against project documentation.',
          ar: 'السعة المعلنة كما أُعلنت علناً. غير متحقَّق منها مقابل وثائق المشروع.',
        },
      },
    ],
  },
  {
    slug: 'shuaibah-2-solar-pv',
    name: { en: 'Shuaibah 2 solar PV plant', ar: 'محطة الشعيبة 2 للطاقة الشمسية' },
    summary: {
      en: 'A utility-scale photovoltaic development on the Red Sea coast in the Makkah region.',
      ar: 'مشروع كهروضوئي بمقياس المرافق على ساحل البحر الأحمر في منطقة مكة المكرمة.',
    },
    sector: 'renewables',
    region: 'makkah',
    location: { en: 'Shuaibah, Makkah Region', ar: 'الشعيبة، منطقة مكة المكرمة' },
    status: 'under-construction',
    capacity: { value: 2060, unit: 'MW' },
    technology: ['Solar photovoltaic'],
    sources: [
      {
        id: 'public-announced',
        label: {
          en: 'Publicly announced project figures',
          ar: 'أرقام المشروع المعلنة علناً',
        },
        kind: 'publication',
        note: {
          en: 'Headline capacity as publicly announced. Not verified against project documentation.',
          ar: 'السعة المعلنة كما أُعلنت علناً. غير متحقَّق منها مقابل وثائق المشروع.',
        },
      },
    ],
  },
  {
    slug: 'neom-green-hydrogen',
    name: {
      en: 'NEOM green hydrogen project',
      ar: 'مشروع نيوم للهيدروجين الأخضر',
    },
    summary: {
      en: 'A green hydrogen and ammonia production complex in Tabuk province, powered by dedicated solar and wind generation.',
      ar: 'مجمع لإنتاج الهيدروجين الأخضر والأمونيا في منطقة تبوك، تغذيه محطات مخصصة للطاقة الشمسية وطاقة الرياح.',
    },
    sector: 'hydrogen',
    region: 'tabuk',
    location: { en: 'NEOM, Tabuk Province', ar: 'نيوم، منطقة تبوك' },
    status: 'under-construction',
    capacity: { value: 2.2, unit: 'GW', note: 'dedicated renewable generation' },
    technology: ['Electrolysis', 'Green ammonia', 'Solar', 'Wind'],
    sources: [
      {
        id: 'public-announced',
        label: {
          en: 'Publicly announced project figures',
          ar: 'أرقام المشروع المعلنة علناً',
        },
        kind: 'publication',
        note: {
          en: 'Headline figures as publicly announced. Not verified against project documentation.',
          ar: 'الأرقام الرئيسية كما أُعلنت علناً. غير متحقَّق منها مقابل وثائق المشروع.',
        },
      },
    ],
  },
];

export const PROJECTS: Project[] = raw.map((p) => projectSchema.parse(p));

export const PROJECT_MAP = new Map(PROJECTS.map((p) => [p.slug, p]));

export function getProject(slug: string): Project | undefined {
  return PROJECT_MAP.get(slug);
}
