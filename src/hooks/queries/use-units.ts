import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import {
  unitsService,
  type UpdateUnitStatusInput,
} from '@/service/units.service';
import type {
  Unit,
  CreateUnitInput,
  UpdateUnitInput,
  UnitFilter,
  PaginationInput,
  Room,
} from '@/model/types/api';

export const unitsKeys = {
  all: ['units'] as const,
  lists: () => [...unitsKeys.all, 'list'] as const,
  list: (filter: UnitFilter, pagination: PaginationInput, sort?: string) =>
    [...unitsKeys.lists(), { filter, pagination, sort }] as const,
  detail: (id: string) => [...unitsKeys.all, 'detail', id] as const,
  stats: (projectId: string) =>
    [...unitsKeys.all, 'stats', projectId] as const,
};

export function useUnitsList(
  filter: UnitFilter = {},
  pagination: PaginationInput = { page: 1, limit: 20 },
  sort?: string
) {
  return useQuery({
    queryKey: unitsKeys.list(filter, pagination, sort),
    queryFn: () =>
      unitsService.list({ ...filter, ...pagination, sort }),
    placeholderData: keepPreviousData,
  });
}

export function useUnit(id: string | undefined) {
  return useQuery<Unit>({
    queryKey: unitsKeys.detail(id ?? ''),
    queryFn: () => unitsService.getById(id as string),
    enabled: Boolean(id),
  });
}

export function useUnitStats(projectId: string | undefined) {
  return useQuery({
    queryKey: unitsKeys.stats(projectId ?? ''),
    queryFn: () => unitsService.getStatsByProject(projectId as string),
    enabled: Boolean(projectId),
  });
}

export function useCreateUnit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateUnitInput) => unitsService.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: unitsKeys.all });
      qc.invalidateQueries({ queryKey: ['buildings'] });
      qc.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useUpdateUnit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateUnitInput }) =>
      unitsService.update(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: unitsKeys.all });
      qc.invalidateQueries({ queryKey: ['buildings'] });
      qc.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useUpdateUnitStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateUnitStatusInput }) =>
      unitsService.updateStatus(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: unitsKeys.all });
      qc.invalidateQueries({ queryKey: ['buildings'] });
      qc.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useSyncUnitRooms() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, rooms }: { id: string; rooms: Room[] }) =>
      unitsService.syncRooms(id, rooms),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: unitsKeys.detail(id) });
      qc.invalidateQueries({ queryKey: unitsKeys.lists() });
    },
  });
}

export function useDeleteUnit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => unitsService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: unitsKeys.all });
      qc.invalidateQueries({ queryKey: ['buildings'] });
      qc.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
