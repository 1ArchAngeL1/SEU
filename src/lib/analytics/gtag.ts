/**
 * The transport layer for Google Analytics 4 — every hit the site sends goes
 * through here. Nothing in this file knows about apartments; see `events.ts`
 * for the taxonomy the site actually fires.
 *
 * Three rules hold for every function below:
 *  - it is safe on the server (no-op) and safe before the gtag script has
 *    loaded (the command is queued the way gtag's own shim queues it);
 *  - it is a no-op when no measurement id is configured;
 *  - empty values are stripped, because GA4 renders an empty string as a real
 *    "(not set)" row and each event may carry only 25 parameters.
 */
import { GA_DEBUG, GA_MEASUREMENT_ID, analyticsEnabled } from './config';

type GtagWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

/** A GA4 parameter value — anything else is dropped before sending. */
export type ParamValue = string | number | boolean | undefined | null;

export type EventParams = Record<string, ParamValue | object | undefined>;

function win(): GtagWindow | null {
  return typeof window === 'undefined' ? null : (window as GtagWindow);
}

/**
 * Hand a command to gtag, queueing it when the script has not defined
 * `window.gtag` yet.
 *
 * The queued form has to be an `arguments` object, not an array: gtag.js picks
 * its commands out of `dataLayer` by testing for `[object Arguments]` and
 * ignores a plain array, so a buffered event would silently vanish.
 */
function send(...args: unknown[]): void {
  const w = win();
  if (!w) return;

  if (typeof w.gtag === 'function') {
    w.gtag(...args);
    return;
  }

  const layer = (w.dataLayer = w.dataLayer ?? []);
  const queue = function () {
    // eslint-disable-next-line prefer-rest-params
    layer.push(arguments);
  };
  // `.apply` is the point here, not a style slip: it is what produces the
  // `arguments` object gtag.js recognises.
  // eslint-disable-next-line prefer-spread
  queue.apply(null, args as []);
}

/** Drops nullish and empty values; keeps `0` and `false`, which are data. */
function clean(params: EventParams): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue;
    out[key] = value;
  }
  return out;
}

/**
 * The visitor's language, taken off `<html lang>` so no component has to pass
 * it in. Every event carries it — the Georgian and English audiences behave
 * differently and the sales team reads the split constantly.
 */
function currentLocale(): string | undefined {
  const w = win();
  return w?.document?.documentElement?.lang || undefined;
}

function debugLog(label: string, payload: unknown): void {
  if (!GA_DEBUG) return;
  console.debug(`[analytics] ${label}`, payload);
}

/**
 * Fire a GA4 event.
 *
 * Unknown events are fine — GA4 accepts any name — but prefer the helpers in
 * `events.ts` so the parameter names stay consistent with the custom
 * dimensions registered in the GA4 property (see `docs/analytics.md`).
 */
export function gaEvent(name: string, params: EventParams = {}): void {
  const payload = { ...clean(params), locale: currentLocale() };
  debugLog(`event: ${name}`, payload);
  if (!analyticsEnabled) return;
  send('event', name, payload);
}

/**
 * A screen view. Sent by hand on every route change: the site is a single-page
 * app after the first load, so gtag's automatic page view (switched off in the
 * config call) would only ever count the landing page.
 */
export function gaPageView(path: string, title?: string): void {
  const w = win();
  if (!w) return;
  const payload = clean({
    page_path: path,
    page_location: w.location.href,
    page_title: title ?? w.document.title,
    locale: currentLocale(),
  });
  debugLog('page_view', payload);
  if (!analyticsEnabled) return;
  send('event', 'page_view', payload);
}

/**
 * Session-wide properties, available as user-scoped dimensions in GA4.
 * Set once per page view; GA4 keeps the last value seen.
 */
export function gaUserProperties(props: EventParams): void {
  const payload = clean(props);
  debugLog('user_properties', payload);
  if (!analyticsEnabled) return;
  send('set', 'user_properties', payload);
}

/**
 * Consent Mode v2 update, for when a cookie banner is added.
 *
 * The defaults are declared in the bootstrap script (`GoogleAnalytics.tsx`):
 * analytics storage granted, every advertising signal denied. Call this to
 * change the visitor's mind afterwards — gtag backfills the hits it buffered.
 */
export function gaSetConsent(consent: {
  analytics?: boolean;
  ads?: boolean;
}): void {
  const payload = clean({
    analytics_storage: consent.analytics === undefined ? undefined : consent.analytics ? 'granted' : 'denied',
    ad_storage: consent.ads === undefined ? undefined : consent.ads ? 'granted' : 'denied',
    ad_user_data: consent.ads === undefined ? undefined : consent.ads ? 'granted' : 'denied',
    ad_personalization: consent.ads === undefined ? undefined : consent.ads ? 'granted' : 'denied',
  });
  debugLog('consent update', payload);
  if (!analyticsEnabled) return;
  send('consent', 'update', payload);
}

export { GA_MEASUREMENT_ID, analyticsEnabled };
