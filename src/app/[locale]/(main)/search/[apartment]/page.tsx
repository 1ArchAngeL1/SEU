'use client';

import { use, useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { ApartmentDetailView } from '@/components/search/ApartmentDetailView';
import { Benefits } from '@/components/search/Benefits';
import { SimilarApartments } from '@/components/search/SimilarApartments';
import { SearchContactForm } from '@/components/search/SearchContactForm';
import { getApartmentById } from '@/prisma/apartment';

export default function ApartmentDetailPage({
  params,
}: {
  params: Promise<{ apartment: string }>;
}) {
  const { apartment: id } = use(params);
  const [apartment, setApartment] = useState<Awaited<
    ReturnType<typeof getApartmentById>
  > | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getApartmentById(id)
      .then((apt) => {
        setApartment(apt);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="bg-dark-green min-h-screen flex items-center justify-center">
        <span className="font-montserrat text-seu-body text-pale-gray">
          Loading...
        </span>
      </div>
    );
  }

  if (!apartment) notFound();

  return (
    <div className="bg-dark-green min-h-screen py-10">
      <div className="flex flex-col mx-auto">
        <ApartmentDetailView
          apartment={{
            id: Number(apartment.id),
            complex: apartment.building?.project?.name ?? '',
            block: apartment.building?.block ?? '',
            floor: apartment.floor,
            apartmentNumber: apartment.apartmentNo,
            totalSize: apartment.totalSize,
            mainSize: apartment.mainSize,
            openSpace: apartment.openSpaceSize,
            rooms: apartment.bedroomCount,
            roomDetails: apartment.rooms.map((r) => ({
              name: r.roomType,
              size: r.size,
              icon: roomTypeToIcon(r.roomType),
            })),
            floorPlanImages: { plan: null, twoD: null, threeD: null },
          }}
        />
        <Benefits />
        <SimilarApartments
          buildingId={apartment.building?.id}
          currentApartmentId={apartment.id}
        />
        <SearchContactForm />
      </div>
    </div>
  );
}

function roomTypeToIcon(
  roomType: string
): 'bedroom' | 'hall' | 'balcony' | 'bathroom' | 'kitchen' | 'storage' | 'living' | 'wc' {
  const map: Record<string, ReturnType<typeof roomTypeToIcon>> = {
    BEDROOM: 'bedroom',
    LIVING_ROOM: 'living',
    KITCHEN: 'kitchen',
    BATHROOM: 'bathroom',
    BALCONY: 'balcony',
    HALLWAY: 'hall',
    STORAGE: 'storage',
  };
  return map[roomType] ?? 'bedroom';
}
