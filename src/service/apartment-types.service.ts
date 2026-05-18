import { apiGet, apiPost, apiPatch, apiDelete } from '@/lib/api-client';
import type {
  ApartmentType,
  CreateApartmentTypeInput,
  UpdateApartmentTypeInput,
} from '@/model/types/api';

export const apartmentTypesService = {
  byProject(projectId: string): Promise<ApartmentType[]> {
    return apiGet<ApartmentType[]>(`/apartment-types/by-project/${projectId}`);
  },

  getById(id: string): Promise<ApartmentType> {
    return apiGet<ApartmentType>(`/apartment-types/${id}`);
  },

  create(input: CreateApartmentTypeInput): Promise<ApartmentType> {
    return apiPost<ApartmentType, { data: CreateApartmentTypeInput }>(
      '/apartment-types',
      { data: input }
    );
  },

  update(id: string, input: UpdateApartmentTypeInput): Promise<ApartmentType> {
    return apiPatch<ApartmentType, { data: UpdateApartmentTypeInput }>(
      `/apartment-types/${id}`,
      { data: input }
    );
  },

  remove(id: string): Promise<{ deleted: boolean; id: string }> {
    return apiDelete(`/apartment-types/${id}`);
  },
};
