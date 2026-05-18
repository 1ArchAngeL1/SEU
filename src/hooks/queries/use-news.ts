import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { newsService } from '@/service/news.service';
import type {
  NewsArticle,
  CreateNewsInput,
  UpdateNewsInput,
  PaginationInput,
  PaginatedResult,
} from '@/model/types/api';

export const newsKeys = {
  all: ['news'] as const,
  lists: () => [...newsKeys.all, 'list'] as const,
  list: (pagination: PaginationInput) =>
    [...newsKeys.lists(), { pagination }] as const,
  details: () => [...newsKeys.all, 'detail'] as const,
  detail: (id: string) => [...newsKeys.details(), id] as const,
};

export function useNewsList(
  pagination: PaginationInput = { page: 1, limit: 20 },
  options?: Partial<UseQueryOptions<PaginatedResult<NewsArticle>>>
) {
  return useQuery<PaginatedResult<NewsArticle>>({
    queryKey: newsKeys.list(pagination),
    queryFn: () => newsService.search({ pagination }),
    placeholderData: keepPreviousData,
    ...options,
  });
}

export function useAllNews() {
  return useQuery<NewsArticle[]>({
    queryKey: [...newsKeys.all, 'all'],
    queryFn: () => newsService.getAll(),
    staleTime: 60_000,
  });
}

export function useNewsArticle(id: string | undefined) {
  return useQuery<NewsArticle>({
    queryKey: newsKeys.detail(id ?? ''),
    queryFn: () => newsService.getById(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateNews() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateNewsInput) => newsService.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: newsKeys.all }),
  });
}

export function useUpdateNews() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateNewsInput }) =>
      newsService.update(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: newsKeys.all }),
  });
}

export function useDeleteNews() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => newsService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: newsKeys.all }),
  });
}
