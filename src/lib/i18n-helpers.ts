import type { LocalizedString } from '@/model/types/api';

export type Locale = 'ka' | 'en';

export function pickLocale(
  value: LocalizedString | string | undefined | null,
  locale: Locale = 'ka'
): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[locale] ?? value.en ?? value.ka ?? '';
}

export function makeLocalized(text: string): LocalizedString {
  return { ka: text, en: text };
}
