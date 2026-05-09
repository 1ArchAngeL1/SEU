'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAllProjects } from '@/hooks/queries/use-projects';
import { pickLocale } from '@/lib/i18n-helpers';
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
    renderImage: initialData?.renderImage ?? '',
    images: initialData?.images ?? [],
    polygonEditor: {
      entries: initialData?.polygon?.length
        ? [{
            raw: initialData.polygon.map((pt) => `${pt.x},${pt.y}`).join(','),
            label: '',
          }]
        : [],
      imageWidth: '',
      imageHeight: '',
    } as PolygonEditorValue,
    isActive: initialData?.isActive ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Track whether polygon was edited (to distinguish % values from pixel values)
  const [polygonDirty, setPolygonDirty] = useState(false);

  function update<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    if (k === 'polygonEditor') setPolygonDirty(true);
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
      name: {
        ka: form.nameKa.trim() || null,
        en: form.nameEn.trim() || null,
      },
      block: form.block.trim().toUpperCase(),
      status: form.status,
      isActive: form.isActive,
      location: { address: form.address.trim() || '' },
      basementFloors:
        form.basementFloors !== '' ? Number(form.basementFloors) : null,
      totalSize: form.totalSize !== '' ? Number(form.totalSize) : null,
      livableArea: form.livableArea !== '' ? Number(form.livableArea) : null,
      parkingSpaces:
        form.parkingSpaces !== '' ? Number(form.parkingSpaces) : null,
      constructionProgress:
        form.constructionProgress !== ''
          ? Number(form.constructionProgress)
          : null,
      description: {
        ka: form.descriptionKa.trim() || null,
        en: form.descriptionEn.trim() || null,
      },
      mainImage: form.mainImage.trim() || null,
      renderImage: form.renderImage.trim() || null,
      images: form.images,
    };

    // Polygon: send rawPolygon + dimensions to backend for conversion
    const pe = form.polygonEditor;
    const validEntries = pe.entries.filter((e) => e.raw.trim());
    if (validEntries.length > 0) {
      if (polygonDirty) {
        // User edited — send as rawPolygon for backend to convert
        const imgW = Number(pe.imageWidth);
        const imgH = Number(pe.imageHeight);
        if (imgW > 0 && imgH > 0) {
          payload.rawPolygon = validEntries[0].raw.replace(/\s+/g, ',');
          payload.imageWidth = imgW;
          payload.imageHeight = imgH;
        }
      } else if (initialData?.polygon?.length) {
        // Unmodified — send existing percentage values as-is
        payload.polygon = initialData.polygon;
      }
    } else {
      // All entries removed — clear polygon
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
    if (!form.nameKa && !form.nameEn) {
      setError('Provide a name in Georgian or English');
      tabs.setActive('basics');
      return;
    }
    // Validate: if polygon was edited, image dimensions are required
    const hasPolygonEntries = form.polygonEditor.entries.some((e) => e.raw.trim());
    if (hasPolygonEntries && polygonDirty) {
      const imgW = Number(form.polygonEditor.imageWidth);
      const imgH = Number(form.polygonEditor.imageHeight);
      if (!imgW || !imgH) {
        setError('Enter the source image width and height for polygon coordinate conversion.');
        tabs.setActive('media');
        return;
      }
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
