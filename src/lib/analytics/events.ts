/**
 * The event taxonomy for the public site — everything a real-estate developer
 * needs to read out of GA4 **and out of the Meta pixel**, in one place.
 *
 * Every function here reports to both platforms: one `gaEvent(…)` and one call
 * into `fb-events.ts`, which holds the Meta spelling of the same event. That is
 * deliberate — a component fires `trackGenerateLead(…)` once and both
 * platforms hear about it, so the two taxonomies cannot drift apart the way two
 * sets of call sites would. Either platform switches itself off on its own
 * (no measurement id / `NEXT_PUBLIC_FB_PIXEL_DISABLED`); the call sites never
 * know which one is listening.
 *
 * The funnel these events describe:
 *
 *   page_view → view_item_list → select_item → view_item
 *             → request_call_open → generate_lead
 *
 * with the visual search as a parallel path into the same apartment:
 *
 *   select_project → select_building → select_floor → select_item → view_item
 *
 * GA4's own recommended names are used wherever one fits (`view_item_list`,
 * `select_item`, `view_item`, `search`, `generate_lead`) — those carry
 * built-in reports and `generate_lead` can be flagged as a key event. The rest
 * are custom names, in the same snake_case style.
 *
 * Parameter names are the contract with the GA4 property: each one has to be
 * registered as a custom dimension before it shows up in a report. The full
 * list to register is in `docs/analytics.md`.
 */
import type { Building, Floor, Project, Unit } from '@/model/types/api';
import type { UnitFilter } from '@/model/types/api';
import { LEAD_CURRENCY, LEAD_VALUE } from './config';
import { gaEvent } from './gtag';
import {
  fbClearFilters,
  fbContactClick,
  fbCtaClick,
  fbGenerateLead,
  fbHeroSearch,
  fbHeroSlide,
  fbLanguageSwitch,
  fbLeadError,
  fbLeadFormStart,
  fbPartnerClick,
  fbRequestCallOpen,
  fbResultsPage,
  fbSearch,
  fbSearchResults,
  fbSelectApartmentType,
  fbSelectBuilding,
  fbSelectFloor,
  fbSelectNewsArticle,
  fbSelectProject,
  fbSelectUnit,
  fbSocialClick,
  fbSubmitApplication,
  fbVideo,
  fbViewFloorPlan,
  fbViewMap,
  fbViewNewsArticle,
  fbViewProject,
  fbViewUnit,
  fbViewUnitList,
} from './fb-events';
import {
  type ItemList,
  buildingParams,
  floorParams,
  projectParams,
  unitItem,
  unitName,
  unitParams,
} from './items';

export { LIST } from './items';
export type { ItemList } from './items';

/**
 * Where on the site a contact form sits. Attached to every lead so the sales
 * team can tell an apartment enquiry from a "call me" on the landing page —
 * the two are worth very different amounts of attention.
 */
export type LeadSource =
  | 'landing'
  | 'contact_page'
  | 'about_page'
  | 'news_page'
  | 'news_article'
  | 'apartment_page'
  | 'apartment_dialog'
  | 'visual_search'
  | 'visual_search_project'
  | 'visual_search_building'
  | 'visual_search_floor';

/** Which contact channel a visitor tapped, rather than filling in the form. */
export type ContactMethod = 'phone' | 'email';

/** Where a project was shown, for `view_project`. */
export type ProjectPlacement = 'landing_hero' | 'visual_search_project';

/** The non-form calls to action — buttons that navigate rather than submit. */
export type CtaPlacement =
  | 'header'
  | 'landing_about'
  | 'landing_hero'
  | 'footer'
  | 'mobile_menu';

/* ────────────────────────── inventory browsing ────────────────────────── */

/**
 * A list of apartments came into view — the search grid, the similar-units
 * rail, the units of one floor.
 *
 * The list is truncated: a full search page is 40 apartments, and one hit
 * carrying every field of every one of them is a payload big enough for the
 * browser transport to start dropping. `list_size` keeps the real count
 * reportable, and the items themselves omit `item_list_id` / `item_list_name`
 * because GA4 inherits those from the event onto every item.
 */
const MAX_ITEMS = 30;

export function trackViewItemList(
  units: Unit[],
  list: ItemList,
  extra: Record<string, string | number | boolean | undefined> = {}
): void {
  if (units.length === 0) return;
  gaEvent('view_item_list', {
    item_list_id: list.id,
    item_list_name: list.name,
    list_size: units.length,
    items: units.slice(0, MAX_ITEMS).map((unit, i) => unitItem(unit, undefined, i)),
    ...extra,
  });
  fbViewUnitList(units, list);
}

/** An apartment card was clicked. */
export function trackSelectItem(unit: Unit, list: ItemList, index?: number): void {
  gaEvent('select_item', {
    item_list_id: list.id,
    item_list_name: list.name,
    items: [unitItem(unit, list, index)],
    ...unitParams(unit),
  });
  fbSelectUnit(unit, list, index);
}

/** An apartment detail page was opened. */
export function trackViewItem(unit: Unit): void {
  gaEvent('view_item', {
    items: [unitItem(unit)],
    ...unitParams(unit),
  });
  fbViewUnit(unit);
}

/* ──────────────────────────── search & filters ─────────────────────────── */

/**
 * A filter was applied. `search_term` is a readable summary of the filter so
 * the standard "site search" report is useful on its own; the individual
 * criteria also go over as their own parameters, which is what the saved
 * explorations actually group by.
 *
 * Fired for a filter arriving in the URL too (a hero search, a shared link, a
 * back step) — those are searches as much as a click on the Search button.
 */
export function trackSearch(
  filter: UnitFilter,
  context: { source: 'search_form' | 'url'; projectName?: string }
): void {
  const params = filterParams(filter, context.projectName);
  gaEvent('search', { search_source: context.source, ...params });
  fbSearch({ search_source: context.source, ...params }, params.search_term);
}

/**
 * The landing hero's quick filter was submitted.
 *
 * Its own event rather than a `search` with a different source: the hero
 * navigates to `/search?…`, where the filter it carried is applied and fires
 * the real `search`. Sending both under one name would count every hero
 * search twice.
 */
export function trackHeroSearch(filter: UnitFilter): void {
  const params = filterParams(filter);
  gaEvent('hero_search', params);
  fbHeroSearch(params, params.search_term);
}

/** The shared description of a filter — same parameter names everywhere. */
function filterParams(filter: UnitFilter, projectName?: string) {
  const beds = filter.bedroomCounts?.length
    ? filter.bedroomCounts
    : filter.bedrooms != null
      ? [filter.bedrooms]
      : [];
  const rooms = [...(filter.studio ? ['studio'] : []), ...beds.map(String)];

  return {
    search_term: summarizeFilter(filter, rooms),
    filter_project: filter.project,
    filter_project_name: projectName,
    filter_building: filter.building,
    filter_rooms: rooms.length ? rooms.join(',') : undefined,
    filter_rooms_count: rooms.length || undefined,
    filter_studio: filter.studio ?? undefined,
    filter_size_min: filter.minSize,
    filter_size_max: filter.maxSize,
    filter_type: filter.type,
    filter_status: filter.status,
  };
}

/** `sizeM2 60-90 · rooms studio,2` — empty when nothing is narrowed. */
function summarizeFilter(filter: UnitFilter, rooms: string[]): string {
  const parts: string[] = [];
  if (filter.project) parts.push('project');
  if (filter.building) parts.push('block');
  if (filter.minSize != null || filter.maxSize != null) {
    parts.push(`size ${filter.minSize ?? ''}-${filter.maxSize ?? ''}`);
  }
  if (rooms.length) parts.push(`rooms ${rooms.join(',')}`);
  if (filter.type) parts.push(`type ${filter.type}`);
  return parts.join(' · ') || 'all';
}

/** The results that came back for the filter that was just applied. */
export function trackSearchResults(count: number, page: number, totalPages: number): void {
  gaEvent('view_search_results', {
    results_count: count,
    results_page: page,
    results_total_pages: totalPages,
    results_empty: count === 0,
  });
  fbSearchResults(count, page, totalPages);
}

/** Every filter reset to its default — a strong signal the filter is too narrow. */
export function trackClearFilters(source: 'search_form' | 'hero'): void {
  gaEvent('clear_filters', { search_source: source });
  fbClearFilters(source);
}

/** A different page of results. */
export function trackResultsPage(page: number, totalPages: number): void {
  gaEvent('results_pagination', { results_page: page, results_total_pages: totalPages });
  fbResultsPage(page, totalPages);
}

/* ───────────────────────── visual search funnel ────────────────────────── */

/**
 * A project was put in front of the visitor — the landing hero, or the
 * project's own visual-search page.
 *
 * Fired once per mount, not per render: it is an impression of the project,
 * and the figure worth reading is "how many sessions saw Varketili", not how
 * many times React re-rendered the hero.
 */
export function trackViewProject(project: Project, placement: ProjectPlacement): void {
  gaEvent('view_project', { ...projectParams(project), project_placement: placement });
  fbViewProject(project, placement);
}

export function trackSelectProject(
  project: Project,
  source: 'visual_search' | 'landing' = 'visual_search'
): void {
  gaEvent('select_project', { ...projectParams(project), select_source: source });
  fbSelectProject(project, source);
}

export function trackSelectBuilding(
  building: Building,
  project?: Project | null,
  source: 'polygon' | 'list' = 'polygon'
): void {
  gaEvent('select_building', {
    ...buildingParams(building, project),
    select_source: source,
  });
  fbSelectBuilding(building, project, source);
}

export function trackSelectFloor(
  floor: Floor,
  context: { projectId?: string; buildingId?: string; source?: 'polygon' | 'list' } = {}
): void {
  gaEvent('select_floor', {
    ...floorParams(floor),
    project_id: context.projectId,
    building_id: context.buildingId,
    select_source: context.source ?? 'polygon',
  });
  fbSelectFloor(floor, { ...context, source: context.source ?? 'polygon' });
}

/* ───────────────────────── apartment engagement ────────────────────────── */

/** The 2D / 3D / plan switch on an apartment page. */
export function trackViewFloorPlan(unitId: string, mode: string): void {
  gaEvent('view_floor_plan', { unit_id: unitId, view_mode: mode });
  fbViewFloorPlan(unitId, mode);
}

/** A project's location was opened — in the embedded dialog or on Google Maps. */
export function trackViewMap(projectName: string, mode: 'dialog' | 'external'): void {
  gaEvent('view_map', { project_name: projectName, map_mode: mode });
  fbViewMap(projectName, mode);
}

/* ──────────────────────────────── leads ────────────────────────────────── */

/**
 * The call-back dialog was opened from an apartment. The clearest statement of
 * intent on the site short of the lead itself, and the denominator for the
 * dialog's conversion rate.
 */
export function trackRequestCallOpen(unit?: Unit | null, source?: LeadSource): void {
  gaEvent('request_call_open', {
    lead_source: source,
    ...(unit ? unitParams(unit) : {}),
  });
  fbRequestCallOpen(unit, source);
}

/**
 * The visitor started filling a contact form. Paired with `generate_lead` this
 * gives the form's abandonment rate, which is the one number that tells you
 * whether the form itself is the problem.
 */
export function trackLeadFormStart(source: LeadSource, unitId?: string): void {
  gaEvent('lead_form_start', { lead_source: source, unit_id: unitId });
  fbLeadFormStart(source, unitId);
}

/**
 * A contact request was accepted by the backend. **This is the conversion** —
 * mark it as a key event in GA4.
 *
 * `value` is the configured `NEXT_PUBLIC_GA_LEAD_VALUE`, not the apartment's
 * price: a lead is worth a fraction of a sale, and the stored `price.amount`
 * is not reliably a total anyway.
 */
export function trackGenerateLead(args: {
  source: LeadSource;
  unit?: Unit | null;
  unitId?: string;
  hasName: boolean;
  hasEmail: boolean;
}): void {
  const { source, unit, unitId, hasName, hasEmail } = args;
  gaEvent('generate_lead', {
    currency: LEAD_VALUE ? LEAD_CURRENCY : undefined,
    value: LEAD_VALUE,
    lead_source: source,
    lead_has_apartment: Boolean(unit ?? unitId),
    lead_has_name: hasName,
    lead_has_email: hasEmail,
    unit_id: unitId ?? unit?.id,
    unit_label: unit ? unitName(unit) : undefined,
    ...(unit ? unitParams(unit) : {}),
    ...(unit ? { items: [unitItem(unit)] } : {}),
  });
  fbGenerateLead({ source, unit, unitId, hasName, hasEmail });
}

/** A contact form was submitted but the request failed — invisible otherwise. */
export function trackLeadError(source: LeadSource, unitId?: string): void {
  gaEvent('lead_error', { lead_source: source, unit_id: unitId });
  fbLeadError(source, unitId);
}

/** A phone number or email address was tapped instead of the form. */
export function trackContactClick(method: ContactMethod, placement: string): void {
  gaEvent('contact_click', { contact_method: method, contact_placement: placement });
  fbContactClick(method, placement);
}

/* ───────────────────────────── content & site ──────────────────────────── */

export function trackViewNewsArticle(id: string, title: string): void {
  gaEvent('view_news_article', { article_id: id, article_title: title });
  fbViewNewsArticle(id, title);
}

export function trackSelectNewsArticle(id: string, title: string, index?: number): void {
  gaEvent('select_news_article', { article_id: id, article_title: title, index });
  fbSelectNewsArticle(id, title, index);
}

/** A CV was sent from the careers block. */
export function trackSubmitApplication(position: string): void {
  gaEvent('submit_application', { application_position: position });
  fbSubmitApplication(position);
}

export function trackLanguageSwitch(from: string, to: string): void {
  gaEvent('language_switch', { language_from: from, language_to: to });
  fbLanguageSwitch(from, to);
}

/* ──────────────────── layouts, partners, CTAs & chrome ─────────────────── */

/**
 * A layout tile on a project page was clicked ("studio", "2 bedrooms") — it
 * links into `/search` pre-filtered, so this is the start of a search the
 * `search` event on the results page then describes in full.
 */
export function trackSelectApartmentType(args: {
  type: string;
  projectId?: string;
  projectName?: string;
}): void {
  gaEvent('select_apartment_type', {
    rooms_label: args.type,
    project_id: args.projectId,
    project_name: args.projectName,
  });
  fbSelectApartmentType(args.type, args.projectName);
}

/** A partner logo was clicked — an outbound click, so the session ends here. */
export function trackPartnerClick(args: {
  name: string;
  placement: 'landing' | 'about';
  url?: string;
}): void {
  gaEvent('partner_click', {
    partner_name: args.name,
    partner_placement: args.placement,
    outbound_url: args.url,
  });
  fbPartnerClick(args.name, args.placement, args.url);
}

/** A social profile was opened. */
export function trackSocialClick(network: string, placement: string): void {
  gaEvent('social_click', { social_network: network, social_placement: placement });
  fbSocialClick(network, placement);
}

/**
 * A call-to-action that is neither a form nor an apartment — the header's
 * "Contact us", the landing page's "Contact" button.
 *
 * `cta_id` is a stable, English, hand-written id: the visible label is
 * localized, and grouping a report by it would split one button in two.
 */
export function trackCtaClick(args: {
  id: string;
  placement: CtaPlacement;
  label?: string;
  destination?: string;
}): void {
  gaEvent('cta_click', {
    cta_id: args.id,
    cta_placement: args.placement,
    cta_label: args.label,
    cta_destination: args.destination,
  });
  fbCtaClick(args);
}

/**
 * The company / project video.
 *
 * `video_start` and `video_complete` are GA4's own recommended names, so they
 * line up with the ones enhanced measurement produces for embedded YouTube;
 * `video_pause` is a custom name in the same family. `video_provider` says
 * `self_hosted` because these files are served from `/public/video`, not from
 * a platform.
 */
export function trackVideo(
  action: 'start' | 'pause' | 'complete',
  args: { title: string; placement: string; currentTime?: number; duration?: number }
): void {
  const { title, placement, currentTime, duration } = args;
  const percent =
    duration && duration > 0 && currentTime != null
      ? Math.min(100, Math.round((currentTime / duration) * 100))
      : undefined;
  gaEvent(action === 'start' ? 'video_start' : action === 'pause' ? 'video_pause' : 'video_complete', {
    video_title: title,
    video_provider: 'self_hosted',
    video_placement: placement,
    video_current_time: currentTime != null ? Math.round(currentTime) : undefined,
    video_duration: duration != null ? Math.round(duration) : undefined,
    video_percent: percent,
  });
  fbVideo(action, { title, placement, percent });
}

/**
 * The hero slideshow was moved **by hand**. The automatic cycle is never
 * reported: it would fire every 6.5 seconds on an idle tab and drown every
 * other event on the landing page.
 */
export function trackHeroSlide(args: {
  index: number;
  total: number;
  method: 'arrow' | 'dot';
  projectName?: string;
}): void {
  gaEvent('hero_slide', {
    slide_index: args.index,
    slide_total: args.total,
    slide_method: args.method,
    project_name: args.projectName,
  });
  fbHeroSlide(args.index, args.total, args.method, args.projectName);
}
