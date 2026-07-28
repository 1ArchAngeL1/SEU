'use client';

import { useState } from 'react';
import { Input, Textarea } from '@/components/ui/input';
import {
  Field,
  FormFooter,
  Section,
} from '@/components/admin/forms/form-primitives';
import FileUpload from '@/components/admin/forms/FileUpload';
import type {
  LandingPartner,
  CreateLandingPartnerInput,
} from '@/model/types/api';

interface LandingPartnerFormProps {
  initialData?: LandingPartner;
  onSubmit: (input: CreateLandingPartnerInput) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
}

export default function LandingPartnerForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel,
}: LandingPartnerFormProps) {
  const [form, setForm] = useState({
    nameEn: initialData?.nameEn ?? '',
    nameKa: initialData?.nameKa ?? '',
    logoId: initialData?.logoId ?? '',
    websiteLink: initialData?.websiteLink ?? '',
    descriptionEn: initialData?.descriptionEn ?? '',
    descriptionKa: initialData?.descriptionKa ?? '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nameEn.trim() || !form.nameKa.trim()) {
      setError('Both English and Georgian names are required');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const payload: CreateLandingPartnerInput = {
        nameEn: form.nameEn.trim(),
        nameKa: form.nameKa.trim(),
        ...(form.logoId && { logoId: form.logoId }),
        ...(form.websiteLink && { websiteLink: form.websiteLink.trim() }),
        ...(form.descriptionEn && { descriptionEn: form.descriptionEn.trim() }),
        ...(form.descriptionKa && { descriptionKa: form.descriptionKa.trim() }),
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
      <Section title="Logo">
        <Field label="Partner Logo" className="sm:col-span-2">
          <FileUpload
            value={form.logoId || undefined}
            onChange={(v) => set('logoId', v ?? '')}
            accept="image/*"
            emptyLabel="Upload partner logo"
          />
        </Field>
      </Section>

      <Section title="Basic Info">
        <Field label="Name (English) *">
          <Input
            value={form.nameEn}
            onChange={(e) => set('nameEn', e.target.value)}
            placeholder="Partner name"
          />
        </Field>
        <Field label="Name (Georgian) *">
          <Input
            value={form.nameKa}
            onChange={(e) => set('nameKa', e.target.value)}
            placeholder="პარტნიორის სახელი"
          />
        </Field>
        <Field label="Website Link" className="sm:col-span-2">
          <Input
            value={form.websiteLink}
            onChange={(e) => set('websiteLink', e.target.value)}
            placeholder="https://partner.com"
          />
        </Field>
      </Section>

      <Section title="Description">
        <Field label="Description (English)">
          <Textarea
            value={form.descriptionEn}
            onChange={(e) => set('descriptionEn', e.target.value)}
            placeholder="Brief description of the partner…"
          />
        </Field>
        <Field label="Description (Georgian)">
          <Textarea
            value={form.descriptionKa}
            onChange={(e) => set('descriptionKa', e.target.value)}
            placeholder="პარტნიორის მოკლე აღწერა…"
          />
        </Field>
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
