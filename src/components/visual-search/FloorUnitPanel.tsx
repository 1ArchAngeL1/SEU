'use client';

import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import type { Unit } from '@/model/types/api';
import { bedroomCount } from '@/lib/room-counts';
import { statusColors } from '@/lib/unit-status';
import { cn } from '@/lib/utils';

interface FloorUnitPanelProps {
  /** The unit to describe, or null before the visitor has inspected one. */
  unit: Unit | null;
  totalUnits: number;
  availableUnits: number;
  floorNumber?: number;
  block?: string;
  /** Whether this unit opens a detail page — sold and non-living units don't. */
  canOpen: boolean;
  onOpen: () => void;
  /** Parent owns placement and width. */
  className?: string;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="font-montserrat text-seu-caption text-site-fg-dim">
        {label}
      </span>
      <span className="font-montserrat text-seu-body-sm text-site-fg text-right">
        {value}
      </span>
    </div>
  );
}

/**
 * The floor plan's read-out, parked beside the plan instead of floating over
 * it. It is always mounted and holds a fixed minimum height, so revealing a
 * unit never covers the drawing and never shifts the layout.
 */
export default function FloorUnitPanel({
  unit,
  totalUnits,
  availableUnits,
  floorNumber,
  block,
  canOpen,
  onOpen,
  className,
}: FloorUnitPanelProps) {
  const t = useTranslations('visualSearch');

  const beds = unit ? bedroomCount(unit) : 0;
  const colors = unit ? statusColors(unit.status) : null;

  return (
    <div
      className={cn(
        'rounded-xl border border-site-border-soft bg-site-bg/60 backdrop-blur-md p-5 min-h-[19rem] flex flex-col',
        className
      )}
    >
      {/* Floor totals stay put whether or not a unit is being inspected, so the
          panel is never empty on arrival. */}
      <div className="pb-4 border-b border-site-border-soft">
        <p className="font-montserrat text-seu-caption-sm uppercase tracking-[0.2em] text-site-fg-dim">
          {t('apartments')}
        </p>
        <p className="font-montserrat text-seu-body-sm text-site-fg mt-1">
          {t('availableOfTotal', { count: availableUnits, total: totalUnits })}
        </p>
      </div>

      {unit ? (
        <div className="pt-4 flex flex-col gap-4 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="font-bodoni text-seu-heading text-site-fg-strong leading-none">
              {t('unit')} {unit.unitNumber}
            </p>
            {colors && (
              <span
                className={cn(
                  'rounded-full px-2.5 py-1 font-montserrat text-[0.6rem] font-medium uppercase tracking-wider whitespace-nowrap',
                  colors.bg,
                  colors.text
                )}
              >
                {t(`status.${unit.status}`)}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Row label={t('area')} value={`${unit.totalSize} m²`} />
            {block && <Row label={t('block')} value={block} />}
            {floorNumber !== undefined && (
              <Row label={t('floor')} value={floorNumber} />
            )}
          </div>

          {beds > 0 && (
            <div className="flex flex-col gap-2 pt-3 border-t border-site-border-soft">
              <p className="font-montserrat text-seu-caption text-site-fg-muted">
                {t('beds', { count: beds })}
              </p>
            </div>
          )}

          {canOpen && (
            <button
              type="button"
              onClick={onOpen}
              className="mt-auto flex items-center justify-center gap-2 rounded-lg bg-primary-green px-4 py-3 font-montserrat text-seu-caption font-medium text-white hover:opacity-90 transition-opacity"
            >
              {t('view')}
              <ArrowRight className="size-4" />
            </button>
          )}
        </div>
      ) : (
        <p className="pt-4 font-montserrat text-seu-caption text-site-fg-dim leading-relaxed">
          {t('hoverHint')}
        </p>
      )}
    </div>
  );
}
