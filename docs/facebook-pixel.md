# Meta (Facebook) Pixel

What the public site sends to Meta, and why it is wired the way it is.

Code lives in `src/lib/analytics/fb-pixel.ts` (the transport),
`src/lib/analytics/fb-events.ts` (the taxonomy) and
`src/components/analytics/FacebookPixel{,Tracker}.tsx`.

**Components never call either of those.** They call a named helper from
`src/lib/analytics/events.ts`, which reports to GA4 *and* Meta in one go — one
`gaEvent(…)` plus one `fb*(…)`. That is the whole reason the pixel's coverage
matches GA4's: there is a single set of call sites, so the two taxonomies
cannot drift apart. Read `analytics.md` alongside this file; the events are the
same events.

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

**Cookie consent is a hard gate.** Meta has no equivalent of GA4's Consent
Mode, so the gate is the install itself: `loadFbPixel()` returns early unless
`seu_cookie_consent=granted`, which means `window.fbq` never exists and every
`fbTrack` call below quietly does nothing — no script, no hits. Accepting the
notice (`src/components/common/CookieConsent.tsx`) installs the pixel and sends
the `PageView` it slept through; events fired before that are lost, which is
the point. The `<noscript>` pixel is the one exception — it is for visitors with
no JavaScript, who can neither be shown the notice nor record an answer, and it
loads no script and writes no first-party cookie.

To replace the pixel (a new Meta account, a second brand), change the one
constant — and the copy of it in `CLAUDE.md`.

---

## 2. What is sent

Every event in `events.ts` has a Meta counterpart — no exceptions, so there is
nothing to remember when adding a call site. **Bold** names are Meta standard
events: Events Manager understands them with no setup, and they can be a
conversion, an audience or an ad-optimisation target straight away. The rest
are `trackCustom` names in PascalCase, which are collected immediately but have
to be picked by hand in Events Manager before they can be used (see §4).

### The conversions

| Meta event | GA4 event | Fired when |
|---|---|---|
| **`Lead`** ★ | `generate_lead` | A contact request is **accepted by the backend**. Carries `value` / `currency` from `NEXT_PUBLIC_GA_LEAD_VALUE`, plus `lead_source` and the apartment it came from. |
| **`Contact`** | `contact_click` | A phone number or email address is tapped instead of the form (`contact_method`, `contact_placement`). |
| **`SubmitApplication`** | `submit_application` | A CV is sent from the careers block. |
| `LeadFormStart` | `lead_form_start` | The visitor types into a contact form, once per form. The audience worth having: *started the form and never sent it*. |
| `RequestCallOpen` | `request_call_open` | The call-back dialog is opened from an apartment. |
| `LeadError` | `lead_error` | A submitted form was rejected — a lost lead, invisible otherwise. |

### Inventory and search

| Meta event | GA4 event | Fired when |
|---|---|---|
| **`ViewContent`** | `view_item` | An apartment page is opened. `content_type: 'home_listing'`, `content_ids: [unitId]` — the retargeting audience the site is built on. |
| **`Search`** | `search` | A filter is applied, from the form or from the URL. `search_string` is the same readable summary GA4 sends as `search_term`. |
| **`FindLocation`** | `view_map` | A project's location is opened, in the dialog or on Google Maps. |
| `ViewApartmentList` | `view_item_list` | A set of apartments is rendered (grid, similar rail, floor). Up to 30 `content_ids`, with the real count in `num_items`. |
| `SelectApartment` | `select_item` | An apartment card or floor-plan polygon is clicked. |
| `HeroSearch` | `hero_search` | The landing hero's quick filter is submitted. |
| `SearchResults` | `view_search_results` | Results come back (`results_count`, `results_empty`). |
| `ResultsPagination` / `ClearFilters` | `results_pagination` / `clear_filters` | A different page of results / every filter reset. |
| `SelectApartmentType` | `select_apartment_type` | A layout tile on a project page ("studio", "2 bedrooms") is clicked. |

### Projects, content and chrome

| Meta event | GA4 event | Fired when |
|---|---|---|
| `ViewProject` | `view_project` | A project is shown — the landing hero, or its visual-search page. |
| `SelectProject` / `SelectBuilding` / `SelectFloor` | same names | The visual-search funnel, one step each. `SelectProject` also fires from the landing hero and the "ongoing" cards. |
| `ViewFloorPlan` | `view_floor_plan` | The 2D / 3D / Plan switch on an apartment page. |
| `ViewNewsArticle` / `SelectNewsArticle` | same names | A news article is opened / a news card is clicked. |
| `VideoPlay` / `VideoPause` / `VideoComplete` | `video_start` / `video_pause` / `video_complete` | The company video on the landing page, and the project video on a project page. |
| `PartnerClick` | `partner_click` | A partner logo is clicked — an outbound click off the site. |
| `SocialClick` | `social_click` | A footer social profile is opened. |
| `CtaClick` | `cta_click` | A navigating call to action: the header's "Contact us", the landing page's "Contact" button. |
| `HeroSlide` | `hero_slide` | The hero slideshow is moved **by hand**. The 6.5s auto-cycle is never reported — it would fire forever on an idle tab. |
| `LanguageSwitch` | `language_switch` | The EN/KA pill is used. |
| **`PageView`** | `page_view` | Every route the visitor lands on, client-side navigations included. One hit per distinct URL, locale prefix included (`/ka/search?bedrooms=2`). |

### On the landing page specifically

The pixel's base code has always covered the landing page — it is mounted in
`(main)/layout.tsx`, which wraps it. What the landing page now also sends:
`ViewProject` for the hero project, `HeroSearch` and `ClearFilters` from the
quick filter, `SelectProject` from the hero's visual-search button and from
every "ongoing" card, `VideoPlay` / `VideoPause` / `VideoComplete` for the
company video, `PartnerClick`, `SocialClick`, `CtaClick`, `LeadFormStart` and
**`Lead`** from the contact form at the bottom, and `Contact` from the phone
and email in the panel beside it.

### Parameter naming

Meta's own fields use Meta's spelling (`content_type`, `content_ids`,
`content_name`, `content_category`, `search_string`, `value`, `currency`,
`num_items`). **Everything else uses the GA4 spelling** — `project_name`,
`rooms_label`, `lead_source`, `size_m2`, `unit_status` — and comes out of the
same `unitParams()` in `items.ts` that feeds GA4. A Meta breakdown and a GA4
report therefore name the same thing, and `rooms_label` keeps its `studio`
branch for the usual reason: a studio's bedroom count is legitimately 0, which
is also what a unit imported without rooms reports.

Projects are deliberately **not** a second `ViewContent`. Mixing them in would
dilute the apartment-viewer audience with everyone who ever loaded the home
page, so a project impression is `ViewProject`.

**Personal data never goes to Meta.** No name, phone or email, the same rule
GA4 follows: a lead reports *that* a field was filled in
(`lead_has_name`, `lead_has_email`), never its value. No total price is sent
either — `price.amount` on the live data is not reliably a total (see
`CLAUDE.md`), so only `price_per_sqm` travels, and `Lead`'s value is the
configured constant.

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

---

## 4. One-time setup inside Events Manager

Hits arrive whatever you do here; these steps are what turn them into usable
conversions and audiences.

1. **Events Manager → Data sources → the pixel → Overview.** With
   `NEXT_PUBLIC_FB_PIXEL_DEBUG=true` locally, or Meta's *Test events* tab, every
   event above should appear within a minute of being fired.
2. **Aggregated Event Measurement** (Events Manager → Aggregated event
   measurement → Configure web events). iOS traffic only counts the **8**
   events configured here, in priority order. Suggested order:
   `Lead`, `Contact`, `SubmitApplication`, `ViewContent`, `RequestCallOpen`,
   `LeadFormStart`, `Search`, `SelectApartment`.
3. **Custom conversions** (Events Manager → Custom conversions) for the cuts
   the sales team actually buys against — e.g. `Lead` where
   `lead_source = apartment_page` ("enquired about a specific apartment")
   versus `lead_source = landing` ("asked for a call back").
4. **Audiences** (Ads Manager → Audiences → Custom audience → Website):
   - `ViewContent` in the last 30 days, excluding `Lead` — looked at
     apartments, never enquired. The main retargeting pool.
   - `LeadFormStart` excluding `Lead` — abandoned the form; the warmest pool
     on the site.
   - `ViewProject` by `project_name` — one audience per development.
5. **A catalogue is optional.** `ViewContent` already sends
   `content_type: 'home_listing'` with the unit id, so uploading a home-listing
   catalogue later turns the existing hits into dynamic ads with no code
   change — the ids line up with the admin panel's.
6. **Domain verification** (Business settings → Brand safety → Domains) if the
   ads account will ever optimise for these events from a shared domain.

`Lead`'s `value` needs `NEXT_PUBLIC_GA_LEAD_VALUE` set at build time — the same
variable GA4 uses, since one lead is worth one number whoever is asking. With
it unset, `Lead` is sent with no value and Meta reports a count.
