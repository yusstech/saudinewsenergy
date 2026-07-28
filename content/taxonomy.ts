import type { Sector, Region, ContentEdition } from './schema';

type Bilingual = { en: string; ar: string };

/**
 * Desks, in navigation order.
 *
 * `primary: true` marks the six that sit in the main navigation bar; the rest
 * live under "More". The concept asks for a compact specialist nav, and a
 * twelve-item bar is how a specialist publication starts looking like a
 * general one.
 */
export const SECTORS: Array<{
  slug: Sector;
  label: Bilingual;
  blurb: Bilingual;
  primary: boolean;
}> = [
  {
    slug: 'saudi',
    label: { en: 'Saudi', ar: 'السعودية' },
    blurb: {
      en: 'Policy, projects and companies across the Kingdom.',
      ar: 'السياسات والمشاريع والشركات في أنحاء المملكة.',
    },
    primary: true,
  },
  {
    slug: 'oil-gas',
    label: { en: 'Oil & Gas', ar: 'النفط والغاز' },
    blurb: {
      en: 'Upstream, midstream, refining and trade.',
      ar: 'الاستكشاف والإنتاج والنقل والتكرير والتجارة.',
    },
    primary: true,
  },
  {
    slug: 'power',
    label: { en: 'Power & Utilities', ar: 'الكهرباء والمرافق' },
    blurb: {
      en: 'Generation, transmission, distribution and grid operations.',
      ar: 'التوليد والنقل والتوزيع وتشغيل الشبكة.',
    },
    primary: true,
  },
  {
    slug: 'renewables',
    label: { en: 'Renewables', ar: 'الطاقة المتجددة' },
    blurb: {
      en: 'Solar, wind and the National Renewable Energy Program.',
      ar: 'الطاقة الشمسية وطاقة الرياح والبرنامج الوطني للطاقة المتجددة.',
    },
    primary: true,
  },
  {
    slug: 'markets',
    label: { en: 'Markets', ar: 'الأسواق' },
    blurb: {
      en: 'Benchmarks, equities and trade flows.',
      ar: 'الأسعار المرجعية والأسهم وتدفقات التجارة.',
    },
    primary: true,
  },
  {
    slug: 'projects',
    label: { en: 'Projects', ar: 'المشاريع' },
    blurb: {
      en: 'Awards, financial close, construction and commissioning.',
      ar: 'الترسيات والإقفال المالي والإنشاء والتشغيل.',
    },
    primary: true,
  },
  {
    slug: 'hydrogen',
    label: { en: 'Hydrogen', ar: 'الهيدروجين' },
    blurb: {
      en: 'Clean hydrogen, ammonia and export infrastructure.',
      ar: 'الهيدروجين النظيف والأمونيا والبنية التحتية للتصدير.',
    },
    primary: false,
  },
  {
    slug: 'carbon',
    label: { en: 'Carbon & Climate', ar: 'الكربون والمناخ' },
    blurb: {
      en: 'Capture and storage, the circular carbon economy and national targets.',
      ar: 'الاحتجاز والتخزين والاقتصاد الدائري للكربون والمستهدفات الوطنية.',
    },
    primary: false,
  },
  {
    slug: 'petrochemicals',
    label: { en: 'Petrochemicals', ar: 'البتروكيماويات' },
    blurb: {
      en: 'Feedstock, conversion and downstream investment.',
      ar: 'اللقيم والتحويل والاستثمار في الصناعات التحويلية.',
    },
    primary: false,
  },
  {
    slug: 'technology',
    label: { en: 'Technology & Innovation', ar: 'التقنية والابتكار' },
    blurb: {
      en: 'Grid intelligence, digitalisation, efficiency and local manufacturing.',
      ar: 'ذكاء الشبكة والتحول الرقمي وكفاءة الطاقة والتصنيع المحلي.',
    },
    primary: false,
  },
  {
    slug: 'policy',
    label: { en: 'Policy & Regulation', ar: 'السياسات والتنظيم' },
    blurb: {
      en: 'Ministry decisions, regulation and Vision 2030 delivery.',
      ar: 'قرارات الوزارة والتنظيم وتنفيذ رؤية 2030.',
    },
    primary: false,
  },
  {
    slug: 'companies',
    label: { en: 'Companies', ar: 'الشركات' },
    blurb: {
      en: 'Operators, developers, contractors and suppliers.',
      ar: 'المشغلون والمطورون والمقاولون والموردون.',
    },
    primary: false,
  },
];

export const SECTOR_MAP = new Map(SECTORS.map((s) => [s.slug, s]));

export function sectorLabel(slug: Sector, locale: 'en' | 'ar'): string {
  return SECTOR_MAP.get(slug)?.label[locale] ?? slug;
}

export const PRIMARY_SECTORS = SECTORS.filter((s) => s.primary);
export const MORE_SECTORS = SECTORS.filter((s) => !s.primary);

/* --------------------------------------------------------------- regions -- */

export const REGIONS: Array<{ slug: Region; label: Bilingual }> = [
  { slug: 'riyadh', label: { en: 'Riyadh', ar: 'الرياض' } },
  { slug: 'makkah', label: { en: 'Makkah', ar: 'مكة المكرمة' } },
  { slug: 'madinah', label: { en: 'Madinah', ar: 'المدينة المنورة' } },
  {
    slug: 'eastern-province',
    label: { en: 'Eastern Province', ar: 'المنطقة الشرقية' },
  },
  { slug: 'asir', label: { en: 'Asir', ar: 'عسير' } },
  { slug: 'tabuk', label: { en: 'Tabuk', ar: 'تبوك' } },
  { slug: 'hail', label: { en: "Ha'il", ar: 'حائل' } },
  {
    slug: 'northern-borders',
    label: { en: 'Northern Borders', ar: 'الحدود الشمالية' },
  },
  { slug: 'jazan', label: { en: 'Jazan', ar: 'جازان' } },
  { slug: 'najran', label: { en: 'Najran', ar: 'نجران' } },
  { slug: 'al-bahah', label: { en: 'Al Bahah', ar: 'الباحة' } },
  { slug: 'al-jouf', label: { en: 'Al Jouf', ar: 'الجوف' } },
  { slug: 'qassim', label: { en: 'Qassim', ar: 'القصيم' } },
  { slug: 'kingdom-wide', label: { en: 'Kingdom-wide', ar: 'على مستوى المملكة' } },
  { slug: 'gcc', label: { en: 'GCC', ar: 'دول الخليج' } },
  { slug: 'mena', label: { en: 'MENA', ar: 'الشرق الأوسط وشمال أفريقيا' } },
  { slug: 'global', label: { en: 'Global', ar: 'عالمي' } },
];

export const REGION_MAP = new Map(REGIONS.map((r) => [r.slug, r]));

export function regionLabel(slug: Region, locale: 'en' | 'ar'): string {
  return REGION_MAP.get(slug)?.label[locale] ?? slug;
}

/** The Saudi regions offered as project filters — supra-national scopes excluded. */
export const SAUDI_REGIONS = REGIONS.filter(
  (r) => !['gcc', 'mena', 'global'].includes(r.slug),
);

/* -------------------------------------------------------------- editions -- */

export const EDITION_LABEL: Record<ContentEdition, Bilingual> = {
  saudi: { en: 'Saudi Arabia', ar: 'السعودية' },
  gcc: { en: 'GCC', ar: 'دول الخليج' },
  mena: { en: 'Middle East & North Africa', ar: 'الشرق الأوسط وشمال أفريقيا' },
  global: { en: 'Global Energy', ar: 'الطاقة عالمياً' },
};
