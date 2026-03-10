'use client';

import { useEffect, useState, useCallback } from 'react';
import SearchForm from '@/components/search/SearchForm';
import { ApartmentCardGridView } from '@/components/search/ApartmentCardGridView';
import { PaginationControl } from '@/components/search/PaginationControl';
import { getAllApartmentsFiltered } from '@/prisma/apartment';
import { ApartmentDTO, ApartmentFilterDTO } from '@/model/dto/apartment.dto';

const ITEMS_PER_PAGE = 40;

export default function SearchPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [apartments, setApartments] = useState<ApartmentDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<ApartmentFilterDTO>({
    selectedRooms: null,
  });

  const fetchApartments = useCallback(
    async (filter: ApartmentFilterDTO, page: number) => {
      setLoading(true);
      try {
        const result = await getAllApartmentsFiltered(filter, {
          page,
          pageSize: ITEMS_PER_PAGE,
        });
        setApartments(result.items);
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error('Failed to fetch apartments:', error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchApartments(activeFilter, currentPage);
  }, [activeFilter, currentPage, fetchApartments]);

  function handleSearch(filter: ApartmentFilterDTO) {
    setActiveFilter(filter);
    setCurrentPage(1);
  }

  function handleClear() {
    setActiveFilter({ selectedRooms: null });
    setCurrentPage(1);
  }

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

        <SearchForm onSearch={handleSearch} onClear={handleClear} />

        <div className="bg-dark-green">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <span className="font-montserrat text-seu-body text-pale-gray">
                Loading apartments...
              </span>
            </div>
          ) : apartments.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <span className="font-montserrat text-seu-body text-secondary-grey">
                No apartments found
              </span>
            </div>
          ) : (
            <ApartmentCardGridView data={apartments} />
          )}
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
