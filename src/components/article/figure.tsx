import { getTranslations } from 'next-intl/server';
import type { MediaAsset } from '@content/schema';

/**
 * A figure and its caption.
 *
 * The caption carries the editorial line and nothing else. Where the picture
 * came from is recorded in the asset's frontmatter — `credit` and `license` are
 * required by the schema — but that record is the newsroom's, not the page's,
 * and it is what governs which images may be used here in the first place.
 *
 * The one mark the page does carry is on in-house diagrams, which say so.
 */
export async function Figure({
  asset,
  priority = false,
  className = '',
}: {
  asset: MediaAsset;
  priority?: boolean;
  className?: string;
}) {
  const t = await getTranslations('article');

  return (
    <figure className={`my-8 ${className}`}>
      <div className="overflow-hidden bg-surface-sunken">
        <img
          src={asset.src}
          alt={asset.alt}
          width={asset.width}
          height={asset.height}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : undefined}
          className="w-full"
        />
      </div>

      <figcaption className="mt-2.5 space-y-1 text-meta leading-relaxed text-muted">
        {asset.caption && <p>{asset.caption}</p>}

        {asset.isDiagram && <p className="text-micro text-faint">{t('diagram')}</p>}
      </figcaption>
    </figure>
  );
}
