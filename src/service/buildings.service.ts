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

type ListBuildingsParams = BuildingFilter &
  PaginationInput & { sort?: string };

export const buildingsService = {
  list(params: ListBuildingsParams = {}): Promise<PaginatedResult<Building>> {
    return apiGetPaginated<Building>('/buildings', {
      params: params as Record<string, string | number | boolean | undefined | null>,
    });
  },

  byProject(projectId: string): Promise<Building[]> {
    return apiGet<Building[]>(`/buildings/by-project/${projectId}`);
  },

  getById(id: string): Promise<Building> {
    return apiGet<Building>(`/buildings/${id}`);
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
