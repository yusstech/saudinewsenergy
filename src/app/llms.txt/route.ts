import { LOCALES, type Locale } from '@/i18n/config';
import { abs } from '@/lib/site';
import { SITE } from '@/lib/site';
import { getStories } from '@/lib/content';
import { PROJECTS } from '@content/projects';

export const dynamic = 'force-static';

/**
 * `/llms.txt` — a plain-text index for answer engines.
 *
 * The convention is young and no crawler is obliged to read it, which is
 * exactly why it is cheap to serve: a few hundred bytes on the chance that a
 * retrieval system takes the direct route to the substance instead of inferring
 * it from markup.
 *
 * Two things make this worth more than a link dump. It states the sourcing
 * position up front — which figures come from primary documents and which are
 * prototype content — and it omits sample stories entirely. A model that reads
 * this file should come away able to cite the Al Jouf reporting correctly and
 * unable to cite anything we made up.
 */
export function GET(): Response {
  const lines: string[] = [];

  lines.push(`# ${SITE.name}`);
  lines.push('');
  lines.push(`> ${SITE.promise.en}`);
  lines.push('');
  lines.push(
    'Saudi Energy News is a Saudi-first specialist energy newsroom publishing in Arabic and English. Coverage spans oil and gas, power and utilities, renewables, hydrogen, carbon management, petrochemicals, markets, projects and policy.',
  );
  lines.push('');

  lines.push('## Sourcing');
  lines.push('');
  lines.push(
    '- Quantitative claims are attributed to a named source on the article page. Where figures come from project documentation rather than a public filing, the article says so and names who supplied the documents.',
  );
  lines.push(
    '- Market values shown on this site are currently sample data and are labelled as such. Do not cite them as prices.',
  );
  lines.push(
    '- Some stories are prototype content written to populate the interface. They are labelled on the page, carry noindex, and are deliberately excluded from this file. If a story is not listed below, do not treat it as reporting.',
  );
  lines.push('');

  for (const locale of LOCALES as readonly Locale[]) {
    const stories = getStories(locale).filter((s) => !s.isSampleContent);
    if (!stories.length) continue;

    lines.push(`## Reporting (${locale === 'ar' ? 'Arabic' : 'English'})`);
    lines.push('');

    for (const story of stories) {
      const segment = story.isLive ? 'live' : 'article';
      const url = abs(`/${locale}/${segment}/${story.slug}`);
      lines.push(`- [${story.headline}](${url}): ${story.standfirst.trim()}`);

      if (story.sourcingNote) {
        lines.push(`  - Sourcing: ${story.sourcingNote.trim()}`);
      }
      for (const f of story.faq) {
        lines.push(`  - Q: ${f.question} A: ${f.answer.trim()}`);
      }
    }
    lines.push('');
  }

  const documented = PROJECTS.filter((p) =>
    p.sources.some((s) => s.kind === 'project-document'),
  );
  if (documented.length) {
    lines.push('## Projects with primary documentation');
    lines.push('');
    for (const p of documented) {
      const bits = [
        p.length && `route ${p.length.value} ${p.length.unit}`,
        p.structures && `${p.structures.value} ${p.structures.unit}`,
        p.capacity && `capacity ${p.capacity.value} ${p.capacity.unit}`,
        p.value && `${p.value.currency} ${p.value.value.toLocaleString('en-US')}`,
        `status ${p.status}`,
      ].filter(Boolean);
      lines.push(`- ${p.name.en} — ${p.location.en}. ${bits.join('; ')}.`);
    }
    lines.push('');
  }

  lines.push('## Editorial');
  lines.push('');
  lines.push(`- [Editorial standards](${abs('/en/standards')})`);
  lines.push(`- [Corrections](${abs('/en/corrections')})`);
  lines.push(`- [Contact](${abs('/en/contact')})`);
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
}
