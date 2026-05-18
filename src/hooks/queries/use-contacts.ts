import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { contactsService } from '@/service/contacts.service';
import type {
  Contact,
  ContactStatus,
  CreateContactInput,
  PaginatedResult,
  PaginationInput,
} from '@/model/types/api';

export const contactsKeys = {
  all: ['contacts'] as const,
  lists: () => [...contactsKeys.all, 'list'] as const,
  list: (pagination: PaginationInput, status?: ContactStatus) =>
    [...contactsKeys.lists(), { pagination, status }] as const,
  details: () => [...contactsKeys.all, 'detail'] as const,
  detail: (id: string) => [...contactsKeys.details(), id] as const,
};

export function useContactsList(
  pagination: PaginationInput = { page: 1, limit: 20 },
  status?: ContactStatus,
  options?: Partial<UseQueryOptions<PaginatedResult<Contact>>>
) {
  return useQuery<PaginatedResult<Contact>>({
    queryKey: contactsKeys.list(pagination, status),
    queryFn: () =>
      contactsService.search({
        pagination,
        data: status ? { status } : {},
      }),
    placeholderData: keepPreviousData,
    ...options,
  });
}

export function useCreateContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateContactInput) => contactsService.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: contactsKeys.all }),
  });
}

export function useUpdateContactStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ContactStatus }) =>
      contactsService.updateStatus(id, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: contactsKeys.all }),
  });
}
