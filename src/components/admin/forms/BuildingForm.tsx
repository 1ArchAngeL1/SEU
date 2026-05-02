'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAllProjects } from '@/hooks/queries/use-projects';
import { pickLocale } from '@/lib/i18n-helpers';
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
  Building,
  BuildingStatus,
  CreateBuildingInput,
} from '@/model/types/api';

const BUILDING_STATUSES: BuildingStatus[] = [
  'planning',
  'foundation',
  'under_construction',
  'finishing',
  'completed',
  'occupied',
];

const TABS = [
  { id: 'basics', label: 'Basics' },
  { id: 'sizes', label: 'Sizes & Progress' },
  { id: 'description', label: 'Description' },
  { id: 'media', label: 'Media' },
  { id: 'flags', label: 'Flags' },
];

interface BuildingFormProps {
  initialData?: Building;
  fixedProjectId?: string;
  onSubmit: (data: CreateBuildingInput) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

function projectIdOf(b?: Building): string {
  if (!b) return '';
  return typeof b.project === 'string' ? b.project : b.project.id;
}

export default function BuildingForm({
  initialData,
  fixedProjectId,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
}: BuildingFormProps) {
  const tabs = useTabs('basics');
  const projectsQ = useAllProjects();
  const projects = useMemo(() => projectsQ.data ?? [], [projectsQ.data]);

  const isEdit = !!initialData;

  const [form, setForm] = useState({
    project: fixedProjectId ?? projectIdOf(initialData) ?? '',
    nameKa: initialData?.name?.ka ?? '',
    nameEn: initialData?.name?.en ?? '',
    block: initialData?.block ?? '',
    address: initialData?.location?.address ?? '',
    status: (initialData?.status ?? 'planning') as BuildingStatus,
    basementFloors: initialData?.basementFloors?.toString() ?? '0',
    totalSize: initialData?.totalSize?.toString() ?? '',
    livableArea: initialData?.livableArea?.toString() ?? '',
    parkingSpaces: initialData?.parkingSpaces?.toString() ?? '0',
    constructionProgress:
      initialData?.constructionProgress?.toString() ?? '0',
    descriptionKa: initialData?.description?.ka ?? '',
    descriptionEn: initialData?.description?.en ?? '',
    mainImage: initialData?.mainImage ?? '',
    images: initialData?.images ?? [],
    isActive: initialData?.isActive ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function update<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  useEffect(() => {
    if (!form.project && projects.length > 0) {
      setForm((p) => ({ ...p, project: projects[0].id }));
    }
  }, [projects, form.project]);

  function buildPayload(): CreateBuildingInput {
    const payload: CreateBuildingInput = {
      project: form.project,
      name: {
        ka: form.nameKa.trim() || undefined,
        en: form.nameEn.trim() || undefined,
      },
      block: form.block.trim().toUpperCase(),
      status: form.status,
      isActive: form.isActive,
    };
    if (form.address) payload.location = { address: form.address.trim() };
    if (form.basementFloors !== '')
      payload.basementFloors = Number(form.basementFloors);
    if (form.totalSize !== '') payload.totalSize = Number(form.totalSize);
    if (form.livableArea !== '')
      payload.livableArea = Number(form.livableArea);
    if (form.parkingSpaces !== '')
      payload.parkingSpaces = Number(form.parkingSpaces);
    if (form.constructionProgress !== '')
      payload.constructionProgress = Number(form.constructionProgress);
    if (form.descriptionKa || form.descriptionEn) {
      payload.description = {
        ka: form.descriptionKa.trim() || undefined,
        en: form.descriptionEn.trim() || undefined,
      };
    }
    if (form.mainImage) payload.mainImage = form.mainImage.trim();
    if (form.images.length > 0) payload.images = form.images;
    return payload;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.project) {
      setError('Project is required');
      tabs.setActive('basics');
      return;
    }
    if (!form.block.trim()) {
      setError('Block is required');
      tabs.setActive('basics');
      return;
    }
    if (!form.nameKa && !form.nameEn) {
      setError('Provide a name in Georgian or English');
      tabs.setActive('basics');
      return;
    }
    setLoading(true);
    try {
      await onSubmit(buildPayload());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save building');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs tabs={TABS} active={tabs.active} onChange={tabs.setActive} />

      {tabs.active === 'basics' && (
        <div className="space-y-5">
          {!fixedProjectId && !isEdit && (
            <Section cols={1}>
              <Field label="Project">
                <FormSelect
                  value={form.project}
                  onChange={(v) => update('project', v)}
                  placeholder="Select a project"
                  options={projects.map((p) => ({
                    value: p.id,
                    label: pickLocale(p.name),
                  }))}
                />
              </Field>
            </Section>
          )}
          <Section title="Name">
            <Field label="Name (Georgian)">
              <Input
                value={form.nameKa}
                onChange={(e) => update('nameKa', e.target.value)}
                placeholder="ბლოკი A"
              />
            </Field>
            <Field label="Name (English)">
              <Input
                value={form.nameEn}
                onChange={(e) => update('nameEn', e.target.value)}
                placeholder="Block A"
              />
            </Field>
          </Section>
          <Section title="Identity" cols={3}>
            <Field label="Block code" hint="Single letter, e.g. A">
              <Input
                value={form.block}
                onChange={(e) => update('block', e.target.value)}
                placeholder="A"
                className="uppercase"
              />
            </Field>
            <Field label="Status">
              <FormSelect
                value={form.status}
                onChange={(v) => update('status', v as BuildingStatus)}
                options={BUILDING_STATUSES.map((s) => ({ value: s }))}
              />
            </Field>
            <Field label="Address">
              <Input
                value={form.address}
                onChange={(e) => update('address', e.target.value)}
                placeholder="optional override"
              />
            </Field>
          </Section>
        </div>
      )}

      {tabs.active === 'sizes' && (
        <div className="space-y-5">
          <Section title="Basement & parking" cols={2}>
            <Field
              label="Basement floors"
              hint="Above-ground floors are managed individually under the building."
            >
              <Input
                type="number"
                min="0"
                value={form.basementFloors}
                onChange={(e) => update('basementFloors', e.target.value)}
              />
            </Field>
            <Field label="Parking spaces">
              <Input
                type="number"
                min="0"
                value={form.parkingSpaces}
                onChange={(e) => update('parkingSpaces', e.target.value)}
              />
            </Field>
          </Section>
          <Section title="Area" cols={3}>
            <Field label="Total size (m²)">
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.totalSize}
                onChange={(e) => update('totalSize', e.target.value)}
              />
            </Field>
            <Field label="Livable area (m²)">
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.livableArea}
                onChange={(e) => update('livableArea', e.target.value)}
              />
            </Field>
            <Field label="Construction progress (%)">
              <Input
                type="number"
                min="0"
                max="100"
                value={form.constructionProgress}
                onChange={(e) =>
                  update('constructionProgress', e.target.value)
                }
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
            />
          </Field>
          <Field label="Description (English)">
            <Textarea
              value={form.descriptionEn}
              onChange={(e) => update('descriptionEn', e.target.value)}
            />
          </Field>
        </div>
      )}

      {tabs.active === 'media' && (
        <div className="space-y-5">
          <Field label="Main image" hint="Block cover image">
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
        </div>
      )}

      {tabs.active === 'flags' && (
        <div className="space-y-4">
          <Switch
            label="Active"
            checked={form.isActive}
            onChange={(v) => update('isActive', v)}
          />
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
