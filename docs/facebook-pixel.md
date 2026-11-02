# Meta (Facebook) Pixel

What the public site sends to Meta, and why it is wired the way it is.

Code lives in `src/lib/analytics/fb-pixel.ts` and
`src/components/analytics/FacebookPixel{,Tracker}.tsx`. Components call a
named helper (`fbPageView()`, `fbTrack()`), never `window.fbq` — the same rule
that keeps the GA4 parameter names consistent (see `analytics.md`).

---

## 1. Turning it on

Nothing to configure. **The pixel id is hardcoded** —
`FB_PIXEL_ID = '1722060141425387'` in `src/lib/analytics/fb-pixel.ts` — so the
pixel fires on a plain production build. This is on purpose, and different from
GA4: there is exactly one pixel for this site, and an unset variable on the
server must not silently switch tracking off.

| Variable | Required | Meaning |
|---|---|---|
| `NEXT_PUBLIC_FB_PIXEL_DISABLED` | no | `true` switches the whole integration off: no script, no events, no `<noscript>` pixel. Use it on a dev box or a preview deploy so that traffic stays out of the pixel. |
| `NEXT_PUBLIC_FB_PIXEL_DEBUG` | no | `true` logs every hit to the console (`[fb-pixel] …`). Works with the pixel enabled or disabled. |

`NEXT_PUBLIC_*` is inlined at build time — a changed value needs a rebuild and
a restart.

**Where it runs:** the public layout only
(`src/app/[locale]/(main)/layout.tsx`). `/admin/*` and `/presentation/*` are
staff tools; counting the sales team's own sessions would wreck every audience
and conversion figure built on the pixel.

To replace the pixel (a new Meta account, a second brand), change the one
constant — and the copy of it in `CLAUDE.md`.

---

## 2. What is sent

| Event | When |
|---|---|
| `PageView` | Every route the visitor lands on, including client-side navigations. One hit per distinct URL, locale prefix included (`/ka/search?bedrooms=2`). |

That is the whole taxonomy today. The pixel's standard events (`Lead`,
`Contact`, `ViewContent`, `Search`) are not wired yet; `fbTrack(name, params)`
is the entry point when they are, and the natural places are the ones GA4
already instruments — `ContactForm`'s successful submit for `Lead`, the
apartment page for `ViewContent`.

**Personal data never goes to Meta.** No name, phone or email, the same rule
GA4 follows: a lead may report *that* a field was filled in, never its value.

---

## 3. Why the snippet is not a `<script>` tag

Meta hands out an inline `<script>` that creates the `fbq` shim, injects
`fbevents.js`, calls `init`, and fires one `PageView`. Pasted into this app it
would be wrong in two ways.

**The one-shot `PageView` only counts the landing page.** After the first load
this is a single-page app: Meta never sees another document load. So `init`
stays in the bootstrap and the view is fired by hand for every route, by
`FacebookPixelTracker` — exactly the arrangement GA4 uses (`send_page_view:
false` + `PageViewTracker`).

**An inline script races the React tree.** A `track` fired from an effect
during hydration can run before an `afterInteractive` `<script>` has executed,
and a `track` that reaches the queue before `init` is dropped. So the snippet
is transcribed into `loadFbPixel()` instead: it creates the shim, requests the
library, and queues `init` in that order, is idempotent, and every entry point
calls it before tracking. Whoever gets there first bootstraps the pixel; the
rest are no-ops.

Two details in there are load-bearing:

- the shim queues the **`arguments` object**, not a rest array, because
  `fbevents.js` drains `fbq.queue` as Meta's own snippet left it (`gtag.ts`
  has the same note about `dataLayer`);
- `window._fbq` is set, which is where the library looks for an already-queued
  instance.

The `<noscript>` image stays in the server-rendered markup, so a visitor with
JavaScript off still produces one hit per page.
