'use client';

import { Plus, Trash2 } from 'lucide-react';
import type { Room, RoomType } from '@/model/types/api';
import { btnGhost, Field, FormSelect, Input } from '../form-primitives';
import FormBlock from './FormBlock';

const ROOM_TYPE_OPTIONS: Array<{ value: RoomType; label: string }> = [
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'living_room', label: 'Living room' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'bathroom', label: 'Bathroom' },
  { value: 'toilet', label: 'Toilet' },
  { value: 'hall', label: 'Hall' },
  { value: 'balcony', label: 'Balcony' },
  { value: 'terrace', label: 'Terrace' },
  { value: 'storage', label: 'Storage' },
  { value: 'other', label: 'Other' },
];

interface UnitRoomsListSectionProps {
  value: Room[];
  onChange: (next: Room[]) => void;
}

function emptyRoom(): Room {
  return { name: '', type: 'bedroom' };
}

export default function UnitRoomsListSection({
  value,
  onChange,
}: UnitRoomsListSectionProps) {
  function updateRoom(index: number, patch: Partial<Room>) {
    const next = value.map((room, i) => (i === index ? { ...room, ...patch } : room));
    onChange(next);
  }

  function removeRoom(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function addRoom() {
    onChange([...value, emptyRoom()]);
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
              <Field label="Name">
                <Input
                  value={room.name}
                  onChange={(e) => updateRoom(index, { name: e.target.value })}
                  placeholder="e.g. Master bedroom"
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
              <Field label="Description">
                <Input
                  value={room.description ?? ''}
                  onChange={(e) =>
                    updateRoom(index, { description: e.target.value || undefined })
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
