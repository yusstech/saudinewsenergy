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
];

export const COMPANIES: Company[] = raw.map((c) => companySchema.parse(c));

export const COMPANY_MAP = new Map(COMPANIES.map((c) => [c.slug, c]));

export function getCompany(slug: string): Company | undefined {
  return COMPANY_MAP.get(slug);
}
