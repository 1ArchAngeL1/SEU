'use client';

import { useState } from 'react';
import { Input, Textarea } from '@/components/ui/input';
import {
  Field,
  FormFooter,
  Section,
} from '@/components/admin/forms/form-primitives';
import FileUpload from '@/components/admin/forms/FileUpload';
import type { Partner, CreatePartnerInput } from '@/model/types/api';

interface PartnerFormProps {
  initialData?: Partner;
  onSubmit: (input: CreatePartnerInput) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
}

export default function PartnerForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel,
}: PartnerFormProps) {
  const [form, setForm] = useState({
    name: initialData?.name ?? '',
    description: initialData?.description ?? '',
    logoId: initialData?.logoId ?? '',
    mail: initialData?.mail ?? '',
    phone: initialData?.phone ?? '',
    address: initialData?.address ?? '',
    facebookLink: initialData?.facebookLink ?? '',
    discountPercentage: initialData?.discountPercentage ?? '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Name is required');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const payload: CreatePartnerInput = {
        name: form.name.trim(),
        ...(form.description && { description: form.description.trim() }),
        ...(form.logoId && { logoId: form.logoId }),
        ...(form.mail && { mail: form.mail.trim() }),
        ...(form.phone && { phone: form.phone.trim() }),
        ...(form.address && { address: form.address.trim() }),
        ...(form.facebookLink && { facebookLink: form.facebookLink.trim() }),
        ...(form.discountPercentage !== '' && {
          discountPercentage: Number(form.discountPercentage),
        }),
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
        <Field label="Name *">
          <Input
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="Partner name"
          />
        </Field>
        <Field label="Email">
          <Input
            type="email"
            value={form.mail}
            onChange={(e) => set('mail', e.target.value)}
            placeholder="contact@partner.com"
          />
        </Field>
        <Field label="Phone">
          <Input
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            placeholder="+995 ..."
          />
        </Field>
        <Field label="Address">
          <Input
            value={form.address}
            onChange={(e) => set('address', e.target.value)}
            placeholder="Partner address"
          />
        </Field>
      </Section>

      <Section title="Links & Details">
        <Field label="Facebook Link">
          <Input
            value={form.facebookLink}
            onChange={(e) => set('facebookLink', e.target.value)}
            placeholder="https://facebook.com/..."
          />
        </Field>
        <Field label="Discount %" hint="0–100">
          <Input
            type="number"
            min={0}
            max={100}
            value={form.discountPercentage}
            onChange={(e) => set('discountPercentage', e.target.value)}
            placeholder="e.g. 10"
          />
        </Field>
      </Section>

      <Section title="Description" cols={1}>
        <Field label="Description">
          <Textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Brief description of the partner…"
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
