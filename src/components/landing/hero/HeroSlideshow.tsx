'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('landing');
  return (
    <div className="absolute inset-0">
      {gallery.map((src, i) => {
        const url = fileUrl(src);
        // Legacy external URLs (non-UUID refs) can't go through the Next image
        // optimizer's domain allowlist — pass them through untouched. The common
        // case (`/api/files/{uuid}`) is same-origin and gets optimized.
        const remote = /^https?:\/\//i.test(url);
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
            <Image
              src={url}
              alt={projectName ? t('heroImageAlt', { name: projectName, n: i + 1 }) : ''}
              fill
              // Hero spans the full viewport width.
              sizes="100vw"
              // First slide is the LCP element — preload it; the rest load lazily.
              priority={i === 0}
              unoptimized={remote}
              className={cn(
                'object-cover transition-transform duration-[8000ms] ease-out',
                isActive ? 'scale-105' : 'scale-100'
              )}
            />
          </div>
        );
      })}

      {gallery.length === 0 && (
        <div className="absolute inset-0 bg-gradient-to-br from-secondary-black via-dark-green to-black" />
      )}

      {/* Overlay for legibility — always dark so the hero stays dramatic */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark-green via-dark-green/55 to-dark-green/15" />
      <div className="absolute inset-0 bg-gradient-to-r from-dark-green/70 via-dark-green/30 to-transparent" />
    </div>
  );
}
