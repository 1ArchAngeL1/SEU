import type { Room, RoomType } from '@/model/types/api';

/**
 * Room counts are derived from the `rooms` array — never from the scalar
 * `bedrooms` / `bathrooms` / `livingRooms` / `balconies` / `terraces` fields.
 *
 * Those scalars are dead data. They are not in the backend's Unit schema and
 * nothing writes them: `syncRooms()` only `$set`s `rooms`, so a scalar keeps
 * whatever the original import left on the document — commonly `0` — and never
 * changes when an editor edits the layout. The backend's own unit filtering
 * already sidesteps them for the same reason (see `buildFilter` in
 * `units.service.ts`: "the scalar `bedrooms`/`roomCount` fields are stale for
 * many imported units").
 *
 * Reading a scalar is what made the floor-plan hover card show "0 სველი
 * წერტილი" for units whose detail page listed a bathroom correctly.
 */

/**
 * A unit, or anything else carrying a rooms array.
 *
 * The deprecated scalars are declared here because this module is the one
 * sanctioned place that may read them — see the fallback in `bedroomCount`.
 */
interface HasRooms {
  rooms?: Room[] | null;
  bedrooms?: number;
  bathrooms?: number;
}

/**
 * The backend enum still carries the retired `toilet` type and legacy units
 * are stored with it, but the frontend `RoomType` union dropped it. Anything
 * counting or rendering bathrooms has to fold the two together.
 */
export function normalizeRoomType(type: RoomType): RoomType {
  return (type as string) === 'toilet' ? 'bathroom' : type;
}

/** The rooms actually present, with import nulls and non-objects dropped. */
export function unitRooms(unit: HasRooms | null | undefined): Room[] {
  const rooms = unit?.rooms;
  if (!Array.isArray(rooms)) return [];
  return rooms.filter((r): r is Room => r != null && typeof r === 'object');
}

/** How many rooms of `type` the unit has, counting legacy aliases. */
export function countRoomType(
  unit: HasRooms | null | undefined,
  type: RoomType
): number {
  const target = normalizeRoomType(type);
  return unitRooms(unit).filter((r) => normalizeRoomType(r.type) === target)
    .length;
}

/**
 * Rooms win whenever the unit has any; the stale scalar is used only for units
 * whose `rooms` array is empty, where it is the sole surviving record of the
 * layout.
 *
 * As of the last audit of the live database (690 units): 138 units carry no
 * rooms at all, and 113 of those still have a non-zero stored `bedrooms` from
 * the import — dropping the scalar outright would blank a bedroom count that
 * is currently shown and correct. In the other direction, no unit that *has*
 * rooms carries a stored count the rooms don't account for, so preferring
 * rooms never loses information.
 */
export function bedroomCount(unit: HasRooms | null | undefined): number {
  if (unitRooms(unit).length > 0) return countRoomType(unit, 'bedroom');
  return unit?.bedrooms ?? 0;
}

/**
 * A studio is a unit with a studio room and no bedrooms — the same definition
 * the backend filters on (`buildFilter` in `units.service.ts`).
 *
 * Test this before falling back to any room tally: a studio's bedroom count is
 * legitimately 0, so treating 0 as "unknown" and substituting the total number
 * of rooms bills a studio as a four-room apartment.
 */
export function isStudio(unit: HasRooms | null | undefined): boolean {
  const rooms = unitRooms(unit);
  if (rooms.length === 0) return false;
  return (
    rooms.some((r) => r.type === 'studio') &&
    countRoomType(unit, 'bedroom') === 0
  );
}

export function bathroomCount(unit: HasRooms | null | undefined): number {
  if (unitRooms(unit).length > 0) return countRoomType(unit, 'bathroom');
  return unit?.bathrooms ?? 0;
}
