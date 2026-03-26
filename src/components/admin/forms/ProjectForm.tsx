'use client';

import { useState } from 'react';
import { projectSchema } from '@/lib/schemas/admin';

const inputClass =
  'bg-secondary-black/40 border border-secondary-black text-pale-gray placeholder:text-secondary-grey/60 rounded-lg px-3 py-2 text-seu-caption focus:outline-none focus:border-pale-gray/40 transition-colors w-full';
const labelClass = 'text-seu-caption-sm text-secondary-grey font-montserrat';
const btnPrimary =
  'bg-primary-green text-white font-montserrat font-medium text-seu-caption px-6 py-2 rounded-lg hover:bg-primary-green/85 transition-colors disabled:opacity-50';

interface ProjectFormProps {
  initialData?: { name: string; address: string };
  onSubmit: (data: { name: string; address: string }) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export default function ProjectForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
}: ProjectFormProps) {
  const [name, setName] = useState(initialData?.name ?? '');
  const [address, setAddress] = useState(initialData?.address ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const result = projectSchema.safeParse({ name, address });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setLoading(true);
    try {
      await onSubmit(result.data);
    } catch {
      setError('Failed to save project');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-1">
        <label className={labelClass}>Project Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. SEU Varketili"
          required
          className={inputClass}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className={labelClass}>Address</label>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="e.g. Varketili, Tbilisi"
          required
          className={inputClass}
        />
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
