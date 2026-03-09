'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import { DUMMY_APARTMENTS } from '@/components/search/dummyApartments';
import { ApartmentDetailView } from '@/components/search/ApartmentDetailView';
import { Benefits } from '@/components/search/Benefits';
import { SimilarApartments } from '@/components/search/SimilarApartments';
import { SearchContactForm } from '@/components/search/SearchContactForm';

export default function ApartmentDetailPage({
  params,
}: {
  params: Promise<{ apartment: string }>;
}) {
  const { apartment: id } = use(params);

  const apartment = DUMMY_APARTMENTS.find((a) => a.id === Number(id));
  if (!apartment) notFound();

  return (
    <div className="bg-dark-green min-h-screen py-10">
      <div className="flex flex-col mx-auto">
        <ApartmentDetailView apartment={apartment} />
        <Benefits />
        <SimilarApartments currentApartmentId={apartment.id} />
        <SearchContactForm />
      </div>
    </div>
  );
}
