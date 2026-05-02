'use client';

import { useMemo, useState } from 'react';
import type { Floor, Unit } from '@/model/types/api';
import StoryFloorRow from './StoryFloorRow';

interface StoryViewProps {
  units: Unit[];
  floors: Floor[];
  fallbackFloorCount?: number;
  onUnitClick: (unit: Unit) => void;
  onAddUnitToFloor?: (floorNumber: number) => void;
  onEditFloor?: (floor: Floor) => void;
  onDeleteFloor?: (floor: Floor) => void;
}

export default function StoryView({
  units,
  floors,
  fallbackFloorCount = 0,
  onUnitClick,
  onAddUnitToFloor,
  onEditFloor,
  onDeleteFloor,
}: StoryViewProps) {
  const floorRows = useMemo(() => {
    const groups = new Map<number, Unit[]>();
    for (const u of units) {
      const arr = groups.get(u.floorNumber) ?? [];
      arr.push(u);
      groups.set(u.floorNumber, arr);
    }
    for (const [, arr] of groups) {
      arr.sort((a, b) =>
        a.unitNumber.localeCompare(b.unitNumber, undefined, {
          numeric: true,
          sensitivity: 'base',
        })
      );
    }

    const known = new Map<number, Floor>();
    for (const f of floors) known.set(f.floorNumber, f);

    const numbers = new Set<number>(known.keys());
    for (const fn of groups.keys()) numbers.add(fn);
    if (floors.length === 0 && fallbackFloorCount > 0) {
      for (let f = fallbackFloorCount; f >= 1; f--) numbers.add(f);
    }

    return Array.from(numbers)
      .sort((a, b) => b - a)
      .map((floorNumber) => ({
        floorNumber,
        floor: known.get(floorNumber),
        units: groups.get(floorNumber) ?? [],
      }));
  }, [units, floors, fallbackFloorCount]);

  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  function toggle(floor: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(floor)) next.delete(floor);
      else next.add(floor);
      return next;
    });
  }

  if (floorRows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-admin-border-soft bg-admin-card p-10 text-center">
        <p className="font-montserrat text-seu-caption text-admin-fg-muted">
          No floors defined yet. Add a floor to start placing units.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {floorRows.map(({ floorNumber, floor, units: floorUnits }) => (
        <StoryFloorRow
          key={floorNumber}
          floorNumber={floorNumber}
          floor={floor}
          units={floorUnits}
          isExpanded={expanded.has(floorNumber)}
          onToggle={() => toggle(floorNumber)}
          onUnitClick={onUnitClick}
          onAddUnit={
            onAddUnitToFloor ? () => onAddUnitToFloor(floorNumber) : undefined
          }
          onEditFloor={
            floor && onEditFloor ? () => onEditFloor(floor) : undefined
          }
          onDeleteFloor={
            floor && onDeleteFloor ? () => onDeleteFloor(floor) : undefined
          }
        />
      ))}
    </div>
  );
}
