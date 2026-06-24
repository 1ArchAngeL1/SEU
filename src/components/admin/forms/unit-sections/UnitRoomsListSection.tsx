'use client';

import { Plus, Trash2 } from 'lucide-react';
import type { Room, RoomType } from '@/model/types/api';
import { btnGhost, Field, FormSelect, Input } from '../form-primitives';
import FormBlock from './FormBlock';

const ROOM_TYPE_LABELS: Record<RoomType, { en: string; ka: string }> = {
  bedroom: { en: 'Bedroom', ka: 'საძინებელი' },
  living_room: { en: 'Living Room', ka: 'მისაღები' },
  studio: { en: 'Studio', ka: 'სტუდიო' },
  kitchen: { en: 'Kitchen', ka: 'სამზარეულო' },
  bathroom: { en: 'Bathroom', ka: 'სველი წერტილი' },
  hall: { en: 'Hall', ka: 'ჰოლი' },
  balcony: { en: 'Balcony', ka: 'აივანი' },
  terrace: { en: 'Terrace', ka: 'ტერასა' },
  storage: { en: 'Storage', ka: 'სათავსო' },
  other: { en: 'Room', ka: 'ოთახი' },
};

const ROOM_TYPE_OPTIONS: Array<{ value: RoomType; label: string }> = (
  Object.keys(ROOM_TYPE_LABELS) as RoomType[]
).map((value) => ({ value, label: ROOM_TYPE_LABELS[value].en }));

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// A name "looks auto-generated" for the given type if it's empty, equals the
// type label, or matches "Label N" (e.g. "Bedroom 2"). Used to decide whether
// a name should be regenerated when the type changes — manual edits are kept.
function isAutoName(name: string | undefined, type: RoomType, lang: 'en' | 'ka'): boolean {
  if (!name) return true;
  const label = ROOM_TYPE_LABELS[type][lang];
  return name === label || new RegExp(`^${escapeRegex(label)} \\d+$`).test(name);
}

function autoNameFor(
  type: RoomType,
  rooms: Room[],
  excludeIndex: number
): { nameEn: string; nameKa: string } {
  const sameTypeBefore = rooms.filter((r, i) => i !== excludeIndex && r.type === type).length;
  const { en, ka } = ROOM_TYPE_LABELS[type];
  if (sameTypeBefore === 0) return { nameEn: en, nameKa: ka };
  const suffix = sameTypeBefore + 1;
  return { nameEn: `${en} ${suffix}`, nameKa: `${ka} ${suffix}` };
}

interface UnitRoomsListSectionProps {
  value: Room[];
  onChange: (next: Room[]) => void;
}

export default function UnitRoomsListSection({
  value,
  onChange,
}: UnitRoomsListSectionProps) {
  function updateRoom(index: number, patch: Partial<Room>) {
    const current = value[index];
    const next = value.map((room, i) => (i === index ? { ...room, ...patch } : room));
    if (patch.type && current && patch.type !== current.type) {
      const target = next[index];
      if (
        isAutoName(target.nameEn, current.type, 'en') &&
        isAutoName(target.nameKa, current.type, 'ka')
      ) {
        const generated = autoNameFor(patch.type, next, index);
        next[index] = { ...target, ...generated };
      }
    }
    onChange(next);
  }

  function removeRoom(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function addRoom() {
    const type: RoomType = 'bedroom';
    const generated = autoNameFor(type, value, value.length);
    onChange([...value, { type, ...generated }]);
  }

  return (
    <FormBlock
      title="Room layout"
      subtitle="Individual rooms with type, size, and notes"
    >
      <div className="flex flex-col gap-3">
        {value.length === 0 && (
          <p className="font-montserrat text-seu-caption-sm text-admin-fg-dim">
            No rooms yet. Add the first one to start mapping the interior.
          </p>
        )}

        {value.map((room, index) => (
          <div
            key={index}
            className="rounded-lg border border-admin-border-soft bg-admin-deep/40 p-3"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <span className="font-montserrat text-seu-caption-sm text-admin-fg-muted uppercase tracking-wider">
                Room {index + 1}
              </span>
              <button
                type="button"
                onClick={() => removeRoom(index)}
                className="text-rose-400/80 hover:text-rose-300 transition-colors p-1 rounded"
                aria-label={`Remove room ${index + 1}`}
              >
                <Trash2 className="size-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Name (English)" hint="Leave empty to use the type label">
                <Input
                  value={room.nameEn ?? ''}
                  onChange={(e) => updateRoom(index, { nameEn: e.target.value })}
                  placeholder="e.g. Master bedroom"
                  maxLength={100}
                />
              </Field>
              <Field label="Name (Georgian)" hint="ცარიელი დატოვებაში ტიპის სახელი გამოჩნდება">
                <Input
                  value={room.nameKa ?? ''}
                  onChange={(e) => updateRoom(index, { nameKa: e.target.value })}
                  placeholder="მაგ. სამთავრო საძინებელი"
                  maxLength={100}
                />
              </Field>
              <Field label="Type">
                <FormSelect
                  value={room.type}
                  onChange={(v) => updateRoom(index, { type: v as RoomType })}
                  options={ROOM_TYPE_OPTIONS}
                />
              </Field>
              <Field label="Size (m²)">
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  value={room.size?.toString() ?? ''}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const parsed = raw === '' ? undefined : Number(raw);
                    updateRoom(index, {
                      size: parsed !== undefined && Number.isFinite(parsed) ? parsed : undefined,
                    });
                  }}
                />
              </Field>
              <Field label="Description (English)">
                <Input
                  value={room.descriptionEn ?? ''}
                  onChange={(e) =>
                    updateRoom(index, { descriptionEn: e.target.value || undefined })
                  }
                  maxLength={500}
                />
              </Field>
              <Field label="Description (Georgian)">
                <Input
                  value={room.descriptionKa ?? ''}
                  onChange={(e) =>
                    updateRoom(index, { descriptionKa: e.target.value || undefined })
                  }
                  maxLength={500}
                />
              </Field>
            </div>
          </div>
        ))}

        <div>
          <button type="button" onClick={addRoom} className={btnGhost}>
            <span className="inline-flex items-center gap-1.5">
              <Plus className="size-4" />
              Add room
            </span>
          </button>
        </div>
      </div>
    </FormBlock>
  );
}
