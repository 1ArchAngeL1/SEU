import { filesService } from '@/service/files.service';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Resolve a stored image/file reference to a renderable URL.
 *
 * - UUID (e.g. `de305d54-75b4-431b-adb2-eb6b9e546014`) → backend
 *   `/files/{uuid}` download URL.
 * - Anything else (full URL, relative path, empty) is returned as-is so
 *   the field stays backwards compatible with previously stored external
 *   URLs.
 */
export function fileUrl(value: string | null | undefined): string {
  if (!value) return '';
  const v = value.trim();
  if (!v) return '';
  if (UUID_RE.test(v)) return filesService.urlFor(v);
  return v;
}

export function isFileUuid(value: string | null | undefined): boolean {
  return !!value && UUID_RE.test(value.trim());
}
