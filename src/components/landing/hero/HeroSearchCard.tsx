'use client';

import { useState } from 'react';
import { RotateCcw, Search } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

const ROOM_OPTIONS = [1, 2, 3, 4];

export default function HeroSearchCard() {
  const router = useRouter();
  const [sizeFrom, setSizeFrom] = useState('');
  const [sizeTo, setSizeTo] = useState('');
  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);

  function handleSearch() {
    const params = new URLSearchParams();
    if (sizeFrom.trim()) params.set('minSize', sizeFrom.trim());
    if (sizeTo.trim()) params.set('maxSize', sizeTo.trim());
    if (selectedRooms.length === 1) {
      params.set('bedrooms', String(selectedRooms[0]));
    } else if (selectedRooms.length > 1) {
      params.set('minBedrooms', String(Math.min(...selectedRooms)));
      params.set('maxBedrooms', String(Math.max(...selectedRooms)));
    }
    const qs = params.toString();
    router.push(qs ? `/search?${qs}` : '/search');
  }

  function handleClear() {
    setSizeFrom('');
    setSizeTo('');
    setSelectedRooms([]);
  }

  return (
    <div className="absolute right-8 lg:right-12 top-1/2 -translate-y-1/2 z-20 hidden lg:block animate-[fadeInUp_0.9s_cubic-bezier(0.16,1,0.3,1)_0.5s_both]">
      <div className="w-[24rem] bg-dark-green/90 backdrop-blur-2xl border border-secondary-grey rounded-lg px-6 pt-6 pb-5 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2.5 pb-4 border-b border-secondary-grey/20">
          <Search
            className="size-[1.5rem] text-secondary-grey"
            strokeWidth={1.5}
          />
          <span className="font-montserrat text-seu-body-sm text-pale-gray">
            Find Apartment
          </span>
        </div>

        {/* Size m² */}
        <div className="mt-5">
          <span className="font-montserrat font-medium text-seu-caption text-pale-gray block mb-2.5">
            Size m²
          </span>
          <div className="flex items-center gap-2.5">
            <input
              type="number"
              placeholder="From 0"
              value={sizeFrom}
              onChange={(e) => setSizeFrom(e.target.value)}
              className={
                'flex-1 min-w-0 bg-seu-dark-gray/90 border border-seu-dark-gray rounded-lg px-4 py-2.5 font-montserrat text-seu-caption text-pale-gray placeholder-secondary-grey/80 focus:outline-none focus:ring-1 focus:ring-secondary-grey/40 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
              }
              min={0}
            />
            <input
              type="number"
              placeholder="To 250+"
              value={sizeTo}
              onChange={(e) => setSizeTo(e.target.value)}
              className={
                'flex-1 min-w-0 bg-seu-dark-gray/90 border border-seu-dark-gray rounded-lg px-4 py-2.5 font-montserrat text-seu-caption text-pale-gray placeholder-secondary-grey/80 focus:outline-none focus:ring-1 focus:ring-secondary-grey/40 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
              }
              min={0}
            />
          </div>
        </div>

        {/* Bedrooms */}
        <div className="mt-5">
          <span className="font-montserrat font-medium text-seu-caption text-pale-gray block mb-2.5">
            Bedrooms
          </span>
          <div className="grid grid-cols-6 gap-1.5">
            {ROOM_OPTIONS.map((n) => {
              const isActive = selectedRooms.includes(n);
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() =>
                    setSelectedRooms((prev) =>
                      prev.includes(n)
                        ? prev.filter((r) => r !== n)
                        : [...prev, n]
                    )
                  }
                  className={cn(
                    'aspect-square rounded-lg font-montserrat text-seu-caption transition-colors',
                    isActive
                      ? 'bg-primary-orange text-white'
                      : 'bg-seu-dark-gray text-secondary-grey hover:text-pale-gray'
                  )}
                >
                  {n}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 mt-5">
          <button
            type="button"
            onClick={handleSearch}
            className="bg-primary-orange text-white font-montserrat font-medium text-seu-caption px-7 py-2.5 rounded-xl hover:bg-primary-orange/85 transition-colors"
          >
            Search
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-2 font-montserrat text-seu-caption text-secondary-grey hover:text-pale-gray transition-colors"
          >
            <RotateCcw className="size-3.5" strokeWidth={2} />
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
