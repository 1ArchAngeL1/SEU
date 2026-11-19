/**
 * Cookie consent.
 *
 * The visitor's answer to the cookie notice, kept in a first-party cookie
 * rather than `localStorage` on purpose: the GA bootstrap script in
 * `GoogleAnalytics.tsx` is inline and has to know the answer *before* gtag
 * loads, and a cookie is the only store a synchronous inline script can read.
 *
 * Who reads it:
 *  - `GoogleAnalytics.tsx` — picks the Consent Mode v2 default from it, so a
 *    returning visitor who accepted is granted from the very first hit;
 *  - `fb-pixel.ts` — `loadFbPixel()` refuses to install the pixel without it;
 *  - `CookieConsent.tsx` — shows the notice only while the answer is missing.
 *
 * An unset cookie means "not asked yet", which is not the same as "denied":
 * the notice has to come back for it.
 */

/** Name of the cookie holding the decision. Mirrored in the GA bootstrap. */
export const CONSENT_COOKIE = 'seu_cookie_consent';

export type ConsentValue = 'granted' | 'denied';

/**
 * How long a decision stands. Six months is the usual reading of the European
 * guidance — after that the notice asks again rather than assuming consent
 * given a year ago still holds.
 */
const CONSENT_MAX_AGE_SECONDS = 180 * 24 * 60 * 60;

/** `null` on the server, and when the visitor has not answered yet. */
export function readCookieConsent(): ConsentValue | null {
  if (typeof document === 'undefined') return null;

  for (const entry of document.cookie.split(';')) {
    const [name, ...rest] = entry.trim().split('=');
    if (name !== CONSENT_COOKIE) continue;
    const value = rest.join('=');
    return value === 'granted' || value === 'denied' ? value : null;
  }
  return null;
}

/** True only on an explicit "accept" — an unanswered notice is not consent. */
export function hasAnalyticsConsent(): boolean {
  return readCookieConsent() === 'granted';
}

/**
 * Subscribers notified when the decision is written.
 *
 * This is what lets `<CookieConsent>` read the cookie through
 * `useSyncExternalStore` and hold no state of its own: the cookie *is* the
 * state, and writing it re-renders whoever is reading it.
 */
const listeners = new Set<() => void>();

export function subscribeCookieConsent(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function writeCookieConsent(value: ConsentValue): void {
  if (typeof document === 'undefined') return;

  // No `Secure` on plain http, or the cookie is silently dropped on a dev box
  // and the notice reappears on every page.
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie =
    `${CONSENT_COOKIE}=${value}; Path=/; Max-Age=${CONSENT_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;

  for (const listener of listeners) listener();
}
