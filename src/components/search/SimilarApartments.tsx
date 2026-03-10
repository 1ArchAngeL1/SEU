'use client';

import { useEffect, useState } from 'react';
import ApartmentCard from '@/components/search/ApartmentCard';
import { ApartmentDTO } from '@/model/dto/apartment.dto';
import { getAllApartmentsFiltered } from '@/prisma/apartment';

interface SimilarApartmentsProps {
  buildingId?: string;
  currentApartmentId?: string;
}

export function SimilarApartments({
  buildingId,
  currentApartmentId,
}: SimilarApartmentsProps) {
  const [apartments, setApartments] = useState<ApartmentDTO[]>([]);

  useEffect(() => {
    getAllApartmentsFiltered(
      { buildingId, selectedRooms: null },
      { page: 1, pageSize: 9 }
    ).then((result) => {
      setApartments(
        result.items.filter((apt) => apt.id !== currentApartmentId).slice(0, 8)
      );
    });
  }, [buildingId, currentApartmentId]);

  if (apartments.length === 0) return null;

  return (
    <div className="mt-32 px-10 pb-20">
      <h2 className="font-[--font-bodoni] font-normal text-seu-subheading text-pale-gray mb-8">
        Similar Apartments
      </h2>

      <div className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar">
        {apartments.map((apartment) => (
          <div key={apartment.id} className="shrink-0 w-80">
            <ApartmentCard data={apartment} />
          </div>
        ))}
      </div>
    </div>
  );
}
