'use client';

import { cn } from '@/lib/utils';
import { Link } from '@/i18n/navigation';
import { pickLocale } from '@/lib/i18n-helpers';
import type { Unit } from '@/model/types/api';

export type ApartmentCardProps = {
  className?: string;
  data: Unit;
  onClick?: () => void;
};

function currencySymbol(c: string) {
  if (c === 'USD') return '$';
  if (c === 'EUR') return '€';
  if (c === 'GEL') return '₾';
  return '';
}

export default function ApartmentCard({
  className,
  data,
  onClick,
}: ApartmentCardProps) {
  const projectName =
    typeof data.project === 'string' ? '' : pickLocale(data.project.name);

  return (
    <Link href={`/search/${data.id}`}>
      <div
        onClick={onClick}
        className={cn(
          'relative w-full h-[499px] bg-[#FFFFFF1F] border border-pale-gray rounded-md overflow-hidden cursor-pointer transition-all hover:border-primary-green',
          className
        )}
      >
        <div className="absolute top-6 left-6">
          <span className="font-montserrat font-medium text-seu-body text-white uppercase tracking-wide">
            Apartment #{data.unitNumber}
          </span>
        </div>

        <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-2">
          {projectName && (
            <span className="px-3 py-1.5 bg-pale-gray/10 border border-secondary-grey rounded-lg font-montserrat text-seu-caption text-pale-gray uppercase">
              {projectName}
            </span>
          )}
          <span className="px-3 py-1.5 bg-pale-gray/10 border border-secondary-grey rounded-lg font-montserrat text-seu-caption text-pale-gray">
            Block {data.block}
          </span>
          <span className="px-3 py-1.5 bg-pale-gray/10 border border-secondary-grey rounded-lg font-montserrat text-seu-caption text-pale-gray">
            Floor {data.floorNumber}
          </span>
          <span className="px-3 py-1.5 bg-pale-gray/10 border border-secondary-grey rounded-lg font-montserrat text-seu-caption text-pale-gray">
            {data.bedrooms ?? 0} {data.bedrooms === 1 ? 'Room' : 'Rooms'}
          </span>
          <span className="px-3 py-1.5 bg-pale-gray/10 border border-secondary-grey rounded-lg font-montserrat text-seu-caption text-pale-gray">
            {data.totalSize} m²
          </span>
          <span className="px-3 py-1.5 bg-primary-green/20 border border-primary-green rounded-lg font-montserrat text-seu-caption text-primary-green">
            {currencySymbol(data.price.currency)}
            {data.price.amount.toLocaleString()}
          </span>
        </div>
      </div>
    </Link>
  );
}
