# Google Analytics 4

Everything the public site sends to GA4, why it sends it, and what has to be
clicked in the GA4 UI before the data turns into reports.

Code lives in `src/lib/analytics/` (`config.ts` → `gtag.ts` → `items.ts` →
`events.ts`) and `src/components/analytics/`. Components never call `gtag`
directly — they call a named helper from `events.ts`, so a parameter is spelled
the same way everywhere. GA4 registers custom dimensions **by parameter name**;
a second spelling is a second, half-empty dimension.

---

## 1. Turning it on

| Variable | Required | Meaning |
|---|---|---|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | yes | `G-XXXXXXXXXX` from GA4 → Admin → Data streams → Web. **Empty = the whole integration is off**: no script, no events. |
| `NEXT_PUBLIC_GA_DEBUG` | no | `true` routes hits to DebugView and logs every event to the console. Never `true` in production — debug hits are excluded from the standard reports. |
| `NEXT_PUBLIC_GA_LEAD_VALUE` | no | What one contact request is worth. Attached to `generate_lead` as `value`. |
| `NEXT_PUBLIC_GA_LEAD_CURRENCY` | no | Currency for the above. Default `GEL`. |

`NEXT_PUBLIC_*` is inlined at build time — a changed value needs a rebuild and
a restart, exactly like `NEXT_PUBLIC_SITE_MODE`.

**Where it runs:** the public layout only (`src/app/[locale]/(main)/layout.tsx`).
`/admin/*` and `/presentation/*` are staff tools; counting the sales team's own
sessions would wreck every engagement figure in the property.

**Page views are manual.** The site is a single-page app after the first load,
so `send_page_view` is off in the config call and `PageViewTracker` fires one
`page_view` per distinct URL, locale prefix included (`/ka/search?bedrooms=2`).

---

## 2. The funnel

```
page_view
   │
   ├── search ──────────────► view_search_results ──► results_pagination
   │   (filter applied)        (how many matched)
   │
   ├── view_item_list ──────► select_item ──────────► view_item
   │   (grid / rail / floor)   (card clicked)         (apartment page)
   │                                                      │
   └── select_project ──► select_building ──► select_floor ┘
       (visual search)                                     │
                                                           ▼
                                  view_floor_plan · view_map · request_call_open
                                                           │
                                                           ▼
                                                    generate_lead  ★ key event
                                                    contact_click  (dialled instead)
```

---

## 3. Events

Names in **bold** are GA4 recommended events and come with built-in reports.

### Inventory

| Event | Fired when | Key parameters |
|---|---|---|
| **`view_item_list`** | A set of apartments is rendered: search grid, "similar apartments" rail, a floor's units | `item_list_id`, `item_list_name`, `list_size`, `items[]` |
| **`select_item`** | An apartment card or floor-plan polygon is clicked | `item_list_id`, `items[]`, plus every `unit_*` parameter |
| **`view_item`** | An apartment detail page is opened | `items[]`, plus every `unit_*` parameter |

Lists (`item_list_id`): `search_results`, `similar_apartments`,
`visual_search_floor`, `landing_hero`.

### Search

| Event | Fired when | Key parameters |
|---|---|---|
| **`search`** | A filter is applied — from the form, a shared link, or a back step | `search_source` (`search_form` \| `url`), `search_term`, `filter_*` |
| `hero_search` | The landing hero's quick filter is submitted | `filter_*` |
| `view_search_results` | Results come back for that filter | `results_count`, `results_page`, `results_total_pages`, `results_empty` |
| `results_pagination` | A different page of results | `results_page`, `results_total_pages` |
| `clear_filters` | Every filter reset | `search_source` |

`hero_search` is its own name on purpose: the hero navigates to `/search?…`,
where the filter is applied and fires the real `search`. One name for both
would count every hero search twice.

### Visual search

| Event | Fired when | Key parameters |
|---|---|---|
| `select_project` | A project is entered, from `/visual-search` or the landing hero | `project_id`, `project_name`, `project_status`, `select_source` |
| `select_building` | A block is entered (any polygon layer or the mobile "view" button) | `building_id`, `building_name`, `block`, `building_status`, `project_*` |
| `select_floor` | A floor is entered | `floor_id`, `floor_number`, `floor_total_units`, `floor_available_units` |

### Engagement

| Event | Fired when | Key parameters |
|---|---|---|
| `view_floor_plan` | The 2D / 3D / Plan switch on an apartment page | `unit_id`, `view_mode` |
| `view_map` | A project's location is opened | `project_name`, `map_mode` (`dialog` \| `external`) |
| `view_news_article` | A news article page is opened | `article_id`, `article_title` |
| `select_news_article` | A news card is clicked | `article_id`, `article_title`, `index` |
| `language_switch` | The EN/KA pill is used | `language_from`, `language_to` |

### Leads — the part the sales team reads

| Event | Fired when | Key parameters |
|---|---|---|
| `request_call_open` | The call-back dialog is opened from an apartment | `lead_source`, every `unit_*` |
| `lead_form_start` | The visitor types into a contact form (once per form) | `lead_source`, `unit_id` |
| **`generate_lead`** ★ | A contact request is **accepted by the backend** | `value`, `currency`, `lead_source`, `lead_has_apartment`, `lead_has_name`, `lead_has_email`, `unit_id`, `unit_label`, every `unit_*` |
| `lead_error` | A submitted form was rejected — a lost lead, invisible otherwise | `lead_source`, `unit_id` |
| `contact_click` | A phone number or email address is tapped instead | `contact_method` (`phone` \| `email`), `contact_placement` |
| `submit_application` | A CV is sent from the careers block | `application_position` |

`lead_source` is one of: `landing`, `contact_page`, `about_page`, `news_page`,
`news_article`, `apartment_page`, `apartment_dialog`, `visual_search`,
`visual_search_project`, `visual_search_building`, `visual_search_floor`.
It is a **required prop** on `ContactForm` — an unlabelled lead is a hole in
the conversion report, so a new form cannot be added without declaring where
it sits.

`lead_form_start` ÷ `generate_lead` is the form's abandonment rate, which is
the one number that says whether the form itself is the problem.

---

## 4. What a unit looks like in GA4

Every apartment is described twice, once per scope. Item-scoped dimensions
cannot be used on non-ecommerce events (`generate_lead`, `request_call_open`),
so the same facts also travel as event parameters. That is the documented GA4
workaround, not duplication by accident.

**Item scope** (inside `items[]`):

| Field | Holds |
|---|---|
| `item_id` / `item_name` | unit id / `Project · Block X · Fl. N · #unit` |
| `item_brand` | `SEU Development` |
| `item_category` … `item_category5` | project, block, unit type, layout, status |
| `item_variant` | furnishing status |
| `project_id`, `building_id`, `floor_number`, `size_m2`, `bedrooms`, `price_per_sqm` | item-scoped custom dimensions |

**Event scope:** `unit_id`, `unit_number`, `unit_type`, `unit_status`,
`project_id`, `project_name`, `building_id`, `block`, `floor_number`,
`size_m2`, `bedrooms`, `rooms_label`, `is_studio`, `furnishing`,
`price_per_sqm`.

Two deliberate rules:

- **Names are always the English ones.** The visitor's language is already its
  own dimension (`locale`); taking the localized name here would split one
  project into two unrelated rows in every report.
- **No total price is sent.** `price.amount` on the live data is not reliably a
  total — the same reason the price filter is unwired (see `CLAUDE.md`). Only
  the declared `price.pricePerSqm` is reported, and lead value comes from
  `NEXT_PUBLIC_GA_LEAD_VALUE` instead. If the price data is ever cleaned up,
  add `price` to `unitItem()` in `src/lib/analytics/items.ts` and nothing else
  has to change.
- **`rooms_label`** is `studio`, `1`, `2`, … or `unknown`. A studio is never
  "0 bedrooms": its bedroom count is legitimately zero, which is also what a
  unit imported without a room list reports, and merging the two would bill
  every unlabelled unit as a studio.

---

## 5. One-time setup inside GA4

Data arrives whatever you do here, but it stays invisible in reports until
these are registered.

### 5.1 Mark the key event

Admin → Events → **`generate_lead`** → *Mark as key event*. Optionally also
`request_call_open` and `contact_click` as secondary key events.

### 5.2 Register custom dimensions

Admin → Custom definitions → Create custom dimension. GA4 allows 50
event-scoped dimensions; the list below is 30.

**Event-scoped** (scope: Event, event parameter = the name):

```
unit_id          unit_number      unit_type        unit_status
project_id       project_name     project_status   building_id
building_name    block            floor_number     floor_id
size_m2          bedrooms         rooms_label      is_studio
furnishing       price_per_sqm    locale           lead_source
contact_method   contact_placement  view_mode      map_mode
search_source    search_term      filter_rooms     filter_project_name
results_count    article_title
```

**Item-scoped** (scope: Item):

```
project_id   building_id   floor_number   size_m2   bedrooms   price_per_sqm
```

**User-scoped:** `site_mode`, `site_locale`.

> Register the ones you will actually report on first — a dimension only
> collects data from the day it is created, so adding them late loses history.

### 5.3 Enable enhanced measurement

Admin → Data streams → Web → Enhanced measurement. It covers scroll depth,
outbound clicks (the footer's Facebook / Instagram / YouTube links), file
downloads and embedded YouTube video engagement — none of which the code above
has to duplicate. Leave **site search off**: `/search` is a structured filter,
not a keyword box, and the `search` event already carries it properly.

### 5.4 Suggested reports

| Question | Build it from |
|---|---|
| Which project draws the most interest? | `view_item` by `project_name` |
| Which apartments are viewed but never enquired about? | `view_item` vs `generate_lead` by `unit_id` |
| Which layout sells attention — studio, 2-bed, 3-bed? | `view_item` by `rooms_label` |
| Where do leads come from? | `generate_lead` by `lead_source` × session source/medium |
| Is the visual search working? | `select_project` → `select_building` → `select_floor` → `select_item` as a funnel exploration |
| Are filters returning nothing? | `view_search_results` where `results_empty = true`, by `search_term` |
| Do people call instead of writing? | `contact_click` by `contact_placement` |
| Which floors get attention? | `select_floor` by `floor_number` |

---

## 6. Privacy

Consent Mode v2 defaults are declared before the library loads
(`GoogleAnalytics.tsx`): **analytics storage granted, every advertising signal
denied** — the site runs no ad platforms and asks for no advertising consent.
IP anonymisation is unconditional in GA4.

No personal data is ever sent: a lead reports *that* a name and an email were
filled in (`lead_has_name`, `lead_has_email`), never their values. The phone
number, name and email live only in the backend and the admin panel.

If a cookie banner is added later, call `gaSetConsent({ analytics, ads })` from
`src/lib/analytics/gtag.ts` when the visitor chooses — gtag backfills the hits
it buffered in the meantime. The banner itself is the only missing piece; the
plumbing is already there.

---

## 7. Checking it works

1. `NEXT_PUBLIC_GA_DEBUG=true`, rebuild, reload.
2. Every event is logged to the browser console as `[analytics] event: …` —
   this also works with **no** measurement id, so the taxonomy can be checked
   before the property exists.
3. With an id set, GA4 → Admin → DebugView shows the same stream live.
4. Realtime (not DebugView) is where production traffic shows up; standard
   reports lag by up to 24–48 hours.
