'use client';

import { useState } from 'react';
import { FormFooter, Tabs, useTabs } from './form-primitives';
import ProjectBasicsSection, {
  type ProjectBasicsSectionValue,
} from './project-sections/ProjectBasicsSection';
import ProjectDescriptionSection, {
  type ProjectDescriptionSectionValue,
} from './project-sections/ProjectDescriptionSection';
import ProjectPricingSection, {
  type ProjectPricingSectionValue,
} from './project-sections/ProjectPricingSection';
import ProjectMediaSection, {
  type ProjectMediaSectionValue,
} from './project-sections/ProjectMediaSection';
import ProjectFlagsSection, {
  type ProjectFlagsSectionValue,
} from './project-sections/ProjectFlagsSection';
import type {
  CreateProjectInput,
  Project,
  ProjectStatus,
} from '@/model/types/api';

const TABS = [
  { id: 'basics', label: 'Basics' },
  { id: 'description', label: 'Description' },
  { id: 'pricing', label: 'Dates & Pricing' },
  { id: 'media', label: 'Media' },
  { id: 'flags', label: 'Flags' },
];

interface ProjectFormProps {
  initialData?: Project;
  onSubmit: (data: CreateProjectInput) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

function dateInputValue(d?: string | null): string {
  if (!d) return '';
  return d.length >= 10 ? d.slice(0, 10) : d;
}

export default function ProjectForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
}: ProjectFormProps) {
  const tabs = useTabs('basics');

  const [form, setForm] = useState({
    nameKa: initialData?.name?.ka ?? '',
    nameEn: initialData?.name?.en ?? '',
    descriptionKa: initialData?.description?.ka ?? '',
    descriptionEn: initialData?.description?.en ?? '',
    address: initialData?.location?.address ?? '',
    city: initialData?.location?.city ?? '',
    district: initialData?.location?.district ?? '',
    status: (initialData?.status ?? 'planning') as ProjectStatus,
    startDate: dateInputValue(initialData?.startDate),
    expectedCompletionDate: dateInputValue(
      initialData?.expectedCompletionDate
    ),
    actualCompletionDate: dateInputValue(initialData?.actualCompletionDate),
    totalLandArea: initialData?.totalLandArea?.toString() ?? '',
    images: initialData?.images ?? [],
    mainImage: initialData?.mainImage ?? '',
    renderImage: initialData?.renderImage ?? '',
    videoUrl: initialData?.videoUrl ?? '',
    priceCurrency: initialData?.priceRange?.currency ?? 'USD',
    minPrice: initialData?.priceRange?.minPrice?.toString() ?? '',
    maxPrice: initialData?.priceRange?.maxPrice?.toString() ?? '',
    minPricePerSqm:
      initialData?.priceRange?.minPricePerSqm?.toString() ?? '',
    maxPricePerSqm:
      initialData?.priceRange?.maxPricePerSqm?.toString() ?? '',
    isActive: initialData?.isActive ?? true,
    isFeatured: initialData?.isFeatured ?? false,
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

  function buildPayload(): CreateProjectInput {
    const payload: CreateProjectInput = {
      name: {
        ka: form.nameKa.trim() || undefined,
        en: form.nameEn.trim() || undefined,
      },
      location: {
        address: form.address.trim(),
        city: form.city.trim() || undefined,
        district: form.district.trim() || undefined,
      },
      status: form.status,
      isActive: form.isActive,
      isFeatured: form.isFeatured,
    };

    if (form.descriptionKa || form.descriptionEn) {
      payload.description = {
        ka: form.descriptionKa.trim() || undefined,
        en: form.descriptionEn.trim() || undefined,
      };
    }
    if (form.startDate) payload.startDate = form.startDate;
    if (form.expectedCompletionDate)
      payload.expectedCompletionDate = form.expectedCompletionDate;
    if (form.actualCompletionDate)
      payload.actualCompletionDate = form.actualCompletionDate;
    if (form.totalLandArea !== '')
      payload.totalLandArea = Number(form.totalLandArea);
    payload.images = form.images;
    payload.mainImage = form.mainImage.trim() || undefined;
    payload.renderImage = form.renderImage.trim() || undefined;
    if (form.videoUrl) payload.videoUrl = form.videoUrl.trim();

    const minPrice = form.minPrice !== '' ? Number(form.minPrice) : undefined;
    const maxPrice = form.maxPrice !== '' ? Number(form.maxPrice) : undefined;
    const minPricePerSqm =
      form.minPricePerSqm !== '' ? Number(form.minPricePerSqm) : undefined;
    const maxPricePerSqm =
      form.maxPricePerSqm !== '' ? Number(form.maxPricePerSqm) : undefined;
    if (
      minPrice !== undefined ||
      maxPrice !== undefined ||
      minPricePerSqm !== undefined ||
      maxPricePerSqm !== undefined
    ) {
      payload.priceRange = {
        currency: form.priceCurrency,
        minPrice,
        maxPrice,
        minPricePerSqm,
        maxPricePerSqm,
      };
    }
    return payload;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.nameKa && !form.nameEn) {
      setError('Provide at least a Georgian or English name');
      tabs.setActive('basics');
      return;
    }
    if (!form.address.trim()) {
      setError('Address is required');
      tabs.setActive('basics');
      return;
    }
    setLoading(true);
    try {
      await onSubmit(buildPayload());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save project');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs tabs={TABS} active={tabs.active} onChange={tabs.setActive} />

      {tabs.active === 'basics' && (
        <ProjectBasicsSection
          value={{
            nameKa: form.nameKa,
            nameEn: form.nameEn,
            address: form.address,
            city: form.city,
            district: form.district,
            status: form.status,
          }}
          update={sectionUpdate<ProjectBasicsSectionValue>()}
        />
      )}

      {tabs.active === 'description' && (
        <ProjectDescriptionSection
          value={{
            descriptionKa: form.descriptionKa,
            descriptionEn: form.descriptionEn,
          }}
          update={sectionUpdate<ProjectDescriptionSectionValue>()}
        />
      )}

      {tabs.active === 'pricing' && (
        <ProjectPricingSection
          value={{
            startDate: form.startDate,
            expectedCompletionDate: form.expectedCompletionDate,
            actualCompletionDate: form.actualCompletionDate,
            totalLandArea: form.totalLandArea,
            priceCurrency: form.priceCurrency,
            minPrice: form.minPrice,
            maxPrice: form.maxPrice,
            minPricePerSqm: form.minPricePerSqm,
            maxPricePerSqm: form.maxPricePerSqm,
          }}
          update={sectionUpdate<ProjectPricingSectionValue>()}
        />
      )}

      {tabs.active === 'media' && (
        <ProjectMediaSection
          value={{
            mainImage: form.mainImage,
            renderImage: form.renderImage,
            images: form.images,
            videoUrl: form.videoUrl,
          }}
          update={sectionUpdate<ProjectMediaSectionValue>()}
        />
      )}

      {tabs.active === 'flags' && (
        <ProjectFlagsSection
          value={{ isActive: form.isActive, isFeatured: form.isFeatured }}
          update={sectionUpdate<ProjectFlagsSectionValue>()}
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
