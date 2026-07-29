import { projectSchema, type Project } from './schema';

/**
 * Project records.
 *
 * The reference table behind the reporting: what each project is, where it is,
 * what it consists of and where it has got to. Records are shared by both
 * locales, so their prose is written twice.
 *
 * Nothing in this file is invented. If a figure is not known, the field is
 * absent rather than filled — the schema makes every quantitative field
 * optional for exactly that reason.
 */

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
    technology: [
      '380 kV double-circuit overhead line',
      'ACSR twin bundle conductor',
      'Optical ground wire (OPGW)',
      'Fibre-optic communications',
      'Teleprotection and SCADA integration',
    ],
    announcedDate: '2021-08-01',
    completedDate: '2023-09-30',
  },
  {
    slug: 'tabuk-380kv-transmission-line',
    name: {
      en: 'Tabuk 380 kV double-circuit overhead transmission line',
      ar: 'خط تبوك الهوائي مزدوج الدائرة جهد 380 كيلوفولت',
    },
    summary: {
      en: 'An approximately 112.5-kilometre double-circuit overhead transmission line on 309 towers across the Tabuk Region, using six tower designs — suspension, small, medium and heavy angle, transposition and terminal — and a quad-bundle conductor arrangement, delivered as an EPC package including optical ground wire, protection, communications and grid integration.',
      ar: 'خط نقل هوائي مزدوج الدائرة بطول نحو 112.5 كيلومتراً على 309 أبراج عبر منطقة تبوك، بستة تصاميم للأبراج تشمل أبراج التعليق وأبراج الزوايا الصغيرة والمتوسطة والكبيرة وأبراج تبديل الأطوار وأبراج النهاية، مع ترتيب موصلات رباعي الحزمة، نُفّذ كحزمة هندسة وتوريد وإنشاء شملت سلك الأرضي الضوئي والحماية والاتصالات والربط بالشبكة.',
    },
    sector: 'power',
    region: 'tabuk',
    location: { en: 'Tabuk Region', ar: 'منطقة تبوك' },
    status: 'operational',
    client: 'saudi-electricity-company',
    contractor: 'samaya-group',
    length: { value: 112.5, unit: 'km', note: 'approximate route length' },
    structures: { value: 309, unit: 'towers' },
    technology: [
      '380 kV double-circuit overhead line',
      'Quad-bundle phase conductor',
      'Six tower designs',
      'Optical ground wire (OPGW)',
      'Protection, control and communications',
    ],
    announcedDate: '2020-03-01',
    completedDate: '2022-03-31',
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
  },
];

export const PROJECTS: Project[] = raw.map((p) => projectSchema.parse(p));

export const PROJECT_MAP = new Map(PROJECTS.map((p) => [p.slug, p]));

export function getProject(slug: string): Project | undefined {
  return PROJECT_MAP.get(slug);
}
