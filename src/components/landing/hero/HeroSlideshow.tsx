'use client';

import { pickLocale } from '@/lib/i18n-helpers';
import { fileUrl } from '@/lib/file-url';
import { cn } from '@/lib/utils';

interface HeroSlideshowProps {
  gallery: string[];
  active: number;
  projectId?: string;
  projectName?: string;
}

export default function HeroSlideshow({
  gallery,
  active,
  projectId,
  projectName,
}: HeroSlideshowProps) {
  return (
    <div className="absolute inset-0">
      {gallery.map((src, i) => {
        const url = fileUrl(src);
        const isActive = i === active;
        return (
          <div
            key={`${projectId ?? 'p'}-${i}`}
            className={cn(
              'absolute inset-0 transition-opacity duration-[1200ms] ease-out',
              isActive ? 'opacity-100' : 'opacity-0'
            )}
            aria-hidden={!isActive}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={projectName ? `${projectName} — image ${i + 1}` : ''}
              className={cn(
                'absolute inset-0 w-full h-full object-cover transition-transform duration-[8000ms] ease-out',
                isActive ? 'scale-105' : 'scale-100'
              )}
            />
          </div>
        );
      })}

      {gallery.length === 0 && (
        <div className="absolute inset-0 bg-gradient-to-br from-secondary-black via-site-bg to-black" />
      )}

      {/* Overlay for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-site-bg via-site-bg/55 to-site-bg/15" />
      <div className="absolute inset-0 bg-gradient-to-r from-site-bg/70 via-site-bg/30 to-transparent" />
    </div>
  );
}
