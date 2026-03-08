'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const benefits = [
  'Up to 2 hectares of recreational space;',
  'Guarded courtyard;',
  'Underground and surface parking;',
  'Trade and office premises;',
  'Children playgrounds;',
  'Sports and playgrounds;',
  'Tennis courts;',
  'Gym;',
  'There will be a lobby at the entrance to each building;',
  'School.',
];

// PLACEHOLDER: IMAGE - Replace with actual benefit/building images
const placeholderImages = [
  { id: 1, alt: 'Building exterior view 1' },
  { id: 2, alt: 'Building exterior view 2' },
  { id: 3, alt: 'Recreational area' },
  { id: 4, alt: 'Courtyard view' },
  { id: 5, alt: 'Amenities view' },
];

export function Benefits() {
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
    <div className="mt-40 flex gap-12 px-10">
      {/* Left side: Benefits list */}
      <div className="w-[30%] shrink-0">
        <h2 className="font-[--font-bodoni] font-normal text-seu-subheading text-pale-gray mb-6">
          Benefits
        </h2>

        <ul className="space-y-2">
          {benefits.map((benefit, index) => (
            <li
              key={index}
              className="font-montserrat text-seu-caption text-pale-gray/70"
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
              className="flex-1 h-80 rounded-lg overflow-hidden relative"
            >
              {/* PLACEHOLDER: IMAGE - Building/amenity photo */}
              <div className="absolute inset-0 bg-[#1a2535] flex items-center justify-center">
                <span className="font-montserrat text-seu-caption text-pale-gray/20">
                  {image.alt}
                </span>
              </div>
              {/* Dark overlay for the image effect */}
              <div className="absolute inset-0 bg-dark-green/40" />
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
                className="w-9 h-9 rounded-full border border-pale-gray/40 flex items-center justify-center hover:border-pale-gray transition-colors cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4 text-pale-gray" />
              </button>
              <button
                onClick={goToNext}
                className="w-9 h-9 rounded-full border border-pale-gray/40 flex items-center justify-center hover:border-pale-gray transition-colors cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4 text-pale-gray" />
              </button>
            </div>
          </div>

          {/* Counter - right aligned */}
          <div className="flex-none">
            <span className="font-montserrat text-seu-body-lg">
              <span className="text-pale-gray">
                {String(currentIndex + 1).padStart(2, '0')}
              </span>
              <span className="text-pale-gray/40">
                /{String(totalImages).padStart(2, '0')}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
