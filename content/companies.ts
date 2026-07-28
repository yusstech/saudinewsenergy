import { companySchema, type Company } from './schema';

/**
 * Organisations that appear in coverage.
 *
 * Inclusion follows editorial relevance, not commercial priority — an entity
 * page exists because we report on the organisation, and it disappears if we
 * stop. `url` is load-bearing beyond navigation: it is the identifier used in
 * schema.org `about` / `mentions`, which is how an answer engine resolves
 * "Samaya Group" in our copy to the actual company rather than to a string.
 */
const raw: Company[] = [
  {
    slug: 'ministry-of-energy',
    name: { en: 'Ministry of Energy', ar: 'وزارة الطاقة' },
    type: 'government',
    summary: {
      en: 'The Saudi government body responsible for the Kingdom’s integrated energy remit — oil, gas, refining, petrochemicals, electricity, renewables, clean hydrogen and carbon management.',
      ar: 'الجهة الحكومية المسؤولة عن منظومة الطاقة المتكاملة في المملكة، وتشمل النفط والغاز والتكرير والبتروكيماويات والكهرباء والطاقة المتجددة والهيدروجين النظيف وإدارة الكربون.',
    },
    sectors: ['policy', 'oil-gas', 'power', 'renewables', 'hydrogen', 'carbon'],
    url: 'https://www.moenergy.gov.sa/en/ministry/about/about-ministry',
    headquarters: 'Riyadh',
  },
  {
    slug: 'samaya-group',
    name: { en: 'Samaya Group Company Ltd.', ar: 'شركة مجموعة سمايا المحدودة' },
    type: 'contractor',
    summary: {
      en: 'An engineering, procurement and construction contractor working on high-voltage transmission infrastructure in Saudi Arabia, including the Al Jouf 380 kV double-circuit overhead line in the Tabarjal area.',
      ar: 'مقاول هندسة وتوريد وإنشاء يعمل في بنية نقل الكهرباء عالية الجهد في السعودية، ومن مشاريعه خط الجوف الهوائي مزدوج الدائرة جهد 380 كيلوفولت في منطقة طبرجل.',
    },
    sectors: ['power', 'projects'],
    headquarters: 'Saudi Arabia',
  },
  {
    slug: 'saudi-aramco',
    name: { en: 'Saudi Aramco', ar: 'أرامكو السعودية' },
    type: 'listed',
    summary: {
      en: 'The Kingdom’s national oil company and one of the world’s largest integrated energy and chemicals producers.',
      ar: 'شركة النفط الوطنية في المملكة وإحدى أكبر شركات الطاقة والكيماويات المتكاملة في العالم.',
    },
    sectors: ['oil-gas', 'petrochemicals', 'hydrogen', 'carbon'],
    url: 'https://www.aramco.com',
    headquarters: 'Dhahran',
  },
  {
    slug: 'saudi-electricity-company',
    name: { en: 'Saudi Electricity Company', ar: 'الشركة السعودية للكهرباء' },
    type: 'utility',
    summary: {
      en: 'The Kingdom’s principal electricity utility, responsible for distribution and, through the National Grid SA, high-voltage transmission.',
      ar: 'المرفق الكهربائي الرئيسي في المملكة، ويتولى التوزيع ونقل الكهرباء عالي الجهد عبر الشركة الوطنية للنقل.',
    },
    sectors: ['power'],
    url: 'https://www.se.com.sa',
    headquarters: 'Riyadh',
  },
  {
    slug: 'national-grid-sa',
    name: { en: 'National Grid SA', ar: 'الشركة الوطنية لنقل الكهرباء' },
    type: 'utility',
    summary: {
      en: 'The transmission system operator for Saudi Arabia, responsible for the high-voltage network that links generation to demand centres across the Kingdom.',
      ar: 'مشغّل نظام النقل في السعودية، ويتولى الشبكة عالية الجهد التي تربط التوليد بمراكز الأحمال في أنحاء المملكة.',
    },
    sectors: ['power'],
    headquarters: 'Riyadh',
  },
  {
    slug: 'acwa-power',
    name: { en: 'ACWA Power', ar: 'أكوا باور' },
    type: 'listed',
    summary: {
      en: 'A Saudi developer, investor and operator of power generation, desalination and green hydrogen projects across the Kingdom and internationally.',
      ar: 'شركة سعودية مطوّرة ومستثمرة ومشغّلة لمشاريع توليد الكهرباء وتحلية المياه والهيدروجين الأخضر داخل المملكة وخارجها.',
    },
    sectors: ['power', 'renewables', 'hydrogen'],
    url: 'https://www.acwapower.com',
    headquarters: 'Riyadh',
  },
  {
    slug: 'saudi-power-procurement-company',
    name: {
      en: 'Saudi Power Procurement Company',
      ar: 'الشركة السعودية لشراء الطاقة',
    },
    type: 'state-owned',
    summary: {
      en: 'The principal buyer for electricity in Saudi Arabia, contracting generation capacity on behalf of the sector.',
      ar: 'المشتري الرئيسي للكهرباء في السعودية، ويتعاقد على السعات التوليدية نيابة عن القطاع.',
    },
    sectors: ['power', 'markets'],
    headquarters: 'Riyadh',
  },
  {
    slug: 'neom',
    name: { en: 'NEOM', ar: 'نيوم' },
    type: 'developer',
    summary: {
      en: 'A development in Tabuk province whose energy programme includes large-scale renewables and green hydrogen production.',
      ar: 'مشروع تطويري في منطقة تبوك يشمل برنامجه للطاقة مشاريع واسعة للطاقة المتجددة وإنتاج الهيدروجين الأخضر.',
    },
    sectors: ['renewables', 'hydrogen', 'projects'],
    url: 'https://www.neom.com',
    headquarters: 'Tabuk Province',
  },
  {
    slug: 'public-investment-fund',
    name: { en: 'Public Investment Fund', ar: 'صندوق الاستثمارات العامة' },
    type: 'institution',
    summary: {
      en: 'Saudi Arabia’s sovereign wealth fund, and a principal investor in the Kingdom’s renewable generation and energy transition programmes.',
      ar: 'صندوق الثروة السيادي في السعودية، ومستثمر رئيسي في برامج التوليد المتجدد وتحوّل الطاقة في المملكة.',
    },
    sectors: ['renewables', 'markets', 'companies'],
    url: 'https://www.pif.gov.sa',
    headquarters: 'Riyadh',
  },
];

export const COMPANIES: Company[] = raw.map((c) => companySchema.parse(c));

export const COMPANY_MAP = new Map(COMPANIES.map((c) => [c.slug, c]));

export function getCompany(slug: string): Company | undefined {
  return COMPANY_MAP.get(slug);
}
