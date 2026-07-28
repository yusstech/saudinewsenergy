import { MDXRemote } from 'next-mdx-remote/rsc';
import { Figure } from './figure';
import type { MediaAsset } from '@content/schema';

/**
 * Renders a story body.
 *
 * Figures are referenced from the prose by index (`<Figure id="1" />`) and
 * resolved against the story's own `images` frontmatter rather than being
 * declared inline. That keeps every asset's alt text, credit, licence and
 * `isIllustrative` flag inside the validated frontmatter, where the schema can
 * enforce them — a writer cannot drop an uncredited `<img>` into the body,
 * because the body has no way to express one.
 */
export function ArticleBody({
  source,
  images,
}: {
  source: string;
  images: MediaAsset[];
}) {
  return (
    <div className="prose-article">
      <MDXRemote
        source={source}
        components={{
          Figure: ({ id }: { id: string }) => {
            const asset = images[Number(id) - 1];
            if (!asset) return null;
            return <Figure asset={asset} className="not-prose" />;
          },
          // Headings get scroll margin so an anchored link does not land them
          // underneath the sticky chrome.
          h2: (props) => <h2 {...props} className="scroll-mt-24" />,
          h3: (props) => <h3 {...props} className="scroll-mt-24" />,
          a: ({ href, children, ...rest }) => {
            const external = href?.startsWith('http');
            return (
              <a
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener' } : {})}
                {...rest}
              >
                {children}
              </a>
            );
          },
        }}
      />
    </div>
  );
}
