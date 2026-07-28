import type { ReactNode } from 'react';

/**
 * The `<html>` element lives in `[locale]/layout.tsx`, not here, because `lang`
 * and `dir` are per-locale and must be correct on the server's first byte —
 * setting direction on the client is a visible reflow and a screen-reader
 * failure. This root exists only so Next has a layout above the locale segment.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
