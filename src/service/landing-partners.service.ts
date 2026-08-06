import {
  apiGet,
  apiPost,
  apiPostPaginated,
  apiPatch,
  apiDelete,
} from '@/lib/api-client';
import type {
  LandingPartner,
  CreateLandingPartnerInput,
  UpdateLandingPartnerInput,
  PaginatedResult,
  PaginationInput,
  SortDirection,
} from '@/model/types/api';

interface LandingPartnerFilter {
  q?: string;
}

interface SearchLandingPartnersBody {
  pagination?: PaginationInput;
  sort?: { field: string; direction: SortDirection }[];
  data?: LandingPartnerFilter;
}

export const landingPartnersService = {
  search(
    input: SearchLandingPartnersBody = {},
  ): Promise<PaginatedResult<LandingPartner>> {
    return apiPostPaginated<LandingPartner, SearchLandingPartnersBody>(
      '/landing-partners/search',
      {
        pagination: { page: 1, limit: 20, ...input.pagination },
        // Manual display order first; fall back to newest for records that
        // predate `sortOrder` (or share a value).
        sort: input.sort ?? [
          { field: 'sortOrder', direction: 'asc' },
          { field: 'createdAt', direction: 'desc' },
        ],
        data: input.data ?? {},
      },
    );
  },

  /**
   * Persist a new display order. Assigns `sortOrder = index` to each id in the
   * given order and PATCHes them all. Requires the backend to whitelist
   * `sortOrder` on the update DTO.
   */
  reorder(orderedIds: string[]): Promise<LandingPartner[]> {
    return Promise.all(
      orderedIds.map((id, index) =>
        landingPartnersService.update(id, { sortOrder: index }),
      ),
    );
  },

  getAll(): Promise<LandingPartner[]> {
    return landingPartnersService
      .search({ pagination: { page: 1, limit: 200 } })
      .then((r) => r.items);
  },

  getById(id: string): Promise<LandingPartner> {
    return apiGet<LandingPartner>(`/landing-partners/${id}`);
  },

  create(input: CreateLandingPartnerInput): Promise<LandingPartner> {
    return apiPost<LandingPartner, { data: CreateLandingPartnerInput }>(
      '/landing-partners',
      { data: input },
    );
  },

  update(id: string, input: UpdateLandingPartnerInput): Promise<LandingPartner> {
    return apiPatch<LandingPartner, { data: UpdateLandingPartnerInput }>(
      `/landing-partners/${id}`,
      { data: input },
    );
  },

  remove(id: string): Promise<{ deleted: boolean; id: string }> {
    return apiDelete(`/landing-partners/${id}`);
  },
};
