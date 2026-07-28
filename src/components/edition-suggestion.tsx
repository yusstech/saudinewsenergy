import { getTranslations } from 'next-intl/server';
import { suggestedEdition } from '@/lib/edition';
import { EditionSuggestionClient } from './edition-suggestion-client';

/**
 * The dismissible edition recommendation.
 *
 * This exists instead of a geo-redirect. A reader arriving from the UAE is
 * offered GCC coverage alongside their Saudi edition; they are never moved
 * there. The distinction matters editorially — Saudi Arabia stays the centre in
 * every edition — and technically, because a redirect keyed to IP means two
 * readers requesting the same URL get different pages, which breaks canonical
 * URLs and makes shared links unreliable.
 */
export async function EditionSuggestion() {
  const suggestion = await suggestedEdition();
  if (!suggestion) return null;

  const t = await getTranslations('edition');

  return (
    <EditionSuggestionClient
      edition={suggestion.edition}
      title={t('suggestionTitle')}
      body={t('suggestionBody', {
        country: suggestion.country,
        edition: t(suggestion.edition),
      })}
      accept={t('suggestionAccept', { edition: t(suggestion.edition) })}
      dismiss={t('suggestionDismiss')}
    />
  );
}
