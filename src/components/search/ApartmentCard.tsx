'use client';

import { cn } from '@/lib/utils';
import { ApartmentDTO } from '@/model/dto/apartment.dto';
import { Link } from '@/i18n/navigation';

export type ApartmentCardProps = {
  className?: string;
  data: ApartmentDTO;
  onClick?: () => void;
};

export default function ApartmentCard({
  className,
  data,
  onClick,
}: ApartmentCardProps) {
  return (
    <Link href={`/search/${data.id}`}>
      <div
        onClick={onClick}
        className={cn(
          'relative w-full h-[499px] bg-[#FFFFFF1F] border border-pale-gray rounded-md overflow-hidden cursor-pointer transition-all hover:border-primary-green',
          className
        )}
      >
        {/* Apartment Name */}
        <div className="absolute top-6 left-6">
          <span className="font-montserrat font-medium text-seu-body text-white uppercase tracking-wide">
            Apartment #{data.apartmentNo}
          </span>
        </div>

        {/* Badges */}
        <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-2">
          {/* Project Name */}
          {data.building?.project && (
            <span className="px-3 py-1.5 bg-pale-gray/10 border border-secondary-grey rounded-lg font-montserrat text-seu-caption text-pale-gray uppercase">
              {data.building.project.name}
            </span>
          )}

          {/* Block */}
          {data.building && (
            <span className="px-3 py-1.5 bg-pale-gray/10 border border-secondary-grey rounded-lg font-montserrat text-seu-caption text-pale-gray">
              Block {data.building.block}
            </span>
          )}

          {/* Floor */}
          <span className="px-3 py-1.5 bg-pale-gray/10 border border-secondary-grey rounded-lg font-montserrat text-seu-caption text-pale-gray">
            Floor {data.floor}
          </span>

          {/* Rooms */}
          <span className="px-3 py-1.5 bg-pale-gray/10 border border-secondary-grey rounded-lg font-montserrat text-seu-caption text-pale-gray">
            {data.bedroomCount} {data.bedroomCount === 1 ? 'Room' : 'Rooms'}
          </span>

          {/* Size */}
          <span className="px-3 py-1.5 bg-pale-gray/10 border border-secondary-grey rounded-lg font-montserrat text-seu-caption text-pale-gray">
            {data.totalSize} m²
          </span>

          {/* Price */}
          <span className="px-3 py-1.5 bg-primary-green/20 border border-primary-green rounded-lg font-montserrat text-seu-caption text-primary-green">
            ${data.price.toLocaleString()}
          </span>
        </div>
      </div>
    </Link>
  );
}
