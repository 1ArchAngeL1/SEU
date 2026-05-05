import { Plus } from 'lucide-react';
import StatusBadge from '../StatusBadge';
import { pickLocale } from '@/lib/i18n-helpers';
import type { Building } from '@/model/types/api';

interface BuildingDetailHeroProps {
  building: Building;
  aboveGroundFloorCount: number;
  onAddUnit: () => void;
}

export default function BuildingDetailHero({
  building,
  aboveGroundFloorCount,
  onAddUnit,
}: BuildingDetailHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-admin-border-soft bg-admin-card-gradient mb-6">
      <div className="absolute -top-20 -right-20 size-64 rounded-full bg-primary-orange/10 blur-3xl pointer-events-none" />
      <div className="relative p-6 sm:p-7 flex items-end justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4 min-w-0">
          <div className="size-16 rounded-xl border border-admin-border bg-admin-input grid place-items-center font-[--font-bodoni] text-seu-title text-admin-fg leading-none shrink-0">
            {building.block}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="font-[--font-bodoni] font-normal text-seu-heading-lg text-admin-fg leading-none">
                Block {building.block}
              </h1>
              <StatusBadge status={building.status} />
            </div>
            <p className="text-seu-caption text-admin-fg-muted font-montserrat mt-1">
              {pickLocale(building.name) || `Block ${building.block}`} ·{' '}
              {aboveGroundFloorCount} floor
              {aboveGroundFloorCount !== 1 ? 's' : ''}
              {building.basementFloors > 0 &&
                ` · ${building.basementFloors} basement`}
              {building.constructionProgress != null &&
                ` · ${building.constructionProgress}% built`}
            </p>
          </div>
        </div>
        <button
          onClick={onAddUnit}
          className="bg-primary-orange text-white font-montserrat font-medium text-seu-caption px-4 py-2 rounded-lg hover:bg-primary-orange/85 transition-colors flex items-center gap-2 shadow-lg shadow-primary-orange/20"
        >
          <Plus className="size-4" />
          Add Unit
        </button>
      </div>
    </div>
  );
}
