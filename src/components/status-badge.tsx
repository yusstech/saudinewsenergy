import { useTranslations } from 'next-intl';
import type { AlertState, StoryType } from '@content/schema';

/**
 * The reserved status colours, applied.
 *
 * The mapping from state to colour lives here and nowhere else. If a badge somewhere renders red
 * without going through this component, the promise that red means Breaking is already broken —
 * so there is exactly one way to produce one.
 *
 * Restyled from solid fills to a tinted ground with a coloured rule. A row of solid red and
 * amber chips reads as a system-status panel; a tint reads as editorial marking, which is what
 * these are. The colour is no less identifiable for being quieter.
 */
const ALERT_STYLE: Record<AlertState, string> = {
  breaking:
    'bg-breaking-soft text-breaking ring-1 ring-inset ring-breaking/30',
  developing:
    'bg-developing-soft text-developing ring-1 ring-inset ring-developing/30',
  live: 'bg-live-soft text-live ring-1 ring-inset ring-live/30',
  'market-move':
    'bg-market-soft text-market ring-1 ring-inset ring-market/30',
  'project-update':
    'bg-surface-sunken text-muted ring-1 ring-inset ring-line-strong',
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
      className={`label inline-flex items-center gap-1.5 rounded-[2px] px-1.5 py-0.5 ${ALERT_STYLE[state]} ${className}`}
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
 * Deliberately typographic rather than coloured. The concept requires analysis and opinion to be
 * separable from straight news at a glance, but giving them colours of their own would compete
 * with the alert states — and a reader deciding whether a coloured chip means "urgent" or
 * "opinion" is decoding the interface instead of reading the story.
 */
const TYPE_STYLE: Record<StoryType, string> = {
  news: 'text-muted',
  analysis: 'text-copper-500 dark:text-copper-300',
  opinion: 'text-copper-500 italic dark:text-copper-300',
  explainer: 'text-brand-500 dark:text-brand-400',
  investigation: 'text-strong',
  interview: 'text-muted',
  sponsored:
    'text-body bg-surface-sunken px-1.5 py-0.5 rounded-[2px] ring-1 ring-inset ring-line-strong',
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

  return <span className={`label ${TYPE_STYLE[type]} ${className}`}>{t(type)}</span>;
}

/**
 * The prototype-content label.
 *
 * Non-dismissible by design, and rendered on the card as well as the article, because a reader
 * who meets a card in a feed has already formed an impression before they click.
 */
export function SampleBadge({ className = '' }: { className?: string }) {
  const t = useTranslations('common');
  return (
    <span
      className={`label inline-flex items-center rounded-[2px] bg-surface-sunken px-1.5 py-0.5 text-muted ring-1 ring-inset ring-line-strong ${className}`}
    >
      {t('sampleData')}
    </span>
  );
}
