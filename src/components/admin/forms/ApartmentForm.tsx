'use client';

import { useState } from 'react';
import { apartmentSchema } from '@/lib/schemas/admin';
import type { ApartmentStatus, RoomType } from '@prisma/client';

const inputClass =
  'bg-secondary-black/40 border border-secondary-black text-pale-gray placeholder:text-secondary-grey/60 rounded-lg px-3 py-2 text-seu-caption focus:outline-none focus:border-pale-gray/40 transition-colors w-full';
const selectClass =
  'bg-secondary-black/40 border border-secondary-black text-pale-gray rounded-lg px-3 py-2 text-seu-caption focus:outline-none focus:border-pale-gray/40 transition-colors w-full';
const labelClass = 'text-seu-caption-sm text-secondary-grey font-montserrat';
const btnPrimary =
  'bg-primary-green text-white font-montserrat font-medium text-seu-caption px-6 py-2 rounded-lg hover:bg-primary-green/85 transition-colors disabled:opacity-50';

const ROOM_TYPES: RoomType[] = [
  'BEDROOM',
  'LIVING_ROOM',
  'KITCHEN',
  'BATHROOM',
  'BALCONY',
  'HALLWAY',
  'STORAGE',
];

const STATUSES: ApartmentStatus[] = ['AVAILABLE', 'RESERVED', 'SOLD'];

interface ApartmentFormData {
  buildingId: string;
  floor: number;
  apartmentNo: number;
  position: number;
  totalSize: number;
  mainSize: number;
  openSpaceSize: number;
  bedroomCount: number;
  price: number;
  status: ApartmentStatus;
  rooms: Array<{ roomType: RoomType; size: number }>;
}

interface ApartmentFormProps {
  initialData?: Partial<ApartmentFormData>;
  buildingId: string;
  onSubmit: (data: ApartmentFormData) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export default function ApartmentForm({
  initialData,
  buildingId,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
}: ApartmentFormProps) {
  const [form, setForm] = useState({
    floor: initialData?.floor?.toString() ?? '',
    apartmentNo: initialData?.apartmentNo?.toString() ?? '',
    position: initialData?.position?.toString() ?? '',
    totalSize: initialData?.totalSize?.toString() ?? '',
    mainSize: initialData?.mainSize?.toString() ?? '',
    openSpaceSize: initialData?.openSpaceSize?.toString() ?? '',
    bedroomCount: initialData?.bedroomCount?.toString() ?? '',
    price: initialData?.price?.toString() ?? '',
    status: initialData?.status ?? ('AVAILABLE' as ApartmentStatus),
  });
  const [rooms, setRooms] = useState<
    Array<{ roomType: RoomType; size: string }>
  >(
    initialData?.rooms?.map((r) => ({
      roomType: r.roomType,
      size: r.size.toString(),
    })) ?? []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function updateField(key: string, val: string) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function addRoom() {
    setRooms((prev) => [...prev, { roomType: 'BEDROOM', size: '' }]);
  }

  function removeRoom(idx: number) {
    setRooms((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateRoom(idx: number, key: 'roomType' | 'size', val: string) {
    setRooms((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, [key]: val } : r))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const parsed = apartmentSchema.safeParse({
      buildingId,
      floor: form.floor,
      apartmentNo: form.apartmentNo,
      position: form.position,
      totalSize: form.totalSize,
      mainSize: form.mainSize,
      openSpaceSize: form.openSpaceSize,
      bedroomCount: form.bedroomCount,
      price: form.price,
      status: form.status,
      rooms: rooms.map((r) => ({
        roomType: r.roomType,
        size: r.size,
      })),
    });

    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      return;
    }

    setLoading(true);
    try {
      await onSubmit(parsed.data as ApartmentFormData);
    } catch {
      setError('Failed to save apartment');
    } finally {
      setLoading(false);
    }
  }

  const fields = [
    { key: 'floor', label: 'Floor', placeholder: 'e.g. 5', type: 'number' },
    {
      key: 'apartmentNo',
      label: 'Apartment #',
      placeholder: 'e.g. 501',
      type: 'number',
    },
    {
      key: 'position',
      label: 'Position (column)',
      placeholder: 'e.g. 1',
      type: 'number',
    },
    {
      key: 'totalSize',
      label: 'Total m\u00B2',
      placeholder: 'e.g. 65.5',
      type: 'number',
      step: '0.01',
    },
    {
      key: 'mainSize',
      label: 'Main m\u00B2',
      placeholder: 'e.g. 55.0',
      type: 'number',
      step: '0.01',
    },
    {
      key: 'openSpaceSize',
      label: 'Open Space m\u00B2',
      placeholder: 'e.g. 10.5',
      type: 'number',
      step: '0.01',
    },
    {
      key: 'bedroomCount',
      label: 'Bedrooms',
      placeholder: 'e.g. 2',
      type: 'number',
    },
    {
      key: 'price',
      label: 'Price ($)',
      placeholder: 'e.g. 85000',
      type: 'number',
      step: '0.01',
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {fields.map(({ key, label, placeholder, type, step }) => (
          <div key={key} className="flex flex-col gap-1">
            <label className={labelClass}>{label}</label>
            <input
              value={form[key as keyof typeof form]}
              onChange={(e) => updateField(key, e.target.value)}
              placeholder={placeholder}
              type={type}
              step={step}
              required
              className={inputClass}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1">
        <label className={labelClass}>Status</label>
        <select
          value={form.status}
          onChange={(e) => updateField('status', e.target.value)}
          className={selectClass}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-seu-caption font-medium text-pale-gray/70 font-montserrat">
            Rooms
          </span>
          <button
            type="button"
            onClick={addRoom}
            className="text-primary-green text-seu-caption-sm hover:underline font-montserrat"
          >
            + Add room
          </button>
        </div>
        {rooms.map((room, idx) => (
          <div key={idx} className="flex gap-2 mb-2 items-center">
            <select
              value={room.roomType}
              onChange={(e) => updateRoom(idx, 'roomType', e.target.value)}
              className={selectClass}
            >
              {ROOM_TYPES.map((rt) => (
                <option key={rt} value={rt}>
                  {rt.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
            <input
              value={room.size}
              onChange={(e) => updateRoom(idx, 'size', e.target.value)}
              placeholder="Size m\u00B2"
              type="number"
              step="0.01"
              className={`${inputClass} max-w-28`}
            />
            <button
              type="button"
              onClick={() => removeRoom(idx)}
              className="text-red/80 hover:text-red text-seu-caption-sm transition-colors whitespace-nowrap"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {error && (
        <p className="text-red text-seu-caption-sm font-montserrat">{error}</p>
      )}

      <div className="flex gap-3 justify-end pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="text-secondary-grey hover:text-pale-gray font-montserrat text-seu-caption transition-colors"
        >
          Cancel
        </button>
        <button type="submit" disabled={loading} className={btnPrimary}>
          {loading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
