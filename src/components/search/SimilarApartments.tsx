'use client';

import ApartmentCard from '@/components/search/ApartmentCard';
import { useUnitsList } from '@/hooks/queries/use-units';

interface SimilarApartmentsProps {
  buildingId?: string;
  currentApartmentId?: string;
}

export function SimilarApartments({
  buildingId,
  currentApartmentId,
}: SimilarApartmentsProps) {
  const unitsQ = useUnitsList(
    { building: buildingId, status: 'available' },
    { page: 1, limit: 9 }
  );

  const apartments = (unitsQ.data?.items ?? [])
    .filter((u) => u.id !== currentApartmentId)
    .slice(0, 8);

  if (!buildingId || apartments.length === 0) return null;

  return (
    <div className="mt-16 lg:mt-32 px-5 lg:px-10 pb-12 lg:pb-20">
      <h2 className="font-[--font-bodoni] font-normal text-seu-subheading text-pale-gray mb-8">
        Similar Apartments
      </h2>

      <div className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar">
        {apartments.map((apartment) => (
          <div key={apartment.id} className="shrink-0 w-64 lg:w-80">
            <ApartmentCard data={apartment} />
          </div>
        ))}
      </div>
    </div>
  );
}
