import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LOCALES, type Locale } from '@/i18n/config';
import { baseMetadata, jsonLdScript } from '@/lib/seo';
import { abs } from '@/lib/site';
import { COMPANIES, getCompany } from '@content/companies';
import { PROJECTS } from '@content/projects';
import { getStoriesByCompany } from '@/lib/content';
import { sectorLabel } from '@content/taxonomy';
import { StoryCard } from '@/components/story-card';
import { ProjectCard } from '@/components/project-card';
import { SectionHeading } from '@/components/section';
import { PageHeader, EmptyState } from '@/components/page-header';

/**
 * Every valid slug is enumerated by generateStaticParams, so anything else is
 * genuinely not a page here. Without this, an unknown slug renders on demand,
 * hits `notFound()` and returns the 404 *body* with a 200 status — a soft 404
 * that search engines will happily index as a real page.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    COMPANIES.map((c) => ({ locale, slug: c.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const company = getCompany(slug);
  if (!company) return {};
  return {
    ...baseMetadata(locale, `/company/${slug}`),
    title: company.name[locale],
    description: company.summary[locale],
  };
}

/**
 * An entity page.
 *
 * The `sameAs` link to the organisation's own site is the load-bearing part of
 * the structured data here. It is what lets a consumer resolve "Samaya Group"
 * in our copy to a real company rather than to a string that happens to recur —
 * which is the same mechanism that makes our `mentions` markup on articles
 * worth emitting at all.
 */
export default async function CompanyPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const company = getCompany(slug);
  if (!company) notFound();

  const t = await getTranslations('company');
  const tp = await getTranslations('projects');

  const stories = getStoriesByCompany(locale, slug);
  const projects = PROJECTS.filter(
    (p) => p.client === slug || p.contractor === slug,
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            '@id': `${abs(`/${locale}/company/${slug}`)}#organization`,
            name: company.name[locale],
            alternateName:
              locale === 'ar' ? company.name.en : company.name.ar,
            description: company.summary[locale],
            ...(company.url ? { url: company.url, sameAs: [company.url] } : {}),
            ...(company.headquarters
              ? {
                  address: {
                    '@type': 'PostalAddress',
                    addressLocality: company.headquarters,
                    addressCountry: 'SA',
                  },
                }
              : {}),
          }),
        }}
      />

      <PageHeader
        eyebrow={t(`type.${company.type}`)}
        title={company.name[locale]}
        intro={company.summary[locale]}
      >
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {company.sectors.map((s) => (
            <span
              key={s}
              className="rounded-sm bg-surface-sunken px-2 py-1 text-xs font-medium"
            >
              {sectorLabel(s, locale)}
            </span>
          ))}
          {company.url && (
            <a
              href={company.url}
              target="_blank"
              rel="noopener"
              className="text-xs font-medium text-brand-500 underline underline-offset-4"
            >
              {company.url.replace(/^https?:\/\//, '')}
            </a>
          )}
        </div>
      </PageHeader>

      <div className="page space-y-[var(--space-section)] py-[var(--space-block)]">
        <section>
          <SectionHeading title={t('coverage')} />
          {stories.length === 0 ? (
            <EmptyState title={t('noCoverage')} />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {stories.map((s) => (
                <StoryCard key={s.slug} story={s} locale={locale} />
              ))}
            </div>
          )}
        </section>

        {projects.length > 0 && (
          <section>
            <SectionHeading title={tp('title')} />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <ProjectCard
                  key={p.slug}
                  project={p}
                  locale={locale}
                  id={`company-${p.slug}`}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
