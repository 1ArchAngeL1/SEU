'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAllProjects } from '@/hooks/queries/use-projects';
import { useBuildingsByProject } from '@/hooks/queries/use-buildings';
import { pickLocale } from '@/lib/i18n-helpers';
import type { UnitFilter } from '@/model/types/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type SearchFormProps = {
  className?: string;
  onSearch?: (filter: UnitFilter) => void;
  onClear?: () => void;
};

const ROOM_OPTIONS = [1, 2, 3, 4, 5];
const ANY_PROJECT = '__any_project__';
const ANY_BUILDING = '__any_building__';

function toNum(v: string): number | undefined {
  const t = v.trim();
  if (!t) return undefined;
  const n = Number(t);
  return Number.isFinite(n) ? n : undefined;
}

const labelClass =
  'font-montserrat text-seu-caption-sm text-dark-green mb-2 block';
const fieldClass =
  'h-10 rounded-md bg-transparent border border-secondary-grey/50 text-dark-green placeholder:text-secondary-grey/70 shadow-none font-montserrat text-seu-caption hover:border-dark-green/50 focus-visible:border-dark-green focus-visible:ring-0';
const triggerClass =
  'h-10 rounded-md bg-transparent border border-secondary-grey/50 text-dark-green shadow-none font-montserrat text-seu-caption hover:bg-transparent hover:border-dark-green/50 focus-visible:border-dark-green focus-visible:ring-0 data-[state=open]:border-dark-green data-[state=open]:ring-0 data-[placeholder]:text-secondary-grey/70';
const contentClass =
  'bg-white text-dark-green border-secondary-grey/40 backdrop-blur-none shadow-lg shadow-black/10';
const itemClass =
  'text-dark-green data-[highlighted]:bg-pale-gray data-[highlighted]:text-dark-green data-[state=checked]:bg-primary-orange/10 data-[state=checked]:text-dark-green';

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
      data-admin-theme="light"
      className={cn(
        'px-6 sm:px-10 xl:px-16 pb-10 max-w-[1920px] mx-auto',
        className
      )}
    >
      {/* Filter header with thin divider underneath */}
      <div className="flex items-center gap-2 pb-3 mb-8 border-b border-secondary-grey/30">
        <Search className="size-4 text-secondary-grey" strokeWidth={1.5} />
        <span className="font-montserrat text-seu-caption text-secondary-grey uppercase tracking-wider">
          Filter Apartments
        </span>
      </div>

      {/* Top row — Project / Block / Size / Rooms */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-6 mb-6">
        <div>
          <Label className={labelClass}>Project</Label>
          <Select
            value={project || ANY_PROJECT}
            onValueChange={(v) => {
              setProject(v === ANY_PROJECT ? '' : v);
              setBuilding('');
            }}
          >
            <SelectTrigger className={triggerClass}>
              <SelectValue placeholder="Choose" />
            </SelectTrigger>
            <SelectContent className={contentClass}>
              <SelectItem value={ANY_PROJECT} className={itemClass}>
                Any project
              </SelectItem>
              {projects.map((p) => (
                <SelectItem
                  value={p.id}
                  key={p.id}
                  className={itemClass}
                >
                  {pickLocale(p.name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className={labelClass}>Block</Label>
          <Select
            value={building || ANY_BUILDING}
            onValueChange={(v) =>
              setBuilding(v === ANY_BUILDING ? '' : v)
            }
            disabled={!project}
          >
            <SelectTrigger className={triggerClass}>
              <SelectValue placeholder="Choose" />
            </SelectTrigger>
            <SelectContent className={contentClass}>
              <SelectItem value={ANY_BUILDING} className={itemClass}>
                Any block
              </SelectItem>
              {buildings.map((b) => (
                <SelectItem
                  value={b.id}
                  key={b.id}
                  className={itemClass}
                >
                  Block {b.block}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className={labelClass}>Size m2</Label>
          <div className="flex gap-3">
            <Input
              type="number"
              min={0}
              inputMode="numeric"
              value={sizeFrom}
              onChange={(e) => setSizeFrom(e.target.value)}
              placeholder="From"
              className={fieldClass}
            />
            <Input
              type="number"
              min={0}
              inputMode="numeric"
              value={sizeTo}
              onChange={(e) => setSizeTo(e.target.value)}
              placeholder="To"
              className={fieldClass}
            />
          </div>
        </div>

        <div>
          <Label className={labelClass}>Rooms</Label>
          <div className="flex gap-2">
            {ROOM_OPTIONS.map((num) => {
              const active = selectedRooms.includes(num);
              return (
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
                    'size-10 rounded-md font-montserrat text-seu-caption transition-colors border',
                    active
                      ? 'bg-dark-green text-white border-dark-green'
                      : 'bg-transparent text-dark-green border-secondary-grey/50 hover:border-dark-green'
                  )}
                >
                  {num}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom row — Price + Search/Clear */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-6 items-start">
        {/* Price field */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="font-montserrat text-seu-caption-sm text-dark-green">
              Price
            </span>
            <div className="inline-flex items-center gap-1">
              {(['USD', 'GEL'] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCurrency(c)}
                  className={cn(
                    'px-2.5 py-0.5 rounded-md font-montserrat text-[0.7rem] font-medium transition-colors',
                    currency === c
                      ? 'bg-primary-orange text-white'
                      : 'text-secondary-grey hover:text-dark-green'
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <Input
              type="number"
              min={0}
              inputMode="numeric"
              value={priceFrom}
              onChange={(e) => setPriceFrom(e.target.value)}
              placeholder="From"
              className={fieldClass}
            />
            <Input
              type="number"
              min={0}
              inputMode="numeric"
              value={priceTo}
              onChange={(e) => setPriceTo(e.target.value)}
              placeholder="To"
              className={fieldClass}
            />
          </div>
          {validationError && (
            <p className="mt-2 font-montserrat text-seu-caption-sm text-red">
              {validationError}
            </p>
          )}
        </div>

        {/* Search + Clear, vertically aligned with the price inputs */}
        <div className="md:col-span-2 lg:col-span-3 flex items-end h-full">
          <div className="flex items-center gap-6 pt-7">
            <Button
              type="submit"
              className="bg-primary-orange hover:bg-primary-orange/90 text-white font-montserrat font-medium text-seu-caption h-10 px-8 rounded-md shadow-none"
            >
              Search
            </Button>
            <button
              type="button"
              onClick={handleClear}
              className="font-montserrat text-seu-caption text-dark-green hover:text-primary-orange transition-colors"
            >
              Clear filters
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
