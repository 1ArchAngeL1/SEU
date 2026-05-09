'use client';

import { useState } from 'react';
import { btnGhost, btnPrimary } from './form-primitives';
import type { PolygonEditorValue } from './PolygonsEditor';
import type {
  CreateUnitInput,
  FurnishingStatus,
  Room,
  Unit,
  UnitStatus,
  UnitType,
} from '@/model/types/api';
import { cn } from '@/lib/utils';
import UnitIdentitySection, {
  type UnitIdentitySectionValue,
} from './unit-sections/UnitIdentitySection';
import UnitRoomsSection, {
  type UnitRoomsSectionValue,
} from './unit-sections/UnitRoomsSection';
import UnitRoomsListSection from './unit-sections/UnitRoomsListSection';
import UnitSizesSection, {
  type UnitSizesSectionValue,
} from './unit-sections/UnitSizesSection';
import UnitPriceSection, {
  type UnitPriceSectionValue,
} from './unit-sections/UnitPriceSection';
import UnitMediaSection, {
  type UnitMediaSectionValue,
} from './unit-sections/UnitMediaSection';
import UnitDescriptionSection, {
  type UnitDescriptionSectionValue,
} from './unit-sections/UnitDescriptionSection';
import UnitFlagsSection, {
  type UnitFlagsSectionValue,
} from './unit-sections/UnitFlagsSection';

interface UnitFormProps {
  buildingId: string;
  projectId: string;
  defaultBlock: string;
  initialData?: Unit;
  initialFloor?: number;
  initialUnitNumber?: string;
  onSubmit: (data: CreateUnitInput, rooms: Room[]) => Promise<void>;
  onCancel: () => void;
  onDelete?: () => void;
  submitLabel?: string;
  /** Render with sheet-style footer pinned to bottom. */
  footerVariant?: 'inline' | 'sticky';
}

function num(v: string): number | undefined {
  if (v === '' || v === null || v === undefined) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export default function UnitForm({
  buildingId,
  projectId,
  defaultBlock,
  initialData,
  initialFloor,
  initialUnitNumber,
  onSubmit,
  onCancel,
  onDelete,
  submitLabel = 'Save',
  footerVariant = 'inline',
}: UnitFormProps) {
  const [polygonDirty, setPolygonDirty] = useState(false);
  const [form, setForm] = useState({
    // Basics
    unitNumber: initialData?.unitNumber ?? initialUnitNumber ?? '',
    block: initialData?.block ?? defaultBlock,
    floor: (initialData?.floorNumber ?? initialFloor ?? '').toString(),
    entrance: initialData?.entrance ?? '',
    type: (initialData?.type ?? 'living') as UnitType,
    status: (initialData?.status ?? 'available') as UnitStatus,

    // Rooms
    bedrooms: initialData?.bedrooms?.toString() ?? '0',
    bathrooms: initialData?.bathrooms?.toString() ?? '0',
    livingRooms: initialData?.livingRooms?.toString() ?? '0',
    balconies: initialData?.balconies?.toString() ?? '0',
    terraces: initialData?.terraces?.toString() ?? '0',

    // Sizes
    totalSize: initialData?.totalSize?.toString() ?? '',
    livableArea: initialData?.livableArea?.toString() ?? '',
    balconySize: initialData?.balconySize?.toString() ?? '',
    terraceSize: initialData?.terraceSize?.toString() ?? '',

    // Price
    amount: initialData?.price?.amount?.toString() ?? '',
    currency: initialData?.price?.currency ?? 'USD',
    pricePerSqm: initialData?.price?.pricePerSqm?.toString() ?? '',
    discount: initialData?.price?.discount?.toString() ?? '0',
    originalPrice: initialData?.price?.originalPrice?.toString() ?? '',

    // Media
    mainImage: initialData?.mainImage ?? '',
    images: initialData?.images ?? [],
    floorPlanImage: initialData?.floorPlanImage ?? '',
    twoDContent: initialData?.twoDContent ?? '',
    threeDContent: initialData?.threeDContent ?? '',
    videoTourUrl: initialData?.videoTourUrl ?? '',
    virtualTourUrl: initialData?.virtualTourUrl ?? '',
    renderImage: initialData?.renderImage ?? '',
    polygonEditor: {
      entries: initialData?.polygon?.length
        ? [{ raw: initialData.polygon.map((pt) => `${pt.x},${pt.y}`).join(','), label: '' }]
        : [],
      imageWidth: '',
      imageHeight: '',
    } as PolygonEditorValue,

    // Description
    descriptionKa: initialData?.description?.ka ?? '',
    descriptionEn: initialData?.description?.en ?? '',

    // Flags
    furnishingStatus: (initialData?.furnishingStatus ??
      'rough_draft') as FurnishingStatus,
    isActive: initialData?.isActive ?? true,
  });
  const [roomsList, setRoomsList] = useState<Room[]>(() => {
    const raw = initialData?.rooms;
    if (!Array.isArray(raw)) return [];
    return raw
      .filter((r): r is Room => r != null && typeof r === 'object')
      .map((r) => ({
        name: typeof r.name === 'string' ? r.name : '',
        type: r.type ?? 'bedroom',
        ...(typeof r.size === 'number' && { size: r.size }),
        ...(typeof r.description === 'string' && { description: r.description }),
      }));
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function update<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    if (k === 'polygonEditor') setPolygonDirty(true);
    setForm((p) => ({ ...p, [k]: v }));
  }

  function sectionUpdate<V extends Partial<typeof form>>() {
    return update as unknown as <K extends keyof V>(k: K, v: V[K]) => void;
  }

  function buildPayload(): CreateUnitInput {
    const payload: CreateUnitInput = {
      building: buildingId,
      project: projectId,
      unitNumber: form.unitNumber.trim(),
      block: form.block.trim().toUpperCase(),
      floorNumber: Number(form.floor) || 0,
      type: form.type,
      status: form.status,
      bedrooms: num(form.bedrooms) ?? null,
      bathrooms: num(form.bathrooms) ?? null,
      livingRooms: num(form.livingRooms) ?? null,
      balconies: num(form.balconies) ?? null,
      terraces: num(form.terraces) ?? null,
      totalSize: Number(form.totalSize) || 0,
      livableArea: num(form.livableArea) ?? null,
      balconySize: num(form.balconySize) ?? null,
      terraceSize: num(form.terraceSize) ?? null,
      price: {
        currency: form.currency,
        amount: Number(form.amount) || 0,
        pricePerSqm: num(form.pricePerSqm) ?? null,
        discount: num(form.discount) ?? null,
        originalPrice: num(form.originalPrice) ?? null,
      },
      furnishingStatus: form.furnishingStatus,
      isActive: form.isActive,
      entrance: form.entrance.trim() || null,
      mainImage: form.mainImage.trim() || null,
      images: form.images,
      floorPlanImage: form.floorPlanImage.trim() || null,
      twoDContent: form.twoDContent.trim() || null,
      threeDContent: form.threeDContent.trim() || null,
      videoTourUrl: form.videoTourUrl.trim() || null,
      virtualTourUrl: form.virtualTourUrl.trim() || null,
      renderImage: form.renderImage.trim() || null,
      description: {
        ka: form.descriptionKa.trim() || null,
        en: form.descriptionEn.trim() || null,
      },
    };

    // Polygon handling
    const pe = form.polygonEditor;
    const validEntries = pe.entries.filter((e) => e.raw.trim());
    if (validEntries.length > 0) {
      if (polygonDirty) {
        const imgW = Number(pe.imageWidth);
        const imgH = Number(pe.imageHeight);
        if (imgW > 0 && imgH > 0) {
          payload.rawPolygon = validEntries[0].raw.replace(/\s+/g, ',');
          payload.imageWidth = imgW;
          payload.imageHeight = imgH;
        }
      } else if (initialData?.polygon?.length) {
        payload.polygon = initialData.polygon;
      }
    } else {
      payload.polygon = [];
    }

    return payload;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.unitNumber.trim()) return setError('Unit number is required');
    if (!form.block.trim()) return setError('Block is required');
    if (form.floor === '') return setError('Floor is required');
    if (!form.totalSize) return setError('Total size is required');
    if (!form.amount) return setError('Price amount is required');
    const hasPolygonEntries = form.polygonEditor.entries.some((e) => e.raw.trim());
    if (hasPolygonEntries && polygonDirty) {
      const imgW = Number(form.polygonEditor.imageWidth);
      const imgH = Number(form.polygonEditor.imageHeight);
      if (!imgW || !imgH) {
        return setError('Enter the source image width and height for polygon coordinate conversion.');
      }
    }
    for (const [i, room] of roomsList.entries()) {
      if (!room.name.trim()) return setError(`Room ${i + 1}: name is required`);
    }
    const cleanRooms: Room[] = roomsList.map((r) => ({
      name: r.name.trim(),
      type: r.type,
      ...(r.size !== undefined && { size: r.size }),
      ...(r.description?.trim() && { description: r.description.trim() }),
    }));
    setLoading(true);
    try {
      await onSubmit(buildPayload(), cleanRooms);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save unit');
    } finally {
      setLoading(false);
    }
  }

  const sticky = footerVariant === 'sticky';

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        sticky ? 'flex flex-col h-full min-h-0' : 'flex flex-col gap-6'
      )}
    >
      <div
        className={cn(
          sticky
            ? 'flex-1 overflow-y-auto px-6 py-5 space-y-7'
            : 'space-y-7'
        )}
      >
        <UnitIdentitySection
          value={{
            unitNumber: form.unitNumber,
            block: form.block,
            floor: form.floor,
            entrance: form.entrance,
            type: form.type,
            status: form.status,
          }}
          update={sectionUpdate<UnitIdentitySectionValue>()}
        />

        <UnitRoomsSection
          value={{
            bedrooms: form.bedrooms,
            bathrooms: form.bathrooms,
            livingRooms: form.livingRooms,
            balconies: form.balconies,
            terraces: form.terraces,
          }}
          update={sectionUpdate<UnitRoomsSectionValue>()}
        />

        <UnitRoomsListSection value={roomsList} onChange={setRoomsList} />

        <UnitSizesSection
          value={{
            totalSize: form.totalSize,
            livableArea: form.livableArea,
            balconySize: form.balconySize,
            terraceSize: form.terraceSize,
          }}
          update={sectionUpdate<UnitSizesSectionValue>()}
        />

        <UnitPriceSection
          value={{
            amount: form.amount,
            currency: form.currency,
            pricePerSqm: form.pricePerSqm,
            discount: form.discount,
            originalPrice: form.originalPrice,
          }}
          update={sectionUpdate<UnitPriceSectionValue>()}
        />

        <UnitMediaSection
          value={{
            mainImage: form.mainImage,
            images: form.images,
            floorPlanImage: form.floorPlanImage,
            twoDContent: form.twoDContent,
            threeDContent: form.threeDContent,
            videoTourUrl: form.videoTourUrl,
            virtualTourUrl: form.virtualTourUrl,
            renderImage: form.renderImage,
            polygonEditor: form.polygonEditor,
          }}
          update={sectionUpdate<UnitMediaSectionValue>()}
        />

        <UnitDescriptionSection
          value={{
            descriptionKa: form.descriptionKa,
            descriptionEn: form.descriptionEn,
          }}
          update={sectionUpdate<UnitDescriptionSectionValue>()}
        />

        <UnitFlagsSection
          value={{
            furnishingStatus: form.furnishingStatus,
            isActive: form.isActive,
          }}
          update={sectionUpdate<UnitFlagsSectionValue>()}
        />

        {error && (
          <div
            className="rounded-lg border px-3 py-2 text-seu-caption-sm font-montserrat"
            style={{
              borderColor: 'var(--admin-danger-border)',
              background: 'var(--admin-danger-shell)',
              color: 'var(--admin-danger-text)',
            }}
          >
            {error}
          </div>
        )}
      </div>

      <div
        className={cn(
          'flex items-center justify-between gap-3 border-t border-admin-border-soft',
          sticky
            ? 'px-6 py-4 bg-admin-bg/70 backdrop-blur shrink-0'
            : 'pt-4 mt-2'
        )}
      >
        <div>
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="text-rose-400/80 hover:text-rose-300 hover:bg-rose-500/10 px-3 py-2 rounded-md text-seu-caption-sm font-montserrat transition-colors"
            >
              Delete unit
            </button>
          )}
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={onCancel} className={btnGhost}>
            Cancel
          </button>
          <button type="submit" disabled={loading} className={btnPrimary}>
            {loading ? 'Saving…' : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
