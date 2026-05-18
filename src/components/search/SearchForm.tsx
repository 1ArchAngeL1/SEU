'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAllProjects } from '@/hooks/queries/use-projects';
import { useBuildingsByProject } from '@/hooks/queries/use-buildings';
import type { UnitFilter } from '@/model/types/api';
import { Button } from '@/components/ui/button';
import ProjectSelect from './fields/ProjectSelect';
import BuildingSelect from './fields/BuildingSelect';
import RangeInput from './fields/RangeInput';
import RoomSelector from './fields/RoomSelector';
import PriceField from './fields/PriceField';

export type SearchFormProps = {
  className?: string;
  initialFilter?: UnitFilter;
  onSearch?: (filter: UnitFilter) => void;
  onClear?: () => void;
};

const ROOM_OPTIONS = [0, 1, 2, 3, 4, 5];

function toNum(v: string): number | undefined {
  const t = v.trim();
  if (!t) return undefined;
  const n = Number(t);
  return Number.isFinite(n) ? n : undefined;
}

function deriveInitialRooms(f?: UnitFilter): number[] {
  if (!f) return [];
  if (f.bedrooms != null) return [f.bedrooms];
  if (f.minBedrooms != null && f.maxBedrooms != null) {
    const rooms: number[] = [];
    for (let i = f.minBedrooms; i <= f.maxBedrooms; i++) rooms.push(i);
    return rooms.filter((r) => ROOM_OPTIONS.includes(r));
  }
  return [];
}

export default function SearchForm({
  className,
  initialFilter,
  onSearch,
  onClear,
}: SearchFormProps) {
  const [project, setProject] = useState(initialFilter?.project ?? '');
  const [building, setBuilding] = useState(initialFilter?.building ?? '');
  const [sizeFrom, setSizeFrom] = useState(initialFilter?.minSize != null ? String(initialFilter.minSize) : '');
  const [sizeTo, setSizeTo] = useState(initialFilter?.maxSize != null ? String(initialFilter.maxSize) : '');
  const [selectedRooms, setSelectedRooms] = useState<number[]>(() => deriveInitialRooms(initialFilter));
  const [currency, setCurrency] = useState<'USD' | 'GEL'>('USD');
  const [priceFrom, setPriceFrom] = useState(initialFilter?.minPrice != null ? String(initialFilter.minPrice) : '');
  const [priceTo, setPriceTo] = useState(initialFilter?.maxPrice != null ? String(initialFilter.maxPrice) : '');
  const [validationError, setValidationError] = useState('');

  const t = useTranslations('search');
  const projectsQ = useAllProjects();
  const buildingsQ = useBuildingsByProject(project || undefined);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setValidationError('');

    const sFrom = toNum(sizeFrom);
    const sTo = toNum(sizeTo);
    const pFrom = toNum(priceFrom);
    const pTo = toNum(priceTo);

    if (sFrom != null && sTo != null && sFrom > sTo) {
      setValidationError(t('sizeFromError'));
      return;
    }
    if (pFrom != null && pTo != null && pFrom > pTo) {
      setValidationError(t('priceFromError'));
      return;
    }

    const filter: UnitFilter = {
      project: project || undefined,
      building: building || undefined,
      minSize: sFrom,
      maxSize: sTo,
      minPrice: pFrom,
      maxPrice: pTo,
      status: 'available',
    };
    if (selectedRooms.length === 1) {
      filter.bedrooms = selectedRooms[0];
    } else if (selectedRooms.length > 1) {
      filter.minBedrooms = Math.min(...selectedRooms);
      filter.maxBedrooms = Math.max(...selectedRooms);
    }
    if (selectedRooms.includes(0)) {
      filter.type = 'living';
    }
    onSearch?.(filter);
  }

  function handleClear() {
    setProject('');
    setBuilding('');
    setSizeFrom('');
    setSizeTo('');
    setSelectedRooms([]);
    setCurrency('USD');
    setPriceFrom('');
    setPriceTo('');
    setValidationError('');
    onClear?.();
  }

  const projects = projectsQ.data ?? [];
  const buildings = buildingsQ.data ?? [];

  return (
    <form
      onSubmit={handleSubmit}
      data-admin-theme="light"
      className={cn(
        'px-5 sm:px-10 xl:px-16 pb-10 max-w-[1920px] mx-auto',
        className
      )}
    >
      {/* Filter header with thin divider underneath */}
      <div className="flex items-center gap-2 pb-3 mb-8 border-b border-secondary-grey/30">
        <Search className="size-4 text-secondary-grey" strokeWidth={1.5} />
        <span className="font-montserrat text-seu-caption text-secondary-grey uppercase tracking-wider">
          {t('filterApartments')}
        </span>
      </div>

      {/* Top row -- Project / Block / Size / Rooms */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-6 mb-6">
        <ProjectSelect
          value={project}
          onChange={(v) => {
            setProject(v);
            setBuilding('');
          }}
          projects={projects}
        />

        <BuildingSelect
          value={building}
          onChange={setBuilding}
          buildings={buildings}
          disabled={!project}
        />

        <RangeInput
          label={t('sizeM2')}
          from={sizeFrom}
          to={sizeTo}
          onFromChange={setSizeFrom}
          onToChange={setSizeTo}
        />

        <RoomSelector
          selected={selectedRooms}
          onChange={setSelectedRooms}
        />
      </div>

      {/* Bottom row -- Price + Search/Clear */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-6 items-start">
        <PriceField
          currency={currency}
          onCurrencyChange={setCurrency}
          from={priceFrom}
          to={priceTo}
          onFromChange={setPriceFrom}
          onToChange={setPriceTo}
          error={validationError}
        />

        {/* Search + Clear, vertically aligned with the price inputs */}
        <div className="md:col-span-2 lg:col-span-3 flex items-end h-full">
          <div className="flex items-center gap-6 pt-7">
            <Button
              type="submit"
              className="bg-primary-orange hover:bg-primary-orange/90 text-white font-montserrat font-medium text-seu-caption h-10 px-8 rounded-md shadow-none"
            >
              {t('searchBtn')}
            </Button>
            <button
              type="button"
              onClick={handleClear}
              className="font-montserrat text-seu-caption text-dark-green hover:text-primary-orange transition-colors"
            >
              {t('clearFilters')}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
