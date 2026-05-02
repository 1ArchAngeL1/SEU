'use client';

import { useState } from 'react';
import SearchForm from '@/components/search/SearchForm';
import { ApartmentCardGridView } from '@/components/search/ApartmentCardGridView';
import { PaginationControl } from '@/components/search/PaginationControl';
import { useUnitsList } from '@/hooks/queries/use-units';
import type { UnitFilter } from '@/model/types/api';

const ITEMS_PER_PAGE = 40;

export default function SearchPage() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<UnitFilter>({ status: 'available' });

  const unitsQ = useUnitsList(filter, { page, limit: ITEMS_PER_PAGE });

  function handleSearch(next: UnitFilter) {
    setFilter(next);
    setPage(1);
  }

  function handleClear() {
    setFilter({ status: 'available' });
    setPage(1);
  }

  function handlePageChange(p: number) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const units = unitsQ.data?.items ?? [];
  const totalPages = unitsQ.data?.pagination.totalPages ?? 1;

  return (
    <div className="bg-pale-gray min-h-screen pt-20 pb-40">
      <div className="mx-auto">
        <h1 className="font-bodoni text-seu-title-xl text-dark-green mb-8 px-10 max-w-[1920px] mx-auto">
          APARTMENTS.
        </h1>

        <SearchForm onSearch={handleSearch} onClear={handleClear} />

        <div className="bg-dark-green">
          {unitsQ.isLoading ? (
            <div className="flex items-center justify-center py-20">
              <span className="font-montserrat text-seu-body text-pale-gray">
                Loading apartments…
              </span>
            </div>
          ) : units.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <span className="font-montserrat text-seu-body text-secondary-grey">
                No apartments found
              </span>
            </div>
          ) : (
            <ApartmentCardGridView data={units} />
          )}
          <PaginationControl
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
