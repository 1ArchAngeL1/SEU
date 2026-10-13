'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Loader2, SearchX } from 'lucide-react';
import SearchForm from '@/components/search/SearchForm';
import { ApartmentCardGridView } from '@/components/search/ApartmentCardGridView';
import { PaginationControl } from '@/components/search/PaginationControl';
import { usePublicUnitsList } from '@/hooks/queries/use-units';
import { useActiveProjects } from '@/hooks/queries/use-projects';
import { visibleUnits } from '@/lib/visibility';
import type { UnitFilter, UnitType } from '@/model/types/api';

// 'commerce' is intentionally omitted — commercial units are hidden on the
// public search for now (no images yet). The set is sent to the backend as
// `types`, so those units never reach the page and the pagination totals match
// the grid; dropping them client-side used to leave holes in it.
const PUBLIC_UNIT_TYPES: ReadonlyArray<UnitType> = ['living', 'parking', 'storage'];

const ITEMS_PER_PAGE = 40;

function toNum(v: string | null): number | undefined {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

/**
 * A comma-separated list of counts — `?bedrooms=1,4`. A single value is still
 * a single value, so the older `?bedrooms=2` links keep working.
 */
function toNumList(v: string | null): number[] {
  if (!v) return [];
  const nums = v
    .split(',')
    .map((part) => Number(part.trim()))
    .filter((n) => Number.isFinite(n) && n >= 0);
  return [...new Set(nums)].sort((a, b) => a - b);
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  // Only the active projects — a link to a deactivated one must not resolve.
  const projectsQ = useActiveProjects();

  const urlProject = searchParams.get('project');
  // The active list has to settle before we can honour `?project=` (it may
  // point at a deactivated project) or fall back to the admin-set default.
  const ready = projectsQ.isSuccess || projectsQ.isError;
  // Every param is read from this string, so it is also the memo's dependency:
  // arriving on /search?bedrooms=2 from /search?bedrooms=1 — or stepping back
  // to it — has to rebuild the filter, not keep the one from the first render.
  const query = searchParams.toString();

  const initialFilter = useMemo<UnitFilter>(() => {
    const params = new URLSearchParams(query);
    const f: UnitFilter = { status: 'available' };
    const minSize = toNum(params.get('minSize'));
    const maxSize = toNum(params.get('maxSize'));
    const bedrooms = toNumList(params.get('bedrooms'));
    const minBedrooms = toNum(params.get('minBedrooms'));
    const maxBedrooms = toNum(params.get('maxBedrooms'));
    const studioParam = params.get('studio') === 'true';
    const typeParam = params.get('type');
    const buildingParam = params.get('building');
    if (minSize != null) f.minSize = Math.max(0, minSize);
    if (maxSize != null) f.maxSize = Math.max(0, maxSize);
    // One count stays a plain `bedrooms`; several become the exact set. Never a
    // min/max range — `1,4` would widen into "1 through 4".
    if (bedrooms.length === 1) {
      f.bedrooms = bedrooms[0];
    } else if (bedrooms.length > 1) {
      f.bedroomCounts = bedrooms;
    } else {
      if (minBedrooms != null) f.minBedrooms = minBedrooms;
      if (maxBedrooms != null) f.maxBedrooms = maxBedrooms;
    }
    if (studioParam) f.studio = true;
    // A `?type=` outside the public set (i.e. `commerce`) is ignored rather
    // than narrowing the search to units the page will not show anyway.
    if (typeParam && PUBLIC_UNIT_TYPES.includes(typeParam as UnitType)) {
      f.type = typeParam as UnitType;
    }
    const activeProjects = projectsQ.data ?? [];
    if (urlProject && activeProjects.some((p) => p.id === urlProject)) {
      f.project = urlProject;
    } else {
      // No project in the URL, or one that has since been deactivated — fall
      // back to the admin-configured default.
      const defaultProject = activeProjects.find((p) => p.isDefault);
      if (defaultProject) f.project = defaultProject.id;
    }
    if (buildingParam) f.building = buildingParam;
    return f;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, query]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-pale-gray flex items-center justify-center py-24">
        <Loader2 className="size-6 text-primary-green animate-spin" />
      </div>
    );
  }

  // Keyed on the URL so a new set of params remounts the form and the results
  // with the new filter as their initial state.
  return (
    <SearchPageContent key={query || 'all'} initialFilter={initialFilter} />
  );
}

function SearchPageContent({ initialFilter }: { initialFilter: UnitFilter }) {
  const t = useTranslations('search');

  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<UnitFilter>(initialFilter);

  // Apartments (living units) first, then parking and storage.
  // The public list: units of a deactivated unit, block or project are dropped
  // by the backend, so the pagination totals match what is on show — including
  // a hand-typed `?building=` pointing at a block the admin switched off.
  // `types` is only sent when the visitor has not picked a single type, so the
  // two filters never have to be reconciled.
  const scopedFilter = useMemo<UnitFilter>(
    () => (filter.type ? filter : { ...filter, types: [...PUBLIC_UNIT_TYPES] }),
    [filter]
  );

  const unitsQ = usePublicUnitsList(
    scopedFilter,
    { page, limit: ITEMS_PER_PAGE },
    'typePriority'
  );

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

  // Second line of defence — each unit arrives with its project and block
  // populated, flags included. Commercial units are excluded server-side by
  // `types`; the check below only catches anything that slips past it.
  const units = useMemo(
    () =>
      visibleUnits(unitsQ.data?.items ?? []).filter(
        (u) => u.type !== 'commerce'
      ),
    [unitsQ.data]
  );
  const totalPages = unitsQ.data?.pagination.totalPages ?? 1;

  return (
    <div className="min-h-screen">
      {/* Filter area — light background */}
      <div className="bg-pale-gray pt-8 lg:pt-12 pb-2">
        <div className="mx-auto">
          <h1 className="font-bodoni text-seu-heading lg:text-seu-title-xl text-dark-green mb-6 lg:mb-8 px-5 lg:px-10 max-w-[1920px] mx-auto">
            {t('chooseApartment')}
          </h1>

          <SearchForm initialFilter={initialFilter} onSearch={handleSearch} onClear={handleClear} />
        </div>
      </div>

      {/* Results area — dark background */}
      <div className="relative bg-site-bg site-noise">
        {unitsQ.isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24">
            <Loader2 className="size-6 text-primary-green animate-spin" />
            <span className="font-montserrat text-seu-body-sm text-site-fg-dim">
              {t('loading')}
            </span>
          </div>
        ) : unitsQ.isError ? (
          /* A rejected request is not an empty result — saying "nothing
             matches" would blame the filters for a failed call. */
          <div className="flex flex-col items-center justify-center gap-3 py-24 px-6 text-center">
            <span className="size-12 rounded-full bg-site-bg-hover border border-site-border-soft flex items-center justify-center">
              <SearchX className="size-5 text-site-fg-muted" />
            </span>
            <p className="font-montserrat font-medium text-seu-body text-site-fg">
              {t('loadError')}
            </p>
            <button
              type="button"
              onClick={() => unitsQ.refetch()}
              className="font-montserrat text-seu-caption text-primary-green hover:underline"
            >
              {t('retry')}
            </button>
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
  );
}
