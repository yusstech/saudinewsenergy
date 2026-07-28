/**
 * The route-level loading state.
 *
 * Deliberately a quiet skeleton rather than a spinner: this sits under a header
 * that is already visible, and a spinning indicator below stable chrome reads
 * as something being wrong rather than as something arriving.
 */
export default function Loading() {
  return (
    <div className="mx-auto max-w-[1440px] px-[var(--gutter)] py-10" aria-hidden="true">
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-2/3 rounded-sm bg-surface-sunken" />
        <div className="h-4 w-1/2 rounded-sm bg-surface-sunken" />
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="h-48 rounded-sm bg-surface-sunken" />
          <div className="h-48 rounded-sm bg-surface-sunken" />
          <div className="h-48 rounded-sm bg-surface-sunken" />
        </div>
      </div>
      <span className="sr-only">Loading</span>
    </div>
  );
}
