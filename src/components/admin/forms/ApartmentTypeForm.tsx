'use client';

import { useState } from 'react';
import { Input, Textarea } from '@/components/ui/input';
import {
  Field,
  FormFooter,
  Section,
  Switch,
} from '@/components/admin/forms/form-primitives';
import FileUpload from '@/components/admin/forms/FileUpload';
import type {
  ApartmentType,
  CreateApartmentTypeInput,
} from '@/model/types/api';

interface ApartmentTypeFormProps {
  projectId: string;
  initialData?: ApartmentType;
  onSubmit: (input: CreateApartmentTypeInput) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
}

export default function ApartmentTypeForm({
  projectId,
  initialData,
  onSubmit,
  onCancel,
  submitLabel,
}: ApartmentTypeFormProps) {
  const [form, setForm] = useState({
    nameKa: initialData?.nameKa ?? '',
    nameEn: initialData?.nameEn ?? '',
    bedrooms: initialData?.bedrooms?.toString() ?? '0',
    sizeFrom: initialData?.sizeFrom?.toString() ?? '',
    sizeTo: initialData?.sizeTo?.toString() ?? '',
    image: initialData?.image ?? '',
    descriptionKa: initialData?.descriptionKa ?? '',
    descriptionEn: initialData?.descriptionEn ?? '',
    isActive: initialData?.isActive ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const bedrooms = Number(form.bedrooms);
    const sizeFrom = Number(form.sizeFrom);
    const sizeTo = Number(form.sizeTo);

    if (!Number.isFinite(bedrooms) || bedrooms < 0) {
      setError('Bedrooms must be 0 or greater');
      return;
    }
    if (!Number.isFinite(sizeFrom) || sizeFrom < 0) {
      setError('Size from must be 0 or greater');
      return;
    }
    if (!Number.isFinite(sizeTo) || sizeTo < 0) {
      setError('Size to must be 0 or greater');
      return;
    }
    if (sizeFrom > sizeTo) {
      setError('Size from must be ≤ size to');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const payload: CreateApartmentTypeInput = {
        project: projectId,
        bedrooms,
        sizeFrom,
        sizeTo,
        isActive: form.isActive,
        ...(form.nameEn.trim() && { nameEn: form.nameEn.trim() }),
        ...(form.nameKa.trim() && { nameKa: form.nameKa.trim() }),
        ...(form.descriptionEn.trim() && { descriptionEn: form.descriptionEn.trim() }),
        ...(form.descriptionKa.trim() && { descriptionKa: form.descriptionKa.trim() }),
        ...(form.image && { image: form.image }),
      };
      await onSubmit(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Section title="Image">
        <Field label="Apartment Type Image" className="sm:col-span-2">
          <FileUpload
            value={form.image || undefined}
            onChange={(v) => set('image', v ?? '')}
            accept="image/*"
            emptyLabel="Upload apartment type image"
          />
        </Field>
      </Section>

      <Section title="Name">
        <Field label="Name (English)" hint="e.g. Studio, 1 Bedroom">
          <Input
            value={form.nameEn}
            onChange={(e) => set('nameEn', e.target.value)}
            placeholder="Studio"
          />
        </Field>
        <Field label="Name (Georgian)" hint="e.g. სტუდიო, 1 საძინებელი">
          <Input
            value={form.nameKa}
            onChange={(e) => set('nameKa', e.target.value)}
            placeholder="სტუდიო"
          />
        </Field>
      </Section>

      <Section title="Specs" cols={3}>
        <Field label="Bedrooms *" hint="0 = Studio">
          <Input
            type="number"
            min={0}
            value={form.bedrooms}
            onChange={(e) => set('bedrooms', e.target.value)}
            placeholder="0"
          />
        </Field>
        <Field label="Size from (m²) *">
          <Input
            type="number"
            min={0}
            step="0.1"
            value={form.sizeFrom}
            onChange={(e) => set('sizeFrom', e.target.value)}
            placeholder="30"
          />
        </Field>
        <Field label="Size to (m²) *">
          <Input
            type="number"
            min={0}
            step="0.1"
            value={form.sizeTo}
            onChange={(e) => set('sizeTo', e.target.value)}
            placeholder="50"
          />
        </Field>
      </Section>

      <Section title="Description" cols={1}>
        <Field label="Description (Georgian)">
          <Textarea
            value={form.descriptionKa}
            onChange={(e) => set('descriptionKa', e.target.value)}
            placeholder="ბინის ტიპის აღწერა…"
          />
        </Field>
        <Field label="Description (English)">
          <Textarea
            value={form.descriptionEn}
            onChange={(e) => set('descriptionEn', e.target.value)}
            placeholder="Apartment type description…"
          />
        </Field>
      </Section>

      <Section cols={1}>
        <Switch
          label="Active"
          checked={form.isActive}
          onChange={(v) => set('isActive', v)}
        />
      </Section>

      <FormFooter
        onCancel={onCancel}
        loading={loading}
        submitLabel={submitLabel}
        error={error}
      />
    </form>
  );
}
