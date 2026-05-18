import { API_BASE_URL, ApiRequestError } from '@/lib/api-client';
import { getToken } from '@/lib/auth';

export interface UploadedFile {
  uuid: string;
  originalName: string;
  mimeType: string;
  size: number;
}

/**
 * Files service — wraps the seu-backend file module.
 *
 * The download endpoint streams a file by UUID; we expose `urlFor(uuid)`
 * so callers can render `<img src={urlFor(uuid)}>` directly.
 */
export const filesService = {
  /** Upload a single file via multipart/form-data. Returns the stored UUID + metadata. */
  async upload(file: File, signal?: AbortSignal): Promise<UploadedFile> {
    const fd = new FormData();
    fd.append('file', file);

    let response: Response;
    try {
      response = await fetch(`${API_BASE_URL}/files`, {
        method: 'POST',
        body: fd,
        signal,
        headers: {
          Accept: 'application/json',
          ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
        },
      });
    } catch (e) {
      throw new ApiRequestError(
        e instanceof Error ? e.message : 'Network error',
        0,
        'NETWORK_ERROR'
      );
    }

    let payload: unknown = null;
    const text = await response.text();
    if (text.trim().length > 0) {
      try {
        payload = JSON.parse(text);
      } catch {
        payload = text;
      }
    }

    if (!response.ok) {
      const err = (payload ?? {}) as Record<string, unknown> & {
        message?: string | string[];
        error?: { key?: string; message?: string };
      };
      const messageRaw = err.message ?? err.error?.message;
      const message = Array.isArray(messageRaw)
        ? messageRaw.join(' · ')
        : messageRaw || `Upload failed (${response.status})`;
      throw new ApiRequestError(
        message,
        response.status,
        err.error?.key,
        payload
      );
    }

    // Backend wraps in { success: true, data: {...} }; tolerate raw too.
    if (
      payload &&
      typeof payload === 'object' &&
      'data' in (payload as Record<string, unknown>)
    ) {
      return (payload as { data: UploadedFile }).data;
    }
    return payload as UploadedFile;
  },

  /** Direct URL to download/stream a stored file. */
  urlFor(uuid: string): string {
    return `${API_BASE_URL}/files/${uuid}`;
  },
};
