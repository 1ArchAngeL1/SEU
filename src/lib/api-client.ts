import type { PaginatedResult, PaginationMeta } from '@/model/types/api';
import { getToken, removeToken } from '@/lib/auth';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export class ApiRequestError extends Error {
  status: number;
  code?: string;
  payload?: unknown;

  constructor(message: string, status: number, code?: string, payload?: unknown) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.code = code;
    this.payload = payload;
  }
}

interface ApiCallOptions<TBody = unknown> {
  body?: TBody;
  params?: Record<string, string | number | boolean | undefined | null>;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

function buildUrl(
  path: string,
  params?: Record<string, string | number | boolean | undefined | null>
): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const base = `${API_BASE_URL}${cleanPath}`;

  if (!params) return base;

  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.append(key, String(value));
    }
  });
  const qs = search.toString();
  return qs ? `${base}?${qs}` : base;
}

async function rawRequest<TBody = unknown>(
  method: HttpMethod,
  path: string,
  options: ApiCallOptions<TBody> = {}
): Promise<unknown> {
  const { body, params, headers = {}, signal } = options;
  const isFormData = body instanceof FormData;

  const token = getToken();
  const fetchHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  const init: RequestInit = {
    method,
    headers: fetchHeaders,
    signal,
  };

  if (body !== undefined && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    init.body = isFormData ? (body as FormData) : JSON.stringify(body);
  }

  let response: Response;
  try {
    response = await fetch(buildUrl(path, params), init);
  } catch (e) {
    throw new ApiRequestError(
      e instanceof Error ? e.message : 'Network error',
      0,
      'NETWORK_ERROR'
    );
  }

  let payload: unknown = null;
  if (response.status !== 204 && response.headers.get('content-length') !== '0') {
    const text = await response.text();
    if (text.trim().length > 0) {
      try {
        payload = JSON.parse(text);
      } catch {
        payload = text;
      }
    }
  }

  if (!response.ok) {
    if (response.status === 401 && typeof window !== 'undefined') {
      removeToken();
      const isAdminPath = window.location.pathname.match(/^\/(en|ka)\/admin/);
      if (isAdminPath && !window.location.pathname.includes('/admin/login')) {
        window.location.href = window.location.pathname.replace(/\/admin.*/, '/admin/login');
      }
    }

    const err = (payload ?? {}) as Record<string, unknown> & {
      message?: string | string[];
      error?: { key?: string; message?: string };
    };
    const messageRaw = err.message ?? err.error?.message;
    const message = Array.isArray(messageRaw)
      ? messageRaw.join(' · ')
      : messageRaw || `Request failed with status ${response.status}`;
    throw new ApiRequestError(
      message,
      response.status,
      err.error?.key,
      payload
    );
  }

  return payload;
}

function isWrappedSingle(p: unknown): p is { success: true; data: unknown } {
  return (
    !!p &&
    typeof p === 'object' &&
    (p as { success?: unknown }).success === true &&
    'data' in (p as Record<string, unknown>)
  );
}

function isPaginatedResultShape(
  p: unknown
): p is { data: unknown[]; page?: number; limit?: number; total?: number; totalPages?: number } {
  return (
    !!p &&
    typeof p === 'object' &&
    Array.isArray((p as { data?: unknown }).data)
  );
}

/** Single-resource GET/POST/PATCH unwrap. Tolerant of:
 *  - {success, timestamp, data: T}  (projects)
 *  - raw T                          (buildings, units, by-project array)
 */
function unwrapSingle<T>(payload: unknown): T {
  if (isWrappedSingle(payload)) return payload.data as T;
  return payload as T;
}

/** Paginated list unwrap. Tolerant of:
 *  - {success, data: T[], pagination: {...}}        (projects/search)
 *  - {data: T[], page, limit, total, totalPages}    (buildings, units list)
 *  - raw T[]                                         (buildings/by-project)
 */
function unwrapPaginated<T>(payload: unknown): PaginatedResult<T> {
  if (Array.isArray(payload)) {
    const items = payload as T[];
    return {
      items,
      pagination: {
        page: 1,
        limit: items.length || 0,
        total: items.length,
        totalPages: 1,
      },
    };
  }
  if (isWrappedSingle(payload)) {
    const wrapped = payload as {
      data: T[];
      pagination?: PaginationMeta;
    };
    const items = Array.isArray(wrapped.data) ? wrapped.data : [];
    return {
      items,
      pagination: wrapped.pagination ?? defaultPagination(items),
    };
  }
  if (isPaginatedResultShape(payload)) {
    const items = payload.data as T[];
    return {
      items,
      pagination: {
        page: payload.page ?? 1,
        limit: payload.limit ?? items.length,
        total: payload.total ?? items.length,
        totalPages: payload.totalPages ?? 1,
      },
    };
  }
  return {
    items: [],
    pagination: { page: 1, limit: 0, total: 0, totalPages: 1 },
  };
}

function defaultPagination<T>(items: T[]): PaginationMeta {
  const len = items.length;
  return { page: 1, limit: len || 20, total: len, totalPages: 1 };
}

export async function apiGet<T>(
  path: string,
  options?: Omit<ApiCallOptions, 'body'>
): Promise<T> {
  return unwrapSingle<T>(await rawRequest('GET', path, options));
}

export async function apiGetPaginated<T>(
  path: string,
  options?: Omit<ApiCallOptions, 'body'>
): Promise<PaginatedResult<T>> {
  return unwrapPaginated<T>(await rawRequest('GET', path, options));
}

export async function apiPost<T, TBody = unknown>(
  path: string,
  body?: TBody,
  options?: Omit<ApiCallOptions<TBody>, 'body'>
): Promise<T> {
  return unwrapSingle<T>(await rawRequest('POST', path, { ...options, body }));
}

export async function apiPostPaginated<T, TBody = unknown>(
  path: string,
  body?: TBody,
  options?: Omit<ApiCallOptions<TBody>, 'body'>
): Promise<PaginatedResult<T>> {
  return unwrapPaginated<T>(
    await rawRequest('POST', path, { ...options, body })
  );
}

export async function apiPatch<T, TBody = unknown>(
  path: string,
  body?: TBody,
  options?: Omit<ApiCallOptions<TBody>, 'body'>
): Promise<T> {
  return unwrapSingle<T>(await rawRequest('PATCH', path, { ...options, body }));
}

export async function apiPut<T, TBody = unknown>(
  path: string,
  body?: TBody,
  options?: Omit<ApiCallOptions<TBody>, 'body'>
): Promise<T> {
  return unwrapSingle<T>(await rawRequest('PUT', path, { ...options, body }));
}

export async function apiDelete<T = { deleted: boolean; id: string }>(
  path: string,
  options?: Omit<ApiCallOptions, 'body'>
): Promise<T> {
  return unwrapSingle<T>(await rawRequest('DELETE', path, options));
}
