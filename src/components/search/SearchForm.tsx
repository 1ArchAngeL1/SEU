'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useActiveProjects } from '@/hooks/queries/use-projects';
import { useActiveBuildingsByProject } from '@/hooks/queries/use-buildings';
import type { UnitFilter } from '@/model/types/api';
import { Button } from '@/components/ui/button';
import ProjectSelect from './fields/ProjectSelect';
import BuildingSelect from './fields/BuildingSelect';
import RangeInput from './fields/RangeInput';
import RoomSelector from './fields/RoomSelector';

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
  const rooms: number[] = [];
  if (f.studio) rooms.push(0); // studio
  if (f.bedrooms != null && f.bedrooms > 0) {
    rooms.push(f.bedrooms);
  } else if (f.minBedrooms != null && f.maxBedrooms != null) {
    for (let i = f.minBedrooms; i <= f.maxBedrooms; i++) {
      if (i > 0) rooms.push(i);
    }
  }
  return rooms.filter((r) => ROOM_OPTIONS.includes(r));
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
  const [validationError, setValidationError] = useState('');

  const t = useTranslations('search');
  // Deactivated projects and blocks are not offered as filter options.
  const projectsQ = useActiveProjects();
  const buildingsQ = useActiveBuildingsByProject(project || undefined);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setValidationError('');

    const sFrom = toNum(sizeFrom);
    const sTo = toNum(sizeTo);

    if (sFrom != null && sTo != null && sFrom > sTo) {
      setValidationError(t('sizeFromError'));
      return;
    }

    const filter: UnitFilter = {
      project: project || undefined,
      building: building || undefined,
      minSize: sFrom,
      maxSize: sTo,
      status: 'available',
    };
    // "Studio" = a studio room with zero bedrooms; bedroom-count buttons (1–5)
    // filter on the number of bedrooms. Both are derived from each unit's room
    // list on the backend, and OR-ed so a mixed pick matches either.
    const studio = selectedRooms.includes(0);
    const beds = selectedRooms.filter((r) => r > 0);

    if (studio) {
      filter.studio = true;
      filter.type = 'living';
    }
    if (beds.length === 1) {
      filter.bedrooms = beds[0];
    } else if (beds.length > 1) {
      filter.minBedrooms = Math.min(...beds);
      filter.maxBedrooms = Math.max(...beds);
    }
    onSearch?.(filter);
  }

  function handleClear() {
    setProject('');
    setBuilding('');
    setSizeFrom('');
    setSizeTo('');
    setSelectedRooms([]);
    setValidationError('');
    onClear?.();
  }

  const projects = projectsQ.data ?? [];
  const buildings = buildingsQ.data;

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

      {/* Validation error */}
      {validationError && (
        <p className="font-montserrat text-seu-caption text-red mb-4">
          {validationError}
        </p>
      )}

      {/* Search + Clear */}
      <div className="flex items-center gap-6">
        <Button
          type="submit"
          style={{ color: '#ffffff' }}
          className="bg-black hover:bg-black/90 font-montserrat font-medium text-seu-caption h-10 px-8 rounded-md shadow-none"
        >
          {t('searchBtn')}
        </Button>
        <button
          type="button"
          onClick={handleClear}
          className="font-montserrat text-seu-caption text-dark-green hover:text-black transition-colors"
        >
          {t('clearFilters')}
        </button>
      </div>
    </form>
  );
}
