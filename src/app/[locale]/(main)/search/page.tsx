'use client';

import { useState } from 'react';
import SearchForm from '@/components/search/SearchForm';
import { ApartmentCardGridView } from '@/components/search/ApartmentCardGridView';
import { PaginationControl } from '@/components/search/PaginationControl';
import { DUMMY_APARTMENTS } from '@/components/search/dummyApartments';

const ITEMS_PER_PAGE = 40;

export default function SearchPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(DUMMY_APARTMENTS.length / ITEMS_PER_PAGE);
  const pagedData = DUMMY_APARTMENTS.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  function handlePageChange(page: number) {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="bg-pale-gray min-h-screen pt-20 pb-40">
      <div className="mx-auto">
        <h1 className="font-bodoni text-seu-title-xl text-dark-green mb-8 px-10 max-w-[1920px] mx-auto">
          APARTMENTS.
        </h1>

        <SearchForm />

        <div className={'bg-dark-green'}>
          <ApartmentCardGridView data={pagedData} />
          <PaginationControl
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
