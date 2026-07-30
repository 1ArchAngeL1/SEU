import {
  apiGet,
  apiPost,
  apiPostPaginated,
  apiPatch,
} from '@/lib/api-client';
import type {
  Resume,
  CreateResumeInput,
  UpdateResumeStatusInput,
  PaginatedResult,
  PaginationInput,
  ResumeStatus,
  SortDirection,
} from '@/model/types/api';

interface ResumeFilter {
  q?: string;
  status?: ResumeStatus;
}

interface SearchResumesBody {
  pagination?: PaginationInput;
  sort?: { field: string; direction: SortDirection }[];
  data?: ResumeFilter;
}

export const resumesService = {
  search(input: SearchResumesBody = {}): Promise<PaginatedResult<Resume>> {
    return apiPostPaginated<Resume, SearchResumesBody>('/resumes/search', {
      pagination: { page: 1, limit: 20, ...input.pagination },
      sort: input.sort ?? [{ field: 'createdAt', direction: 'desc' }],
      data: input.data ?? {},
    });
  },

  getById(id: string): Promise<Resume> {
    return apiGet<Resume>(`/resumes/${id}`);
  },

  create(input: CreateResumeInput): Promise<Resume> {
    return apiPost<Resume, { data: CreateResumeInput }>('/resumes', {
      data: input,
    });
  },

  updateStatus(id: string, input: UpdateResumeStatusInput): Promise<Resume> {
    return apiPatch<Resume, { data: UpdateResumeStatusInput }>(
      `/resumes/${id}/status`,
      { data: input }
    );
  },
};
