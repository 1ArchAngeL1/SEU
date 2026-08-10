import {
  apiGet,
  apiGetPaginated,
  apiPost,
  apiPatch,
  apiDelete,
} from '@/lib/api-client';
import type {
  Building,
  CreateBuildingInput,
  UpdateBuildingInput,
  PaginatedResult,
  BuildingFilter,
  PaginationInput,
} from '@/model/types/api';

/**
 * `visibleOnly` is the public-site opt-in: the backend then applies the
 * "Active" cascade and drops every block the admin switched off, plus the
 * blocks of a switched-off project. Admin calls leave it out.
 */
type ListBuildingsParams = BuildingFilter &
  PaginationInput & { sort?: string; visibleOnly?: boolean };

export const buildingsService = {
  list(params: ListBuildingsParams = {}): Promise<PaginatedResult<Building>> {
    return apiGetPaginated<Building>('/buildings', {
      params: params as Record<string, string | number | boolean | undefined | null>,
    });
  },

  /** Public site: every block still on show, across all projects. */
  getAllActive(): Promise<Building[]> {
    return buildingsService
      .list({ visibleOnly: true, page: 1, limit: 500 })
      .then((r) => r.items);
  },

  byProject(
    projectId: string,
    opts: { visibleOnly?: boolean } = {}
  ): Promise<Building[]> {
    return apiGet<Building[]>(`/buildings/by-project/${projectId}`, {
      params: { visibleOnly: opts.visibleOnly },
    });
  },

  /** With `visibleOnly` a deactivated block — or one in a deactivated project —
   *  answers 404 instead of the record. */
  getById(id: string, opts: { visibleOnly?: boolean } = {}): Promise<Building> {
    return apiGet<Building>(`/buildings/${id}`, {
      params: { visibleOnly: opts.visibleOnly },
    });
  },

  create(input: CreateBuildingInput): Promise<Building> {
    return apiPost<Building, CreateBuildingInput>('/buildings', input);
  },

  update(id: string, input: UpdateBuildingInput): Promise<Building> {
    return apiPatch<Building, UpdateBuildingInput>(`/buildings/${id}`, input);
  },

  remove(id: string): Promise<{ deleted: boolean; id: string }> {
    return apiDelete(`/buildings/${id}`);
  },
};
