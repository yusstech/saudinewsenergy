'use client';

import { useEffect, useState } from 'react';
import { SITE } from '@/lib/site';

/**
 * The reader's own time, shown only when it differs from Damascus.
 *
 * Damascus is the time of record and always renders on the server. This line is
 * an addition for readers elsewhere, and it is computed on the client because
 * the server has no idea what timezone the reader is in — guessing from an IP
 * address would be wrong often enough to be worse than useless.
 *
 * It renders nothing until after hydration, which also means it cannot cause a
 * mismatch: the server and the first client render agree that there is no
 * element here.
 */
export function LocalTime({ iso, label }: { iso: string; label: string }) {
  const [local, setLocal] = useState<string | null>(null);

  useEffect(() => {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!zone || zone === SITE.timeZone) return;

    const formatter = new Intl.DateTimeFormat(undefined, {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: zone,
      timeZoneName: 'short',
    });
    setLocal(formatter.format(new Date(iso)));
  }, [iso]);

  if (!local) return null;

  return (
    <p className="text-xs text-faint">
      {label}{' '}
      <time dateTime={iso} className="numeric">
        {local}
      </time>
    </p>
  );
}
