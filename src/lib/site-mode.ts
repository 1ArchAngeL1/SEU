/**
 * Public site mode.
 *
 * The test-mode notice stays up until someone explicitly sets
 * NEXT_PUBLIC_SITE_MODE=live. Defaulting to "test" is deliberate: forgetting the
 * variable on a deploy leaves the disclaimer visible instead of silently
 * dropping it from an unfinished site.
 *
 * NEXT_PUBLIC_* is inlined at build time, so a change needs a rebuild.
 */
export const SITE_MODE = process.env.NEXT_PUBLIC_SITE_MODE ?? 'test';

export const isTestMode = SITE_MODE !== 'live';
