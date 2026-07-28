import { useTranslations } from 'next-intl';
import type { AlertState, StoryType } from '@content/schema';

/**
 * The reserved status colours, applied.
 *
 * The mapping from state to colour lives here and nowhere else. If a badge
 * somewhere renders red without going through this component, the promise that
 * red means Breaking has already been broken — so there is exactly one way to
 * produce one.
 */
const ALERT_STYLE: Record<AlertState, string> = {
  breaking: 'bg-[--color-breaking] text-white',
  developing: 'bg-[--color-developing] text-white',
  live: 'bg-[--color-live] text-white',
  'market-move': 'bg-[--color-market] text-white',
  'project-update': 'bg-[--color-surface-sunken] text-[--color-body] ring-1 ring-[--color-line-strong]',
};

const ALERT_KEY: Record<AlertState, string> = {
  breaking: 'breaking',
  developing: 'developing',
  live: 'live',
  'market-move': 'marketMove',
  'project-update': 'projectUpdate',
};

export function AlertBadge({
  state,
  className = '',
}: {
  state: AlertState;
  className?: string;
}) {
  const t = useTranslations('status');
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm px-1.5 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wider ${ALERT_STYLE[state]} ${className}`}
    >
      {state === 'live' && (
        <span
          className="live-dot inline-block size-1.5 rounded-full bg-current"
          aria-hidden="true"
        />
      )}
      {t(ALERT_KEY[state])}
    </span>
  );
}

/**
 * The News / Analysis / Opinion / Sponsored distinction, made visible.
 *
 * Deliberately typographic rather than coloured. The concept requires analysis
 * and opinion to be separable from straight news at a glance, but giving them
 * colours of their own would compete with the alert states — and a reader who
 * has to decide whether a coloured chip means "urgent" or "opinion" is being
 * asked to decode the interface instead of reading the story.
 */
const TYPE_STYLE: Record<StoryType, string> = {
  news: 'text-[--color-muted]',
  analysis: 'text-[--color-copper-500] dark:text-[--color-copper-300]',
  opinion: 'text-[--color-copper-500] dark:text-[--color-copper-300] italic',
  explainer: 'text-[--color-brand-500] dark:text-[--color-brand-400]',
  investigation: 'text-[--color-body] font-bold',
  interview: 'text-[--color-muted]',
  sponsored:
    'text-[--color-body] bg-[--color-surface-sunken] px-1.5 py-0.5 rounded-sm ring-1 ring-[--color-line-strong]',
};

export function TypeLabel({
  type,
  className = '',
}: {
  type: StoryType;
  className?: string;
}) {
  const t = useTranslations('storyType');
  // "News" is the unmarked default. Labelling every straight news story adds a
  // word to every card and distinguishes nothing.
  if (type === 'news') return null;

  return (
    <span
      className={`text-[0.6875rem] font-semibold uppercase tracking-wider ${TYPE_STYLE[type]} ${className}`}
    >
      {t(type)}
    </span>
  );
}

/**
 * The prototype-content label.
 *
 * Non-dismissible by design, and rendered on the card as well as the article,
 * because a reader who arrives at a card in a feed has already formed an
 * impression before they click.
 */
export function SampleBadge({ className = '' }: { className?: string }) {
  const t = useTranslations('market');
  return (
    <span
      className={`inline-flex items-center rounded-sm bg-[--color-surface-sunken] px-1.5 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-[--color-muted] ring-1 ring-[--color-line-strong] ${className}`}
    >
      {t('sampleData')}
    </span>
  );
}
