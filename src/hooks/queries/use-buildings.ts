import { useMemo } from 'react';
import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { buildingsService } from '@/service/buildings.service';
import { visibleBuildings } from '@/lib/visibility';
import type {
  Building,
  CreateBuildingInput,
  UpdateBuildingInput,
  BuildingFilter,
  PaginationInput,
} from '@/model/types/api';

// Public and admin reads of the same record answer differently — the public
// one hides what the admin panel deactivated — so they must not share a cache
// entry. Every key carries the scope it was fetched under.
export const buildingsKeys = {
  all: ['buildings'] as const,
  lists: () => [...buildingsKeys.all, 'list'] as const,
  list: (filter: BuildingFilter, pagination: PaginationInput) =>
    [...buildingsKeys.lists(), { filter, pagination }] as const,
  active: () => [...buildingsKeys.all, 'active'] as const,
  byProject: (projectId: string | undefined, visibleOnly = false) =>
    [...buildingsKeys.all, 'byProject', projectId ?? '', { visibleOnly }] as const,
  detail: (id: string | undefined, visibleOnly = false) =>
    [...buildingsKeys.all, 'detail', id ?? '', { visibleOnly }] as const,
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
    queryKey: buildingsKeys.byProject(projectId),
    queryFn: () => buildingsService.byProject(projectId as string),
    enabled: Boolean(projectId),
  });
}

/**
 * Public site: the project's blocks minus the ones the admin deactivated, and
 * none at all when the project itself is switched off. The backend applies the
 * cascade; the client-side filter is a second line of defence.
 */
export function useActiveBuildingsByProject(projectId: string | undefined) {
  const query = useQuery<Building[]>({
    queryKey: buildingsKeys.byProject(projectId, true),
    queryFn: () =>
      buildingsService.byProject(projectId as string, { visibleOnly: true }),
    enabled: Boolean(projectId),
  });
  const data = useMemo(() => visibleBuildings(query.data ?? []), [query.data]);
  return { ...query, data };
}

/**
 * Public site: every block still on show, across all projects. Used where a
 * page needs to judge blocks it has not fetched one by one — the search
 * results and the project cards in visual search.
 */
export function useActiveBuildings() {
  return useQuery<Building[]>({
    queryKey: buildingsKeys.active(),
    queryFn: () => buildingsService.getAllActive(),
    staleTime: 60_000,
  });
}

export function useBuilding(id: string | undefined) {
  return useQuery<Building>({
    queryKey: buildingsKeys.detail(id),
    queryFn: () => buildingsService.getById(id as string),
    enabled: Boolean(id),
  });
}

/**
 * Public site: a deactivated block — or one in a deactivated project — comes
 * back as a 404, so deep links can `notFound()` on `isError`.
 */
export function usePublicBuilding(id: string | undefined) {
  return useQuery<Building>({
    queryKey: buildingsKeys.detail(id, true),
    queryFn: () => buildingsService.getById(id as string, { visibleOnly: true }),
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
