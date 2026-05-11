'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

type ViewMode = '3D' | '2D' | 'Plan';

interface ApartmentFloorPlanProps {
  floorPlanImages: {
    plan: string | null;
    twoD: string | null;
    threeD: string | null;
  };
  apartmentNumber: string | number;
  complex: string;
  block: string;
}

function CompassRose() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" className="flex-shrink-0">
      <circle cx="22" cy="22" r="20" fill="none" stroke="#ccc" strokeWidth="1" />
      <polygon points="22,5 19,22 25,22" fill="#E84B3A" />
      <polygon points="22,39 19,22 25,22" fill="#bbb" />
      <text
        x="22"
        y="4.5"
        textAnchor="middle"
        fill="#888"
        fontSize="7"
        fontFamily="sans-serif"
        fontWeight="600"
      >
        N
      </text>
      <text x="22" y="43" textAnchor="middle" fill="#888" fontSize="7">
        S
      </text>
      <text x="2.5" y="24" textAnchor="middle" fill="#888" fontSize="7">
        W
      </text>
      <text x="41.5" y="24" textAnchor="middle" fill="#888" fontSize="7">
        E
      </text>
    </svg>
  );
}

export function ApartmentFloorPlan({
  floorPlanImages,
  apartmentNumber,
  complex,
  block,
}: ApartmentFloorPlanProps) {
  const t = useTranslations('search');
  const [viewMode, setViewMode] = useState<ViewMode>('Plan');

  const floorPlanSrc =
    viewMode === 'Plan'
      ? floorPlanImages.plan
      : viewMode === '2D'
        ? floorPlanImages.twoD
        : floorPlanImages.threeD;

  return (
    <div className="flex-1 bg-white rounded-2xl overflow-hidden flex flex-col min-h-[400px] lg:min-h-[640px] shadow-sm">
      {/* Tabs + Compass */}
      <div className="flex items-center justify-between px-6 py-5">
        <div className="flex gap-2">
          {(['3D', '2D', 'Plan'] as ViewMode[]).map((mode) => {
            const active = viewMode === mode;
            return (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={cn(
                  'px-4 lg:px-6 h-9 rounded-lg font-montserrat text-seu-caption lg:text-seu-body-sm transition-colors border',
                  active
                    ? 'bg-dark-green text-white border-dark-green'
                    : 'bg-transparent text-dark-green border-secondary-grey/50 hover:bg-pale-gray/40 hover:border-dark-green/40'
                )}
              >
                {mode}
              </button>
            );
          })}
        </div>

        <CompassRose />
      </div>

      {/* Floor plan area */}
      <div className="flex-1 flex items-center justify-center p-8">
        {floorPlanSrc ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={floorPlanSrc}
            alt={`${viewMode} floor plan — Apt ${apartmentNumber}`}
            className="max-h-[480px] object-contain"
          />
        ) : (
          <div className="w-full h-full min-h-[480px] border-2 border-dashed border-secondary-grey/25 rounded-xl flex flex-col items-center justify-center gap-3">
            <FileText className="w-10 h-10 text-secondary-grey/30" />
            <p className="font-montserrat text-seu-body-sm text-secondary-grey/40">
              {viewMode} {t('floorPlan')}
            </p>
            <p className="font-montserrat text-seu-caption-sm text-secondary-grey/30">
              {complex} · {t('block')} {block} · Apt {apartmentNumber}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
