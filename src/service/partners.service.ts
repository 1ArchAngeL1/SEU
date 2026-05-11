import {
  apiGet,
  apiPost,
  apiPostPaginated,
  apiPatch,
  apiDelete,
} from '@/lib/api-client';
import type {
  Partner,
  CreatePartnerInput,
  UpdatePartnerInput,
  PaginatedResult,
  PaginationInput,
  SortDirection,
} from '@/model/types/api';

interface PartnerFilter {
  q?: string;
}

interface SearchPartnersBody {
  pagination?: PaginationInput;
  sort?: { field: string; direction: SortDirection }[];
  data?: PartnerFilter;
}

export const partnersService = {
  search(input: SearchPartnersBody = {}): Promise<PaginatedResult<Partner>> {
    return apiPostPaginated<Partner, SearchPartnersBody>('/partners/search', {
      pagination: { page: 1, limit: 20, ...input.pagination },
      sort: input.sort ?? [{ field: 'createdAt', direction: 'desc' }],
      data: input.data ?? {},
    });
  },

  getAll(): Promise<Partner[]> {
    return partnersService
      .search({ pagination: { page: 1, limit: 200 } })
      .then((r) => r.items);
  },

  getById(id: string): Promise<Partner> {
    return apiGet<Partner>(`/partners/${id}`);
  },

  create(input: CreatePartnerInput): Promise<Partner> {
    return apiPost<Partner, { data: CreatePartnerInput }>('/partners', {
      data: input,
    });
  },

  update(id: string, input: UpdatePartnerInput): Promise<Partner> {
    return apiPatch<Partner, { data: UpdatePartnerInput }>(`/partners/${id}`, {
      data: input,
    });
  },

  remove(id: string): Promise<{ deleted: boolean; id: string }> {
    return apiDelete(`/partners/${id}`);
  },
};
