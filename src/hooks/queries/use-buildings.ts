import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { buildingsService } from '@/service/buildings.service';
import type {
  Building,
  CreateBuildingInput,
  UpdateBuildingInput,
  BuildingFilter,
  PaginationInput,
} from '@/model/types/api';

export const buildingsKeys = {
  all: ['buildings'] as const,
  lists: () => [...buildingsKeys.all, 'list'] as const,
  list: (filter: BuildingFilter, pagination: PaginationInput) =>
    [...buildingsKeys.lists(), { filter, pagination }] as const,
  byProject: (projectId: string) =>
    [...buildingsKeys.all, 'byProject', projectId] as const,
  detail: (id: string) => [...buildingsKeys.all, 'detail', id] as const,
};

export function useBuildingsList(
  filter: BuildingFilter = {},
  pagination: PaginationInput = { page: 1, limit: 20 }
) {
  return useQuery({
    queryKey: buildingsKeys.list(filter, pagination),
    queryFn: () => buildingsService.list({ ...filter, ...pagination }),
    placeholderData: keepPreviousData,
  });
}

export function useBuildingsByProject(projectId: string | undefined) {
  return useQuery<Building[]>({
    queryKey: buildingsKeys.byProject(projectId ?? ''),
    queryFn: () => buildingsService.byProject(projectId as string),
    enabled: Boolean(projectId),
  });
}

export function useBuilding(id: string | undefined) {
  return useQuery<Building>({
    queryKey: buildingsKeys.detail(id ?? ''),
    queryFn: () => buildingsService.getById(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateBuilding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateBuildingInput) => buildingsService.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: buildingsKeys.all });
      qc.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useUpdateBuilding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateBuildingInput }) =>
      buildingsService.update(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: buildingsKeys.all }),
  });
}

export function useDeleteBuilding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => buildingsService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: buildingsKeys.all });
      qc.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
