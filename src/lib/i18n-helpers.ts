export type Locale = 'ka' | 'en';

export function pickLocalized(
  enValue: string | undefined | null,
  kaValue: string | undefined | null,
  locale: Locale = 'ka'
): string {
  if (locale === 'ka') return kaValue ?? enValue ?? '';
  return enValue ?? kaValue ?? '';
}
