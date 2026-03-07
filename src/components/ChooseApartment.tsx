'use client';

import { useState } from 'react';
import { RotateCcw, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ApartmentFilters = {
  sizeFrom: number;
  sizeTo: number;
  bedrooms: number | null;
};

export type ChooseApartmentProps = {
  className?: string;
  onSearch?: (filters: ApartmentFilters) => void;
  onReset?: () => void;
};

const BEDROOM_OPTIONS = [1, 2, 3, 4, 5, 6];

export default function ChooseApartment({
  className,
  onSearch,
  onReset,
}: ChooseApartmentProps) {
  const [sizeFrom, setSizeFrom] = useState('0');
  const [sizeTo, setSizeTo] = useState('250');
  const [selectedBedrooms, setSelectedBedrooms] = useState<number | null>(null);

  const handleSearch = () => {
    onSearch?.({
      sizeFrom: Number(sizeFrom) || 0,
      sizeTo: Number(sizeTo) || 0,
      bedrooms: selectedBedrooms,
    });
  };

  const handleReset = () => {
    setSizeFrom('0');
    setSizeTo('250');
    setSelectedBedrooms(null);
    onReset?.();
  };

  return (
    <div
      className={cn(
        'bg-dark-green rounded-2xl p-8 max-w-xl border border-secondary-grey',
        className
      )}
    >
      <div className="flex items-center gap-3 mb-8">
        <Search className="w-6 h-6 text-pale-gray/26" />
        <h2 className="font-bodoni text-seu-subheading text-pale-gray uppercase tracking-wide">
          Choose Apartment
        </h2>
      </div>

      <div className="mb-6">
        <label className="block text-seu-body-sm text-secondary-grey mb-3">
          Size m2
        </label>
        <div className="flex gap-4">
          <div className="flex-1 flex items-center bg-pale-gray/26 border border-secondary-black rounded-xl px-4 py-3">
            <span className="text-seu-body-sm text-secondary-grey mr-2">
              From
            </span>
            <input
              type="number"
              value={sizeFrom}
              onChange={(e) => setSizeFrom(e.target.value)}
              className="w-full bg-transparent text-seu-body-sm text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              min={0}
            />
          </div>
          <div className="flex-1 flex items-center bg-pale-gray/26 border border-secondary-black rounded-xl px-4 py-3">
            <span className="text-seu-body-sm text-secondary-grey mr-2">
              To
            </span>
            <input
              type="number"
              value={sizeTo}
              onChange={(e) => setSizeTo(e.target.value)}
              className="w-full bg-transparent text-seu-body-sm text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              min={0}
            />
            {/*<span className="text-seu-body-sm text-white">+</span>*/}
          </div>
        </div>
      </div>

      {/* Bedrooms Section */}
      <div className="mb-8">
        <label className="block text-seu-body-sm text-secondary-grey mb-3">
          Bedooms
        </label>
        <div className="flex gap-3">
          {BEDROOM_OPTIONS.map((num) => (
            <button
              key={num}
              type="button"
              onClick={() =>
                setSelectedBedrooms(selectedBedrooms === num ? null : num)
              }
              className={cn(
                'w-12 h-12 rounded-lg font-montserrat text-seu-body-sm transition-colors cursor-pointer',
                selectedBedrooms === num
                  ? 'bg-primary-green text-white'
                  : 'bg-pale-gray/26 text-pale-gray hover:bg-secondary-black/80'
              )}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button
          type="button"
          onClick={handleSearch}
          className="bg-primary-green text-white font-montserrat font-medium text-seu-body px-10 py-3 rounded-xl hover:bg-primary-green/85 transition-colors"
        >
          Search
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-2 text-pale-gray font-montserrat text-seu-body-sm hover:text-white transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          Reset
        </button>
      </div>
    </div>
  );
}
