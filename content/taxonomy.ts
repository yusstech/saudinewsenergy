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
    slug: 'syria',
    label: { en: 'Syria', ar: 'سوريا' },
    blurb: {
      en: 'Policy, projects and companies across the country.',
      ar: 'السياسات والمشاريع والشركات في أنحاء البلاد.',
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
      en: 'Solar, wind and distributed generation.',
      ar: 'الطاقة الشمسية وطاقة الرياح والتوليد الموزع.',
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
  { slug: 'damascus', label: { en: 'Damascus', ar: 'دمشق' } },
  { slug: 'rural-damascus', label: { en: 'Rural Damascus', ar: 'ريف دمشق' } },
  { slug: 'aleppo', label: { en: 'Aleppo', ar: 'حلب' } },
  { slug: 'homs', label: { en: 'Homs', ar: 'حمص' } },
  { slug: 'hama', label: { en: 'Hama', ar: 'حماة' } },
  { slug: 'latakia', label: { en: 'Latakia', ar: 'اللاذقية' } },
  { slug: 'tartus', label: { en: 'Tartus', ar: 'طرطوس' } },
  { slug: 'idlib', label: { en: 'Idlib', ar: 'إدلب' } },
  { slug: 'daraa', label: { en: 'Daraa', ar: 'درعا' } },
  { slug: 'as-suwayda', label: { en: 'As-Suwayda', ar: 'السويداء' } },
  { slug: 'quneitra', label: { en: 'Quneitra', ar: 'القنيطرة' } },
  { slug: 'deir-ez-zor', label: { en: 'Deir ez-Zor', ar: 'دير الزور' } },
  { slug: 'raqqa', label: { en: 'Raqqa', ar: 'الرقة' } },
  { slug: 'al-hasakah', label: { en: 'Al-Hasakah', ar: 'الحسكة' } },
  { slug: 'nationwide', label: { en: 'Nationwide', ar: 'على مستوى سوريا' } },
  { slug: 'levant', label: { en: 'Levant', ar: 'بلاد الشام' } },
  { slug: 'mena', label: { en: 'MENA', ar: 'الشرق الأوسط وشمال أفريقيا' } },
  { slug: 'global', label: { en: 'Global', ar: 'عالمي' } },
];

export const REGION_MAP = new Map(REGIONS.map((r) => [r.slug, r]));

export function regionLabel(slug: Region, locale: 'en' | 'ar'): string {
  return REGION_MAP.get(slug)?.label[locale] ?? slug;
}

/** The Syrian regions offered as project filters — supra-national scopes excluded. */
export const SYRIA_REGIONS = REGIONS.filter(
  (r) => !['levant', 'mena', 'global'].includes(r.slug),
);

/* -------------------------------------------------------------- editions -- */

export const EDITION_LABEL: Record<ContentEdition, Bilingual> = {
  syria: { en: 'Syria', ar: 'سوريا' },
  levant: { en: 'Levant', ar: 'بلاد الشام' },
  mena: { en: 'Middle East & North Africa', ar: 'الشرق الأوسط وشمال أفريقيا' },
  global: { en: 'Global Energy', ar: 'الطاقة عالمياً' },
};
