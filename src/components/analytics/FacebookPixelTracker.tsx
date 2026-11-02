'use client';

import { Suspense, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { fbPageView, loadFbPixel } from '@/lib/analytics/fb-pixel';

/**
 * Installs the Meta pixel and sends a `PageView` for every route the visitor
 * lands on, including the client-side navigations the snippet cannot see.
 *
 * Same reasoning as `PageViewTracker`: `next/navigation`'s `usePathname` is
 * used on purpose rather than the locale-stripped one from `@/i18n/navigation`,
 * so `/ka/search` and `/en/search` are reported as the real URLs they are.
 */
function Tracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastSent = useRef<string | null>(null);

  useEffect(() => {
    const query = searchParams.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    // React may run the effect twice (Strict Mode) and a param can be
    // rewritten to the same value — one view per distinct URL.
    if (lastSent.current === url) return;
    lastSent.current = url;

    // Idempotent; the first call is what bootstraps the pixel.
    loadFbPixel();
    fbPageView();
  }, [pathname, searchParams]);

  return null;
}

export default function FacebookPixelTracker() {
  // `useSearchParams` opts a route into client rendering unless it sits behind
  // a Suspense boundary — this one keeps every page statically renderable.
  return (
    <Suspense fallback={null}>
      <Tracker />
    </Suspense>
  );
}
