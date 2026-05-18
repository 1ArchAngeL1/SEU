import {
  apiGet,
  apiPost,
  apiPostPaginated,
  apiPatch,
} from '@/lib/api-client';
import type {
  Contact,
  CreateContactInput,
  UpdateContactStatusInput,
  PaginatedResult,
  PaginationInput,
  ContactStatus,
  SortDirection,
} from '@/model/types/api';

interface ContactFilter {
  q?: string;
  status?: ContactStatus;
}

interface SearchContactsBody {
  pagination?: PaginationInput;
  sort?: { field: string; direction: SortDirection }[];
  data?: ContactFilter;
}

export const contactsService = {
  search(input: SearchContactsBody = {}): Promise<PaginatedResult<Contact>> {
    return apiPostPaginated<Contact, SearchContactsBody>('/contacts/search', {
      pagination: { page: 1, limit: 20, ...input.pagination },
      sort: input.sort ?? [{ field: 'createdAt', direction: 'desc' }],
      data: input.data ?? {},
    });
  },

  getById(id: string): Promise<Contact> {
    return apiGet<Contact>(`/contacts/${id}`);
  },

  create(input: CreateContactInput): Promise<Contact> {
    return apiPost<Contact, { data: CreateContactInput }>('/contacts', {
      data: input,
    });
  },

  updateStatus(id: string, input: UpdateContactStatusInput): Promise<Contact> {
    return apiPatch<Contact, { data: UpdateContactStatusInput }>(
      `/contacts/${id}/status`,
      { data: input }
    );
  },
};
