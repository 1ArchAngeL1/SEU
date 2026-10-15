/**
 * Apartments, blocks and projects as GA4 sees them.
 *
 * GA4's ecommerce model is the right shape for a developer's inventory: an
 * apartment is an item, a results grid is an item list, and the funnel from
 * `view_item_list` through `view_item` to `generate_lead` is exactly the one
 * the sales team wants to read. The mapping is kept in one place so every
 * event describes a unit with the same parameter names — GA4 custom
 * dimensions are registered per name, and a second spelling is a second,
 * half-empty dimension.
 *
 * Two deliberate choices:
 *
 *  - **Names are always the English ones.** A visitor's language is already a
 *    dimension (`locale`); taking the localized name here would split one
 *    project into two unrelated rows in every report.
 *  - **No total price.** `price.amount` on the live data is not reliably a
 *    total (see CLAUDE.md — the price filter was unwired for the same reason),
 *    so only the declared `price.pricePerSqm` is reported. Lead value comes
 *    from the configured `NEXT_PUBLIC_GA_LEAD_VALUE` instead.
 */
import type { Building, Floor, Project, Unit } from '@/model/types/api';
import { bedroomCount, isStudio } from '@/lib/room-counts';
import { refId } from '@/lib/visibility';

export const ITEM_BRAND = 'SEU Development';

/** The lists an apartment can be selected from — keep these stable. */
export const LIST = {
  searchResults: { id: 'search_results', name: 'Apartment search results' },
  similar: { id: 'similar_apartments', name: 'Similar apartments' },
  visualSearchFloor: { id: 'visual_search_floor', name: 'Visual search — floor plan' },
  landingHero: { id: 'landing_hero', name: 'Landing hero' },
} as const;

export type ItemList = { id: string; name: string };

export interface GaItem {
  item_id: string;
  item_name: string;
  item_brand: string;
  /** Project — the top-level grouping in every inventory report. */
  item_category?: string;
  /** Block. */
  item_category2?: string;
  /** Unit type: living / parking / storage / commerce. */
  item_category3?: string;
  /** Layout: `studio`, `1`, `2`, … or `unknown` for units imported without rooms. */
  item_category4?: string;
  /** Sales status at the moment of the hit. */
  item_category5?: string;
  item_variant?: string;
  item_list_id?: string;
  item_list_name?: string;
  index?: number;
  quantity: number;
  /* Item-scoped custom dimensions — register these in GA4 to report on them. */
  project_id?: string;
  building_id?: string;
  floor_number?: number;
  size_m2?: number;
  bedrooms?: number;
  price_per_sqm?: number;
}

function projectOf(unit: Unit): Project | null {
  return typeof unit.project === 'string' ? null : unit.project;
}

function buildingOf(unit: Unit): Building | null {
  return typeof unit.building === 'string' ? null : unit.building;
}

/**
 * The layout as a reportable label. A studio is its own category and never
 * "0 bedrooms" — its bedroom count is legitimately zero, which is also what a
 * unit imported with no room list reports, and the two must not merge.
 */
export function roomsLabel(unit: Unit): string {
  if (isStudio(unit)) return 'studio';
  const beds = bedroomCount(unit);
  if (beds > 0) return String(beds);
  return (unit.rooms?.length ?? 0) > 0 ? '0' : 'unknown';
}

/** Rounded to one decimal — GA4 groups far better without float noise. */
function size(value: number | undefined): number | undefined {
  if (value == null || !Number.isFinite(value) || value <= 0) return undefined;
  return Math.round(value * 10) / 10;
}

/** An apartment as a GA4 ecommerce item. */
export function unitItem(
  unit: Unit,
  list?: ItemList,
  index?: number
): GaItem {
  const project = projectOf(unit);
  const building = buildingOf(unit);
  return {
    item_id: unit.id,
    item_name: unitName(unit),
    item_brand: ITEM_BRAND,
    item_category: project?.nameEn || undefined,
    item_category2: unit.block || undefined,
    item_category3: unit.type,
    item_category4: roomsLabel(unit),
    item_category5: unit.status,
    item_variant: unit.furnishingStatus,
    item_list_id: list?.id,
    item_list_name: list?.name,
    index,
    quantity: 1,
    project_id: refId(unit.project),
    building_id: building?.id ?? refId(unit.building),
    floor_number: unit.floorNumber,
    size_m2: size(unit.totalSize),
    bedrooms: bedroomCount(unit),
    price_per_sqm: unit.price?.pricePerSqm || undefined,
  };
}

/**
 * A human-readable apartment label, matching the one the admin contacts list
 * prints so a GA row and a CRM row name the same thing.
 */
export function unitName(unit: Unit): string {
  const project = projectOf(unit);
  return [
    project?.nameEn,
    unit.block ? `Block ${unit.block}` : null,
    `Fl. ${unit.floorNumber}`,
    `#${unit.unitNumber}`,
  ]
    .filter(Boolean)
    .join(' · ');
}

/**
 * The same apartment flattened into event-scoped parameters.
 *
 * Items carry their own dimensions, but item-scoped dimensions cannot be used
 * on non-ecommerce events (`generate_lead`, `request_call_open`, …) or in
 * explorations alongside them — so the unit is described twice, once per
 * scope. That is the documented GA4 workaround, not an oversight.
 */
export function unitParams(unit: Unit): Record<string, string | number | boolean | undefined> {
  const project = projectOf(unit);
  const building = buildingOf(unit);
  return {
    unit_id: unit.id,
    unit_number: unit.unitNumber,
    unit_type: unit.type,
    unit_status: unit.status,
    project_id: refId(unit.project),
    project_name: project?.nameEn || undefined,
    building_id: building?.id ?? refId(unit.building),
    block: unit.block || undefined,
    floor_number: unit.floorNumber,
    size_m2: size(unit.totalSize),
    bedrooms: bedroomCount(unit),
    rooms_label: roomsLabel(unit),
    is_studio: isStudio(unit),
    furnishing: unit.furnishingStatus,
    price_per_sqm: unit.price?.pricePerSqm || undefined,
  };
}

/** Project-scoped parameters, for the steps of the visual search funnel. */
export function projectParams(project: Project | null | undefined) {
  if (!project) return {};
  return {
    project_id: project.id,
    project_name: project.nameEn || undefined,
    project_status: project.status,
  };
}

/** Block-scoped parameters. `project` fills in when the block carries an id only. */
export function buildingParams(
  building: Building | null | undefined,
  project?: Project | null
) {
  if (!building) return {};
  const parent = typeof building.project === 'string' ? project : building.project;
  return {
    building_id: building.id,
    building_name: building.nameEn || undefined,
    block: building.block || undefined,
    building_status: building.status,
    project_id: refId(building.project),
    project_name: parent?.nameEn || undefined,
  };
}

/** Floor-scoped parameters. */
export function floorParams(floor: Floor | null | undefined) {
  if (!floor) return {};
  return {
    floor_id: floor.id,
    floor_number: floor.floorNumber,
    floor_total_units: floor.totalUnits,
    floor_available_units: floor.availableUnits,
  };
}
