'use client';

import { ChevronRight } from 'lucide-react';
import type { ApartmentDTO } from '@/model/dto/apartment.dto';
import StatusBadge from '@/components/admin/StatusBadge';
import { cn } from '@/lib/utils';

interface StoryFloorRowProps {
  floor: number;
  apartments: ApartmentDTO[];
  isExpanded: boolean;
  onToggle: () => void;
  onApartmentClick: (apartment: ApartmentDTO) => void;
}

export default function StoryFloorRow({
  floor,
  apartments,
  isExpanded,
  onToggle,
  onApartmentClick,
}: StoryFloorRowProps) {
  const count = apartments.length;
  const available = apartments.filter((a) => a.status === 'AVAILABLE').length;
  const reserved = apartments.filter((a) => a.status === 'RESERVED').length;
  const sold = apartments.filter((a) => a.status === 'SOLD').length;

  const prices = apartments.map((a) => a.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  return (
    <div className="rounded-lg border border-secondary-black overflow-hidden">
      {/* Floor header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 bg-secondary-black/30 hover:bg-secondary-black/40 transition-colors"
      >
        <ChevronRight
          className={cn(
            'size-4 text-secondary-grey transition-transform',
            isExpanded && 'rotate-90'
          )}
        />
        <span className="font-montserrat font-semibold text-seu-caption text-pale-gray">
          Floor {floor}
        </span>
        <span className="text-seu-caption-sm text-secondary-grey font-montserrat ml-2">
          {count} apartment{count !== 1 ? 's' : ''}
        </span>
        {count > 0 && (
          <>
            <span className="text-seu-caption-sm text-secondary-grey/60 font-montserrat">
              |
            </span>
            <span className="text-seu-caption-sm text-pale-gray/60 font-montserrat">
              ${minPrice.toLocaleString()}
              {minPrice !== maxPrice && ` – $${maxPrice.toLocaleString()}`}
            </span>
            <span className="text-seu-caption-sm text-secondary-grey/60 font-montserrat">
              |
            </span>
            <div className="flex gap-2 text-seu-caption-sm font-montserrat">
              {available > 0 && (
                <span className="text-[#4ade80]">{available} avail</span>
              )}
              {reserved > 0 && (
                <span className="text-[#c9a962]">{reserved} rsrvd</span>
              )}
              {sold > 0 && <span className="text-red">{sold} sold</span>}
            </div>
          </>
        )}
      </button>

      {/* Expanded apartment table */}
      {isExpanded && count > 0 && (
        <table className="w-full text-seu-caption font-montserrat">
          <thead>
            <tr className="bg-secondary-black/20 text-left text-secondary-grey/80">
              <th className="px-4 py-2 font-medium text-seu-caption-sm">
                Apt #
              </th>
              <th className="px-4 py-2 font-medium text-seu-caption-sm">
                Rooms
              </th>
              <th className="px-4 py-2 font-medium text-seu-caption-sm">
                Area m²
              </th>
              <th className="px-4 py-2 font-medium text-seu-caption-sm">
                Price
              </th>
              <th className="px-4 py-2 font-medium text-seu-caption-sm">
                $/m²
              </th>
              <th className="px-4 py-2 font-medium text-seu-caption-sm">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {apartments.map((apt) => (
              <tr
                key={apt.id}
                onClick={() => onApartmentClick(apt)}
                className="border-t border-secondary-black/50 hover:bg-secondary-black/20 transition-colors cursor-pointer"
              >
                <td className="px-4 py-2 text-pale-gray font-medium">
                  #{apt.apartmentNo}
                </td>
                <td className="px-4 py-2 text-pale-gray/70">
                  {apt.bedroomCount}
                </td>
                <td className="px-4 py-2 text-pale-gray/70">
                  {apt.totalSize}
                </td>
                <td className="px-4 py-2 text-pale-gray">
                  ${apt.price.toLocaleString()}
                </td>
                <td className="px-4 py-2 text-pale-gray/70">
                  ${Math.round(apt.price / apt.totalSize).toLocaleString()}
                </td>
                <td className="px-4 py-2">
                  <StatusBadge status={apt.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isExpanded && count === 0 && (
        <div className="px-4 py-4 text-seu-caption-sm text-secondary-grey/60 font-montserrat">
          No apartments on this floor
        </div>
      )}
    </div>
  );
}
