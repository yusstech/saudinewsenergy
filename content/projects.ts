import { z } from 'zod';
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

// The *input* type: fields with schema defaults (alternateNames, technology)
// stay optional here and are filled in by `parse` below.
const raw: z.input<typeof projectSchema>[] = [
  {
    slug: 'north-aleppo-power-plant',
    name: {
      en: 'North Aleppo combined-cycle power plant',
      ar: 'محطة شمال حلب لتوليد الكهرباء بالدورة المركبة',
    },
    alternateNames: ['North Aleppo CCGT', 'Aleppo 1,200 MW power plant'],
    summary: {
      en: 'The largest of four gas-fired plants in the 5,000 MW generation programme agreed with a Qatari-Turkish-US consortium in November 2025.',
      ar: 'أكبر أربع محطات غازية ضمن برنامج التوليد بقدرة 5000 ميغاواط المتفق عليه مع تحالف قطري–تركي–أمريكي في تشرين الثاني/نوفمبر 2025.',
    },
    sector: 'power',
    region: 'aleppo',
    location: { en: 'North Aleppo, Aleppo Governorate', ar: 'شمال حلب، محافظة حلب' },
    status: 'awarded',
    client: 'ministry-of-energy',
    contractor: 'ucc-holding',
    capacity: { value: 1200, unit: 'MW' },
    technology: ['Combined-cycle gas turbine'],
    announcedDate: '2025-11-06',
  },
  {
    slug: 'deir-ezzor-power-plant',
    name: {
      en: 'Deir ez-Zor combined-cycle power plant',
      ar: 'محطة دير الزور لتوليد الكهرباء بالدورة المركبة',
    },
    summary: {
      en: 'A 1,000 MW gas-fired plant in the 5,000 MW generation programme agreed in November 2025.',
      ar: 'محطة غازية بقدرة 1000 ميغاواط ضمن برنامج التوليد بقدرة 5000 ميغاواط المتفق عليه في تشرين الثاني/نوفمبر 2025.',
    },
    sector: 'power',
    region: 'deir-ez-zor',
    location: { en: 'Deir ez-Zor Governorate', ar: 'محافظة دير الزور' },
    status: 'awarded',
    client: 'ministry-of-energy',
    contractor: 'ucc-holding',
    capacity: { value: 1000, unit: 'MW' },
    technology: ['Combined-cycle gas turbine'],
    announcedDate: '2025-11-06',
  },
  {
    slug: 'zayzoun-power-plant',
    name: {
      en: 'Zayzoun combined-cycle power plant',
      ar: 'محطة زيزون لتوليد الكهرباء بالدورة المركبة',
    },
    summary: {
      en: 'A 1,000 MW gas-fired plant in the 5,000 MW generation programme agreed in November 2025.',
      ar: 'محطة غازية بقدرة 1000 ميغاواط ضمن برنامج التوليد بقدرة 5000 ميغاواط المتفق عليه في تشرين الثاني/نوفمبر 2025.',
    },
    sector: 'power',
    region: 'idlib',
    location: { en: 'Zayzoun, Idlib Governorate', ar: 'زيزون، محافظة إدلب' },
    status: 'awarded',
    client: 'ministry-of-energy',
    contractor: 'ucc-holding',
    capacity: { value: 1000, unit: 'MW' },
    technology: ['Combined-cycle gas turbine'],
    announcedDate: '2025-11-06',
  },
  {
    slug: 'mhardeh-power-plant',
    name: {
      en: 'Mhardeh combined-cycle power plant',
      ar: 'محطة محردة لتوليد الكهرباء بالدورة المركبة',
    },
    alternateNames: ['Mahardah power plant'],
    summary: {
      en: 'An 800 MW gas-fired plant in the 5,000 MW generation programme agreed in November 2025.',
      ar: 'محطة غازية بقدرة 800 ميغاواط ضمن برنامج التوليد بقدرة 5000 ميغاواط المتفق عليه في تشرين الثاني/نوفمبر 2025.',
    },
    sector: 'power',
    region: 'hama',
    location: { en: 'Mhardeh, Hama Governorate', ar: 'محردة، محافظة حماة' },
    status: 'awarded',
    client: 'ministry-of-energy',
    contractor: 'ucc-holding',
    capacity: { value: 800, unit: 'MW' },
    technology: ['Combined-cycle gas turbine'],
    announcedDate: '2025-11-06',
  },
  {
    slug: 'syria-1000mw-solar-programme',
    name: {
      en: 'Syria 1,000 MW solar programme',
      ar: 'برنامج الطاقة الشمسية السوري بقدرة 1000 ميغاواط',
    },
    alternateNames: ['1 GW Syrian solar programme'],
    summary: {
      en: 'Four photovoltaic plants totalling 1,000 MW at Widian Al-Rabee (200 MW), Deir ez-Zor (300 MW), Aleppo (300 MW) and Homs (200 MW), forming the renewable share of the 5,000 MW generation programme.',
      ar: 'أربع محطات كهروضوئية بإجمالي 1000 ميغاواط في وديان الربيع (200) ودير الزور (300) وحلب (300) وحمص (200)، وتشكّل الحصة المتجددة من برنامج التوليد بقدرة 5000 ميغاواط.',
    },
    sector: 'renewables',
    region: 'nationwide',
    location: {
      en: 'Widian Al-Rabee, Deir ez-Zor, Aleppo and Homs',
      ar: 'وديان الربيع ودير الزور وحلب وحمص',
    },
    status: 'awarded',
    client: 'ministry-of-energy',
    contractor: 'ucc-holding',
    capacity: { value: 1000, unit: 'MW', note: 'across four sites' },
    technology: ['Photovoltaic'],
    announcedDate: '2025-11-06',
  },
  {
    slug: 'syria-offshore-exploration-block',
    name: {
      en: 'Syrian deep-water offshore exploration block',
      ar: 'الرقعة الاستكشافية البحرية السورية في المياه العميقة',
    },
    alternateNames: ['Syria first deep-water block'],
    summary: {
      en: 'Syria’s first deep-water offshore oil and gas exploration project, in territorial waters, with Chevron proceeding alongside the Syrian Petroleum Company and UCC Holding. Technical and field operations were scheduled to begin in summer 2026.',
      ar: 'أول مشروع استكشاف نفط وغاز بحري في المياه العميقة السورية، ضمن المياه الإقليمية، بمشاركة شيفرون إلى جانب الشركة السورية للنفط ويو سي سي القابضة. وكان من المقرر بدء العمليات الفنية والميدانية في صيف 2026.',
    },
    sector: 'oil-gas',
    region: 'latakia',
    location: { en: 'Syrian territorial waters, eastern Mediterranean', ar: 'المياه الإقليمية السورية، شرق المتوسط' },
    status: 'announced',
    client: 'syrian-petroleum-company',
    contractor: 'chevron',
    technology: ['Deep-water offshore exploration'],
    announcedDate: '2026-02-04',
  },
];

export const PROJECTS: Project[] = raw.map((p) => projectSchema.parse(p));

export const PROJECT_MAP = new Map(PROJECTS.map((p) => [p.slug, p]));

export function getProject(slug: string): Project | undefined {
  return PROJECT_MAP.get(slug);
}
