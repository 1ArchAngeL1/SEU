'use client';

import { useState } from 'react';
import { RotateCcw, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

const ROOM_OPTIONS = [1, 2, 3, 4];

export default function HeroSearchCard() {
  const t = useTranslations('landing');
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
      <div className="w-[24rem] bg-site-bg/90 backdrop-blur-2xl border border-site-border-strong rounded-lg px-6 pt-6 pb-5 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2.5 pb-4 border-b border-site-border-soft">
          <Search
            className="size-[1.5rem] text-site-fg-muted"
            strokeWidth={1.5}
          />
          <span className="font-montserrat text-seu-body-sm text-site-fg">
            {t('findApartment')}
          </span>
        </div>

        {/* Size m² */}
        <div className="mt-5">
          <span className="font-montserrat font-medium text-seu-caption text-site-fg block mb-2.5">
            {t('sizeM2')}
          </span>
          <div className="flex items-center gap-2.5">
            <input
              type="number"
              placeholder={t('fromPlaceholder')}
              value={sizeFrom}
              onChange={(e) => setSizeFrom(e.target.value)}
              className={
                'flex-1 min-w-0 bg-site-bg-input border border-site-input-border rounded-lg px-4 py-2.5 font-montserrat text-seu-caption text-site-fg placeholder-site-fg-muted focus:outline-none focus:ring-1 focus:ring-site-border-soft transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
              }
              min={0}
            />
            <input
              type="number"
              placeholder={t('toPlaceholder')}
              value={sizeTo}
              onChange={(e) => setSizeTo(e.target.value)}
              className={
                'flex-1 min-w-0 bg-site-bg-input border border-site-input-border rounded-lg px-4 py-2.5 font-montserrat text-seu-caption text-site-fg placeholder-site-fg-muted focus:outline-none focus:ring-1 focus:ring-site-border-soft transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
              }
              min={0}
            />
          </div>
        </div>

        {/* Bedrooms */}
        <div className="mt-5">
          <span className="font-montserrat font-medium text-seu-caption text-site-fg block mb-2.5">
            {t('bedrooms')}
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
                      : 'bg-site-bg-input text-site-fg-muted hover:text-site-fg'
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
            {t('search')}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-2 font-montserrat text-seu-caption text-site-fg-muted hover:text-site-fg transition-colors"
          >
            <RotateCcw className="size-3.5" strokeWidth={2} />
            {t('clear')}
          </button>
        </div>
      </div>
    </div>
  );
}
