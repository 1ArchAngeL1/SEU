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

type ListUnitsParams = UnitFilter & PaginationInput & { sort?: string };

export interface UpdateUnitStatusInput {
  status: UnitStatus;
  reservation?: UnitReservation;
  saleRecord?: UnitSaleRecord;
}

export const unitsService = {
  list(params: ListUnitsParams = {}): Promise<PaginatedResult<Unit>> {
    return apiGetPaginated<Unit>('/units', {
      params: params as Record<string, string | number | boolean | undefined | null>,
    });
  },

  getById(id: string): Promise<Unit> {
    return apiGet<Unit>(`/units/${id}`);
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
