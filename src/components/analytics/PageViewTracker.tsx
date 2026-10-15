'use client';

import { Suspense, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { gaPageView, gaUserProperties } from '@/lib/analytics/gtag';

/**
 * Sends a `page_view` for every route the visitor lands on, including the
 * client-side navigations gtag cannot see by itself.
 *
 * `next/navigation`'s `usePathname` is used on purpose rather than the
 * locale-stripped one from `@/i18n/navigation`: the reports want `/ka/search`
 * and `/en/search` as the real URLs they are, with the language also available
 * as its own dimension.
 */
function Tracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastSent = useRef<string | null>(null);

  useEffect(() => {
    const query = searchParams.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    // React may run the effect twice (Strict Mode) and a param can be rewritten
    // to the same value — one view per distinct URL.
    if (lastSent.current === url) return;
    lastSent.current = url;

    gaUserProperties({ site_locale: document.documentElement.lang || undefined });
    gaPageView(url);
  }, [pathname, searchParams]);

  return null;
}

export default function PageViewTracker() {
  // `useSearchParams` opts a route into client rendering unless it sits behind
  // a Suspense boundary — this one keeps every page statically renderable.
  return (
    <Suspense fallback={null}>
      <Tracker />
    </Suspense>
  );
}
