'use client';

import { useState, useEffect } from 'react';
import { buildingSchema } from '@/lib/schemas/admin';
import { getAllProjects } from '@/prisma/project';

const inputClass =
  'bg-secondary-black/40 border border-secondary-black text-pale-gray placeholder:text-secondary-grey/60 rounded-lg px-3 py-2 text-seu-caption focus:outline-none focus:border-pale-gray/40 transition-colors w-full';
const selectClass =
  'bg-secondary-black/40 border border-secondary-black text-pale-gray rounded-lg px-3 py-2 text-seu-caption focus:outline-none focus:border-pale-gray/40 transition-colors w-full';
const labelClass = 'text-seu-caption-sm text-secondary-grey font-montserrat';
const btnPrimary =
  'bg-primary-green text-white font-montserrat font-medium text-seu-caption px-6 py-2 rounded-lg hover:bg-primary-green/85 transition-colors disabled:opacity-50';

interface BuildingFormProps {
  initialData?: { projectId: string; block: string; floorCount: number };
  fixedProjectId?: string;
  onSubmit: (data: {
    projectId: string;
    block: string;
    floorCount: number;
  }) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export default function BuildingForm({
  initialData,
  fixedProjectId,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
}: BuildingFormProps) {
  const [projects, setProjects] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [projectId, setProjectId] = useState(
    fixedProjectId ?? initialData?.projectId ?? ''
  );
  const [block, setBlock] = useState(initialData?.block ?? '');
  const [floorCount, setFloorCount] = useState(
    initialData?.floorCount?.toString() ?? ''
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getAllProjects().then((projs) => {
      setProjects(projs);
      if (!projectId && projs.length > 0) {
        setProjectId(projs[0].id);
      }
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const result = buildingSchema.safeParse({ projectId, block, floorCount });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setLoading(true);
    try {
      await onSubmit(result.data);
    } catch {
      setError('Failed to save building');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!fixedProjectId && (
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Project</label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className={selectClass}
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="flex flex-col gap-1">
        <label className={labelClass}>Block</label>
        <input
          value={block}
          onChange={(e) => setBlock(e.target.value)}
          placeholder="e.g. A"
          required
          className={inputClass}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className={labelClass}>Floor Count</label>
        <input
          value={floorCount}
          onChange={(e) => setFloorCount(e.target.value)}
          placeholder="e.g. 12"
          type="number"
          min="1"
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
