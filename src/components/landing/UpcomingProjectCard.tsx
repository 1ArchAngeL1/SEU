'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

export type UpcomingProjectCardProps = {
  className?: string;
  name: string;
  startDate?: string;
  image?: string;
};

export default function UpcomingProjectCard({
  className,
  name,
  startDate,
  image,
}: UpcomingProjectCardProps) {
  return (
    <div
      className={cn(
        'relative w-full max-w-xl h-[350px] rounded-xl overflow-hidden border border-site-border-soft hover:border-primary-orange/20 transition-colors duration-500 hover-lift',
        className
      )}
    >
      {/* Background Image or Gradient Placeholder */}
      {image ? (
        <Image src={image} alt={name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-secondary-black/80 via-site-bg to-navy-green/50" />
      )}

      {/* Edge vignette for smooth background transition */}
      <div className="site-vignette absolute inset-0 shadow-[inset_0_0_40px_10px_var(--site-bg)]" />
      {/* Fog overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-site-bg/90 via-transparent to-site-bg/40" />

      {/* Content - Bottom */}
      <div className="absolute bottom-6 left-6 right-6">
        {startDate && (
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
            STARTING: {startDate}
          </p>
        )}
        <h3 className="font-bodoni text-seu-heading-lg text-white">{name}</h3>
      </div>
    </div>
  );
}
