import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apartmentTypesService } from '@/service/apartment-types.service';
import type {
  ApartmentType,
  CreateApartmentTypeInput,
  UpdateApartmentTypeInput,
} from '@/model/types/api';

export const apartmentTypesKeys = {
  all: ['apartment-types'] as const,
  byProject: (projectId: string) =>
    [...apartmentTypesKeys.all, 'byProject', projectId] as const,
  detail: (id: string) => [...apartmentTypesKeys.all, 'detail', id] as const,
};

export function useApartmentTypesByProject(projectId: string | undefined) {
  return useQuery<ApartmentType[]>({
    queryKey: apartmentTypesKeys.byProject(projectId ?? ''),
    queryFn: () => apartmentTypesService.byProject(projectId as string),
    enabled: Boolean(projectId),
  });
}

export function useCreateApartmentType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateApartmentTypeInput) =>
      apartmentTypesService.create(input),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: apartmentTypesKeys.all });
      qc.invalidateQueries({
        queryKey: apartmentTypesKeys.byProject(vars.project),
      });
    },
  });
}

export function useUpdateApartmentType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: UpdateApartmentTypeInput;
    }) => apartmentTypesService.update(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: apartmentTypesKeys.all }),
  });
}

export function useDeleteApartmentType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apartmentTypesService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: apartmentTypesKeys.all }),
  });
}
