import type { Locale } from '@/lib/i18n-helpers';

/** Rough reading-time estimate (~200 wpm), always at least 1 minute. */
export function estimateReadMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

const DATE_LOCALE: Record<Locale, string> = { ka: 'ka-GE', en: 'en-US' };

/** Localized long date (e.g. "January 1, 2026" / "1 იანვარი, 2026"). */
export function formatNewsDate(iso: string, locale: Locale = 'ka'): string {
  try {
    return new Date(iso).toLocaleDateString(DATE_LOCALE[locale], {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

/**
 * First sentence / line of a body, used as the lead overlay on the article
 * hero. Falls back to the whole (trimmed) text and truncates long leads.
 */
export function leadSentence(text: string, maxLen = 140): string {
  const trimmed = text.trim();
  if (!trimmed) return '';
  const firstLine = trimmed.split(/\n+/)[0]?.trim() ?? '';
  const source = firstLine || trimmed;
  const match = source.match(/^[\s\S]*?[.!?。！？](\s|$)/);
  const sentence = (match ? match[0] : source).trim();
  if (sentence.length <= maxLen) return sentence;
  return sentence.slice(0, maxLen).trimEnd() + '…';
}

/** Split a body into paragraphs on blank lines (falls back to single line breaks). */
export function toParagraphs(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  const byBlank = trimmed.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  if (byBlank.length > 1) return byBlank;
  return trimmed.split(/\n+/).map((p) => p.trim()).filter(Boolean);
}
