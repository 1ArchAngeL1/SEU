import {
  apiGet,
  apiPost,
  apiPostPaginated,
  apiPatch,
  apiDelete,
} from '@/lib/api-client';
import type {
  NewsArticle,
  CreateNewsInput,
  UpdateNewsInput,
  NewsFilter,
  PaginatedResult,
  PaginationInput,
  SortDirection,
} from '@/model/types/api';

interface SearchNewsBody {
  pagination?: PaginationInput;
  sort?: { field: string; direction: SortDirection }[];
  data?: NewsFilter;
}

export const newsService = {
  search(input: SearchNewsBody = {}): Promise<PaginatedResult<NewsArticle>> {
    return apiPostPaginated<NewsArticle, SearchNewsBody>('/news/search', {
      pagination: { page: 1, limit: 20, ...input.pagination },
      sort: input.sort ?? [{ field: 'createdAt', direction: 'desc' }],
      data: input.data ?? {},
    });
  },

  getAll(): Promise<NewsArticle[]> {
    return newsService
      .search({ pagination: { page: 1, limit: 200 } })
      .then((r) => r.items);
  },

  getById(id: string): Promise<NewsArticle> {
    return apiGet<NewsArticle>(`/news/${id}`);
  },

  create(input: CreateNewsInput): Promise<NewsArticle> {
    return apiPost<NewsArticle, { data: CreateNewsInput }>('/news', {
      data: input,
    });
  },

  update(id: string, input: UpdateNewsInput): Promise<NewsArticle> {
    return apiPatch<NewsArticle, { data: UpdateNewsInput }>(`/news/${id}`, {
      data: input,
    });
  },

  remove(id: string): Promise<{ deleted: boolean; id: string }> {
    return apiDelete(`/news/${id}`);
  },
};
