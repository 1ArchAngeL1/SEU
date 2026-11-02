/**
 * Meta (Facebook) Pixel.
 *
 * The transport layer for every hit the site sends to Meta. It is the same
 * shape as `gtag.ts`: safe on the server (no-op), safe before `fbevents.js`
 * has loaded (the call is queued the way Meta's own snippet queues it), and
 * empty parameter values are stripped before sending.
 *
 * Unlike GA4 the pixel id is **hardcoded**, not read from the environment:
 * there is one pixel for this site and it has to fire on a plain production
 * build with no extra configuration. Set `NEXT_PUBLIC_FB_PIXEL_DISABLED=true`
 * on a dev box or a preview deploy to keep that traffic out of the pixel.
 */

/** Meta Events Manager → Data sources → the pixel's id. */
export const FB_PIXEL_ID = '1722060141425387';

/** Escape hatch for local and preview builds; the pixel is on by default. */
export const fbPixelEnabled = process.env.NEXT_PUBLIC_FB_PIXEL_DISABLED !== 'true';

/** Mirrors every hit to the console, the way `NEXT_PUBLIC_GA_DEBUG` does. */
const FB_PIXEL_DEBUG = process.env.NEXT_PUBLIC_FB_PIXEL_DEBUG === 'true';

const FB_EVENTS_SRC = 'https://connect.facebook.net/en_US/fbevents.js';

type Fbq = {
  (...args: unknown[]): void;
  /** Installed by `fbevents.js` once the library is ready. */
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  push?: unknown;
  loaded?: boolean;
  version?: string;
};

type PixelWindow = Window & { fbq?: Fbq; _fbq?: Fbq };

function win(): PixelWindow | null {
  return typeof window === 'undefined' ? null : (window as PixelWindow);
}

function debugLog(label: string, payload: unknown): void {
  if (!FB_PIXEL_DEBUG) return;
  console.debug(`[fb-pixel] ${label}`, payload);
}

/** Drops nullish and empty values; keeps `0` and `false`, which are data. */
function clean(params: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue;
    out[key] = value;
  }
  return out;
}

/**
 * Install the pixel: create the `fbq` shim, load `fbevents.js`, and `init` the
 * pixel id. Idempotent — a second call is a no-op — so every entry point below
 * can call it without caring who got there first.
 *
 * This is Meta's documented snippet, transcribed rather than injected as an
 * inline `<script>`, which is what keeps the order right: the shim exists
 * before the library is requested, and `init` is the first command in the
 * queue, so a `track` fired during hydration cannot be processed before it.
 */
export function loadFbPixel(): void {
  const w = win();
  if (!w || !fbPixelEnabled) return;
  // Already bootstrapped, by us or by anything else on the page.
  if (w.fbq) return;

  // The queued form has to be the `arguments` object, not a rest array:
  // `fbevents.js` drains `fbq.queue` as the snippet left it, so this stays
  // byte-for-byte compatible with Meta's own shim.
  const fbq = function () {
    const self = w.fbq;
    if (!self) return;
    // eslint-disable-next-line prefer-rest-params
    const args = arguments;
    if (self.callMethod) {
      // eslint-disable-next-line prefer-spread
      self.callMethod.apply(self, args as unknown as unknown[]);
    } else {
      self.queue.push(args);
    }
  } as unknown as Fbq;

  fbq.queue = [];
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  w.fbq = fbq;
  w._fbq = w._fbq ?? fbq;

  const script = w.document.createElement('script');
  script.async = true;
  script.src = FB_EVENTS_SRC;
  const first = w.document.getElementsByTagName('script')[0];
  if (first?.parentNode) first.parentNode.insertBefore(script, first);
  else w.document.head.appendChild(script);

  debugLog('init', FB_PIXEL_ID);
  fbq('init', FB_PIXEL_ID);
}

/**
 * Fire a standard Meta event (`PageView`, `Lead`, `Contact`, …).
 *
 * Prefer the standard names: Events Manager understands them, and a custom
 * name has to be configured by hand before it can be used in an audience.
 */
export function fbTrack(name: string, params?: Record<string, unknown>): void {
  const w = win();
  if (!w || !fbPixelEnabled) return;
  loadFbPixel();
  const payload = params ? clean(params) : undefined;
  debugLog(`track: ${name}`, payload ?? {});
  w.fbq?.('track', name, payload);
}

/**
 * A page view. Sent by hand on every route change: after the first load this
 * is a single-page app, so the snippet's one-shot `PageView` would only ever
 * count the landing page. The pixel reads the URL off `document.location`
 * itself, which Next has already updated by the time effects run.
 */
export function fbPageView(): void {
  fbTrack('PageView');
}
