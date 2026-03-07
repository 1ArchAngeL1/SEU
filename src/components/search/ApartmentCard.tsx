'use client';

import { cn } from '@/lib/utils';
import { ApartmentData } from '@/components/search/ApartmentCardGridView';

export type ApartmentCardProps = {
  className?: string;
  data: ApartmentData;
  onClick?: () => void;
};

export default function ApartmentCard({
  className,
  data,
  onClick,
}: ApartmentCardProps) {
  const statusColors = {
    available: 'bg-primary-green',
    sold: 'bg-red',
    reserved: 'bg-secondary-grey',
  };

  const statusLabels = {
    available: 'Available',
    sold: 'Sold',
    reserved: 'Reserved',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative w-full] h-[499px] bg-[#FFFFFF1F] border border-pale-gray rounded-md overflow-hidden cursor-pointer transition-all hover:border-primary-green hover:scale-105',
        className
      )}
    >
      {/* Apartment Name */}
      <div className="absolute top-6 left-6">
        <span className="font-montserrat font-medium text-seu-body text-white uppercase tracking-wide">
          {data.name}
        </span>
      </div>

      {/* Badges */}
      <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-2">
        {/* Complex Name */}
        <span className="px-3 py-1.5 bg-pale-gray/10 border border-secondary-grey rounded-lg font-montserrat text-seu-caption text-pale-gray uppercase">
          {data.complex}
        </span>

        {/* Block */}
        <span className="px-3 py-1.5 bg-pale-gray/10 border border-secondary-grey rounded-lg font-montserrat text-seu-caption text-pale-gray">
          Block {data.block}
        </span>

        {/* Rooms */}
        <span className="px-3 py-1.5 bg-pale-gray/10 border border-secondary-grey rounded-lg font-montserrat text-seu-caption text-pale-gray">
          {data.rooms} {data.rooms === 1 ? 'Room' : 'Rooms'}
        </span>

        {/* Size */}
        <span className="px-3 py-1.5 bg-pale-gray/10 border border-secondary-grey rounded-lg font-montserrat text-seu-caption text-pale-gray">
          {data.size} m²
        </span>

        {/* Status */}
        <span
          className={cn(
            'px-3 py-1.5 rounded-lg font-montserrat text-seu-caption text-white',
            // statusColors[status]
          )}
        >
          {/*{statusLabels[status]}*/}
        </span>
      </div>
    </div>
  );
}
