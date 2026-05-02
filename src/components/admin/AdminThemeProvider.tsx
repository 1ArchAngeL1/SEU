'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ReactNode } from 'react';

/**
 * Admin-scoped theme provider.
 *
 * - Persists choice under the `seu-admin-theme` storage key (separate from
 *   any future site-wide theme).
 * - Writes the active theme to `data-admin-theme` on the wrapping element,
 *   which is what our globals.css token blocks key off of.
 * - Defaults to `system` so the admin matches the OS preference on first visit.
 */
export function AdminThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-admin-theme"
      defaultTheme="system"
      enableSystem
      storageKey="seu-admin-theme"
      themes={['light', 'dark']}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
