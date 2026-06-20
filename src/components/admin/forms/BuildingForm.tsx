'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import { useAllProjects } from '@/hooks/queries/use-projects';
import { pickLocalized, type Locale } from '@/lib/i18n-helpers';
import { FormFooter, Tabs, useTabs } from './form-primitives';
import type { PolygonEditorValue } from './PolygonsEditor';
import BuildingBasicsSection, {
  type BuildingBasicsSectionValue,
} from './building-sections/BuildingBasicsSection';
import BuildingSizesSection, {
  type BuildingSizesSectionValue,
} from './building-sections/BuildingSizesSection';
import BuildingDescriptionSection, {
  type BuildingDescriptionSectionValue,
} from './building-sections/BuildingDescriptionSection';
import BuildingMediaSection, {
  type BuildingMediaSectionValue,
} from './building-sections/BuildingMediaSection';
import BuildingFlagsSection, {
  type BuildingFlagsSectionValue,
} from './building-sections/BuildingFlagsSection';
import type {
  Building,
  BuildingStatus,
  CreateBuildingInput,
} from '@/model/types/api';

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
  const locale = useLocale() as Locale;

  const isEdit = !!initialData;

  const [form, setForm] = useState({
    project: fixedProjectId ?? projectIdOf(initialData) ?? '',
    nameKa: initialData?.nameKa ?? '',
    nameEn: initialData?.nameEn ?? '',
    block: initialData?.block ?? '',
    addressEn: initialData?.location?.addressEn ?? '',
    addressKa: initialData?.location?.addressKa ?? '',
    status: (initialData?.status ?? 'planning') as BuildingStatus,
    basementFloors: initialData?.basementFloors?.toString() ?? '0',
    totalSize: initialData?.totalSize?.toString() ?? '',
    livableArea: initialData?.livableArea?.toString() ?? '',
    parkingSpaces: initialData?.parkingSpaces?.toString() ?? '0',
    constructionProgress:
      initialData?.constructionProgress?.toString() ?? '0',
    descriptionKa: initialData?.descriptionKa ?? '',
    descriptionEn: initialData?.descriptionEn ?? '',
    mainImage: initialData?.mainImage ?? '',
    renderImage: initialData?.renderImage ?? '',
    images: initialData?.images ?? [],
    polygonEditor: {
      entries: initialData?.polygon?.length
        ? [{
            raw: initialData.polygon.map((pt) => `${pt.x},${pt.y}`).join(','),
            label: '',
          }]
        : [],
    } as PolygonEditorValue,
    isActive: initialData?.isActive ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function update<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  function sectionUpdate<V extends Partial<typeof form>>() {
    return update as unknown as <K extends keyof V>(k: K, v: V[K]) => void;
  }

  useEffect(() => {
    if (!form.project && projects.length > 0) {
      setForm((p) => ({ ...p, project: projects[0].id }));
    }
  }, [projects, form.project]);

  function buildPayload(): CreateBuildingInput {
    const payload: CreateBuildingInput = {
      project: form.project,
      nameEn: form.nameEn.trim(),
      nameKa: form.nameKa.trim(),
      block: form.block.trim().toUpperCase(),
      status: form.status,
      isActive: form.isActive,
      location: {
        addressEn: form.addressEn.trim() || undefined,
        addressKa: form.addressKa.trim() || undefined,
      },
      basementFloors:
        form.basementFloors !== '' ? Number(form.basementFloors) : undefined,
      totalSize: form.totalSize !== '' ? Number(form.totalSize) : undefined,
      livableArea:
        form.livableArea !== '' ? Number(form.livableArea) : undefined,
      parkingSpaces:
        form.parkingSpaces !== '' ? Number(form.parkingSpaces) : undefined,
      constructionProgress:
        form.constructionProgress !== ''
          ? Number(form.constructionProgress)
          : undefined,
      descriptionEn: form.descriptionEn.trim() || undefined,
      descriptionKa: form.descriptionKa.trim() || undefined,
      mainImage: form.mainImage.trim() || undefined,
      renderImage: form.renderImage.trim() || undefined,
      images: form.images,
    };

    const pe = form.polygonEditor;
    const validEntries = pe.entries.filter((e) => e.raw.trim());
    if (validEntries.length > 0) {
      const nums = validEntries[0].raw
        .replace(/\s+/g, ',')
        .split(',')
        .map((s) => parseFloat(s.trim()))
        .filter((n) => !isNaN(n));
      const points: { x: number; y: number }[] = [];
      for (let i = 0; i + 1 < nums.length; i += 2) {
        points.push({ x: nums[i], y: nums[i + 1] });
      }
      payload.polygon = points;
    } else {
      payload.polygon = [];
    }

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
    if (!form.nameEn.trim() || !form.nameKa.trim()) {
      setError('Both English and Georgian names are required');
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
        <BuildingBasicsSection
          value={{
            project: form.project,
            nameKa: form.nameKa,
            nameEn: form.nameEn,
            block: form.block,
            status: form.status,
            addressEn: form.addressEn,
            addressKa: form.addressKa,
          }}
          update={sectionUpdate<BuildingBasicsSectionValue>()}
          showProjectPicker={!fixedProjectId && !isEdit}
          projectOptions={projects.map((p) => ({
            id: p.id,
            label: pickLocalized(p.nameEn, p.nameKa, locale),
          }))}
        />
      )}

      {tabs.active === 'sizes' && (
        <BuildingSizesSection
          value={{
            basementFloors: form.basementFloors,
            parkingSpaces: form.parkingSpaces,
            totalSize: form.totalSize,
            livableArea: form.livableArea,
            constructionProgress: form.constructionProgress,
          }}
          update={sectionUpdate<BuildingSizesSectionValue>()}
        />
      )}

      {tabs.active === 'description' && (
        <BuildingDescriptionSection
          value={{
            descriptionKa: form.descriptionKa,
            descriptionEn: form.descriptionEn,
          }}
          update={sectionUpdate<BuildingDescriptionSectionValue>()}
        />
      )}

      {tabs.active === 'media' && (
        <BuildingMediaSection
          value={{
            mainImage: form.mainImage,
            renderImage: form.renderImage,
            images: form.images,
            polygonEditor: form.polygonEditor,
          }}
          update={sectionUpdate<BuildingMediaSectionValue>()}
        />
      )}

      {tabs.active === 'flags' && (
        <BuildingFlagsSection
          value={{ isActive: form.isActive }}
          update={sectionUpdate<BuildingFlagsSectionValue>()}
        />
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
