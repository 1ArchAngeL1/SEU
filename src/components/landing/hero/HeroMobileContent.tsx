'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';
import { pickLocale } from '@/lib/i18n-helpers';
import { cn } from '@/lib/utils';
import type { Project } from '@/model/types/api';

interface HeroMobileContentProps {
  project: Project;
  gallery: string[];
  active: number;
  onDotClick: (i: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function HeroMobileContent({
  project,
  gallery,
  active,
  onDotClick,
  onPrev,
  onNext,
}: HeroMobileContentProps) {
  const router = useRouter();

  function handleFindApartment() {
    router.push('/search');
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-6 lg:hidden flex flex-col gap-4 animate-[fadeInUp_0.9s_cubic-bezier(0.16,1,0.3,1)_0.3s_both]">
      {/* Project name */}
      <h1 className="font-[--font-bodoni] text-seu-heading text-white leading-none uppercase">
        {pickLocale(project.name)}
      </h1>

      {/* Find Apartment button */}
      <button
        type="button"
        onClick={handleFindApartment}
        className="w-full bg-primary-orange text-white font-montserrat font-medium text-seu-body py-4 rounded-xl hover:bg-primary-orange/85 transition-colors"
      >
        Find Apartment
      </button>

      {/* Pagination dots + arrows */}
      {gallery.length > 1 && (
        <div className="flex items-center justify-center gap-3 mt-1">
          <button
            type="button"
            onClick={onPrev}
            className="size-7 rounded-full border border-pale-gray/25 grid place-items-center text-pale-gray/85"
            aria-label="Previous image"
          >
            <ChevronLeft className="size-3.5" />
          </button>
          <div className="flex items-center gap-1.5">
            {gallery.map((_src, index) => (
              <button
                key={`mdot-${index}`}
                onClick={() => onDotClick(index)}
                className={cn(
                  'size-2 rounded-full transition-all',
                  index === active
                    ? 'bg-primary-orange'
                    : 'bg-white/35'
                )}
                aria-label={`Show image ${index + 1}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={onNext}
            className="size-7 rounded-full border border-pale-gray/25 grid place-items-center text-pale-gray/85"
            aria-label="Next image"
          >
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
