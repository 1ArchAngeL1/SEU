'use client';

import {
  Plus,
  LayoutGrid,
  List as ListIcon,
  Loader2,
  Building2,
} from 'lucide-react';
import StatusBadge from '@/components/admin/StatusBadge';
import ChessBoard from '@/components/admin/chess/ChessBoard';
import StoryView from '@/components/admin/story/StoryView';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { pickLocalized } from '@/lib/i18n-helpers';
import { cn } from '@/lib/utils';
import type {
  Building,
  Floor,
  Unit,
  UnitStatus,
  UnitType,
} from '@/model/types/api';
import MicroStat from './MicroStat';
import UnitsTableView from './UnitsTableView';
import { STATUSES, TYPES, type ViewMode } from './styles';

export default function UnitsBuildingContext({
  building,
  buildingLoading,
  unitsLoading,
  unitsError,
  units,
  floors,
  floorsLoading,
  view,
  setView,
  page,
  setPage,
  totalPages,
  filterStatus,
  filterType,
  setFilterStatus,
  setFilterType,
  onCellClick,
  onEmptyCellClick,
  onAddUnitOnFloor,
  onAddFloor,
  onEditFloor,
  onDeleteFloor,
  openEdit,
  handleRemove,
}: {
  building: Building | undefined;
  buildingLoading: boolean;
  unitsLoading: boolean;
  unitsError: string | null;
  units: Unit[];
  floors: Floor[];
  floorsLoading: boolean;
  view: ViewMode;
  setView: (v: ViewMode) => void;
  page: number;
  setPage: (p: number) => void;
  totalPages: number;
  filterStatus: '' | UnitStatus;
  filterType: '' | UnitType;
  setFilterStatus: (v: '' | UnitStatus) => void;
  setFilterType: (v: '' | UnitType) => void;
  onCellClick: (u: Unit) => void;
  onEmptyCellClick: (floor: number, position: number) => void;
  onAddUnitOnFloor: (floorNumber: number) => void;
  onAddFloor: () => void;
  onEditFloor: (floor: Floor) => void;
  onDeleteFloor: (floor: Floor) => void;
  openEdit: (u: Unit) => void;
  handleRemove: (id: string) => void;
}) {
  if (buildingLoading || !building) {
    return (
      <div className="flex items-center justify-center py-16 text-admin-fg-muted">
        <Loader2 className="size-5 animate-spin mr-2" />
        Loading building…
      </div>
    );
  }

  const stats = {
    total: units.length,
    available: units.filter((u) => u.status === 'available').length,
    reserved: units.filter((u) => u.status === 'reserved').length,
    sold: units.filter((u) => u.status === 'sold').length,
  };

  const aboveGroundFloorCount = floors.filter((f) => f.floorNumber >= 1).length;
  const fallbackFloorCount = floors.length === 0 ? 1 : 0;

  return (
    <div className="space-y-5">
      {/* Building hero header */}
      <div className="rounded-2xl border border-admin-border-soft bg-admin-card-gradient p-5 sm:p-6 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 size-48 rounded-full bg-primary-green/10 blur-3xl pointer-events-none" />
        <div className="relative flex items-end justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4 min-w-0">
            <div className="size-14 rounded-xl border border-admin-border bg-admin-input grid place-items-center font-[--font-bodoni] text-seu-heading text-admin-fg leading-none shrink-0">
              {building.block}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h2 className="font-[--font-bodoni] text-seu-heading-lg text-admin-fg leading-none">
                  Block {building.block}
                </h2>
                <StatusBadge status={building.status} />
              </div>
              <p className="font-montserrat text-seu-caption text-admin-fg-muted">
                {pickLocalized(building.nameEn, building.nameKa) || `Block ${building.block}`} ·{' '}
                {aboveGroundFloorCount} floor
                {aboveGroundFloorCount !== 1 ? 's' : ''}
                {building.basementFloors > 0 &&
                  ` · ${building.basementFloors} basement`}
                {(building.parkingSpaces ?? 0) > 0 &&
                  ` · ${building.parkingSpaces} parking`}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3 text-center">
            <MicroStat label="Total" value={stats.total} />
            <MicroStat
              label="Avail"
              value={stats.available}
              accent="emerald"
            />
            <MicroStat
              label="Rsrvd"
              value={stats.reserved}
              accent="amber"
            />
            <MicroStat label="Sold" value={stats.sold} accent="rose" />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <Select
          value={filterStatus || '__all__'}
          onValueChange={(v) =>
            setFilterStatus(v === '__all__' ? '' : (v as UnitStatus))
          }
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All statuses</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s.replace(/_/g, ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filterType || '__all__'}
          onValueChange={(v) =>
            setFilterType(v === '__all__' ? '' : (v as UnitType))
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All types</SelectItem>
            {TYPES.map((t) => (
              <SelectItem key={t} value={t} className="capitalize">
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-1 p-1 bg-admin-deep rounded-lg border border-admin-border shadow-inner shadow-black/40 ml-auto">
          {(
            [
              { id: 'grid', label: 'Chess', Icon: LayoutGrid },
              { id: 'storey', label: 'Storey', Icon: ListIcon },
              { id: 'table', label: 'Table', Icon: ListIcon },
            ] as const
          ).map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md font-montserrat font-medium text-seu-caption-sm transition-all',
                view === id
                  ? 'bg-admin-elevated-gradient text-admin-fg border border-primary-green/30 shadow-sm shadow-primary-green/10'
                  : 'text-admin-fg-muted hover:text-admin-fg hover:bg-admin-hover border border-transparent'
              )}
            >
              <Icon className="size-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* No floors warning when chess/storey */}
      {floors.length === 0 && !floorsLoading && view !== 'table' && (
        <div
          className="rounded-xl border p-4 flex items-start gap-3"
          style={{
            borderColor: 'var(--admin-warning-border)',
            background: 'var(--admin-warning-shell)',
          }}
        >
          <Building2
            className="size-4 mt-0.5 shrink-0"
            style={{ color: 'var(--admin-warning-text)' }}
          />
          <div
            className="font-montserrat text-seu-caption flex-1"
            style={{ color: 'var(--admin-warning-text)' }}
          >
            No floors registered yet — add a floor first so units can be placed
            properly.
          </div>
          <button
            onClick={onAddFloor}
            className="font-montserrat text-seu-caption-sm bg-primary-green text-white px-3 py-1.5 rounded-md hover:bg-primary-green/85 transition-colors flex items-center gap-1 shrink-0"
          >
            <Plus className="size-3.5" />
            Add floor
          </button>
        </div>
      )}

      {unitsError ? (
        <div
          className="rounded-2xl border p-6 font-montserrat text-seu-caption"
          style={{
            borderColor: 'var(--admin-danger-border)',
            background: 'var(--admin-danger-shell)',
            color: 'var(--admin-danger-text)',
          }}
        >
          Failed to load units — {unitsError}
        </div>
      ) : view === 'grid' ? (
        unitsLoading && units.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-admin-fg-muted">
            <Loader2 className="size-5 animate-spin mr-2" />
            Loading units…
          </div>
        ) : (
          <ChessBoard
            units={units}
            floorCount={fallbackFloorCount}
            basementFloors={building.basementFloors}
            definedFloorNumbers={floors.map((f) => f.floorNumber)}
            onCellClick={onCellClick}
            onEmptyCellClick={onEmptyCellClick}
          />
        )
      ) : view === 'storey' ? (
        unitsLoading && units.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-admin-fg-muted">
            <Loader2 className="size-5 animate-spin mr-2" />
            Loading units…
          </div>
        ) : (
          <StoryView
            units={units}
            floors={floors}
            fallbackFloorCount={fallbackFloorCount}
            onUnitClick={onCellClick}
            onAddUnitToFloor={onAddUnitOnFloor}
            onEditFloor={onEditFloor}
            onDeleteFloor={onDeleteFloor}
          />
        )
      ) : (
        <UnitsTableView
          loading={unitsLoading}
          units={units}
          page={page}
          totalPages={totalPages}
          setPage={setPage}
          openEdit={openEdit}
          handleRemove={handleRemove}
        />
      )}
    </div>
  );
}
