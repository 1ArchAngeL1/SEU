import type { Building, Project, Unit } from '@/model/types/api';

/**
 * Public-site visibility rules.
 *
 * The admin "Active" switch on a project, a building (block) or a unit is a
 * kill-switch: the record and everything underneath it must disappear from the
 * public site. The backend stores the flag per record and does **not** cascade
 * it down the tree, so the public pages apply the cascade themselves — a unit
 * is public only when the unit, its building and its project are all active.
 *
 * Admin screens deliberately skip these helpers: editors must keep seeing
 * deactivated records.
 */

type Ref<T> = string | T | null | undefined;

/**
 * Ids of the records the admin has left Active, as gathered by
 * `usePublicVisibility()`.
 *
 * Relations often arrive as a bare id, which carries no Active flag; these sets
 * are what lets the cascade judge them anyway. Each stays `undefined` until its
 * request resolves, and an unknown set means "cannot tell" rather than "nothing
 * is active" — a failed request never blanks the site.
 */
export interface VisibilityScope {
  /** From `useActiveProjects()`. */
  projects?: ReadonlySet<string>;
  /** From `useActiveBuildings()`, already minus the blocks of dead projects. */
  buildings?: ReadonlySet<string>;
}

/** Relations come back either as a raw id or as a populated document. */
export function refId<T extends { id: string }>(ref: Ref<T>): string | undefined {
  if (!ref) return undefined;
  return typeof ref === 'string' ? ref : ref.id;
}

/** `isActive` of a populated relation; `undefined` when it is only an id. */
function refIsActive<T extends { isActive?: boolean }>(
  ref: Ref<T>
): boolean | undefined {
  if (!ref || typeof ref === 'string') return undefined;
  return ref.isActive;
}

/**
 * Own visibility of a relation. Prefers the populated document when the backend
 * sent one, otherwise falls back to the matching id set. With neither available
 * the relation is assumed visible.
 */
function isRefVisible<T extends { id: string; isActive?: boolean }>(
  ref: Ref<T>,
  activeIds: ReadonlySet<string> | undefined
): boolean {
  const populated = refIsActive(ref);
  if (populated !== undefined) return populated;
  const id = refId(ref);
  if (!id || !activeIds) return true;
  return activeIds.has(id);
}

/** Visibility of a project relation. */
export function isProjectRefVisible(
  ref: Ref<Project>,
  scope?: VisibilityScope
): boolean {
  return isRefVisible(ref, scope?.projects);
}

/**
 * Visibility of a building relation — its own flag plus, when the backend
 * populated it, the flag of the project it belongs to. `scope.buildings`
 * already excludes the blocks of deactivated projects, so a bare id needs no
 * second lookup.
 */
export function isBuildingRefVisible(
  ref: Ref<Building>,
  scope?: VisibilityScope
): boolean {
  if (!isRefVisible(ref, scope?.buildings)) return false;
  if (!ref || typeof ref === 'string') return true;
  return isProjectRefVisible(ref.project, scope);
}

/** A project the public site may render. */
export function isProjectVisible(project: Project | null | undefined): boolean {
  return Boolean(project) && project!.isActive !== false;
}

/** A building is public only when it and its project are both active. */
export function isBuildingVisible(
  building: Building | null | undefined,
  scope?: VisibilityScope
): boolean {
  if (!building || building.isActive === false) return false;
  return isProjectRefVisible(building.project, scope);
}

/** A unit is public only when the unit, its building and its project are active. */
export function isUnitVisible(unit: Unit, scope?: VisibilityScope): boolean {
  if (unit.isActive === false) return false;
  if (!isBuildingRefVisible(unit.building, scope)) return false;
  return isProjectRefVisible(unit.project, scope);
}

/** Drop the deactivated buildings from a list. */
export function visibleBuildings(
  buildings: Building[],
  scope?: VisibilityScope
): Building[] {
  return buildings.filter((b) => isBuildingVisible(b, scope));
}

/** Drop the units hidden by their own, their building's or their project's flag. */
export function visibleUnits(units: Unit[], scope?: VisibilityScope): Unit[] {
  return units.filter((u) => isUnitVisible(u, scope));
}

/**
 * Project headline figures recomputed from its live blocks, so a deactivated
 * block stops being counted anywhere on the public site.
 *
 * `units` / `available` come back `null` when the per-block aggregates are all
 * zero while blocks do exist — the backend does not always fill them in, and a
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
