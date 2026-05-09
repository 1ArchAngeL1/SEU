'use client';

import { useState } from 'react';
import { Field, FormFooter, Input, Section } from './form-primitives';
import FileUpload from './FileUpload';
import PolygonsEditor, { type PolygonEditorValue } from './PolygonsEditor';
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
  const [polygonDirty, setPolygonDirty] = useState(false);
  const [floorNumber, setFloorNumber] = useState(
    initialData?.floorNumber.toString() ??
      (defaultFloorNumber !== undefined ? String(defaultFloorNumber) : '')
  );
  const [floorImageId, setFloorImageId] = useState(
    initialData?.floorImageId ?? ''
  );
  const [renderImage, setRenderImage] = useState(
    initialData?.renderImage ?? ''
  );
  const [polygonEditor, setPolygonEditor] = useState<PolygonEditorValue>({
    entries: initialData?.polygon?.length
      ? [{ raw: initialData.polygon.map((pt) => `${pt.x},${pt.y}`).join(','), label: '' }]
      : [],
    imageWidth: '',
    imageHeight: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handlePolygonChange(val: PolygonEditorValue) {
    setPolygonDirty(true);
    setPolygonEditor(val);
  }

  function buildPolygonFields(): Record<string, unknown> {
    const validEntries = polygonEditor.entries.filter((e) => e.raw.trim());
    if (validEntries.length > 0) {
      if (polygonDirty) {
        const imgW = Number(polygonEditor.imageWidth);
        const imgH = Number(polygonEditor.imageHeight);
        if (imgW > 0 && imgH > 0) {
          return {
            rawPolygon: validEntries[0].raw.replace(/\s+/g, ','),
            imageWidth: imgW,
            imageHeight: imgH,
          };
        }
      } else if (initialData?.polygon?.length) {
        return { polygon: initialData.polygon };
      }
    } else {
      return { polygon: [] as { x: number; y: number }[] };
    }
    return {};
  }

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
    const hasPolygons = polygonEditor.entries.some((e) => e.raw.trim());
    if (hasPolygons && polygonDirty) {
      const imgW = Number(polygonEditor.imageWidth);
      const imgH = Number(polygonEditor.imageHeight);
      if (!imgW || !imgH) {
        setError('Enter the source image width and height for polygon coordinate conversion.');
        return;
      }
    }
    setLoading(true);
    try {
      const polyFields = buildPolygonFields();
      if (isEdit) {
        await onSubmit({
          mode: 'update',
          data: {
            floorImageId: floorImageId.trim() || null,
            renderImage: renderImage.trim() || null,
            ...polyFields,
          },
        });
      } else {
        await onSubmit({
          mode: 'create',
          data: {
            building: buildingId,
            floorNumber: num,
            floorImageId: floorImageId.trim() || null,
            renderImage: renderImage.trim() || null,
            ...polyFields,
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
        <Field
          label="Render image"
          hint="Reference image for interactive polygon mapping"
        >
          <FileUpload
            value={renderImage || undefined}
            onChange={(v) => setRenderImage(v ?? '')}
          />
        </Field>
        <PolygonsEditor
          value={polygonEditor}
          onChange={handlePolygonChange}
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
