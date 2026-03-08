'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { apartmentSearchSchema, ApartmentSearchFilters } from '@/lib/schemas/apartmentSearch';

export type SearchFormProps = {
  className?: string;
  onSubmit?: (filters: ApartmentSearchFilters) => void;
  onClear?: () => void;
  errors?: Partial<Record<keyof ApartmentSearchFilters, string>>;
};

const ROOM_OPTIONS = [1, 2, 3, 4, 5];

export default function SearchForm({
  className,
  onSubmit,
  onClear,
}: SearchFormProps) {
  const [project, setProject] = useState('');
  const [block, setBlock] = useState('');
  const [sizeFrom, setSizeFrom] = useState('');
  const [sizeTo, setSizeTo] = useState('');
  const [selectedRooms, setSelectedRooms] = useState<number | null>(null);
  const [currency, setCurrency] = useState<'USD' | 'GEL'>('USD');
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const [validationErrors, setValidationErrors] = useState<Partial<Record<string, string>>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = apartmentSearchSchema.safeParse({
      project,
      block,
      sizeFrom,
      sizeTo,
      rooms: selectedRooms,
      currency,
      priceFrom,
      priceTo,
    });
    if (!result.success) {
      const flat = result.error.flatten().fieldErrors;
      setValidationErrors(
        Object.fromEntries(
          Object.entries(flat).map(([k, msgs]) => [k, msgs?.[0] ?? ''])
        )
      );
      return;
    }
    setValidationErrors({});
    onSubmit?.(result.data);
  };

  const handleClear = () => {
    setProject('');
    setBlock('');
    setSizeFrom('');
    setSizeTo('');
    setSelectedRooms(null);
    setCurrency('USD');
    setPriceFrom('');
    setPriceTo('');
    onClear?.();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('p-8 xl:p-16 pb-14 max-w-[1920px] mx-auto', className)}
    >
      {/* Filter Label */}
      <div className="flex items-center gap-2 mb-12">
        <Search className="w-4 h-4 text-secondary-grey" />
        <span className="font-montserrat text-seu-caption text-secondary-grey uppercase tracking-wider">
          Filter Apartments
        </span>
      </div>

      {/* Filter Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6 mb-6">
        {/* Project */}
        <div>
          <label className="block font-montserrat text-seu-caption text-dark-green mb-2">
            Project
          </label>
          <select
            value={project}
            onChange={(e) => setProject(e.target.value)}
            className="w-full h-10 bg-pale-gray/10 border border-secondary-grey rounded-xl px-4 font-montserrat text-seu-body-sm text-secondary-grey focus:outline-none focus:border-dark-green appearance-none cursor-pointer"
          >
            <option value="">Choose</option>
            <option value="project1">Project 1</option>
            <option value="project2">Project 2</option>
          </select>
        </div>

        {/* Block */}
        <div>
          <label className="block font-montserrat text-seu-caption text-dark-green mb-2">
            Block
          </label>
          <select
            value={block}
            onChange={(e) => setBlock(e.target.value)}
            className="w-full h-10 bg-pale-gray/10 border border-secondary-grey rounded-xl px-4 font-montserrat text-seu-body-sm text-secondary-grey focus:outline-none focus:border-dark-green appearance-none cursor-pointer"
          >
            <option value="">Choose</option>
            <option value="A">Block A</option>
            <option value="B">Block B</option>
          </select>
        </div>

        {/* Size m2 */}
        <div>
          <label className="block font-montserrat text-seu-caption text-dark-green mb-2">
            Size m2
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={sizeFrom}
              onChange={(e) => { setSizeFrom(e.target.value); setValidationErrors((p) => ({ ...p, sizeFrom: undefined })); }}
              placeholder="From"
              className={cn(
                'w-1/2 h-10 bg-pale-gray/10 border rounded-xl px-4 font-montserrat text-seu-body-sm text-dark-green placeholder:text-secondary-grey focus:outline-none',
                validationErrors.sizeFrom ? 'border-red' : 'border-secondary-grey focus:border-dark-green'
              )}
            />
            <input
              type="text"
              value={sizeTo}
              onChange={(e) => { setSizeTo(e.target.value); setValidationErrors((p) => ({ ...p, sizeTo: undefined })); }}
              placeholder="To"
              className={cn(
                'w-1/2 h-10 bg-pale-gray/10 border rounded-xl px-4 font-montserrat text-seu-body-sm text-dark-green placeholder:text-secondary-grey focus:outline-none',
                validationErrors.sizeTo ? 'border-red' : 'border-secondary-grey focus:border-dark-green'
              )}
            />
          </div>
          {validationErrors.sizeFrom && (
            <p className="mt-1 font-montserrat text-seu-caption-sm text-red">{validationErrors.sizeFrom}</p>
          )}
        </div>

        {/* Rooms */}
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
                  setSelectedRooms(selectedRooms === num ? null : num)
                }
                className={cn(
                  'w-10 h-10 border rounded-xl font-montserrat text-seu-body-sm transition-colors cursor-pointer',
                  selectedRooms === num
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

      {/* Price Row */}
      <div className="flex flex-wrap items-end gap-x-8 gap-y-4 mb-8">
        {/* Price */}
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
              onChange={(e) => { setPriceFrom(e.target.value); setValidationErrors((p) => ({ ...p, priceFrom: undefined })); }}
              placeholder="From"
              className={cn(
                'w-24 h-10 bg-pale-gray/10 border rounded-xl px-4 font-montserrat text-seu-body-sm text-dark-green placeholder:text-secondary-grey focus:outline-none',
                validationErrors.priceFrom ? 'border-red' : 'border-secondary-grey focus:border-dark-green'
              )}
            />
            <input
              type="text"
              value={priceTo}
              onChange={(e) => { setPriceTo(e.target.value); setValidationErrors((p) => ({ ...p, priceTo: undefined })); }}
              placeholder="To"
              className={cn(
                'w-24 h-10 bg-pale-gray/10 border rounded-xl px-4 font-montserrat text-seu-body-sm text-dark-green placeholder:text-secondary-grey focus:outline-none',
                validationErrors.priceTo ? 'border-red' : 'border-secondary-grey focus:border-dark-green'
              )}
            />
          </div>
          {validationErrors.priceFrom && (
            <p className="mt-1 font-montserrat text-seu-caption-sm text-red">{validationErrors.priceFrom}</p>
          )}
        </div>

        {/* Actions */}
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
