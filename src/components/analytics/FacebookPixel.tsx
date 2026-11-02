import { FB_PIXEL_ID, fbPixelEnabled } from '@/lib/analytics/fb-pixel';
import FacebookPixelTracker from './FacebookPixelTracker';

/**
 * Loads the Meta (Facebook) pixel and keeps it fed on client-side navigations.
 *
 * Mounted in the public layout only — admin and presentation routes are staff
 * tools, and counting the sales team's own sessions would wreck every audience
 * and conversion figure built on the pixel.
 *
 * The pixel id is hardcoded in `@/lib/analytics/fb-pixel`, so this works on a
 * plain production build with no configuration. `NEXT_PUBLIC_FB_PIXEL_DISABLED`
 * switches it off for a dev box or a preview deploy.
 */
export default function FacebookPixel() {
  if (!fbPixelEnabled) return null;

  return (
    <>
      <FacebookPixelTracker />
      {/* Meta's no-JavaScript fallback: one request per server-rendered page. */}
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          alt=""
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
