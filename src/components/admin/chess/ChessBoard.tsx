'use client';

import { useMemo } from 'react';
import { Plus } from 'lucide-react';
import type { Unit, UnitStatus } from '@/model/types/api';
import ChessCell from './ChessCell';
import ChessEmptyCell from './ChessEmptyCell';
import ChessFloorLabel from './ChessFloorLabel';
import ChessLegend from './ChessLegend';

interface ChessBoardProps {
  units: Unit[];
  floorCount: number;
  basementFloors?: number;
  /**
   * Registered Floor records' numbers. When provided (length > 0) the chess
   * grid renders ONLY these floors — in descending order, gaps allowed
   * (e.g. 15, 12, 11, 1). Units whose floor isn't registered are hidden.
   * When empty, falls back to a contiguous 1..floorCount range so a brand-new
   * building can be populated before any floors are formally registered.
   */
  definedFloorNumbers?: number[];
  onCellClick: (unit: Unit) => void;
  onEmptyCellClick: (floor: number, position: number) => void;
}

export default function ChessBoard({
  units,
  floorCount,
  basementFloors = 0,
  definedFloorNumbers = [],
  onCellClick,
  onEmptyCellClick,
}: ChessBoardProps) {
  const { cellMap, cellLabels, maxPosition, statusCounts, floors } = useMemo(() => {
    const counts: Record<UnitStatus, number> = {
      available: 0,
      reserved: 0,
      sold: 0,
      not_for_sale: 0,
    };

    // Decide which floors to render.
    let floorList: number[];
    if (definedFloorNumbers.length > 0) {
      // Driven by registered Floor records. Sort descending — gaps preserved.
      floorList = [...new Set(definedFloorNumbers)].sort((a, b) => b - a);
    } else {
      // Fallback: contiguous span based on the floorCount + basementFloors
      // props so the grid is usable before any Floor record exists.
      const top = Math.max(floorCount, 1);
      const bottom = -Math.max(basementFloors, 0);
      floorList = [];
      for (let f = top; f >= 1; f--) floorList.push(f);
      for (let f = -1; f >= bottom; f--) floorList.push(f);
    }

    const renderableFloors = new Set(floorList);

    // Group units only into floors that we actually render. Units on
    // unregistered floors (orphans) are skipped — they're surfaced in the
    // storey view, which flags them as "not registered" so the user can
    // re-create that floor and reclaim them.
    const map = new Map<string, Unit>();
    const byFloor = new Map<number, Unit[]>();
    for (const u of units) {
      counts[u.status]++;
      if (!renderableFloors.has(u.floorNumber)) continue;
      const arr = byFloor.get(u.floorNumber) ?? [];
      arr.push(u);
      byFloor.set(u.floorNumber, arr);
    }

    const labels = new Map<string, string>();
    let maxPos = 0;
    for (const [floor, arr] of byFloor) {
      arr.sort((a, b) =>
        a.unitNumber.localeCompare(b.unitNumber, undefined, {
          numeric: true,
          sensitivity: 'base',
        })
      );
      const isBasement = floor < 0;
      arr.forEach((u, idx) => {
        const pos = idx + 1;
        const key = `${floor}-${pos}`;
        map.set(key, u);
        labels.set(key, isBasement ? `P${pos}` : String(pos));
        if (pos > maxPos) maxPos = pos;
      });
    }

    return {
      cellMap: map,
      cellLabels: labels,
      maxPosition: maxPos || 1,
      statusCounts: counts,
      floors: floorList,
    };
  }, [units, floorCount, basementFloors, definedFloorNumbers]);

  const positions = useMemo(() => {
    const arr: number[] = [];
    for (let p = 1; p <= maxPosition; p++) arr.push(p);
    return arr;
  }, [maxPosition]);

  const groundIndex = floors.findIndex((f) => f < 0);

  if (floors.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-admin-border-soft bg-admin-card p-10 text-center font-montserrat text-seu-caption text-admin-fg-muted">
        No floors to render — add a floor first.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ChessLegend counts={statusCounts} />

      <div className="overflow-x-auto rounded-xl border border-admin-border bg-admin-card-gradient shadow-admin p-4">
        <div
          className="grid gap-1.5 min-w-fit mx-auto"
          style={{
            gridTemplateColumns: `2.25rem repeat(${maxPosition}, 6.5rem) 2.5rem`,
          }}
        >
          {/* Header */}
          <div />
          {positions.map((pos) => (
            <div
              key={`header-${pos}`}
              className="text-center font-montserrat text-[0.6rem] text-admin-fg-dim py-0.5 tabular-nums"
            >
              {pos}
            </div>
          ))}
          <div />

          {floors.map((floor, idx) => {
            const isGroundDivider = idx === groundIndex && groundIndex > 0;
            const isBasement = floor < 0;
            return (
              <div key={`row-${floor}`} className="contents">
                {isGroundDivider && (
                  <div
                    className="col-span-full border-t border-dashed border-admin-border-soft my-2 flex items-center gap-3"
                    style={{ gridColumn: `1 / span ${maxPosition + 2}` }}
                  >
                    <span className="text-[0.6rem] uppercase tracking-widest text-admin-fg-dim font-montserrat px-2 bg-admin-card">
                      ground level
                    </span>
                  </div>
                )}
                <ChessFloorLabel floor={floor} basement={isBasement} />
                {positions.map((pos) => {
                  const key = `${floor}-${pos}`;
                  const unit = cellMap.get(key);
                  return unit ? (
                    <ChessCell
                      key={key}
                      label={cellLabels.get(key) ?? String(pos)}
                      fullUnitNumber={unit.unitNumber}
                      totalSize={unit.totalSize}
                      bedrooms={unit.bedrooms}
                      type={unit.type}
                      status={unit.status}
                      onClick={() => onCellClick(unit)}
                    />
                  ) : (
                    <ChessEmptyCell
                      key={key}
                      onClick={() => onEmptyCellClick(floor, pos)}
                    />
                  );
                })}
                <button
                  key={`add-${floor}`}
                  type="button"
                  onClick={() => onEmptyCellClick(floor, maxPosition + 1)}
                  title={
                    isBasement
                      ? `Add unit on basement ${Math.abs(floor)}`
                      : `Add unit on floor ${floor}`
                  }
                  className="group h-[4.75rem] rounded-md border border-admin-border bg-admin-input-gradient hover:border-primary-green/60 hover:bg-primary-green/10 transition-all flex items-center justify-center"
                >
                  <Plus className="size-4 text-admin-fg-dim group-hover:text-primary-green transition-colors" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
