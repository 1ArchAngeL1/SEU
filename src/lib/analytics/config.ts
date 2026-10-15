/**
 * Google Analytics 4 configuration.
 *
 * Everything here is read from `NEXT_PUBLIC_*`, which Next inlines at build
 * time — a changed value needs a rebuild, exactly like `NEXT_PUBLIC_SITE_MODE`.
 *
 * With no measurement id the whole integration is dormant: no script is
 * injected and every `ga*()` call is a no-op, so a dev box (or a preview
 * deploy) never pollutes the production property.
 */

/** `G-XXXXXXXXXX` from GA4 → Admin → Data streams → Web. */
export const GA_MEASUREMENT_ID = (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? '').trim();

/** Nothing is loaded or sent without a measurement id. */
export const analyticsEnabled = GA_MEASUREMENT_ID.length > 0;

/**
 * Routes every hit through GA4's DebugView and mirrors each event to the
 * browser console. Never leave this on in production — debug hits are excluded
 * from the standard reports.
 */
export const GA_DEBUG = process.env.NEXT_PUBLIC_GA_DEBUG === 'true';

/**
 * What one submitted contact request is worth to the sales team, attached to
 * `generate_lead` so GA4 can report lead value per channel/campaign.
 *
 * This is deliberately a configured constant rather than the apartment's price:
 * `price.amount` on the live data is not reliably a total (see CLAUDE.md), and
 * a lead is worth a slice of a sale, not a sale. Leave it unset to send
 * `generate_lead` with no monetary value.
 */
const rawLeadValue = Number(process.env.NEXT_PUBLIC_GA_LEAD_VALUE);
export const LEAD_VALUE =
  Number.isFinite(rawLeadValue) && rawLeadValue > 0 ? rawLeadValue : undefined;

export const LEAD_CURRENCY = (process.env.NEXT_PUBLIC_GA_LEAD_CURRENCY ?? 'GEL').trim();
