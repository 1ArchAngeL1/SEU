import {
  apiGet,
  apiPost,
  apiPatch,
  apiDelete,
} from '@/lib/api-client';
import type {
  Floor,
  CreateFloorInput,
  UpdateFloorInput,
  FloorFilter,
} from '@/model/types/api';

export const floorsService = {
  list(filter: FloorFilter = {}): Promise<Floor[]> {
    return apiGet<Floor[]>('/floors', {
      params: filter as Record<string, string | number | boolean | undefined | null>,
    });
  },

  byBuilding(buildingId: string): Promise<Floor[]> {
    return apiGet<Floor[]>(`/floors/by-building/${buildingId}`);
  },

  getById(id: string): Promise<Floor> {
    return apiGet<Floor>(`/floors/${id}`);
  },

  create(input: CreateFloorInput): Promise<Floor> {
    return apiPost<Floor, CreateFloorInput>('/floors', input);
  },

  update(id: string, input: UpdateFloorInput): Promise<Floor> {
    return apiPatch<Floor, UpdateFloorInput>(`/floors/${id}`, input);
  },

  remove(id: string): Promise<{ deleted: boolean; id: string }> {
    return apiDelete(`/floors/${id}`);
  },
};
