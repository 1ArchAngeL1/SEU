'use client';

import { useState } from 'react';
import { Field, FormFooter, Input, Section } from './form-primitives';
import FileUpload from './FileUpload';
import type {
  CreateFloorInput,
  Floor,
  UpdateFloorInput,
} from '@/model/types/api';

interface FloorFormProps {
  buildingId: string;
  initialData?: Floor;
  existingFloorNumbers?: number[];
  defaultFloorNumber?: number;
  onSubmit: (
    payload:
      | { mode: 'create'; data: CreateFloorInput }
      | { mode: 'update'; data: UpdateFloorInput }
  ) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export default function FloorForm({
  buildingId,
  initialData,
  existingFloorNumbers = [],
  defaultFloorNumber,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
}: FloorFormProps) {
  const isEdit = !!initialData;
  const [floorNumber, setFloorNumber] = useState(
    initialData?.floorNumber.toString() ??
      (defaultFloorNumber !== undefined ? String(defaultFloorNumber) : '')
  );
  const [floorImageId, setFloorImageId] = useState(
    initialData?.floorImageId ?? ''
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const num = Number(floorNumber);
    if (!Number.isFinite(num) || !Number.isInteger(num)) {
      setError('Floor number must be an integer');
      return;
    }
    if (num < -10) {
      setError('Floor number cannot be lower than -10');
      return;
    }
    if (!isEdit && existingFloorNumbers.includes(num)) {
      setError(`Floor ${num} already exists in this building`);
      return;
    }
    setLoading(true);
    try {
      if (isEdit) {
        await onSubmit({
          mode: 'update',
          data: { floorImageId: floorImageId.trim() || undefined },
        });
      } else {
        await onSubmit({
          mode: 'create',
          data: {
            building: buildingId,
            floorNumber: num,
            floorImageId: floorImageId.trim() || undefined,
          },
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save floor');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Section title="Floor identity" cols={1}>
        <Field
          label="Floor number"
          hint="Use 1 for ground/first, -1 for first basement, etc."
        >
          <Input
            type="number"
            min="-10"
            value={floorNumber}
            onChange={(e) => setFloorNumber(e.target.value)}
            disabled={isEdit}
            placeholder="1"
            className={isEdit ? 'opacity-60 cursor-not-allowed' : ''}
          />
        </Field>
        <Field
          label="Floor plan"
          hint="Upload an image of this floor's layout. Optional."
        >
          <FileUpload
            value={floorImageId || undefined}
            onChange={(v) => setFloorImageId(v ?? '')}
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
