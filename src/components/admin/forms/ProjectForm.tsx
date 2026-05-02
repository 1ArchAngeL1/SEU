'use client';

import { useState } from 'react';
import {
  Field,
  FormFooter,
  FormSelect,
  Input,
  Section,
  Switch,
  Tabs,
  Textarea,
  useTabs,
} from './form-primitives';
import FileUpload from './FileUpload';
import FileGallery from './FileGallery';
import type {
  CreateProjectInput,
  Project,
  ProjectStatus,
} from '@/model/types/api';

const PROJECT_STATUSES: ProjectStatus[] = [
  'planning',
  'presale',
  'under_construction',
  'completed',
  'sold_out',
  'archived',
];

const TABS = [
  { id: 'basics', label: 'Basics' },
  { id: 'description', label: 'Description' },
  { id: 'pricing', label: 'Dates & Pricing' },
  { id: 'media', label: 'Media' },
  { id: 'flags', label: 'Flags' },
];

interface ProjectFormProps {
  initialData?: Project;
  onSubmit: (data: CreateProjectInput) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

function dateInputValue(d?: string | null): string {
  if (!d) return '';
  return d.length >= 10 ? d.slice(0, 10) : d;
}

export default function ProjectForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
}: ProjectFormProps) {
  const tabs = useTabs('basics');

  const [form, setForm] = useState({
    nameKa: initialData?.name?.ka ?? '',
    nameEn: initialData?.name?.en ?? '',
    descriptionKa: initialData?.description?.ka ?? '',
    descriptionEn: initialData?.description?.en ?? '',
    address: initialData?.location?.address ?? '',
    city: initialData?.location?.city ?? '',
    district: initialData?.location?.district ?? '',
    status: (initialData?.status ?? 'planning') as ProjectStatus,
    startDate: dateInputValue(initialData?.startDate),
    expectedCompletionDate: dateInputValue(
      initialData?.expectedCompletionDate
    ),
    actualCompletionDate: dateInputValue(initialData?.actualCompletionDate),
    totalLandArea: initialData?.totalLandArea?.toString() ?? '',
    images: initialData?.images ?? [],
    mainImage: initialData?.mainImage ?? '',
    videoUrl: initialData?.videoUrl ?? '',
    priceCurrency: initialData?.priceRange?.currency ?? 'USD',
    minPrice: initialData?.priceRange?.minPrice?.toString() ?? '',
    maxPrice: initialData?.priceRange?.maxPrice?.toString() ?? '',
    minPricePerSqm:
      initialData?.priceRange?.minPricePerSqm?.toString() ?? '',
    maxPricePerSqm:
      initialData?.priceRange?.maxPricePerSqm?.toString() ?? '',
    isActive: initialData?.isActive ?? true,
    isFeatured: initialData?.isFeatured ?? false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function update<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  function buildPayload(): CreateProjectInput {
    const payload: CreateProjectInput = {
      name: {
        ka: form.nameKa.trim() || undefined,
        en: form.nameEn.trim() || undefined,
      },
      location: {
        address: form.address.trim(),
        city: form.city.trim() || undefined,
        district: form.district.trim() || undefined,
      },
      status: form.status,
      isActive: form.isActive,
      isFeatured: form.isFeatured,
    };

    if (form.descriptionKa || form.descriptionEn) {
      payload.description = {
        ka: form.descriptionKa.trim() || undefined,
        en: form.descriptionEn.trim() || undefined,
      };
    }
    if (form.startDate) payload.startDate = form.startDate;
    if (form.expectedCompletionDate)
      payload.expectedCompletionDate = form.expectedCompletionDate;
    if (form.actualCompletionDate)
      payload.actualCompletionDate = form.actualCompletionDate;
    if (form.totalLandArea !== '')
      payload.totalLandArea = Number(form.totalLandArea);
    if (form.images.length > 0) payload.images = form.images;
    if (form.mainImage) payload.mainImage = form.mainImage.trim();
    if (form.videoUrl) payload.videoUrl = form.videoUrl.trim();

    const minPrice = form.minPrice !== '' ? Number(form.minPrice) : undefined;
    const maxPrice = form.maxPrice !== '' ? Number(form.maxPrice) : undefined;
    const minPricePerSqm =
      form.minPricePerSqm !== '' ? Number(form.minPricePerSqm) : undefined;
    const maxPricePerSqm =
      form.maxPricePerSqm !== '' ? Number(form.maxPricePerSqm) : undefined;
    if (
      minPrice !== undefined ||
      maxPrice !== undefined ||
      minPricePerSqm !== undefined ||
      maxPricePerSqm !== undefined
    ) {
      payload.priceRange = {
        currency: form.priceCurrency,
        minPrice,
        maxPrice,
        minPricePerSqm,
        maxPricePerSqm,
      };
    }
    return payload;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.nameKa && !form.nameEn) {
      setError('Provide at least a Georgian or English name');
      tabs.setActive('basics');
      return;
    }
    if (!form.address.trim()) {
      setError('Address is required');
      tabs.setActive('basics');
      return;
    }
    setLoading(true);
    try {
      await onSubmit(buildPayload());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save project');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs tabs={TABS} active={tabs.active} onChange={tabs.setActive} />

      {tabs.active === 'basics' && (
        <div className="space-y-5">
          <Section title="Name">
            <Field label="Name (Georgian)">
              <Input
                value={form.nameKa}
                onChange={(e) => update('nameKa', e.target.value)}
                placeholder="სახელი"
              />
            </Field>
            <Field label="Name (English)">
              <Input
                value={form.nameEn}
                onChange={(e) => update('nameEn', e.target.value)}
                placeholder="e.g. SEU Varketili"
              />
            </Field>
          </Section>
          <Section title="Location" cols={3}>
            <Field label="Address" className="sm:col-span-3">
              <Input
                value={form.address}
                onChange={(e) => update('address', e.target.value)}
                placeholder="e.g. Vazha-Pshavela Ave 76"
              />
            </Field>
            <Field label="City">
              <Input
                value={form.city}
                onChange={(e) => update('city', e.target.value)}
                placeholder="Tbilisi"
              />
            </Field>
            <Field label="District">
              <Input
                value={form.district}
                onChange={(e) => update('district', e.target.value)}
                placeholder="Saburtalo"
              />
            </Field>
            <Field label="Status">
              <FormSelect
                value={form.status}
                onChange={(v) => update('status', v as ProjectStatus)}
                options={PROJECT_STATUSES.map((s) => ({ value: s }))}
              />
            </Field>
          </Section>
        </div>
      )}

      {tabs.active === 'description' && (
        <div className="space-y-3">
          <Field label="Description (Georgian)">
            <Textarea
              value={form.descriptionKa}
              onChange={(e) => update('descriptionKa', e.target.value)}
              placeholder="აღწერა ქართულად"
            />
          </Field>
          <Field label="Description (English)">
            <Textarea
              value={form.descriptionEn}
              onChange={(e) => update('descriptionEn', e.target.value)}
              placeholder="English description"
            />
          </Field>
        </div>
      )}

      {tabs.active === 'pricing' && (
        <div className="space-y-5">
          <Section title="Dates" cols={3}>
            <Field label="Start date">
              <Input
                type="date"
                value={form.startDate}
                onChange={(e) => update('startDate', e.target.value)}
              />
            </Field>
            <Field label="Expected completion">
              <Input
                type="date"
                value={form.expectedCompletionDate}
                onChange={(e) =>
                  update('expectedCompletionDate', e.target.value)
                }
              />
            </Field>
            <Field label="Actual completion">
              <Input
                type="date"
                value={form.actualCompletionDate}
                onChange={(e) =>
                  update('actualCompletionDate', e.target.value)
                }
              />
            </Field>
            <Field label="Total land area (m²)">
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.totalLandArea}
                onChange={(e) => update('totalLandArea', e.target.value)}
              />
            </Field>
          </Section>
          <Section title="Price range" cols={3}>
            <Field label="Currency">
              <FormSelect
                value={form.priceCurrency}
                onChange={(v) => update('priceCurrency', v)}
                options={[
                  { value: 'USD', label: 'USD ($)' },
                  { value: 'GEL', label: 'GEL (₾)' },
                  { value: 'EUR', label: 'EUR (€)' },
                ]}
              />
            </Field>
            <Field label="Min price">
              <Input
                type="number"
                min="0"
                value={form.minPrice}
                onChange={(e) => update('minPrice', e.target.value)}
              />
            </Field>
            <Field label="Max price">
              <Input
                type="number"
                min="0"
                value={form.maxPrice}
                onChange={(e) => update('maxPrice', e.target.value)}
              />
            </Field>
            <Field label="Min price / m²">
              <Input
                type="number"
                min="0"
                value={form.minPricePerSqm}
                onChange={(e) => update('minPricePerSqm', e.target.value)}
              />
            </Field>
            <Field label="Max price / m²">
              <Input
                type="number"
                min="0"
                value={form.maxPricePerSqm}
                onChange={(e) => update('maxPricePerSqm', e.target.value)}
              />
            </Field>
          </Section>
        </div>
      )}

      {tabs.active === 'media' && (
        <div className="space-y-5">
          <Field label="Main image" hint="Cover image used in cards and headers">
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
          <Field label="Video URL" hint="External video link (YouTube, Vimeo, …)">
            <Input
              value={form.videoUrl}
              onChange={(e) => update('videoUrl', e.target.value)}
              placeholder="https://youtube.com/…"
            />
          </Field>
        </div>
      )}

      {tabs.active === 'flags' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Switch
              label="Active"
              checked={form.isActive}
              onChange={(v) => update('isActive', v)}
            />
            <Switch
              label="Featured"
              checked={form.isFeatured}
              onChange={(v) => update('isFeatured', v)}
            />
          </div>
        </div>
      )}

      <FormFooter
        onCancel={onCancel}
        loading={loading}
        submitLabel={submitLabel}
        error={error}
      />
    </form>
  );
}
