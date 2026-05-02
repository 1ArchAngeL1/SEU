'use client';

import { ChevronRight, Pencil, Plus, Trash2 } from 'lucide-react';
import type { Floor, Unit } from '@/model/types/api';
import StatusBadge from '@/components/admin/StatusBadge';
import { cn } from '@/lib/utils';

interface StoryFloorRowProps {
  floorNumber: number;
  floor?: Floor;
  units: Unit[];
  isExpanded: boolean;
  onToggle: () => void;
  onUnitClick: (unit: Unit) => void;
  onAddUnit?: () => void;
  onEditFloor?: () => void;
  onDeleteFloor?: () => void;
}

export default function StoryFloorRow({
  floorNumber,
  floor,
  units,
  isExpanded,
  onToggle,
  onUnitClick,
  onAddUnit,
  onEditFloor,
  onDeleteFloor,
}: StoryFloorRowProps) {
  const count = units.length;
  const available = units.filter((a) => a.status === 'available').length;
  const reserved = units.filter((a) => a.status === 'reserved').length;
  const sold = units.filter((a) => a.status === 'sold').length;

  const prices = units.map((u) => u.price.amount);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
  const currency = units[0]?.price.currency ?? 'USD';

  const isBasement = floorNumber < 0;
  const isOrphan = !floor;

  return (
    <div
      className={cn(
        'rounded-lg border overflow-hidden bg-admin-card',
        isOrphan ? 'border-amber-500/30' : 'border-admin-border-soft'
      )}
    >
      <div className="w-full flex items-center gap-3 px-4 py-3 hover:bg-admin-hover transition-colors">
        <button
          onClick={onToggle}
          className="flex items-center gap-3 flex-1 min-w-0 text-left"
        >
          <ChevronRight
            className={cn(
              'size-4 shrink-0 text-admin-fg-muted transition-transform',
              isExpanded && 'rotate-90'
            )}
          />
          <span
            className={cn(
              'size-7 shrink-0 rounded-md border grid place-items-center font-[--font-bodoni] text-seu-caption tabular-nums leading-none',
              isBasement
                ? 'border-amber-500/30 bg-amber-500/10 text-amber-200'
                : 'border-admin-border bg-admin-input text-admin-fg-muted'
            )}
          >
            {floorNumber}
          </span>

          <span className="font-montserrat font-semibold text-seu-caption text-admin-fg shrink-0">
            {isBasement
              ? `Basement ${Math.abs(floorNumber)}`
              : `Floor ${floorNumber}`}
          </span>
          {floor?.floorImageId && (
            <span className="font-montserrat text-seu-caption-sm text-admin-fg-dim truncate">
              · {floor.floorImageId}
            </span>
          )}
          {isOrphan && (
            <span className="font-montserrat text-[0.65rem] text-amber-300/90 uppercase tracking-wider shrink-0 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
              not registered
            </span>
          )}
          <span className="text-seu-caption-sm text-admin-fg-muted font-montserrat ml-2 shrink-0">
            {count} unit{count !== 1 ? 's' : ''}
          </span>
          {count > 0 && (
            <>
              <span className="text-seu-caption-sm text-admin-fg-dim shrink-0">
                ·
              </span>
              <span className="text-seu-caption-sm text-admin-fg-muted font-montserrat shrink-0">
                {currencySymbol(currency)}
                {minPrice.toLocaleString()}
                {minPrice !== maxPrice && (
                  <>
                    {' – '}
                    {currencySymbol(currency)}
                    {maxPrice.toLocaleString()}
                  </>
                )}
              </span>
              <span className="text-seu-caption-sm text-admin-fg-dim shrink-0">
                ·
              </span>
              <div className="flex gap-2 text-seu-caption-sm font-montserrat shrink-0">
                {available > 0 && (
                  <span className="text-emerald-300">{available} avail</span>
                )}
                {reserved > 0 && (
                  <span className="text-amber-300">{reserved} rsrvd</span>
                )}
                {sold > 0 && <span className="text-rose-300">{sold} sold</span>}
              </div>
            </>
          )}
        </button>

        <div className="flex gap-1 shrink-0">
          {onAddUnit && (
            <button
              onClick={onAddUnit}
              className="text-primary-green/80 hover:text-primary-green hover:bg-primary-green/10 p-1.5 rounded-md transition-colors"
              title="Add unit on this floor"
            >
              <Plus className="size-3.5" />
            </button>
          )}
          {onEditFloor && (
            <button
              onClick={onEditFloor}
              className="text-admin-fg-muted hover:text-admin-fg hover:bg-admin-hover p-1.5 rounded-md transition-colors"
              title="Edit floor"
            >
              <Pencil className="size-3.5" />
            </button>
          )}
          {onDeleteFloor && (
            <button
              onClick={onDeleteFloor}
              className="text-rose-400/70 hover:text-rose-300 hover:bg-rose-500/10 p-1.5 rounded-md transition-colors"
              title="Delete floor"
            >
              <Trash2 className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {isExpanded && count > 0 && (
        <table className="w-full text-seu-caption font-montserrat">
          <thead>
            <tr className="bg-admin-hover text-left text-admin-fg-muted">
              <th className="px-4 py-2 font-medium text-seu-caption-sm">
                Unit #
              </th>
              <th className="px-4 py-2 font-medium text-seu-caption-sm">
                Type
              </th>
              <th className="px-4 py-2 font-medium text-seu-caption-sm">
                Beds
              </th>
              <th className="px-4 py-2 font-medium text-seu-caption-sm">m²</th>
              <th className="px-4 py-2 font-medium text-seu-caption-sm">
                Price
              </th>
              <th className="px-4 py-2 font-medium text-seu-caption-sm">
                /m²
              </th>
              <th className="px-4 py-2 font-medium text-seu-caption-sm">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {units.map((u) => (
              <tr
                key={u.id}
                onClick={() => onUnitClick(u)}
                className="border-t border-admin-border-soft hover:bg-admin-hover transition-colors cursor-pointer"
              >
                <td className="px-4 py-2 text-admin-fg font-medium">
                  #{u.unitNumber}
                </td>
                <td className="px-4 py-2 text-admin-fg-muted capitalize">
                  {u.type}
                </td>
                <td className="px-4 py-2 text-admin-fg-muted">{u.bedrooms ?? 0}</td>
                <td className="px-4 py-2 text-admin-fg-muted">{u.totalSize}</td>
                <td className="px-4 py-2 text-admin-fg">
                  {currencySymbol(u.price.currency)}
                  {u.price.amount.toLocaleString()}
                </td>
                <td className="px-4 py-2 text-admin-fg-muted">
                  {u.totalSize > 0
                    ? `${currencySymbol(u.price.currency)}${Math.round(
                        u.price.amount / u.totalSize
                      ).toLocaleString()}`
                    : '—'}
                </td>
                <td className="px-4 py-2">
                  <StatusBadge status={u.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isExpanded && count === 0 && (
        <div className="px-4 py-4 flex items-center justify-between gap-3">
          <span className="text-seu-caption-sm text-admin-fg-dim font-montserrat">
            No units on this floor yet
          </span>
          {onAddUnit && (
            <button
              onClick={onAddUnit}
              className="font-montserrat text-seu-caption-sm text-primary-green hover:text-primary-green/80 flex items-center gap-1 transition-colors"
            >
              <Plus className="size-3.5" />
              Add the first unit
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function currencySymbol(c: string) {
  if (c === 'USD') return '$';
  if (c === 'EUR') return '€';
  if (c === 'GEL') return '₾';
  return '';
}
