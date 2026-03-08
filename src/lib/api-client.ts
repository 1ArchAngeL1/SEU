import type { ErrorResponse } from '@/model/dto/common.dto';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiResponse<TData = unknown> {
  data: TData;
  headers: Record<string, string>;
  error?: ErrorResponse;
}

export const NEXT_API_URL = process.env.NEXT_PUBLIC_APP_URL || '';

interface ApiCallOptions<TRequest = unknown> {
  data?: TRequest;
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
}

interface ApiFetchConfig extends RequestInit {
  method: HttpMethod;
  headers: Record<string, string>;
  body?: string | FormData;
}

function buildUrl(
  baseUrl: string,
  path: string,
  params?: Record<string, string | number | boolean>
): string {
  const url = new URL(path.startsWith('/') ? path : `/${path}`, baseUrl);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  return url.toString();
}

export async function apiClient<TResponse = unknown, TRequest = unknown>(
  method: HttpMethod,
  path: string,
  options: ApiCallOptions<TRequest> = {}
): Promise<ApiResponse<TResponse>> {
  try {
    const { data, params, headers = {} } = options;
    const isFormData = data instanceof FormData;

    const baseUrl = NEXT_API_URL;

    const url: string = buildUrl(baseUrl, path, params);

    const fetchConfig: ApiFetchConfig = {
      method,
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        'ngrok-skip-browser-warning': 'ababa',
        ...headers,
      },
    };

    if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
      fetchConfig.body = isFormData ? data : JSON.stringify(data);
    }

    const response = await fetch(url, fetchConfig);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        success: false,
        error: {
          key: 'REQUEST_FAILED',
          message: `Request failed with status ${response.status}`,
          code: response.status,
        },
      }));

      throw errorData as ErrorResponse;
    }

    let responseData: TResponse;

    if (
      response.status === 204 ||
      response.headers.get('content-length') === '0'
    ) {
      responseData = {} as TResponse;
    } else {
      const contentType = response.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        const text = await response.text();

        if (!text || text.trim().length === 0) {
          responseData = {} as TResponse;
        } else {
          responseData = JSON.parse(text) as TResponse;
        }
      } else {
        const text = await response.text();
        responseData = text as TResponse;
      }
    }

    // Convert headers to a plain object
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    return {
      data: responseData,
      headers: responseHeaders,
    };
  } catch (error) {
    if (error && typeof error === 'object' && 'success' in error) {
      throw error;
    }

    throw {
      success: false,
      error: {
        key: 'NETWORK_ERROR',
        message:
          error instanceof Error ? error.message : 'An unknown error occurred',
        code: 500,
      },
    } as ErrorResponse;
  }
}

export const api = {
  get: <TResponse = unknown>(
    path: string,
    options?: Omit<ApiCallOptions, 'data'>
  ) => apiClient<TResponse>('GET', path, options),

  post: <TResponse = unknown, TRequest = unknown>(
    path: string,
    data?: TRequest,
    options?: Omit<ApiCallOptions<TRequest>, 'data'>
  ) => apiClient<TResponse, TRequest>('POST', path, { ...options, data }),

  put: <TResponse = unknown, TRequest = unknown>(
    path: string,
    data?: TRequest,
    options?: Omit<ApiCallOptions<TRequest>, 'data'>
  ) => apiClient<TResponse, TRequest>('PUT', path, { ...options, data }),

  patch: <TResponse = unknown, TRequest = unknown>(
    path: string,
    data?: TRequest,
    options?: Omit<ApiCallOptions<TRequest>, 'data'>
  ) => apiClient<TResponse, TRequest>('PATCH', path, { ...options, data }),

  delete: <TResponse = unknown>(
    path: string,
    options?: Omit<ApiCallOptions, 'data'>
  ) => apiClient<TResponse>('DELETE', path, options),
};

export function getServerFileUrl(id: string): string {
  return '';
}

export function getClientFileUrl(id?: string): string {
  if (id === undefined) return '';
  return `/api/file/${id}`;
}
