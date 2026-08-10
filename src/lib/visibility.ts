import type { Building, Project, Unit } from '@/model/types/api';

/**
 * Public-site visibility rules.
 *
 * The admin "Active" switch on a project, a building (block) or a unit is a
 * kill-switch: the record and everything under it must disappear from the
 * public site — a unit is public only when the unit, its block and its project
 * are all active.
 *
 * The cascade is applied by the **backend**, which every public read opts into
 * with `visibleOnly=true` (see the `usePublic*` / `useActive*` hooks). These
 * helpers are the client-side second line of defence: unit and block responses
 * come with their `project` / `building` relations populated including their
 * `isActive` flags, so a record that slipped through can still be dropped
 * before it reaches the page.
 *
 * Admin screens deliberately skip all of this: editors must keep seeing
 * deactivated records.
 */

type Ref<T> = string | T | null | undefined;

/** Relations come back either as a raw id or as a populated document. */
export function refId<T extends { id: string }>(ref: Ref<T>): string | undefined {
  if (!ref) return undefined;
  return typeof ref === 'string' ? ref : ref.id;
}

/**
 * Visibility of a relation. A bare id carries no flag and reads as visible —
 * the backend has already filtered the list it came in, and guessing "hidden"
 * here would blank pages the admin never switched off.
 */
function isRefVisible<T extends { isActive?: boolean }>(ref: Ref<T>): boolean {
  if (!ref || typeof ref === 'string') return true;
  return ref.isActive !== false;
}

/** A project the public site may render. */
export function isProjectVisible(project: Project | null | undefined): boolean {
  return Boolean(project) && project!.isActive !== false;
}

/** A building is public only when it and its project are both active. */
export function isBuildingVisible(
  building: Building | null | undefined
): boolean {
  if (!building || building.isActive === false) return false;
  return isRefVisible(building.project);
}

/** A unit is public only when the unit, its block and its project are active. */
export function isUnitVisible(unit: Unit): boolean {
  if (unit.isActive === false) return false;
  if (!isRefVisible(unit.building)) return false;
  // A populated block carries its own project — check that leg of the cascade
  // too, in case only the project was switched off.
  if (unit.building && typeof unit.building !== 'string') {
    if (!isRefVisible(unit.building.project)) return false;
  }
  return isRefVisible(unit.project);
}

/** Drop the deactivated blocks from a list. */
export function visibleBuildings(buildings: Building[]): Building[] {
  return buildings.filter(isBuildingVisible);
}

/** Drop the units hidden by their own, their block's or their project's flag. */
export function visibleUnits(units: Unit[]): Unit[] {
  return units.filter(isUnitVisible);
}

/**
 * Project headline figures recomputed from the blocks still on show, so a
 * deactivated block stops being counted anywhere on the public site.
 *
 * `units` / `available` come back `null` when every per-block aggregate is zero
 * while blocks do exist — the backend does not always fill them in, and a
 * silent "0 apartments" would be worse than the project-level number. Callers
 * fall back to the project aggregate in that case.
 */
export function blockTotals(buildings: Building[]): {
  blocks: number;
  units: number | null;
  available: number | null;
} {
  const blocks = buildings.length;
  const units = buildings.reduce((n, b) => n + (b.totalUnits ?? 0), 0);
  const available = buildings.reduce((n, b) => n + (b.availableUnits ?? 0), 0);
  const trustworthy = units > 0 || blocks === 0;
  return {
    blocks,
    units: trustworthy ? units : null,
    available: trustworthy ? available : null,
  };
}
