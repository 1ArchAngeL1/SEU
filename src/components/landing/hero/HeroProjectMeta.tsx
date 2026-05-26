'use client';

import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { pickLocale } from '@/lib/i18n-helpers';
import { cn } from '@/lib/utils';
import type { Project } from '@/model/types/api';

interface HeroProjectMetaProps {
  project: Project;
  gallery: string[];
  active: number;
  onDotClick: (i: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function HeroProjectMeta({
  project,
  gallery,
  active,
  onDotClick,
  onPrev,
  onNext,
}: HeroProjectMetaProps) {
  const t = useTranslations('status');
  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 hidden lg:flex flex-col animate-[fadeInUp_0.9s_cubic-bezier(0.16,1,0.3,1)_0.3s_both]">
      <div className="px-12 pb-8 flex items-end justify-between">
        <div className="flex flex-col gap-3 max-w-xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-pale-gray/10 border border-pale-gray/20 backdrop-blur font-montserrat text-[0.7rem] uppercase tracking-wider text-pale-gray/85">
              {t(project.status as any)}
            </span>
            {project.isFeatured && (
              <span className="px-3 py-1 rounded-full bg-primary-green/20 border border-primary-green/40 backdrop-blur font-montserrat text-[0.7rem] uppercase tracking-wider text-pale-gray">
                {t('featured')}
              </span>
            )}
          </div>

          <h1 className="font-[--font-bodoni] text-seu-title-xl text-white leading-none uppercase">
            {pickLocale(project.name)}
          </h1>

          <div className="flex items-center gap-2 mt-1 font-montserrat text-seu-caption text-pale-gray/85">
            <MapPin className="size-4 shrink-0" />
            <span className="truncate">
              {project.location.address}
              {project.location.city && ` · ${project.location.city}`}
            </span>
          </div>
        </div>

        {/* Pagination dots + arrows */}
        {gallery.length > 1 && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {gallery.map((_src, index) => (
                <button
                  key={`dot-${index}`}
                  onClick={() => onDotClick(index)}
                  className={cn(
                    'h-1.5 rounded-full transition-all',
                    index === active
                      ? 'w-8 bg-primary-green'
                      : 'w-2 bg-white/35 hover:bg-white/60'
                  )}
                  aria-label={`Show image ${index + 1}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-1.5 ml-1">
              <button
                type="button"
                onClick={onPrev}
                className="size-8 rounded-full border border-pale-gray/25 hover:border-pale-gray/60 hover:bg-pale-gray/10 grid place-items-center text-pale-gray/85 transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={onNext}
                className="size-8 rounded-full border border-pale-gray/25 hover:border-pale-gray/60 hover:bg-pale-gray/10 grid place-items-center text-pale-gray/85 transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
