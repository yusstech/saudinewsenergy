import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import { baseMetadata, projectJsonLd, jsonLdScript } from '@/lib/seo';
import { PROJECTS } from '@content/projects';
import { PageHeader } from '@/components/page-header';
import { ProjectFilters } from '@/components/project-filters';
import { ProjectCard } from '@/components/project-card';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'projects' });
  return {
    ...baseMetadata(locale, '/projects'),
    title: t('title'),
    description: t('intro'),
  };
}

/**
 * The projects feed.
 *
 * A card feed with region, sector and status filters — not a map. The concept
 * puts the interactive Saudi map in phase two, and that ordering is right:
 * a map is only better than a list once the underlying project data is
 * structured and consistently maintained, and until then it is a slower way to
 * find five records while implying a completeness the dataset does not have.
 *
 * Filtering runs on the client over a fully server-rendered list, so every
 * project is in the HTML for a crawler and for a reader whose JS never lands.
 */
export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('projects');

  const cards = await Promise.all(
    PROJECTS.map(async (project) => ({
      slug: project.slug,
      region: project.region,
      sector: project.sector,
      status: project.status,
      node: <ProjectCard project={project} locale={locale} />,
    })),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript({
            '@context': 'https://schema.org',
            '@graph': PROJECTS.map((p) => projectJsonLd(p, locale)),
          }),
        }}
      />

      <PageHeader title={t('title')} intro={t('intro')} />

      <div className="mx-auto max-w-[1440px] px-[--spacing-gutter] py-8">
        <ProjectFilters cards={cards} locale={locale} />
      </div>
    </>
  );
}
