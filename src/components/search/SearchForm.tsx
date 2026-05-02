'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAllProjects } from '@/hooks/queries/use-projects';
import { useBuildingsByProject } from '@/hooks/queries/use-buildings';
import { pickLocale } from '@/lib/i18n-helpers';
import type { UnitFilter } from '@/model/types/api';

export type SearchFormProps = {
  className?: string;
  onSearch?: (filter: UnitFilter) => void;
  onClear?: () => void;
};

const ROOM_OPTIONS = [1, 2, 3, 4, 5];

function toNum(v: string): number | undefined {
  const t = v.trim();
  if (!t) return undefined;
  const n = Number(t);
  return Number.isFinite(n) ? n : undefined;
}

export default function SearchForm({
  className,
  onSearch,
  onClear,
}: SearchFormProps) {
  const [project, setProject] = useState('');
  const [building, setBuilding] = useState('');
  const [sizeFrom, setSizeFrom] = useState('');
  const [sizeTo, setSizeTo] = useState('');
  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
  const [currency, setCurrency] = useState<'USD' | 'GEL'>('USD');
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const [validationError, setValidationError] = useState('');

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
      setValidationError('Size "from" must be ≤ "to"');
      return;
    }
    if (pFrom != null && pTo != null && pFrom > pTo) {
      setValidationError('Price "from" must be ≤ "to"');
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
      className={cn('p-8 xl:p-16 pb-14 max-w-[1920px] mx-auto', className)}
    >
      <div className="flex items-center gap-2 mb-12">
        <Search className="w-4 h-4 text-secondary-grey" />
        <span className="font-montserrat text-seu-caption text-secondary-grey uppercase tracking-wider">
          Filter Apartments
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6 mb-6">
        <div>
          <label className="block font-montserrat text-seu-caption text-dark-green mb-2">
            Project
          </label>
          <select
            value={project}
            onChange={(e) => {
              setProject(e.target.value);
              setBuilding('');
            }}
            className="w-full h-10 bg-pale-gray/10 border border-secondary-grey rounded-xl px-4 font-montserrat text-seu-body-sm text-secondary-grey focus:outline-none focus:border-dark-green appearance-none cursor-pointer"
          >
            <option value="">Choose</option>
            {projects.map((p) => (
              <option value={p.id} key={p.id}>
                {pickLocale(p.name)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-montserrat text-seu-caption text-dark-green mb-2">
            Block
          </label>
          <select
            value={building}
            onChange={(e) => setBuilding(e.target.value)}
            disabled={!project}
            className="w-full h-10 bg-pale-gray/10 border border-secondary-grey rounded-xl px-4 font-montserrat text-seu-body-sm text-secondary-grey focus:outline-none focus:border-dark-green appearance-none cursor-pointer disabled:opacity-50"
          >
            <option value="">Choose</option>
            {buildings.map((b) => (
              <option value={b.id} key={b.id}>
                Block {b.block}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-montserrat text-seu-caption text-dark-green mb-2">
            Size m2
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={sizeFrom}
              onChange={(e) => setSizeFrom(e.target.value)}
              placeholder="From"
              className="w-1/2 h-10 bg-pale-gray/10 border border-secondary-grey rounded-xl px-4 font-montserrat text-seu-body-sm text-dark-green placeholder:text-secondary-grey focus:outline-none focus:border-dark-green"
            />
            <input
              type="text"
              value={sizeTo}
              onChange={(e) => setSizeTo(e.target.value)}
              placeholder="To"
              className="w-1/2 h-10 bg-pale-gray/10 border border-secondary-grey rounded-xl px-4 font-montserrat text-seu-body-sm text-dark-green placeholder:text-secondary-grey focus:outline-none focus:border-dark-green"
            />
          </div>
        </div>

        <div>
          <label className="block font-montserrat text-seu-caption text-dark-green mb-2">
            Rooms
          </label>
          <div className="flex gap-2">
            {ROOM_OPTIONS.map((num) => (
              <button
                key={num}
                type="button"
                onClick={() =>
                  setSelectedRooms((prev) =>
                    prev.includes(num)
                      ? prev.filter((r) => r !== num)
                      : [...prev, num]
                  )
                }
                className={cn(
                  'w-10 h-10 border rounded-xl font-montserrat text-seu-body-sm transition-colors cursor-pointer',
                  selectedRooms.includes(num)
                    ? 'bg-dark-green text-white border-dark-green'
                    : 'bg-pale-gray/10 text-dark-green border-secondary-grey hover:border-dark-green'
                )}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-x-8 gap-y-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <label className="font-montserrat text-seu-caption text-dark-green">
              Price
            </label>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={cn(
                  'px-3 py-1 font-montserrat text-seu-caption transition-colors',
                  currency === 'USD'
                    ? 'bg-primary-green text-white rounded-full'
                    : 'text-secondary-grey hover:text-dark-green'
                )}
              >
                USD
              </button>
              <button
                type="button"
                onClick={() => setCurrency('GEL')}
                className={cn(
                  'px-3 py-1 font-montserrat text-seu-caption transition-colors',
                  currency === 'GEL'
                    ? 'bg-primary-green text-white rounded-full'
                    : 'text-secondary-grey hover:text-dark-green'
                )}
              >
                GEL
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={priceFrom}
              onChange={(e) => setPriceFrom(e.target.value)}
              placeholder="From"
              className="w-24 h-10 bg-pale-gray/10 border border-secondary-grey rounded-xl px-4 font-montserrat text-seu-body-sm text-dark-green placeholder:text-secondary-grey focus:outline-none focus:border-dark-green"
            />
            <input
              type="text"
              value={priceTo}
              onChange={(e) => setPriceTo(e.target.value)}
              placeholder="To"
              className="w-24 h-10 bg-pale-gray/10 border border-secondary-grey rounded-xl px-4 font-montserrat text-seu-body-sm text-dark-green placeholder:text-secondary-grey focus:outline-none focus:border-dark-green"
            />
          </div>
          {validationError && (
            <p className="mt-2 font-montserrat text-seu-caption-sm text-red">
              {validationError}
            </p>
          )}
        </div>

        <div className="flex items-center gap-6">
          <button
            type="submit"
            className="bg-primary-green text-white font-montserrat font-medium text-seu-body px-8 h-11 rounded-lg hover:bg-primary-green/90 transition-colors"
          >
            Search
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="font-montserrat text-seu-body-sm text-secondary-grey hover:text-dark-green transition-colors"
          >
            Clear filters
          </button>
        </div>
      </div>
    </form>
  );
}
