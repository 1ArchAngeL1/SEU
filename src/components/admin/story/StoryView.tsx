'use client';

import { useMemo, useState } from 'react';
import type { ApartmentDTO } from '@/model/dto/apartment.dto';
import StoryFloorRow from './StoryFloorRow';

interface StoryViewProps {
  apartments: ApartmentDTO[];
  floorCount: number;
  onApartmentClick: (apartment: ApartmentDTO) => void;
}

export default function StoryView({
  apartments,
  floorCount,
  onApartmentClick,
}: StoryViewProps) {
  const floorGroups = useMemo(() => {
    const groups = new Map<number, ApartmentDTO[]>();

    for (const apt of apartments) {
      const existing = groups.get(apt.floor) ?? [];
      existing.push(apt);
      groups.set(apt.floor, existing);
    }

    // Sort apartments within each floor by position
    for (const [, apts] of groups) {
      apts.sort((a, b) => a.position - b.position);
    }

    // Build floor array from top to bottom
    const floors: Array<{ floor: number; apartments: ApartmentDTO[] }> = [];
    for (let f = floorCount; f >= 1; f--) {
      floors.push({ floor: f, apartments: groups.get(f) ?? [] });
    }

    return floors;
  }, [apartments, floorCount]);

  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  function toggle(floor: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(floor)) {
        next.delete(floor);
      } else {
        next.add(floor);
      }
      return next;
    });
  }

  return (
    <div className="space-y-1">
      {floorGroups.map(({ floor, apartments: floorApts }) => (
        <StoryFloorRow
          key={floor}
          floor={floor}
          apartments={floorApts}
          isExpanded={expanded.has(floor)}
          onToggle={() => toggle(floor)}
          onApartmentClick={onApartmentClick}
        />
      ))}
    </div>
  );
}
