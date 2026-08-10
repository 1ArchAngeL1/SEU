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

// Public and admin reads of the same record answer differently — the public
// one hides what the admin panel deactivated — so they must not share a cache
// entry. Every key carries the scope it was fetched under.
export const unitsKeys = {
  all: ['units'] as const,
  lists: () => [...unitsKeys.all, 'list'] as const,
  list: (
    filter: UnitFilter,
    pagination: PaginationInput,
    sort?: string,
    visibleOnly = false
  ) => [...unitsKeys.lists(), { filter, pagination, sort, visibleOnly }] as const,
  detail: (id: string | undefined, visibleOnly = false) =>
    [...unitsKeys.all, 'detail', id ?? '', { visibleOnly }] as const,
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

/**
 * Public site: the same list with the "Active" cascade applied by the backend,
 * so units of a deactivated block or project never reach the page — and the
 * pagination totals match what is actually shown.
 */
export function usePublicUnitsList(
  filter: UnitFilter = {},
  pagination: PaginationInput = { page: 1, limit: 20 },
  sort?: string
) {
  return useQuery({
    queryKey: unitsKeys.list(filter, pagination, sort, true),
    queryFn: () =>
      unitsService.list({ ...filter, ...pagination, sort, visibleOnly: true }),
    placeholderData: keepPreviousData,
  });
}

export function useUnit(id: string | undefined) {
  return useQuery<Unit>({
    queryKey: unitsKeys.detail(id),
    queryFn: () => unitsService.getById(id as string),
    enabled: Boolean(id),
  });
}

/**
 * Public site: a unit hidden by its own, its block's or its project's switch
 * comes back as a 404, so deep links can `notFound()` on `isError`.
 */
export function usePublicUnit(id: string | undefined) {
  return useQuery<Unit>({
    queryKey: unitsKeys.detail(id, true),
    queryFn: () => unitsService.getById(id as string, { visibleOnly: true }),
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
