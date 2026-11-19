'use client';

import { useSyncExternalStore } from 'react';
import { useTranslations } from 'next-intl';
import { Cookie } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import {
  readCookieConsent,
  subscribeCookieConsent,
  writeCookieConsent,
  type ConsentValue,
} from '@/lib/cookie-consent';
import { gaSetConsent } from '@/lib/analytics/gtag';
import { fbPageView, loadFbPixel } from '@/lib/analytics/fb-pixel';

/**
 * Site-wide cookie notice.
 *
 * Mounted in the public layout only — admin and `/presentation/*` are staff
 * tools and carry no analytics to consent to.
 *
 * The decision is the gate on both tracking platforms: GA4 runs in Consent
 * Mode and the Meta pixel is not installed at all until it is granted. See
 * `src/lib/cookie-consent.ts` for who reads the cookie.
 */
export default function CookieConsent() {
  const t = useTranslations('cookies');

  // The cookie is the state — no local copy to keep in step with it. The
  // server snapshot is `false` on purpose: every public page is statically
  // rendered, so the notice must not be baked into the HTML (a visitor who
  // accepted months ago would get a flash of it). The store is re-read right
  // after hydration, which is when it can appear.
  const needsDecision = useSyncExternalStore(
    subscribeCookieConsent,
    () => readCookieConsent() === null,
    () => false,
  );

  function decide(value: ConsentValue) {
    // The cookie goes down first — both trackers below read it back, and the
    // write is also what hides this notice.
    writeCookieConsent(value);

    const granted = value === 'granted';
    // gtag backfills the hits it buffered while storage was denied.
    gaSetConsent({ analytics: granted });

    if (granted) {
      loadFbPixel();
      // `FacebookPixelTracker` already recorded this URL as sent and will not
      // fire again for it, so send the view the pixel slept through.
      fbPageView();
    }
  }

  if (!needsDecision) return null;

  return (
    // z-50 on purpose, the same level as the sticky header: DOM order then
    // decides, which puts the notice above the header but below a dialog
    // portalled onto the end of <body>.
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6 sm:pb-6">
      <div
        role="dialog"
        aria-labelledby="cookie-consent-title"
        aria-describedby="cookie-consent-text"
        className="mx-auto flex max-w-7xl flex-col gap-4 rounded-2xl border border-secondary-black bg-dark-green/95 p-5 shadow-2xl backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-300 motion-reduce:animate-none sm:flex-row sm:items-center sm:gap-6 sm:p-6"
      >
        <div className="flex items-start gap-3">
          <Cookie
            aria-hidden="true"
            className="mt-0.5 size-5 shrink-0 text-primary-green"
          />
          <div className="space-y-1">
            <p
              id="cookie-consent-title"
              className="font-montserrat font-semibold text-seu-body-sm text-pale-gray"
            >
              {t('title')}
            </p>
            <p
              id="cookie-consent-text"
              className="font-montserrat text-seu-caption leading-relaxed text-pale-gray/70"
            >
              {t('message')}{' '}
              <Link
                href="/policy"
                className="underline underline-offset-2 transition-colors hover:text-pale-gray"
              >
                {t('learnMore')}
              </Link>
            </p>
          </div>
        </div>

        <div className="flex shrink-0 gap-3 sm:ml-auto">
          <button
            type="button"
            onClick={() => decide('denied')}
            className="flex-1 rounded-xl border border-secondary-black px-6 py-2.5 font-montserrat font-medium text-seu-caption text-pale-gray/80 transition-colors hover:border-pale-gray/30 hover:text-pale-gray active:scale-[0.98] sm:flex-none"
          >
            {t('decline')}
          </button>
          <button
            type="button"
            onClick={() => decide('granted')}
            className="flex-1 rounded-xl bg-primary-green px-6 py-2.5 font-montserrat font-medium text-seu-caption text-white shadow-lg shadow-primary-green/25 transition-all hover:bg-primary-green/90 hover:shadow-xl hover:shadow-primary-green/30 active:scale-[0.98] sm:flex-none"
          >
            {t('accept')}
          </button>
        </div>
      </div>
    </div>
  );
}
