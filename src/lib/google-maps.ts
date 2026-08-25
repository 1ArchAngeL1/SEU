/**
 * The project's map pin, as an admin set it.
 *
 * `Project.googleMapLink` is a free-text field in the admin project form, so it
 * arrives in whatever shape Google handed the editor: a pasted `<iframe>`
 * snippet, a bare `maps/embed?pb=…` URL, a share or short link, a `/place/…`
 * URL, or plain coordinates. Two things are needed from it — a frameable URL
 * for the in-page map, and a URL to open Google Maps proper in a new tab.
 *
 * Nothing here guesses a location from the project address: an unset link means
 * no map at all, rather than a pin on the wrong building.
 */

/** `output=embed` renders without an API key, unlike the Maps Embed API. */
const EMBED_BASE = 'https://maps.google.com/maps';
const SEARCH_BASE = 'https://www.google.com/maps/search/?api=1&query=';

/** Pulls the `src` out of a pasted `<iframe …>` embed snippet. */
function unwrapIframe(value: string): string {
  const match = value.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i);
  return match ? match[1] : value;
}

/** Coordinates the way Google writes them into its own URLs, as `lat,lng`. */
function coordsOf(value: string): string | null {
  // `!3d<lat>!4d<lng>` — how embed `pb=` strings and place URLs carry the pin.
  const pin = value.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (pin) return `${pin[1]},${pin[2]}`;
  // `@<lat>,<lng>,17z` — the map centre of a shared link.
  const centre = value.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (centre) return `${centre[1]},${centre[2]}`;
  // Coordinates pasted on their own.
  const bare = value.match(/^\s*(-?\d{1,3}\.\d{3,})\s*,\s*(-?\d{1,3}\.\d{3,})\s*$/);
  return bare ? `${bare[1]},${bare[2]}` : null;
}

/** A readable place query out of a share link — `?q=` / `?query=` / `/place/<slug>`. */
function queryOf(url: URL): string | null {
  const param = url.searchParams.get('q') ?? url.searchParams.get('query');
  if (param) return param;
  const place = url.pathname.match(/\/place\/([^/]+)/);
  return place ? decodeURIComponent(place[1]).replace(/\+/g, ' ') : null;
}

function isHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

/**
 * A URL an `<iframe>` can show, or `null` when the link only resolves inside
 * Google's own tab (short links, for one) — callers fall back to `mapOpenHref`.
 */
export function mapEmbedSrc(link?: string | null): string | null {
  const value = unwrapIframe((link ?? '').trim());
  if (!value) return null;

  if (/\/maps\/embed/i.test(value)) return value; // already frameable

  const coords = coordsOf(value);
  if (coords) return `${EMBED_BASE}?q=${coords}&z=16&output=embed`;

  if (isHttpUrl(value)) {
    let query: string | null = null;
    try {
      query = queryOf(new URL(value));
    } catch {
      return null;
    }
    return query
      ? `${EMBED_BASE}?q=${encodeURIComponent(query)}&z=16&output=embed`
      : null;
  }

  // Plain text — an address the editor typed in.
  return `${EMBED_BASE}?q=${encodeURIComponent(value)}&z=16&output=embed`;
}

/**
 * Where "open in Google Maps" goes. Anything that is not an `http(s)` URL is
 * wrapped in a Maps search rather than used as an href.
 */
export function mapOpenHref(link?: string | null): string | null {
  const value = unwrapIframe((link ?? '').trim());
  if (!value) return null;

  if (/\/maps\/embed/i.test(value)) {
    const coords = coordsOf(value);
    // An embed URL opens fine on its own, but a plain pin reads better.
    return coords ? `${SEARCH_BASE}${coords}` : value;
  }
  if (isHttpUrl(value)) return value;
  return `${SEARCH_BASE}${encodeURIComponent(value)}`;
}
