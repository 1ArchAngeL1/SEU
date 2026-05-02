import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { projectsService } from '@/service/projects.service';
import type {
  Project,
  CreateProjectInput,
  UpdateProjectInput,
  ProjectFilter,
  PaginationInput,
  PaginatedResult,
} from '@/model/types/api';

export const projectsKeys = {
  all: ['projects'] as const,
  lists: () => [...projectsKeys.all, 'list'] as const,
  list: (filter: ProjectFilter, pagination: PaginationInput) =>
    [...projectsKeys.lists(), { filter, pagination }] as const,
  details: () => [...projectsKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectsKeys.details(), id] as const,
};

export function useProjectsList(
  filter: ProjectFilter = {},
  pagination: PaginationInput = { page: 1, limit: 20 },
  options?: Partial<UseQueryOptions<PaginatedResult<Project>>>
) {
  return useQuery<PaginatedResult<Project>>({
    queryKey: projectsKeys.list(filter, pagination),
    queryFn: () => projectsService.search({ data: filter, pagination }),
    placeholderData: keepPreviousData,
    ...options,
  });
}

export function useAllProjects() {
  return useQuery<Project[]>({
    queryKey: [...projectsKeys.all, 'all'],
    queryFn: () => projectsService.getAll(),
    staleTime: 60_000,
  });
}

export function useProject(id: string | undefined) {
  return useQuery<Project>({
    queryKey: projectsKeys.detail(id ?? ''),
    queryFn: () => projectsService.getById(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateProjectInput) => projectsService.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: projectsKeys.all }),
  });
}

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateProjectInput }) =>
      projectsService.update(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: projectsKeys.all }),
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => projectsService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: projectsKeys.all }),
  });
}
