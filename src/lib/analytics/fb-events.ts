/**
 * The Meta (Facebook) side of the site's event taxonomy.
 *
 * One function per event in `events.ts`, which is the only caller: a component
 * fires `trackGenerateLead(…)` once and both platforms hear about it, so the
 * two taxonomies cannot drift apart the way two sets of call sites would.
 *
 * Three rules shape what is in here:
 *
 *  - **A standard event wherever Meta has one.** `ViewContent`, `Search`,
 *    `Lead`, `Contact`, `FindLocation`, `SubmitApplication` are understood by
 *    Events Manager out of the box: they can be a conversion, an audience or an
 *    optimisation target without any setup. Everything Meta has no name for
 *    (a block entered, a floor plan opened, a partner logo clicked) is a
 *    `trackCustom` event in PascalCase, and has to be picked by hand in Events
 *    Manager before it can be used.
 *  - **Parameter names are the GA4 ones.** `project_name`, `rooms_label`,
 *    `lead_source`, `size_m2` — the same spellings `items.ts` produces, so a
 *    Meta breakdown and a GA4 report name the same thing. Only the handful of
 *    parameters Meta defines itself (`content_type`, `content_ids`,
 *    `content_name`, `content_category`, `search_string`, `value`, `currency`,
 *    `num_items`) use Meta's spelling.
 *  - **No personal data.** Exactly as in GA4: a lead reports *that* a name or
 *    an email was filled in, never the value. Nothing here ever receives one.
 *
 * `content_type: 'home_listing'` is Meta's own type for real-estate inventory,
 * so an apartment `ViewContent` lines up with a home-listing catalogue if one
 * is ever uploaded. `content_ids` carries the unit id, which is the id the
 * admin panel and the CRM use.
 */
import type { Building, Floor, Project, Unit } from '@/model/types/api';
import { LEAD_CURRENCY, LEAD_VALUE } from './config';
import { fbTrack, fbTrackCustom } from './fb-pixel';
import { type ItemList, unitName, unitParams } from './items';

/** Meta's content type for real-estate inventory. */
const HOME_LISTING = 'home_listing';

/**
 * Same cap as `view_item_list`'s: a page of results is 40 apartments and a hit
 * carrying all of them is big enough for the browser transport to start
 * dropping. `num_items` keeps the real count reportable.
 */
const MAX_IDS = 30;

/**
 * An apartment as Meta content — Meta's own `content_*` fields plus the GA4
 * `unit_*` spellings, read straight out of `unitParams()` so the two platforms
 * cannot describe the same unit differently.
 */
function unitContent(unit: Unit): Record<string, unknown> {
  const p = unitParams(unit);
  return {
    content_type: HOME_LISTING,
    content_ids: [unit.id],
    content_name: unitName(unit),
    content_category: p.project_name,
    unit_id: p.unit_id,
    unit_type: p.unit_type,
    unit_status: p.unit_status,
    project_id: p.project_id,
    project_name: p.project_name,
    block: p.block,
    floor_number: p.floor_number,
    size_m2: p.size_m2,
    rooms_label: p.rooms_label,
    price_per_sqm: p.price_per_sqm,
  };
}

/* ────────────────────────── inventory browsing ────────────────────────── */

/** An apartment page — the retargeting audience this site is built on. */
export function fbViewUnit(unit: Unit): void {
  fbTrack('ViewContent', unitContent(unit));
}

/** A set of apartments came into view. Meta has no list event of its own. */
export function fbViewUnitList(units: Unit[], list: ItemList): void {
  if (units.length === 0) return;
  fbTrackCustom('ViewApartmentList', {
    content_type: HOME_LISTING,
    content_ids: units.slice(0, MAX_IDS).map((u) => u.id),
    content_category: list.name,
    item_list_id: list.id,
    num_items: units.length,
  });
}

/** An apartment card was clicked. */
export function fbSelectUnit(unit: Unit, list: ItemList, index?: number): void {
  fbTrackCustom('SelectApartment', {
    ...unitContent(unit),
    item_list_id: list.id,
    index,
  });
}

/* ──────────────────────────── search & filters ─────────────────────────── */

/**
 * A filter was applied. `search_string` is the readable filter summary GA4
 * sends as `search_term`, so one row in Events Manager means one row in GA4.
 */
export function fbSearch(params: Record<string, unknown>, searchTerm?: string): void {
  fbTrack('Search', {
    content_type: HOME_LISTING,
    content_category: 'apartments',
    search_string: searchTerm,
    ...params,
  });
}

/**
 * The landing hero's quick filter. A custom name for the same reason GA4 keeps
 * `hero_search` separate: the hero navigates to `/search?…`, where the filter
 * is applied and fires the real `Search`. One name for both would count every
 * hero search twice.
 */
export function fbHeroSearch(params: Record<string, unknown>, searchTerm?: string): void {
  fbTrackCustom('HeroSearch', { search_string: searchTerm, ...params });
}

export function fbSearchResults(count: number, page: number, totalPages: number): void {
  fbTrackCustom('SearchResults', {
    num_items: count,
    results_count: count,
    results_page: page,
    results_total_pages: totalPages,
    results_empty: count === 0,
  });
}

export function fbClearFilters(source: string): void {
  fbTrackCustom('ClearFilters', { search_source: source });
}

export function fbResultsPage(page: number, totalPages: number): void {
  fbTrackCustom('ResultsPagination', {
    results_page: page,
    results_total_pages: totalPages,
  });
}

/* ───────────────────────── projects & visual search ────────────────────── */

/**
 * A project was shown — the landing hero, or a project's own visual-search
 * page. Its own custom event rather than a second `ViewContent`: mixing
 * projects into `ViewContent` would dilute the apartment-viewer audience with
 * everyone who ever loaded the home page.
 */
export function fbViewProject(project: Project, placement: string): void {
  fbTrackCustom('ViewProject', {
    content_ids: [project.id],
    content_name: project.nameEn || undefined,
    project_id: project.id,
    project_name: project.nameEn || undefined,
    project_status: project.status,
    placement,
  });
}

export function fbSelectProject(project: Project, source: string): void {
  fbTrackCustom('SelectProject', {
    content_ids: [project.id],
    content_name: project.nameEn || undefined,
    project_id: project.id,
    project_name: project.nameEn || undefined,
    project_status: project.status,
    select_source: source,
  });
}

export function fbSelectBuilding(
  building: Building,
  project: Project | null | undefined,
  source: string
): void {
  const parent = typeof building.project === 'string' ? project : building.project;
  fbTrackCustom('SelectBuilding', {
    content_ids: [building.id],
    content_name: building.nameEn || undefined,
    building_id: building.id,
    building_name: building.nameEn || undefined,
    block: building.block || undefined,
    project_name: parent?.nameEn || undefined,
    select_source: source,
  });
}

export function fbSelectFloor(
  floor: Floor,
  context: { projectId?: string; buildingId?: string; source?: string }
): void {
  fbTrackCustom('SelectFloor', {
    content_ids: [floor.id],
    floor_id: floor.id,
    floor_number: floor.floorNumber,
    floor_available_units: floor.availableUnits,
    project_id: context.projectId,
    building_id: context.buildingId,
    select_source: context.source,
  });
}

/** A layout tile on a project page ("2 bedrooms", "studio"). */
export function fbSelectApartmentType(type: string, projectName?: string): void {
  fbTrackCustom('SelectApartmentType', {
    content_type: HOME_LISTING,
    content_category: projectName,
    rooms_label: type,
    project_name: projectName,
  });
}

/* ───────────────────────── apartment engagement ────────────────────────── */

export function fbViewFloorPlan(unitId: string, mode: string): void {
  fbTrackCustom('ViewFloorPlan', { unit_id: unitId, view_mode: mode });
}

/** A project's map was opened — Meta's standard event for exactly this. */
export function fbViewMap(projectName: string, mode: string): void {
  fbTrack('FindLocation', {
    content_type: 'destination',
    content_name: projectName,
    project_name: projectName,
    map_mode: mode,
  });
}

/* ──────────────────────────────── leads ────────────────────────────────── */

export function fbRequestCallOpen(unit: Unit | null | undefined, source?: string): void {
  fbTrackCustom('RequestCallOpen', {
    lead_source: source,
    ...(unit ? unitContent(unit) : {}),
  });
}

/**
 * The visitor started typing into a contact form. Worth its own event on Meta
 * specifically: "started the form but never sent it" is an audience you can
 * retarget, which is not something a GA4 report can do for you.
 */
export function fbLeadFormStart(source: string, unitId?: string): void {
  fbTrackCustom('LeadFormStart', { lead_source: source, unit_id: unitId });
}

/**
 * A contact request was accepted by the backend — **the conversion.** Configure
 * `Lead` as the optimisation event in Ads Manager.
 *
 * `value` is the same configured `NEXT_PUBLIC_GA_LEAD_VALUE` GA4 reports, not
 * the apartment's price: a lead is worth a slice of a sale, and the stored
 * `price.amount` is not reliably a total anyway. Omitted entirely when unset,
 * so Meta reports a count rather than a wrong number.
 */
export function fbGenerateLead(args: {
  source: string;
  unit?: Unit | null;
  unitId?: string;
  hasName: boolean;
  hasEmail: boolean;
}): void {
  const { source, unit, unitId, hasName, hasEmail } = args;
  fbTrack('Lead', {
    value: LEAD_VALUE,
    currency: LEAD_VALUE ? LEAD_CURRENCY : undefined,
    lead_source: source,
    lead_has_apartment: Boolean(unit ?? unitId),
    lead_has_name: hasName,
    lead_has_email: hasEmail,
    ...(unit ? unitContent(unit) : unitId ? { content_ids: [unitId], unit_id: unitId } : {}),
  });
}

export function fbLeadError(source: string, unitId?: string): void {
  fbTrackCustom('LeadError', { lead_source: source, unit_id: unitId });
}

/** A phone number or email address was tapped — Meta's `Contact`, literally. */
export function fbContactClick(method: string, placement: string): void {
  fbTrack('Contact', { contact_method: method, contact_placement: placement });
}

/** A CV was sent from the careers block. */
export function fbSubmitApplication(position: string): void {
  fbTrack('SubmitApplication', {
    content_name: position,
    application_position: position,
  });
}

/* ───────────────────────────── content & site ──────────────────────────── */

export function fbViewNewsArticle(id: string, title: string): void {
  fbTrackCustom('ViewNewsArticle', {
    content_type: 'article',
    content_ids: [id],
    content_name: title,
    article_id: id,
    article_title: title,
  });
}

export function fbSelectNewsArticle(id: string, title: string, index?: number): void {
  fbTrackCustom('SelectNewsArticle', {
    content_type: 'article',
    content_ids: [id],
    content_name: title,
    article_id: id,
    article_title: title,
    index,
  });
}

export function fbLanguageSwitch(from: string, to: string): void {
  fbTrackCustom('LanguageSwitch', { language_from: from, language_to: to });
}

/** A partner logo was clicked — an outbound click off the site. */
export function fbPartnerClick(name: string, placement: string, url?: string): void {
  fbTrackCustom('PartnerClick', {
    content_name: name,
    partner_name: name,
    partner_placement: placement,
    outbound_url: url,
  });
}

/** A social profile was opened from the footer. */
export function fbSocialClick(network: string, placement: string): void {
  fbTrackCustom('SocialClick', {
    content_name: network,
    social_network: network,
    social_placement: placement,
  });
}

/** A call-to-action button that is not a form and not an apartment. */
export function fbCtaClick(args: {
  id: string;
  placement: string;
  label?: string;
  destination?: string;
}): void {
  fbTrackCustom('CtaClick', {
    content_name: args.label ?? args.id,
    cta_id: args.id,
    cta_placement: args.placement,
    cta_destination: args.destination,
  });
}

/** The company / project video. One custom name per action, not one with a flag. */
export function fbVideo(
  action: 'start' | 'pause' | 'complete',
  args: { title: string; placement: string; percent?: number }
): void {
  const name =
    action === 'start' ? 'VideoPlay' : action === 'pause' ? 'VideoPause' : 'VideoComplete';
  fbTrackCustom(name, {
    content_type: 'video',
    content_name: args.title,
    video_title: args.title,
    video_placement: args.placement,
    video_percent: args.percent,
  });
}

/** The hero slideshow was moved by hand (the auto-cycle is never reported). */
export function fbHeroSlide(index: number, total: number, method: string, projectName?: string): void {
  fbTrackCustom('HeroSlide', {
    content_name: projectName,
    project_name: projectName,
    slide_index: index,
    slide_total: total,
    slide_method: method,
  });
}
