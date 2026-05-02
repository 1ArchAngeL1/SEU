import {
  apiGet,
  apiPost,
  apiPostPaginated,
  apiPatch,
  apiDelete,
} from '@/lib/api-client';
import type {
  Project,
  CreateProjectInput,
  UpdateProjectInput,
  PaginatedResult,
  ProjectFilter,
  PaginationInput,
  SortDirection,
} from '@/model/types/api';

interface SearchProjectsBody {
  pagination?: PaginationInput;
  sort?: { field: string; direction: SortDirection }[];
  data?: ProjectFilter;
}

export const projectsService = {
  search(input: SearchProjectsBody = {}): Promise<PaginatedResult<Project>> {
    return apiPostPaginated<Project, SearchProjectsBody>(
      '/projects/search',
      {
        pagination: { page: 1, limit: 20, ...input.pagination },
        sort: input.sort ?? [{ field: 'createdAt', direction: 'desc' }],
        data: input.data ?? {},
      }
    );
  },

  getAll(): Promise<Project[]> {
    return projectsService
      .search({ pagination: { page: 1, limit: 200 } })
      .then((r) => r.items);
  },

  getById(id: string): Promise<Project> {
    return apiGet<Project>(`/projects/${id}`);
  },

  create(input: CreateProjectInput): Promise<Project> {
    return apiPost<Project, { data: CreateProjectInput }>('/projects', {
      data: input,
    });
  },

  update(id: string, input: UpdateProjectInput): Promise<Project> {
    return apiPatch<Project, { data: UpdateProjectInput }>(`/projects/${id}`, {
      data: input,
    });
  },

  remove(id: string): Promise<{ deleted: boolean; id: string }> {
    return apiDelete(`/projects/${id}`);
  },
};
