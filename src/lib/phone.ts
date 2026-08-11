/**
 * Phone numbers as entered by admins are usually local — "555 12 34 56" with
 * no country code. The public site shows them in international form so a tap
 * dials correctly from anywhere.
 */

const COUNTRY_CODE = '995'; // Georgia

/**
 * Display form: the number with `+995` in front unless it already carries a
 * country code.
 *
 * Anything already international is left exactly as the admin typed it — the
 * spacing is theirs to choose, and a partner abroad must not be re-tagged as
 * Georgian.
 */
export function formatPhone(raw: string | undefined | null): string {
  const trimmed = String(raw ?? '').trim();
  if (!trimmed) return '';

  // Already international.
  if (trimmed.startsWith('+')) return trimmed;

  const digits = trimmed.replace(/\D/g, '');
  if (!digits) return trimmed;

  // "00…" is the international prefix written the old way.
  if (digits.startsWith('00')) return `+${digits.slice(2)}`;
  if (digits.startsWith(COUNTRY_CODE)) return `+${digits}`;

  // A single leading zero is the domestic trunk prefix and is dropped when the
  // country code goes on.
  const local = trimmed.replace(/^0(?!0)/, '').trim();
  return `+${COUNTRY_CODE} ${local}`;
}

/** `tel:` target — the same number with every separator stripped. */
export function phoneHref(raw: string | undefined | null): string {
  const formatted = formatPhone(raw);
  if (!formatted) return '';
  return `tel:${formatted.replace(/[^\d+]/g, '')}`;
}
