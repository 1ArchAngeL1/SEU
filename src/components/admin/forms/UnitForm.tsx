'use client';

import { useState } from 'react';
import { Check, ClipboardPaste, Copy } from 'lucide-react';
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
  const [form, setForm] = useState({
    // Basics
    unitNumber: initialData?.unitNumber ?? initialUnitNumber ?? '',
    block: initialData?.block ?? defaultBlock,
    floor: (initialData?.floorNumber ?? initialFloor ?? '').toString(),
    entranceEn: initialData?.entranceEn ?? '',
    entranceKa: initialData?.entranceKa ?? '',
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
    } as PolygonEditorValue,

    // Description
    descriptionKa: initialData?.descriptionKa ?? '',
    descriptionEn: initialData?.descriptionEn ?? '',

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
        nameEn: typeof r.nameEn === 'string' ? r.nameEn : '',
        nameKa: typeof r.nameKa === 'string' ? r.nameKa : '',
        type: r.type ?? 'bedroom',
        ...(typeof r.size === 'number' && { size: r.size }),
        ...(typeof r.descriptionEn === 'string' && { descriptionEn: r.descriptionEn }),
        ...(typeof r.descriptionKa === 'string' && { descriptionKa: r.descriptionKa }),
      }));
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [pasteStatus, setPasteStatus] = useState<'idle' | 'pasted'>('idle');

  function update<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function handleCopyFeatures() {
    setError('');
    const payload: Record<string, unknown> = { ...form, roomsList };
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 1500);
    } catch (e) {
      setError(
        'Failed to copy: ' + (e instanceof Error ? e.message : 'clipboard unavailable')
      );
    }
  }

  async function handlePasteFeatures() {
    setError('');
    let text: string;
    try {
      text = await navigator.clipboard.readText();
    } catch (e) {
      setError(
        'Failed to read clipboard: ' +
          (e instanceof Error ? e.message : 'clipboard unavailable')
      );
      return;
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      setError('Clipboard does not contain valid JSON');
      return;
    }
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      setError('Pasted JSON must be an object');
      return;
    }
    const data = parsed as Record<string, unknown>;
    setForm((prev) => {
      const next = { ...prev } as Record<string, unknown>;
      for (const key of Object.keys(prev)) {
        if (!(key in data)) continue;
        const incoming = data[key];
        if (incoming === null || incoming === undefined) continue;
        next[key] = incoming;
      }
      return next as typeof prev;
    });
    if (Array.isArray(data.roomsList)) {
      setRoomsList(
        (data.roomsList as unknown[])
          .filter((r): r is Record<string, unknown> => !!r && typeof r === 'object')
          .map((r) => ({
            nameEn: typeof r.nameEn === 'string' ? r.nameEn : '',
            nameKa: typeof r.nameKa === 'string' ? r.nameKa : '',
            type: (r.type as Room['type']) ?? 'bedroom',
            ...(typeof r.size === 'number' && { size: r.size }),
            ...(typeof r.descriptionEn === 'string' && {
              descriptionEn: r.descriptionEn,
            }),
            ...(typeof r.descriptionKa === 'string' && {
              descriptionKa: r.descriptionKa,
            }),
          }))
      );
    }
    setPasteStatus('pasted');
    setTimeout(() => setPasteStatus('idle'), 1500);
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
      bedrooms: num(form.bedrooms) ?? undefined,
      bathrooms: num(form.bathrooms) ?? undefined,
      livingRooms: num(form.livingRooms) ?? undefined,
      balconies: num(form.balconies) ?? undefined,
      terraces: num(form.terraces) ?? undefined,
      totalSize: Number(form.totalSize) || 0,
      livableArea: num(form.livableArea) ?? undefined,
      balconySize: num(form.balconySize) ?? undefined,
      terraceSize: num(form.terraceSize) ?? undefined,
      price: {
        currency: form.currency,
        amount: Number(form.amount) || 0,
        pricePerSqm: num(form.pricePerSqm) ?? undefined,
        discount: num(form.discount) ?? undefined,
        originalPrice: num(form.originalPrice) ?? undefined,
      },
      furnishingStatus: form.furnishingStatus,
      isActive: form.isActive,
      entranceEn: form.entranceEn.trim() || undefined,
      entranceKa: form.entranceKa.trim() || undefined,
      mainImage: form.mainImage.trim() || undefined,
      images: form.images,
      floorPlanImage: form.floorPlanImage.trim() || undefined,
      twoDContent: form.twoDContent.trim() || undefined,
      threeDContent: form.threeDContent.trim() || undefined,
      videoTourUrl: form.videoTourUrl.trim() || undefined,
      virtualTourUrl: form.virtualTourUrl.trim() || undefined,
      renderImage: form.renderImage.trim() || undefined,
      descriptionEn: form.descriptionEn.trim() || undefined,
      descriptionKa: form.descriptionKa.trim() || undefined,
    };

    // Polygon: parse normalized coordinates directly
    const pe = form.polygonEditor;
    const validEntries = pe.entries.filter((e) => e.raw.trim());
    if (validEntries.length > 0) {
      const nums = validEntries[0].raw
        .replace(/\s+/g, ',')
        .split(',')
        .map((s) => parseFloat(s.trim()))
        .filter((n) => !isNaN(n));
      const points: { x: number; y: number }[] = [];
      for (let i = 0; i + 1 < nums.length; i += 2) {
        points.push({ x: nums[i], y: nums[i + 1] });
      }
      payload.polygon = points;
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
    const cleanRooms: Room[] = roomsList.map((r) => ({
      type: r.type,
      ...(r.nameEn?.trim() && { nameEn: r.nameEn.trim() }),
      ...(r.nameKa?.trim() && { nameKa: r.nameKa.trim() }),
      ...(r.size !== undefined && { size: r.size }),
      ...(r.descriptionEn?.trim() && { descriptionEn: r.descriptionEn.trim() }),
      ...(r.descriptionKa?.trim() && { descriptionKa: r.descriptionKa.trim() }),
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
        <div className="flex items-center justify-end gap-2">
          <span className="font-montserrat text-seu-caption-sm text-admin-fg-dim mr-auto">
            Reuse data across units — copies every property, including
            unit number, block, floor, polygon, and image IDs.
          </span>
          <button
            type="button"
            onClick={handleCopyFeatures}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-admin-border bg-admin-input-gradient hover:border-admin-border-strong text-admin-fg-muted hover:text-admin-fg font-montserrat text-seu-caption-sm transition-colors"
          >
            {copyStatus === 'copied' ? (
              <>
                <Check className="size-3.5" /> Copied
              </>
            ) : (
              <>
                <Copy className="size-3.5" /> Copy JSON
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handlePasteFeatures}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-admin-border bg-admin-input-gradient hover:border-admin-border-strong text-admin-fg-muted hover:text-admin-fg font-montserrat text-seu-caption-sm transition-colors"
          >
            {pasteStatus === 'pasted' ? (
              <>
                <Check className="size-3.5" /> Pasted
              </>
            ) : (
              <>
                <ClipboardPaste className="size-3.5" /> Paste JSON
              </>
            )}
          </button>
        </div>

        <UnitIdentitySection
          value={{
            unitNumber: form.unitNumber,
            block: form.block,
            floor: form.floor,
            entranceEn: form.entranceEn,
            entranceKa: form.entranceKa,
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
