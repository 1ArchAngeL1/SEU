import { getTranslations } from 'next-intl/server';
import { TriangleAlert } from 'lucide-react';
import { isTestMode } from '@/lib/site-mode';

/**
 * Site-wide "this is a test version" notice.
 *
 * Server component — renders nothing and ships no JS once
 * NEXT_PUBLIC_SITE_MODE=live. Intentionally not dismissible: it is a disclaimer
 * about the accuracy of the content, so it has to stay visible on every page.
 */
export default async function TestModeBanner() {
  if (!isTestMode) return null;

  const t = await getTranslations('testMode');

  return (
    <div
      role="status"
      className="w-full bg-primary-orange text-dark-green"
    >
      <div className="flex items-center justify-center gap-2 px-4 py-1.5 text-center">
        <TriangleAlert className="size-4 shrink-0" aria-hidden="true" />
        <p className="font-montserrat text-seu-caption-sm leading-snug">
          {/* Case comes from the message, not `uppercase` — Georgian Mkhedruli
              has no uppercase form, so CSS casing would be a no-op there. */}
          <span className="font-semibold tracking-[0.1em]">{t('label')}</span>
          <span className="mx-2 opacity-40" aria-hidden="true">
            |
          </span>
          <span className="font-medium">{t('message')}</span>
        </p>
      </div>
    </div>
  );
}
