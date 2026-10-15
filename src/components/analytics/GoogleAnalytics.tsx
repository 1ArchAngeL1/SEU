import Script from 'next/script';
import { GA_DEBUG, GA_MEASUREMENT_ID, analyticsEnabled } from '@/lib/analytics/config';
import { SITE_MODE } from '@/lib/site-mode';
import PageViewTracker from './PageViewTracker';

/**
 * Loads Google Analytics 4 and keeps it fed on client-side navigations.
 *
 * Mounted in the public layout only — admin and presentation routes are staff
 * tools, and counting the sales team's own sessions as traffic would wreck
 * every engagement figure the reports are built on.
 *
 * With `NEXT_PUBLIC_GA_MEASUREMENT_ID` unset this renders nothing and ships no
 * JavaScript, so local and preview builds stay out of the property — unless
 * `NEXT_PUBLIC_GA_DEBUG` is on, which keeps the tracker mounted so the event
 * stream can be read in the console before a property exists.
 */
export default function GoogleAnalytics() {
  if (!analyticsEnabled) return GA_DEBUG ? <PageViewTracker /> : null;

  // Consent Mode v2 defaults, declared before the library loads so the very
  // first hit already respects them: analytics storage on, every advertising
  // signal off — the site runs no ad platforms and asks for no ad consent.
  // A cookie banner can flip either side later through `gaSetConsent()`.
  //
  // `send_page_view: false` hands page views to <PageViewTracker>: after the
  // first load this is a single-page app, and gtag's automatic view would only
  // ever count the landing page.
  const bootstrap = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'granted'
});
gtag('js', new Date());
gtag('config', ${JSON.stringify(GA_MEASUREMENT_ID)}, {
  send_page_view: false${GA_DEBUG ? ",\n  debug_mode: true" : ''}
});
gtag('set', 'user_properties', { site_mode: ${JSON.stringify(SITE_MODE)} });
`.trim();

  return (
    <>
      {/* The shim first, so an event fired during hydration is queued rather
          than dropped; the library picks the queue up when it arrives. */}
      <Script id="ga-bootstrap" strategy="afterInteractive">
        {bootstrap}
      </Script>
      <Script
        id="ga-library"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <PageViewTracker />
    </>
  );
}
