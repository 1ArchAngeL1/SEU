'use client';

import { Link } from '@/i18n/navigation';
import { Building2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { pickLocalized } from '@/lib/i18n-helpers';
import { fileUrl } from '@/lib/file-url';
import StatusBadge from './StatusBadge';
import type { Building } from '@/model/types/api';

interface BuildingCardProps {
  building: Building;
  className?: string;
  onClick?: () => void;
  href?: string;
  cta?: string;
}

export default function BuildingCard({
  building,
  className,
  onClick,
  href,
  cta,
}: BuildingCardProps) {
  const progress = building.constructionProgress ?? 0;
  const total = building.totalUnits ?? 0;
  const available = building.availableUnits ?? 0;
  const sold = Math.max(total - available, 0);
  const occupancy = total > 0 ? Math.round((sold / total) * 100) : 0;

  const cardClass = cn(
    'group relative block rounded-2xl border border-admin-border bg-admin-card-gradient overflow-hidden text-left w-full',
    'shadow-admin',
    'transition-all hover:border-primary-green/50 hover:shadow-admin-lg hover:-translate-y-0.5',
    className
  );

  const ctaLabel = cta ?? 'Open chess view';

  const inner = (
    <>
      {/* Cover */}
      <div className="relative aspect-[16/9] bg-admin-input-gradient overflow-hidden border-b border-admin-border-soft">
        {building.mainImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={fileUrl(building.mainImage)}
            alt={`Block ${building.block}`}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Building2 className="size-12 text-admin-fg-dim" />
            <span className="absolute font-[--font-bodoni] text-[6.5rem] text-admin-fg-dim leading-none select-none opacity-40">
              {building.block}
            </span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <StatusBadge status={building.status} />
        </div>
        <div className="absolute bottom-3 left-3 font-[--font-bodoni] text-pale-gray text-seu-heading leading-none drop-shadow-lg">
          Block {building.block}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        <div>
          <div className="font-montserrat text-seu-caption-sm text-admin-fg-muted uppercase tracking-wider">
            {pickLocalized(building.nameEn, building.nameKa) || `Block ${building.block}`}
          </div>
          <div className="font-montserrat text-seu-caption-sm text-admin-fg-muted mt-1">
            {building.floorsAboveGround > 0
              ? `${building.floorsAboveGround} floor${building.floorsAboveGround !== 1 ? 's' : ''}`
              : 'No floors yet'}
            {(building.basementLevels ?? 0) > 0 &&
              ` · ${building.basementLevels} basement level${building.basementLevels !== 1 ? 's' : ''}`}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-seu-caption-sm font-montserrat">
          <Stat label="Units" value={total} />
          <Stat label="Available" value={available} accent="emerald" />
          <Stat label="Sold" value={sold} accent="dim" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-montserrat text-seu-caption-sm text-admin-fg-muted">
              Construction
            </span>
            <span className="font-montserrat text-seu-caption-sm text-admin-fg tabular-nums">
              {progress}%
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-admin-input overflow-hidden">
            <div
              className="h-full bg-primary-green transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-admin-border-soft">
          <span className="font-montserrat text-seu-caption-sm text-admin-fg-muted pt-3">
            {occupancy}% occupied
          </span>
          <span className="flex items-center gap-1 font-montserrat text-seu-caption-sm text-primary-green pt-3 group-hover:translate-x-0.5 transition-transform">
            {ctaLabel}
            <ArrowRight className="size-3.5" />
          </span>
        </div>
      </div>
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cardClass}>
        {inner}
      </button>
    );
  }
  return (
    <Link href={href ?? `/admin/buildings/${building.id}`} className={cardClass}>
      {inner}
    </Link>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: 'emerald' | 'dim';
}) {
  const text =
    accent === 'emerald'
      ? 'text-emerald-300'
      : accent === 'dim'
        ? 'text-admin-fg-dim'
        : 'text-admin-fg';
  return (
    <div className="rounded-lg bg-admin-input-gradient border border-admin-border shadow-admin px-3 py-2">
      <div className="text-admin-fg-muted text-[0.65rem] uppercase tracking-wider">
        {label}
      </div>
      <div
        className={cn(
          'font-[--font-bodoni] text-seu-subheading leading-none mt-1 tabular-nums',
          text
        )}
      >
        {value}
      </div>
    </div>
  );
}
