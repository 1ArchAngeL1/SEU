'use client';

import { useMemo } from 'react';
import type { ApartmentDTO } from '@/model/dto/apartment.dto';
import type { ApartmentStatus } from '@prisma/client';
import ChessCell from './ChessCell';
import ChessEmptyCell from './ChessEmptyCell';
import ChessFloorLabel from './ChessFloorLabel';
import ChessLegend from './ChessLegend';

interface ChessBoardProps {
  apartments: ApartmentDTO[];
  floorCount: number;
  onCellClick: (apartment: ApartmentDTO) => void;
  onEmptyCellClick: (floor: number, position: number) => void;
}

export default function ChessBoard({
  apartments,
  floorCount,
  onCellClick,
  onEmptyCellClick,
}: ChessBoardProps) {
  const { cellMap, maxPosition, statusCounts } = useMemo(() => {
    const map = new Map<string, ApartmentDTO>();
    let maxPos = 0;
    const counts: Record<ApartmentStatus, number> = {
      AVAILABLE: 0,
      RESERVED: 0,
      SOLD: 0,
    };

    for (const apt of apartments) {
      map.set(`${apt.floor}-${apt.position}`, apt);
      if (apt.position > maxPos) maxPos = apt.position;
      counts[apt.status]++;
    }

    return { cellMap: map, maxPosition: maxPos || 1, statusCounts: counts };
  }, [apartments]);

  const floors = useMemo(() => {
    const arr: number[] = [];
    for (let f = floorCount; f >= 1; f--) arr.push(f);
    return arr;
  }, [floorCount]);

  const positions = useMemo(() => {
    const arr: number[] = [];
    for (let p = 1; p <= maxPosition; p++) arr.push(p);
    return arr;
  }, [maxPosition]);

  return (
    <div className="space-y-4">
      <ChessLegend counts={statusCounts} />

      <div className="overflow-x-auto">
        <div
          className="grid gap-1.5 min-w-fit"
          style={{
            gridTemplateColumns: `3rem repeat(${maxPosition}, minmax(7rem, 1fr))`,
          }}
        >
          {/* Header row */}
          <div />
          {positions.map((pos) => (
            <div
              key={`header-${pos}`}
              className="text-center font-montserrat text-seu-caption-sm text-secondary-grey/60 py-1"
            >
              Pos {pos}
            </div>
          ))}

          {/* Floor rows */}
          {floors.map((floor) => (
            <>
              <ChessFloorLabel key={`floor-${floor}`} floor={floor} />
              {positions.map((pos) => {
                const apt = cellMap.get(`${floor}-${pos}`);
                return apt ? (
                  <ChessCell
                    key={`${floor}-${pos}`}
                    apartmentNo={apt.apartmentNo}
                    totalSize={apt.totalSize}
                    price={apt.price}
                    status={apt.status}
                    onClick={() => onCellClick(apt)}
                  />
                ) : (
                  <ChessEmptyCell
                    key={`${floor}-${pos}`}
                    onClick={() => onEmptyCellClick(floor, pos)}
                  />
                );
              })}
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
