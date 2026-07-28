import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { landingPartnersService } from '@/service/landing-partners.service';
import type {
  LandingPartner,
  CreateLandingPartnerInput,
  UpdateLandingPartnerInput,
  PaginationInput,
  PaginatedResult,
} from '@/model/types/api';

export const landingPartnersKeys = {
  all: ['landing-partners'] as const,
  lists: () => [...landingPartnersKeys.all, 'list'] as const,
  list: (pagination: PaginationInput) =>
    [...landingPartnersKeys.lists(), { pagination }] as const,
  details: () => [...landingPartnersKeys.all, 'detail'] as const,
  detail: (id: string) => [...landingPartnersKeys.details(), id] as const,
};

export function useLandingPartnersList(
  pagination: PaginationInput = { page: 1, limit: 20 },
  options?: Partial<UseQueryOptions<PaginatedResult<LandingPartner>>>,
) {
  return useQuery<PaginatedResult<LandingPartner>>({
    queryKey: landingPartnersKeys.list(pagination),
    queryFn: () => landingPartnersService.search({ pagination }),
    placeholderData: keepPreviousData,
    ...options,
  });
}

export function useAllLandingPartners() {
  return useQuery<LandingPartner[]>({
    queryKey: [...landingPartnersKeys.all, 'all'],
    queryFn: () => landingPartnersService.getAll(),
    staleTime: 60_000,
  });
}

export function useLandingPartner(id: string | undefined) {
  return useQuery<LandingPartner>({
    queryKey: landingPartnersKeys.detail(id ?? ''),
    queryFn: () => landingPartnersService.getById(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateLandingPartner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateLandingPartnerInput) =>
      landingPartnersService.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: landingPartnersKeys.all }),
  });
}

export function useUpdateLandingPartner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateLandingPartnerInput }) =>
      landingPartnersService.update(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: landingPartnersKeys.all }),
  });
}

export function useDeleteLandingPartner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => landingPartnersService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: landingPartnersKeys.all }),
  });
}
