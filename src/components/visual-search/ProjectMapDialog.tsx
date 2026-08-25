'use client';

import { ExternalLink, MapPin, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { mapEmbedSrc, mapOpenHref } from '@/lib/google-maps';
import { cn } from '@/lib/utils';

interface ProjectMapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Raw `googleMapLink` exactly as an admin set it on the project. */
  link?: string | null;
  /** Project name — the dialog title. */
  title: string;
  /** Address line under the title, when the project has one. */
  subtitle?: string;
}

/**
 * The project's location on Google Maps, opened from the location text in
 * visual search. Shows the embedded map when the admin's link can be framed and
 * falls back to a plain "open in Google Maps" card when it cannot.
 */
export default function ProjectMapDialog({
  open,
  onOpenChange,
  link,
  title,
  subtitle,
}: ProjectMapDialogProps) {
  const t = useTranslations('visualSearch');
  const embedSrc = mapEmbedSrc(link);
  const openHref = mapOpenHref(link);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            'fixed top-[50%] left-[50%] z-50 w-[min(100%-2rem,56rem)] translate-x-[-50%] translate-y-[-50%]',
            'max-h-[92vh] overflow-y-auto rounded-2xl border border-pale-gray/15 bg-site-bg text-site-fg',
            'shadow-[0_24px_80px_rgba(0,0,0,0.6)] outline-none',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
            'px-5 sm:px-8 pt-6 pb-7'
          )}
        >
          <DialogPrimitive.Close
            className="absolute top-4 right-4 size-9 rounded-full bg-site-bg-hover/80 border border-site-border-soft grid place-items-center text-site-fg-muted hover:text-site-fg hover:border-site-border transition-colors"
            aria-label={t('closeMap')}
          >
            <X className="size-4" />
          </DialogPrimitive.Close>

          {/* Header */}
          <div className="mb-5 pr-10">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="size-4 text-primary-green" />
              <span className="font-montserrat font-semibold text-seu-caption-sm uppercase tracking-[0.2em] text-primary-green">
                {t('location')}
              </span>
            </div>
            <DialogPrimitive.Title className="font-bodoni font-normal text-seu-heading text-site-fg-strong leading-none uppercase">
              {title}
            </DialogPrimitive.Title>
            <DialogPrimitive.Description
              className={cn(
                'font-montserrat text-seu-caption text-site-fg-muted mt-2',
                !subtitle && 'sr-only'
              )}
            >
              {subtitle || t('viewOnMap')}
            </DialogPrimitive.Description>
          </div>

          {/* Links that cannot be framed (short links, above all) never reach
              the dialog — `ProjectLocationLink` sends those straight to Google. */}
          {embedSrc && (
            <iframe
              src={embedSrc}
              title={title}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-[45vh] sm:h-[55vh] rounded-xl border border-pale-gray/15 bg-site-bg-hover"
            />
          )}

          {openHref && (
            <a
              href={openHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-pale-gray/20 bg-site-bg-hover/60 px-5 py-2.5 font-montserrat font-medium text-seu-caption text-site-fg hover:border-primary-green/60 hover:text-primary-green transition-colors"
            >
              {t('openInGoogleMaps')}
              <ExternalLink className="size-3.5" />
            </a>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
