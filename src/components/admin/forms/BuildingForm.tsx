'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAllProjects } from '@/hooks/queries/use-projects';
import { pickLocale } from '@/lib/i18n-helpers';
import { FormFooter, Tabs, useTabs } from './form-primitives';
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

  // Narrow `update` to a section's key set. The parent form holds every key in
  // every section value, so this cast is sound at runtime.
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
        <BuildingBasicsSection
          value={{
            project: form.project,
            nameKa: form.nameKa,
            nameEn: form.nameEn,
            block: form.block,
            status: form.status,
            address: form.address,
          }}
          update={sectionUpdate<BuildingBasicsSectionValue>()}
          showProjectPicker={!fixedProjectId && !isEdit}
          projectOptions={projects.map((p) => ({
            id: p.id,
            label: pickLocale(p.name),
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
          value={{ mainImage: form.mainImage, images: form.images }}
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
