'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// PLACEHOLDER: IMAGE - Replace with actual benefit/building images
const placeholderImages = [
  { id: 1, alt: 'Building exterior view 1' },
  { id: 2, alt: 'Building exterior view 2' },
  { id: 3, alt: 'Recreational area' },
  { id: 4, alt: 'Courtyard view' },
  { id: 5, alt: 'Amenities view' },
];

export function Benefits() {
  const t = useTranslations('search');
  const tb = useTranslations('benefitsList');
  const benefits = [tb('b1'), tb('b2'), tb('b3'), tb('b4'), tb('b5'), tb('b6'), tb('b7'), tb('b8'), tb('b9'), tb('b10')];
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalImages = placeholderImages.length;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  };

  // Get visible images (current and next)
  const visibleImages = [
    placeholderImages[currentIndex],
    placeholderImages[(currentIndex + 1) % totalImages],
  ];

  return (
    <div className="mt-16 lg:mt-40 flex flex-col lg:flex-row gap-8 lg:gap-12 px-5 lg:px-10">
      {/* Left side: Benefits list */}
      <div className="w-full lg:w-[30%] shrink-0">
        <h2 className="font-[--font-bodoni] font-normal text-seu-subheading text-site-fg mb-6">
          {t('benefits')}
        </h2>

        <ul className="space-y-2">
          {benefits.map((benefit, index) => (
            <li
              key={index}
              className="font-montserrat text-seu-caption text-site-fg-dim"
            >
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      {/* Right side: Image carousel */}
      <div className="flex-1">
        {/* Images container */}
        <div className="flex flex-row gap-5">
          {visibleImages.map((image) => (
            <div
              key={image.id}
              className="flex-1 h-48 lg:h-80 rounded-lg overflow-hidden relative"
            >
              {/* PLACEHOLDER: IMAGE - Building/amenity photo */}
              <div className="absolute inset-0 bg-site-bg-elevated flex items-center justify-center">
                <span className="font-montserrat text-seu-caption text-site-fg-dim">
                  {image.alt}
                </span>
              </div>
              {/* Dark overlay for the image effect */}
              <div className="absolute inset-0 bg-site-bg/40" />
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center mt-6">
          {/* Arrow buttons - centered */}
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-2">
              <button
                onClick={goToPrevious}
                className="w-9 h-9 rounded-full border border-site-border-strong flex items-center justify-center hover:border-site-fg transition-colors cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4 text-site-fg" />
              </button>
              <button
                onClick={goToNext}
                className="w-9 h-9 rounded-full border border-site-border-strong flex items-center justify-center hover:border-site-fg transition-colors cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4 text-site-fg" />
              </button>
            </div>
          </div>

          {/* Counter - right aligned */}
          <div className="flex-none">
            <span className="font-montserrat text-seu-body-lg">
              <span className="text-site-fg">
                {String(currentIndex + 1).padStart(2, '0')}
              </span>
              <span className="text-site-fg-dim">
                /{String(totalImages).padStart(2, '0')}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
