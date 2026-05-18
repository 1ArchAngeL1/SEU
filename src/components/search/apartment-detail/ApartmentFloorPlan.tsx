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
    <div className="flex-1 bg-white rounded-2xl overflow-hidden flex flex-col min-h-[400px] lg:min-h-[640px] shadow-site">
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
                    : 'bg-transparent text-dark-green border-dark-green/30 hover:bg-dark-green/5 hover:border-dark-green/60'
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
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={floorPlanSrc}
              alt={`${viewMode} floor plan — Apt ${apartmentNumber}`}
              className="max-h-[480px] object-contain"
            />
            {/* Soft edge fade into background */}
            <div className="site-vignette absolute inset-0 shadow-[inset_0_0_30px_12px_#ffffff]" />
          </div>
        ) : (
          <div className="w-full h-full min-h-[480px] border-2 border-dashed border-site-border-soft rounded-xl flex flex-col items-center justify-center gap-3">
            <FileText className="w-10 h-10 text-site-fg-dim" />
            <p className="font-montserrat text-seu-body-sm text-site-fg-dim">
              {viewMode} {t('floorPlan')}
            </p>
            <p className="font-montserrat text-seu-caption-sm text-site-fg-dim">
              {complex} · {t('block')} {block} · Apt {apartmentNumber}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
