import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { Figure } from './figure';
import type { MediaAsset } from '@content/schema';

/**
 * Renders a story body.
 *
 * Figures are referenced from the prose by index (`<Figure id="1" />`) and
 * resolved against the story's own `images` frontmatter rather than being
 * declared inline. That keeps every asset's alt text, credit and licence inside
 * the validated frontmatter, where the schema can enforce them — a writer
 * cannot drop an unaccounted-for `<img>` into the body, because the body has no
 * way to express one.
 *
 * `remark-gfm` is loaded for one feature that matters to this publication:
 * tables. A project story's schedule of quantities — tower types against
 * counts, spans against crossings — is the densest and most quotable thing on
 * the page, and writing it as anything other than a table means an answer
 * engine has to reconstruct the rows from prose.
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
        options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
        components={{
          // A wide schedule scrolls inside its own box. Letting the table push
          // the page wide is what breaks the layout on a phone.
          table: (props) => (
            <div className="my-7 overflow-x-auto">
              <table {...props} />
            </div>
          ),
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
