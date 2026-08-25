'use client';

import { useState, type ReactNode } from 'react';
import { MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import ProjectMapDialog from './ProjectMapDialog';
import { mapEmbedSrc, mapOpenHref } from '@/lib/google-maps';
import { cn } from '@/lib/utils';

interface ProjectLocationLinkProps {
  /** Raw `googleMapLink` from the project — the admin sets it, nothing is guessed. */
  link?: string | null;
  /** Project name, shown as the map dialog's title. */
  projectName: string;
  /** Address line for the dialog header, when the project has one. */
  address?: string;
  className?: string;
  /** The location text itself. */
  children: ReactNode;
}

/**
 * The location text in visual search, clickable when the project carries a
 * Google Maps link. Without one it stays plain text, so a project the admin has
 * not given a map to simply reads as before.
 *
 * The map opens in a dialog when Google lets us frame the admin's link, and in
 * a new tab when it does not.
 */
export default function ProjectLocationLink({
  link,
  projectName,
  address,
  className,
  children,
}: ProjectLocationLinkProps) {
  const t = useTranslations('visualSearch');
  const [open, setOpen] = useState(false);
  const embedSrc = mapEmbedSrc(link);
  const openHref = mapOpenHref(link);

  if (!openHref) {
    return <span className={className}>{children}</span>;
  }

  return (
    <>
      <button
        type="button"
        title={t('viewOnMap')}
        onClick={(e) => {
          // Some of these sit inside a card-wide link — never navigate away.
          e.preventDefault();
          e.stopPropagation();
          // A link Google will not let us frame (a short link, typically) is
          // no use in a dialog — hand it straight to Google Maps.
          if (embedSrc) setOpen(true);
          else window.open(openHref, '_blank', 'noopener,noreferrer');
        }}
        className={cn(
          'group/map inline-flex items-center gap-1.5 cursor-pointer hover:text-primary-green transition-colors',
          className
        )}
      >
        {children}
        <MapPin className="size-3.5 shrink-0 opacity-60 group-hover/map:opacity-100 transition-opacity" />
      </button>

      {embedSrc && (
        <ProjectMapDialog
          open={open}
          onOpenChange={setOpen}
          link={link}
          title={projectName}
          subtitle={address}
        />
      )}
    </>
  );
}
