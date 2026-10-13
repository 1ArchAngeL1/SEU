import {
  apiGet,
  apiGetPaginated,
  apiPost,
  apiPatch,
  apiPut,
  apiDelete,
} from '@/lib/api-client';
import type {
  Unit,
  UnitStats,
  UnitStatus,
  UnitReservation,
  UnitSaleRecord,
  CreateUnitInput,
  UpdateUnitInput,
  PaginatedResult,
  Room,
  SyncRoomsInput,
  UnitFilter,
  PaginationInput,
} from '@/model/types/api';

/**
 * `visibleOnly` is the public-site opt-in: the backend then applies the
 * "Active" cascade and drops every unit whose block or project the admin
 * switched off. Admin calls leave it out and keep seeing everything.
 */
type ListUnitsParams = UnitFilter &
  PaginationInput & { sort?: string; visibleOnly?: boolean };

export interface UpdateUnitStatusInput {
  status: UnitStatus;
  reservation?: UnitReservation;
  saleRecord?: UnitSaleRecord;
}

/**
 * Array filters travel as one comma-separated query param (`?bedroomCounts=1,4`,
 * `?types=living,parking`). Left to `String(value)` an array would stringify to
 * the same thing by accident; doing it here keeps it deliberate, and drops an
 * empty array instead of sending a blank param.
 */
function csv(values?: readonly (string | number)[]): string | undefined {
  return values && values.length ? values.join(',') : undefined;
}

export const unitsService = {
  list(params: ListUnitsParams = {}): Promise<PaginatedResult<Unit>> {
    const { bedroomCounts, types, ...rest } = params;
    return apiGetPaginated<Unit>('/units', {
      params: {
        ...(rest as Record<string, string | number | boolean | undefined | null>),
        bedroomCounts: csv(bedroomCounts),
        types: csv(types),
      },
    });
  },

  /** With `visibleOnly` a unit hidden by its own, its block's or its project's
   *  switch answers 404 instead of the record. */
  getById(id: string, opts: { visibleOnly?: boolean } = {}): Promise<Unit> {
    return apiGet<Unit>(`/units/${id}`, {
      params: { visibleOnly: opts.visibleOnly },
    });
  },

  getStatsByProject(projectId: string): Promise<UnitStats> {
    return apiGet<UnitStats>(`/units/stats/by-project/${projectId}`);
  },

  create(input: CreateUnitInput): Promise<Unit> {
    return apiPost<Unit, CreateUnitInput>('/units', input);
  },

  update(id: string, input: UpdateUnitInput): Promise<Unit> {
    return apiPatch<Unit, UpdateUnitInput>(`/units/${id}`, input);
  },

  updateStatus(id: string, input: UpdateUnitStatusInput): Promise<Unit> {
    return apiPatch<Unit, UpdateUnitStatusInput>(`/units/${id}/status`, input);
  },

  syncRooms(id: string, rooms: Room[]): Promise<Unit> {
    return apiPut<Unit, SyncRoomsInput>(`/units/${id}/rooms`, { rooms });
  },

  remove(id: string): Promise<{ deleted: boolean; id: string }> {
    return apiDelete(`/units/${id}`);
  },

  trackView(id: string): Promise<{ ok: boolean }> {
    return apiPost<{ ok: boolean }>(`/units/${id}/view`);
  },
};
