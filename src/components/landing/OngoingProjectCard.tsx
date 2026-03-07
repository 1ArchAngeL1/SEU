'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

export type OngoingProjectCardProps = {
  className?: string;
  name: string;
  projectId: string;
  location: string;
  sizeFrom: number;
  sizeTo: number;
  image?: string;
  badge?: string;
  key?: number;
};

export const OngoingProjectCard = ({
  className,
  name,
  projectId,
  location,
  sizeFrom,
  sizeTo,
  image,
  badge,
}: OngoingProjectCardProps) => {
  return (
    <div
      className={cn(
        'relative w-full h-[500px] rounded-2xl overflow-hidden group',
        className
      )}
    >
      {/* Background Image or Gradient Placeholder */}
      {image ? (
        <Image src={image} alt={name} fill className="object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-secondary-black via-dark-green to-navy-green" />
      )}

      {/* Left gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

      {/* Badge - Top Right */}
      {badge && (
        <div className="absolute top-6 right-6">
          <span className="px-3 py-1 bg-primary-green text-white text-seu-caption-sm font-montserrat font-medium rounded">
            {badge}
          </span>
        </div>
      )}

      {/* Content - Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end justify-between">
        {/* Left - Project Info */}
        <div>
          <p className="text-seu-caption text-secondary-grey mb-2 flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {projectId}
          </p>
          <h3 className="font-bodoni text-seu-title text-white">{name}</h3>
        </div>

        {/* Right - Location & Size */}
        <div className="flex items-center gap-8 text-seu-caption">
          <div>
            <span className="text-secondary-grey">Location - </span>
            <span className="text-primary-green">{location}</span>
          </div>
          <div>
            <span className="text-secondary-grey">Size - </span>
            <span className="text-white">
              From {sizeFrom} m To {sizeTo} m
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
