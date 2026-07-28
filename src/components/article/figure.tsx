import { getTranslations } from 'next-intl/server';
import type { MediaAsset } from '@content/schema';

/**
 * A figure, with its credit and licence always attached.
 *
 * The `isIllustrative` branch is the important one. This publication reports on
 * specific physical assets, and the cheapest available mistake is to run a
 * stock photograph of *a* transmission line under a story about *this*
 * transmission line and let the caption imply they are the same. Once that
 * happens the masthead is asserting something it cannot support, and a reader
 * who recognises the tower design knows it.
 *
 * So an illustrative image is labelled as illustrative, in the caption, every
 * time — and `depicts` states what the photograph actually shows rather than
 * what the article is about. There is no code path that renders a photograph
 * without a credit, because `credit` and `license` are required by the schema.
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

        {asset.isIllustrative && (
          <p className="font-medium text-copper-500 dark:text-copper-300">
            {t('illustrative')}
            {asset.depicts && <>. {asset.depicts}</>}
          </p>
        )}

        <p className="text-micro text-faint">
          {asset.isDiagram ? (
            <>{t('diagram')}</>
          ) : (
            <>
              {t('imageCredit')}: {asset.credit} · {asset.license}
              {asset.licenseUrl && (
                <>
                  {' '}
                  <a
                    href={asset.licenseUrl}
                    className="underline underline-offset-2"
                    rel="license noopener"
                    target="_blank"
                  >
                    ↗
                  </a>
                </>
              )}
              {asset.sourceUrl && (
                <>
                  {' · '}
                  <a
                    href={asset.sourceUrl}
                    className="underline underline-offset-2"
                    rel="noopener"
                    target="_blank"
                  >
                    source
                  </a>
                </>
              )}
            </>
          )}
        </p>
      </figcaption>
    </figure>
  );
}
