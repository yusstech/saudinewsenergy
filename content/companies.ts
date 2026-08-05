import { companySchema, type Company } from './schema';

/**
 * Organisations that appear in coverage.
 *
 * Inclusion follows editorial relevance, not commercial priority — an entity
 * page exists because we report on the organisation, and it disappears if we
 * stop. `url` is load-bearing beyond navigation: it is the identifier used in
 * schema.org `about` / `mentions`, which is how an answer engine resolves a
 * contractor named in our copy to the actual company rather than to a string.
 */
const raw: Company[] = [
  {
    slug: 'icco-offshore',
    name: {
      en: 'International Consolidated Contractors Offshore SAL',
      ar: 'إنترناشيونال كونسوليديتد كونتراكتورز أوفشور ش.م.ل',
    },
    type: 'contractor',
    summary: {
      en: 'An engineering, procurement and construction contractor working on high-voltage transmission infrastructure in the Levant, including the Rural Damascus–Daraa 400 kV double-circuit overhead line in southern Syria.',
      ar: 'مقاول هندسة وتوريد وإنشاء يعمل في بنية نقل الكهرباء عالية الجهد في بلاد الشام، ومن مشاريعه خط ريف دمشق–درعا الهوائي مزدوج الدائرة جهد 400 كيلوفولت في جنوب سوريا.',
    },
    sectors: ['power', 'projects'],
  },
  {
    slug: 'ministry-of-energy',
    name: { en: 'Ministry of Energy', ar: 'وزارة الطاقة' },
    type: 'government',
    summary: {
      en: 'The Syrian government body responsible for electricity, oil, gas and renewable energy, and the counterparty to the generation, interconnection and upstream agreements signed since 2025.',
      ar: 'الجهة الحكومية السورية المسؤولة عن الكهرباء والنفط والغاز والطاقة المتجددة، والطرف المقابل في اتفاقيات التوليد والربط والاستكشاف الموقّعة منذ 2025.',
    },
    sectors: ['policy', 'power', 'oil-gas', 'renewables'],
    headquarters: 'Damascus',
  },
  {
    slug: 'syrian-petroleum-company',
    name: { en: 'Syrian Petroleum Company', ar: 'الشركة السورية للنفط' },
    type: 'state-owned',
    summary: {
      en: 'Syria’s state oil company and the operator counterparty on the country’s first deep-water offshore exploration project.',
      ar: 'شركة النفط الحكومية السورية، والطرف المشغّل في أول مشروع استكشاف بحري في المياه العميقة في البلاد.',
    },
    sectors: ['oil-gas', 'companies'],
    headquarters: 'Damascus',
  },
  {
    slug: 'ucc-holding',
    name: { en: 'UCC Holding', ar: 'يو سي سي القابضة' },
    type: 'private',
    summary: {
      en: 'A Qatari group leading the consortium contracted to build 5,000 MW of new Syrian generation, and a partner on the Syrian offshore exploration project.',
      ar: 'مجموعة قطرية تقود التحالف المتعاقد على بناء 5000 ميغاواط من قدرات التوليد الجديدة في سوريا، وشريك في مشروع الاستكشاف البحري السوري.',
    },
    sectors: ['power', 'projects', 'oil-gas'],
    headquarters: 'Doha',
  },
  {
    slug: 'power-international-holding',
    name: {
      en: 'Power International Holding',
      ar: 'باور إنترناشونال القابضة',
    },
    type: 'private',
    summary: {
      en: 'A member of the consortium contracted for Syria’s 5,000 MW generation programme and a signatory to the offshore exploration memorandum with the Syrian Petroleum Company.',
      ar: 'عضو في التحالف المتعاقد على برنامج التوليد السوري بقدرة 5000 ميغاواط، وموقّع على مذكرة الاستكشاف البحري مع الشركة السورية للنفط.',
    },
    sectors: ['power', 'oil-gas', 'projects'],
  },
  {
    slug: 'kalyon-energy',
    name: { en: 'Kalyon G.I.S. Energy', ar: 'كاليون جي آي إس للطاقة' },
    type: 'private',
    summary: {
      en: 'A Turkish energy contractor and consortium member on Syria’s 5,000 MW gas and solar generation programme.',
      ar: 'مقاول طاقة تركي وعضو في تحالف برنامج التوليد الغازي والشمسي السوري بقدرة 5000 ميغاواط.',
    },
    sectors: ['power', 'renewables', 'projects'],
    headquarters: 'Turkey',
  },
  {
    slug: 'cengiz-energy',
    name: { en: 'Cengiz Energy', ar: 'جنكيز للطاقة' },
    type: 'private',
    summary: {
      en: 'A Turkish energy contractor and consortium member on Syria’s 5,000 MW gas and solar generation programme.',
      ar: 'مقاول طاقة تركي وعضو في تحالف برنامج التوليد الغازي والشمسي السوري بقدرة 5000 ميغاواط.',
    },
    sectors: ['power', 'renewables', 'projects'],
    headquarters: 'Turkey',
  },
  {
    slug: 'chevron',
    name: { en: 'Chevron', ar: 'شيفرون' },
    type: 'listed',
    summary: {
      en: 'A US oil and gas major, and the exploration partner on Syria’s first deep-water offshore block.',
      ar: 'شركة نفط وغاز أمريكية كبرى، وشريك الاستكشاف في أول رقعة بحرية سورية في المياه العميقة.',
    },
    sectors: ['oil-gas', 'companies'],
    url: 'https://www.chevron.com',
  },
  {
    slug: 'conocophillips',
    name: { en: 'ConocoPhillips', ar: 'كونوكوفيليبس' },
    type: 'listed',
    summary: {
      en: 'A US independent oil and gas producer contracted alongside Novatara Energy to develop and explore Syrian onshore gas fields.',
      ar: 'منتج نفط وغاز أمريكي مستقل، متعاقد إلى جانب نوفاتارا للطاقة على تطوير واستكشاف حقول الغاز البرية السورية.',
    },
    sectors: ['oil-gas', 'companies'],
    url: 'https://www.conocophillips.com',
  },
  {
    slug: 'socar',
    name: {
      en: 'SOCAR',
      ar: 'سوكار — شركة النفط الحكومية الأذربيجانية',
    },
    type: 'state-owned',
    summary: {
      en: 'Azerbaijan’s state oil company, supplying natural gas to Syrian power plants through the Turkey–Syria pipeline since August 2025.',
      ar: 'شركة النفط الحكومية الأذربيجانية، تورّد الغاز الطبيعي إلى محطات الكهرباء السورية عبر خط الأنابيب التركي–السوري منذ آب/أغسطس 2025.',
    },
    sectors: ['oil-gas', 'companies'],
    url: 'https://www.socar.az',
  },
];

export const COMPANIES: Company[] = raw.map((c) => companySchema.parse(c));

export const COMPANY_MAP = new Map(COMPANIES.map((c) => [c.slug, c]));

export function getCompany(slug: string): Company | undefined {
  return COMPANY_MAP.get(slug);
}
