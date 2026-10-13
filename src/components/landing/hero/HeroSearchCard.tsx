'use client';

import { useState } from 'react';
import { RotateCcw, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

const ROOM_OPTIONS = [0, 1, 2, 3, 4];

export default function HeroSearchCard() {
  const t = useTranslations('landing');
  const router = useRouter();
  const [sizeFrom, setSizeFrom] = useState('');
  const [sizeTo, setSizeTo] = useState('');
  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);

  function handleSearch() {
    const params = new URLSearchParams();
    // Clamped at zero — the backend rejects a negative size with a 400, and
    // `<input type="number" min={0}>` does not stop a typed `-5`.
    const size = (v: string): string | null => {
      const n = Number(v.trim());
      return v.trim() && Number.isFinite(n) ? String(Math.max(0, n)) : null;
    };
    const from = size(sizeFrom);
    const to = size(sizeTo);
    if (from) params.set('minSize', from);
    if (to) params.set('maxSize', to);

    // The studio button is its own filter — a studio is a studio room with
    // zero bedrooms, which `bedrooms=0` does not say: that also matches every
    // unit whose layout was imported without rooms.
    if (selectedRooms.includes(0)) {
      params.set('studio', 'true');
      params.set('type', 'living');
    }
    // The remaining buttons go over as the exact set they are. A min/max pair
    // would widen a pick of 1 and 4 into "1 through 4" and bring back the 2-
    // and 3-bedroom apartments as well.
    const beds = selectedRooms.filter((n) => n > 0).sort((a, b) => a - b);
    if (beds.length) params.set('bedrooms', beds.join(','));

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
      <div className="w-[24rem] bg-dark-green/95 backdrop-blur-2xl border border-pale-gray/15 rounded-xl px-6 pt-6 pb-5 flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
        {/* Header */}
        <div className="flex items-center gap-2.5 pb-4 border-b border-white/10">
          <Search className="size-6 text-secondary-grey" strokeWidth={1.5} />
          <span className="font-montserrat text-seu-body-sm text-pale-gray">
            {t('findApartment')}
          </span>
        </div>

        {/* Size m² */}
        <div className="mt-5">
          <span className="font-montserrat font-medium text-seu-caption text-pale-gray block mb-2.5">
            {t('sizeM2')}
          </span>
          <div className="flex items-center gap-2.5">
            <input
              type="number"
              placeholder={t('fromPlaceholder')}
              value={sizeFrom}
              onChange={(e) => setSizeFrom(e.target.value)}
              className={
                'flex-1 min-w-0 bg-white/8 border border-white/10 rounded-lg px-4 py-2.5 font-montserrat text-seu-caption text-pale-gray placeholder-secondary-grey focus:outline-none focus:ring-1 focus:ring-white/15 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
              }
              min={0}
            />
            <input
              type="number"
              placeholder={t('toPlaceholder')}
              value={sizeTo}
              onChange={(e) => setSizeTo(e.target.value)}
              className={
                'flex-1 min-w-0 bg-white/8 border border-white/10 rounded-lg px-4 py-2.5 font-montserrat text-seu-caption text-pale-gray placeholder-secondary-grey focus:outline-none focus:ring-1 focus:ring-white/15 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
              }
              min={0}
            />
          </div>
        </div>

        {/* Bedrooms */}
        <div className="mt-5">
          <span className="font-montserrat font-medium text-seu-caption text-pale-gray block mb-2.5">
            {t('bedrooms')}
          </span>
          <div className="grid grid-cols-6 gap-1.5">
            {ROOM_OPTIONS.map((n) => {
              const isActive = selectedRooms.includes(n);
              const isStudio = n === 0;
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
                    'rounded-lg font-montserrat text-seu-caption transition-colors',
                    isStudio ? 'col-span-2 h-full' : 'aspect-square',
                    isActive
                      ? 'bg-primary-green text-white'
                      : 'bg-white/8 text-secondary-grey hover:text-pale-gray'
                  )}
                >
                  {isStudio ? t('studio') : n}
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
            className="bg-primary-green text-white font-montserrat font-medium text-seu-caption px-7 py-2.5 rounded-xl hover:bg-primary-green/85 transition-colors"
          >
            {t('search')}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-2 font-montserrat text-seu-caption text-secondary-grey hover:text-pale-gray transition-colors"
          >
            <RotateCcw className="size-3.5" strokeWidth={2} />
            {t('clear')}
          </button>
        </div>
      </div>
    </div>
  );
}
