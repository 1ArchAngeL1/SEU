import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { partnersService } from '@/service/partners.service';
import type {
  Partner,
  CreatePartnerInput,
  UpdatePartnerInput,
  PaginationInput,
  PaginatedResult,
} from '@/model/types/api';

export const partnersKeys = {
  all: ['partners'] as const,
  lists: () => [...partnersKeys.all, 'list'] as const,
  list: (pagination: PaginationInput) =>
    [...partnersKeys.lists(), { pagination }] as const,
  details: () => [...partnersKeys.all, 'detail'] as const,
  detail: (id: string) => [...partnersKeys.details(), id] as const,
};

export function usePartnersList(
  pagination: PaginationInput = { page: 1, limit: 20 },
  options?: Partial<UseQueryOptions<PaginatedResult<Partner>>>
) {
  return useQuery<PaginatedResult<Partner>>({
    queryKey: partnersKeys.list(pagination),
    queryFn: () => partnersService.search({ pagination }),
    placeholderData: keepPreviousData,
    ...options,
  });
}

export function useAllPartners() {
  return useQuery<Partner[]>({
    queryKey: [...partnersKeys.all, 'all'],
    queryFn: () => partnersService.getAll(),
    staleTime: 60_000,
  });
}

export function usePartner(id: string | undefined) {
  return useQuery<Partner>({
    queryKey: partnersKeys.detail(id ?? ''),
    queryFn: () => partnersService.getById(id as string),
    enabled: Boolean(id),
  });
}

export function useCreatePartner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePartnerInput) => partnersService.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: partnersKeys.all }),
  });
}

export function useUpdatePartner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdatePartnerInput }) =>
      partnersService.update(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: partnersKeys.all }),
  });
}

export function useDeletePartner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => partnersService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: partnersKeys.all }),
  });
}
