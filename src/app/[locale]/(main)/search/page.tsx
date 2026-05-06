'use client';

import { useState } from 'react';
import { Loader2, SearchX } from 'lucide-react';
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
    <div className="bg-pale-gray min-h-screen pt-12">
      <div className="mx-auto">
        <h1 className="font-bodoni text-seu-title-xl text-dark-green mb-8 px-10 max-w-[1920px] mx-auto">
          APARTMENTS
        </h1>

        <SearchForm onSearch={handleSearch} onClear={handleClear} />

        <div className="bg-dark-green">
          {unitsQ.isLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-24">
              <Loader2 className="size-6 text-primary-orange animate-spin" />
              <span className="font-montserrat text-seu-body-sm text-pale-gray/80">
                Loading apartments…
              </span>
            </div>
          ) : units.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-24 px-6 text-center">
              <span className="size-12 rounded-full bg-pale-gray/10 border border-pale-gray/15 flex items-center justify-center">
                <SearchX className="size-5 text-secondary-grey" />
              </span>
              <p className="font-montserrat font-medium text-seu-body text-pale-gray">
                No apartments match your filters
              </p>
              <p className="font-montserrat text-seu-caption text-secondary-grey max-w-sm">
                Try widening the size or price range, or clearing some filters.
              </p>
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
