'use client';

import { useState } from 'react';
import {
  Field,
  FormSelect,
  Input,
  Section,
  Switch,
  Textarea,
  btnGhost,
  btnPrimary,
} from './form-primitives';
import FileUpload from './FileUpload';
import FileGallery from './FileGallery';
import type {
  CreateUnitInput,
  FurnishingStatus,
  Unit,
  UnitStatus,
  UnitType,
} from '@/model/types/api';
import { cn } from '@/lib/utils';

const STATUSES: UnitStatus[] = [
  'available',
  'reserved',
  'sold',
  'not_for_sale',
];
const TYPES: UnitType[] = ['living', 'commerce', 'parking', 'storage'];
const FURNISHING: FurnishingStatus[] = [
  'without',
  'rough_draft',
  'finishing',
  'shell_and_core',
];

interface UnitFormProps {
  buildingId: string;
  projectId: string;
  defaultBlock: string;
  initialData?: Unit;
  initialFloor?: number;
  initialUnitNumber?: string;
  onSubmit: (data: CreateUnitInput) => Promise<void>;
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
    entrance: initialData?.entrance ?? '',
    type: (initialData?.type ?? 'living') as UnitType,
    status: (initialData?.status ?? 'available') as UnitStatus,

    // Rooms
    rooms: initialData?.rooms?.toString() ?? '1',
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
    videoTourUrl: initialData?.videoTourUrl ?? '',
    virtualTourUrl: initialData?.virtualTourUrl ?? '',

    // Description
    descriptionKa: initialData?.description?.ka ?? '',
    descriptionEn: initialData?.description?.en ?? '',

    // Flags
    furnishingStatus: (initialData?.furnishingStatus ??
      'rough_draft') as FurnishingStatus,
    isActive: initialData?.isActive ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function update<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  function buildPayload(): CreateUnitInput {
    const pricePerSqm = num(form.pricePerSqm);
    const discount = num(form.discount);
    const originalPrice = num(form.originalPrice);

    const payload: CreateUnitInput = {
      building: buildingId,
      project: projectId,
      unitNumber: form.unitNumber.trim(),
      block: form.block.trim().toUpperCase(),
      floorNumber: Number(form.floor) || 0,
      type: form.type,
      status: form.status,
      rooms: num(form.rooms),
      bedrooms: num(form.bedrooms),
      bathrooms: num(form.bathrooms),
      livingRooms: num(form.livingRooms),
      balconies: num(form.balconies),
      terraces: num(form.terraces),
      totalSize: Number(form.totalSize) || 0,
      livableArea: num(form.livableArea),
      balconySize: num(form.balconySize),
      terraceSize: num(form.terraceSize),
      price: {
        currency: form.currency,
        amount: Number(form.amount) || 0,
        ...(pricePerSqm !== undefined && { pricePerSqm }),
        ...(discount !== undefined && { discount }),
        ...(originalPrice !== undefined && { originalPrice }),
      },
      furnishingStatus: form.furnishingStatus,
      isActive: form.isActive,
    };
    if (form.entrance) payload.entrance = form.entrance.trim();
    if (form.mainImage) payload.mainImage = form.mainImage.trim();
    if (form.images.length > 0) payload.images = form.images;
    if (form.floorPlanImage)
      payload.floorPlanImage = form.floorPlanImage.trim();
    if (form.videoTourUrl) payload.videoTourUrl = form.videoTourUrl.trim();
    if (form.virtualTourUrl)
      payload.virtualTourUrl = form.virtualTourUrl.trim();
    if (form.descriptionKa || form.descriptionEn) {
      payload.description = {
        ka: form.descriptionKa.trim() || undefined,
        en: form.descriptionEn.trim() || undefined,
      };
    }

    return Object.fromEntries(
      Object.entries(payload).filter(([, v]) => v !== undefined)
    ) as CreateUnitInput;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.unitNumber.trim()) return setError('Unit number is required');
    if (!form.block.trim()) return setError('Block is required');
    if (form.floor === '') return setError('Floor is required');
    if (!form.totalSize) return setError('Total size is required');
    if (!form.amount) return setError('Price amount is required');
    setLoading(true);
    try {
      await onSubmit(buildPayload());
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
        <FormBlock
          title="Identity"
          subtitle="Where in the building this unit lives"
        >
          <Section cols={3}>
            <Field label="Unit number" hint="Unique within the building">
              <Input
                value={form.unitNumber}
                onChange={(e) => update('unitNumber', e.target.value)}
                placeholder="e.g. A-12-3"
              />
            </Field>
            <Field label="Block">
              <Input
                value={form.block}
                onChange={(e) => update('block', e.target.value)}
                className="uppercase"
              />
            </Field>
            <Field label="Floor">
              <Input
                type="number"
                value={form.floor}
                onChange={(e) => update('floor', e.target.value)}
              />
            </Field>
            <Field label="Entrance">
              <Input
                value={form.entrance}
                onChange={(e) => update('entrance', e.target.value)}
                placeholder="optional"
              />
            </Field>
            <Field label="Type">
              <FormSelect
                value={form.type}
                onChange={(v) => update('type', v as UnitType)}
                options={TYPES.map((t) => ({ value: t }))}
              />
            </Field>
            <Field label="Status">
              <FormSelect
                value={form.status}
                onChange={(v) => update('status', v as UnitStatus)}
                options={STATUSES.map((s) => ({ value: s }))}
              />
            </Field>
          </Section>
        </FormBlock>

        <FormBlock title="Rooms" subtitle="How the interior is split up">
          <Section cols={3}>
            <Field label="Total rooms">
              <Input
                type="number"
                min="1"
                value={form.rooms}
                onChange={(e) => update('rooms', e.target.value)}
              />
            </Field>
            <Field label="Bedrooms">
              <Input
                type="number"
                min="0"
                value={form.bedrooms}
                onChange={(e) => update('bedrooms', e.target.value)}
              />
            </Field>
            <Field label="Bathrooms">
              <Input
                type="number"
                min="0"
                value={form.bathrooms}
                onChange={(e) => update('bathrooms', e.target.value)}
              />
            </Field>
            <Field label="Living rooms">
              <Input
                type="number"
                min="0"
                value={form.livingRooms}
                onChange={(e) => update('livingRooms', e.target.value)}
              />
            </Field>
            <Field label="Balconies">
              <Input
                type="number"
                min="0"
                value={form.balconies}
                onChange={(e) => update('balconies', e.target.value)}
              />
            </Field>
            <Field label="Terraces">
              <Input
                type="number"
                min="0"
                value={form.terraces}
                onChange={(e) => update('terraces', e.target.value)}
              />
            </Field>
          </Section>
        </FormBlock>

        <FormBlock title="Areas (m²)" subtitle="Surfaces in square meters">
          <Section cols={4}>
            <Field label="Total size">
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.totalSize}
                onChange={(e) => update('totalSize', e.target.value)}
              />
            </Field>
            <Field label="Livable area">
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.livableArea}
                onChange={(e) => update('livableArea', e.target.value)}
              />
            </Field>
            <Field label="Balcony">
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.balconySize}
                onChange={(e) => update('balconySize', e.target.value)}
              />
            </Field>
            <Field label="Terrace">
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.terraceSize}
                onChange={(e) => update('terraceSize', e.target.value)}
              />
            </Field>
          </Section>
        </FormBlock>

        <FormBlock title="Pricing" subtitle="Headline price and discounts">
          <Section cols={3}>
            <Field label="Amount">
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={(e) => update('amount', e.target.value)}
              />
            </Field>
            <Field label="Currency">
              <FormSelect
                value={form.currency}
                onChange={(v) => update('currency', v)}
                options={[
                  { value: 'USD', label: 'USD ($)' },
                  { value: 'GEL', label: 'GEL (₾)' },
                  { value: 'EUR', label: 'EUR (€)' },
                ]}
              />
            </Field>
            <Field label="Price / m²">
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.pricePerSqm}
                onChange={(e) => update('pricePerSqm', e.target.value)}
              />
            </Field>
            <Field label="Discount">
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.discount}
                onChange={(e) => update('discount', e.target.value)}
              />
            </Field>
            <Field label="Original price" hint="Pre-discount">
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.originalPrice}
                onChange={(e) => update('originalPrice', e.target.value)}
              />
            </Field>
          </Section>
        </FormBlock>

        <FormBlock title="Media" subtitle="Image, floor plan, and tour links">
          <div className="space-y-5">
            <Field label="Main image" hint="Cover image used in cards and listings">
              <FileUpload
                value={form.mainImage || undefined}
                onChange={(v) => update('mainImage', v ?? '')}
              />
            </Field>
            <Field label="Gallery">
              <FileGallery
                value={form.images}
                onChange={(v) => update('images', v)}
              />
            </Field>
            <Field
              label="Floor plan"
              hint="Image of this unit's layout"
            >
              <FileUpload
                value={form.floorPlanImage || undefined}
                onChange={(v) => update('floorPlanImage', v ?? '')}
              />
            </Field>
            <Section cols={2}>
              <Field
                label="Video tour URL"
                hint="External link (YouTube, Vimeo, …)"
              >
                <Input
                  value={form.videoTourUrl}
                  onChange={(e) => update('videoTourUrl', e.target.value)}
                  placeholder="https://youtube.com/…"
                />
              </Field>
              <Field
                label="Virtual tour URL"
                hint="External link (Matterport, …)"
              >
                <Input
                  value={form.virtualTourUrl}
                  onChange={(e) => update('virtualTourUrl', e.target.value)}
                  placeholder="https://matterport.com/…"
                />
              </Field>
            </Section>
          </div>
        </FormBlock>

        <FormBlock title="Description" subtitle="Localised marketing copy">
          <div className="space-y-3">
            <Field label="Description (Georgian)">
              <Textarea
                value={form.descriptionKa}
                onChange={(e) => update('descriptionKa', e.target.value)}
              />
            </Field>
            <Field label="Description (English)">
              <Textarea
                value={form.descriptionEn}
                onChange={(e) => update('descriptionEn', e.target.value)}
              />
            </Field>
          </div>
        </FormBlock>

        <FormBlock title="Flags & finishing">
          <Section cols={2}>
            <Field label="Furnishing status">
              <FormSelect
                value={form.furnishingStatus}
                onChange={(v) =>
                  update('furnishingStatus', v as FurnishingStatus)
                }
                options={FURNISHING.map((f) => ({ value: f }))}
              />
            </Field>
            <Switch
              label="Active"
              checked={form.isActive}
              onChange={(v) => update('isActive', v)}
            />
          </Section>
        </FormBlock>

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

function FormBlock({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-admin-border bg-admin-card-gradient shadow-admin overflow-hidden">
      <header className="px-5 py-3 border-b border-admin-border-soft flex items-center gap-3">
        <span className="size-1.5 rounded-full bg-primary-green shadow-[0_0_6px] shadow-primary-green/60" />
        <h3 className="font-[--font-bodoni] text-seu-subheading text-admin-fg leading-none">
          {title}
        </h3>
        {subtitle && (
          <span className="font-montserrat text-seu-caption-sm text-admin-fg-muted truncate">
            · {subtitle}
          </span>
        )}
      </header>
      <div className="px-5 py-5">{children}</div>
    </section>
  );
}
