import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ka'],
  defaultLocale: 'ka',
  localePrefix: 'as-needed',
  // Don't let the middleware auto-redirect unprefixed paths based on a stale
  // NEXT_LOCALE cookie / Accept-Language. With `as-needed` + a default locale,
  // detection bounces `/` back to `/en` and the language toggle can't switch
  // back to the default. The URL prefix is the single source of truth instead.
  localeDetection: false,
});
