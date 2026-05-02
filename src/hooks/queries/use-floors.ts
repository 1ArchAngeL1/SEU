import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { floorsService } from '@/service/floors.service';
import type {
  Floor,
  CreateFloorInput,
  UpdateFloorInput,
  FloorFilter,
} from '@/model/types/api';

export const floorsKeys = {
  all: ['floors'] as const,
  lists: () => [...floorsKeys.all, 'list'] as const,
  list: (filter: FloorFilter) =>
    [...floorsKeys.lists(), filter] as const,
  byBuilding: (buildingId: string) =>
    [...floorsKeys.all, 'byBuilding', buildingId] as const,
  detail: (id: string) => [...floorsKeys.all, 'detail', id] as const,
};

export function useFloorsByBuilding(buildingId: string | undefined) {
  return useQuery<Floor[]>({
    queryKey: floorsKeys.byBuilding(buildingId ?? ''),
    queryFn: () => floorsService.byBuilding(buildingId as string),
    enabled: Boolean(buildingId),
  });
}

export function useFloor(id: string | undefined) {
  return useQuery<Floor>({
    queryKey: floorsKeys.detail(id ?? ''),
    queryFn: () => floorsService.getById(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateFloor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateFloorInput) => floorsService.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: floorsKeys.all });
      qc.invalidateQueries({ queryKey: ['buildings'] });
    },
  });
}

export function useUpdateFloor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateFloorInput }) =>
      floorsService.update(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: floorsKeys.all }),
  });
}

export function useDeleteFloor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => floorsService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: floorsKeys.all });
      qc.invalidateQueries({ queryKey: ['buildings'] });
      qc.invalidateQueries({ queryKey: ['units'] });
    },
  });
}
