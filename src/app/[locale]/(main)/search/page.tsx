'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Loader2, SearchX } from 'lucide-react';
import SearchForm from '@/components/search/SearchForm';
import { ApartmentCardGridView } from '@/components/search/ApartmentCardGridView';
import { PaginationControl } from '@/components/search/PaginationControl';
import { useUnitsList } from '@/hooks/queries/use-units';
import type { UnitFilter } from '@/model/types/api';

const ITEMS_PER_PAGE = 40;

function toNum(v: string | null): number | undefined {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export default function SearchPage() {
  const t = useTranslations('search');
  const searchParams = useSearchParams();

  const initialFilter = useMemo<UnitFilter>(() => {
    const f: UnitFilter = { status: 'available' };
    const minSize = toNum(searchParams.get('minSize'));
    const maxSize = toNum(searchParams.get('maxSize'));
    const bedrooms = toNum(searchParams.get('bedrooms'));
    const minBedrooms = toNum(searchParams.get('minBedrooms'));
    const maxBedrooms = toNum(searchParams.get('maxBedrooms'));
    if (minSize != null) f.minSize = minSize;
    if (maxSize != null) f.maxSize = maxSize;
    if (bedrooms != null) f.bedrooms = bedrooms;
    if (minBedrooms != null) f.minBedrooms = minBedrooms;
    if (maxBedrooms != null) f.maxBedrooms = maxBedrooms;
    return f;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<UnitFilter>(initialFilter);

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
    <div className="bg-site-bg-alt min-h-screen pt-8 lg:pt-12">
      <div className="mx-auto">
        <h1 className="font-bodoni text-seu-heading lg:text-seu-title-xl text-site-fg mb-6 lg:mb-8 px-5 lg:px-10 max-w-[1920px] mx-auto">
          {t('apartments')}
        </h1>

        <SearchForm initialFilter={initialFilter} onSearch={handleSearch} onClear={handleClear} />

        <div className="bg-site-bg">
          {unitsQ.isLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-24">
              <Loader2 className="size-6 text-primary-orange animate-spin" />
              <span className="font-montserrat text-seu-body-sm text-site-fg-dim">
                {t('loading')}
              </span>
            </div>
          ) : units.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-24 px-6 text-center">
              <span className="size-12 rounded-full bg-site-bg-hover border border-site-border-soft flex items-center justify-center">
                <SearchX className="size-5 text-site-fg-muted" />
              </span>
              <p className="font-montserrat font-medium text-seu-body text-site-fg">
                {t('noResults')}
              </p>
              <p className="font-montserrat text-seu-caption text-site-fg-muted max-w-sm">
                {t('noResultsHint')}
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
