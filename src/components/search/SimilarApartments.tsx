'use client';

import ApartmentCard from '@/components/search/ApartmentCard';
import { DUMMY_APARTMENTS } from '@/components/search/dummyApartments';

interface SimilarApartmentsProps {
  currentApartmentId?: number;
}

export function SimilarApartments({
  currentApartmentId,
}: SimilarApartmentsProps) {
  // Get similar apartments (exclude current one, take first 8)
  const similarApartments = DUMMY_APARTMENTS.filter(
    (apt) => apt.id !== currentApartmentId
  ).slice(0, 8);

  return (
    <div className="mt-32 px-10 pb-20">
      {/* Heading */}
      <h2 className="font-[--font-bodoni] font-normal text-seu-subheading text-pale-gray mb-8">
        Similar Apartments
      </h2>

      <div className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar">
        {similarApartments.map((apartment) => (
          <div key={apartment.id} className="shrink-0 w-80">
            <ApartmentCard data={apartment} />
          </div>
        ))}
      </div>
    </div>
  );
}
