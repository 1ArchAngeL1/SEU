import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { resumesService } from '@/service/resumes.service';
import type {
  Resume,
  ResumeStatus,
  CreateResumeInput,
  PaginatedResult,
  PaginationInput,
} from '@/model/types/api';

export const resumesKeys = {
  all: ['resumes'] as const,
  lists: () => [...resumesKeys.all, 'list'] as const,
  list: (pagination: PaginationInput, status?: ResumeStatus) =>
    [...resumesKeys.lists(), { pagination, status }] as const,
  details: () => [...resumesKeys.all, 'detail'] as const,
  detail: (id: string) => [...resumesKeys.details(), id] as const,
};

export function useResumesList(
  pagination: PaginationInput = { page: 1, limit: 20 },
  status?: ResumeStatus,
  options?: Partial<UseQueryOptions<PaginatedResult<Resume>>>
) {
  return useQuery<PaginatedResult<Resume>>({
    queryKey: resumesKeys.list(pagination, status),
    queryFn: () =>
      resumesService.search({
        pagination,
        data: status ? { status } : {},
      }),
    placeholderData: keepPreviousData,
    ...options,
  });
}

export function useCreateResume() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateResumeInput) => resumesService.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: resumesKeys.all }),
  });
}

export function useUpdateResumeStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ResumeStatus }) =>
      resumesService.updateStatus(id, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: resumesKeys.all }),
  });
}
