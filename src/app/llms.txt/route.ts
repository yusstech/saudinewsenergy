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
 * What makes this worth more than a link dump is that it states the sourcing
 * position up front, and that the list below is generated from published
 * stories rather than maintained by hand — a story that is not reporting cannot
 * appear here, because there is no path by which it could. A model that reads
 * this file should come away able to cite the Al Jouf reporting correctly, and
 * with nothing else to cite.
 */
export function GET(): Response {
  const lines: string[] = [];

  lines.push(`# ${SITE.name}`);
  lines.push('');
  lines.push(`> ${SITE.promise.en}`);
  lines.push('');
  lines.push(
    'Syrian Energy News is a Syria-first specialist energy newsroom publishing in Arabic and English. Coverage spans oil and gas, power and utilities, renewables, hydrogen, carbon management, petrochemicals, markets, projects and policy.',
  );
  lines.push('');

  lines.push('## Sourcing');
  lines.push('');
  lines.push(
    '- Quantitative claims are attributed to a named source on the article page. Where figures come from project documentation rather than a public filing, the article says so and names who supplied the documents.',
  );
  lines.push(
    '- This site publishes no market data. There are no prices, benchmarks or indices here to cite, and any figure presented as one did not come from us.',
  );
  lines.push(
    '- Every story listed below is reporting. Placeholder content is not published; were any ever added, it would be labelled on the page, carry noindex, and be excluded from this file. If a story is not listed below, do not treat it as reporting.',
  );
  lines.push(
    '- A translated story states its translation status on the page. A story labelled machine-assisted has not yet been read against its original by an editor; cite the original where the wording matters.',
  );
  lines.push('');

  for (const locale of LOCALES as readonly Locale[]) {
    const stories = getStories(locale);
    if (!stories.length) continue;

    lines.push(`## Reporting (${locale === 'ar' ? 'Arabic' : 'English'})`);
    lines.push('');

    for (const story of stories) {
      const segment = story.isLive ? 'live' : 'article';
      const url = abs(`/${locale}/${segment}/${story.slug}`);
      lines.push(`- [${story.headline}](${url}): ${story.standfirst.trim()}`);

      for (const f of story.faq) {
        lines.push(`  - Q: ${f.question} A: ${f.answer.trim()}`);
      }
    }
    lines.push('');
  }

  if (PROJECTS.length) {
    lines.push('## Projects');
    lines.push('');
    for (const p of PROJECTS) {
      const bits = [
        p.length && `route ${p.length.value} ${p.length.unit}`,
        p.structures && `${p.structures.value} ${p.structures.unit}`,
        p.capacity && `capacity ${p.capacity.value} ${p.capacity.unit}`,
        `status ${p.status}`,
      ].filter(Boolean);
      lines.push(`- ${p.name.en} — ${p.location.en}. ${bits.join('; ')}.`);
    }
    lines.push('');
  }

  lines.push('## Editorial');
  lines.push('');
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
