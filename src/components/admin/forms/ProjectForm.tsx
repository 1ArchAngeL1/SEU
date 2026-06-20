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
    nameKa: initialData?.nameKa ?? '',
    nameEn: initialData?.nameEn ?? '',
    descriptionKa: initialData?.descriptionKa ?? '',
    descriptionEn: initialData?.descriptionEn ?? '',
    benefitsEn: initialData?.benefitsEn ?? '',
    benefitsKa: initialData?.benefitsKa ?? '',
    addressEn: initialData?.location?.addressEn ?? '',
    addressKa: initialData?.location?.addressKa ?? '',
    cityEn: initialData?.location?.cityEn ?? '',
    cityKa: initialData?.location?.cityKa ?? '',
    districtEn: initialData?.location?.districtEn ?? '',
    districtKa: initialData?.location?.districtKa ?? '',
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
    googleMapLink: initialData?.googleMapLink ?? '',
    priceCurrency: initialData?.priceRange?.currency ?? 'USD',
    minPrice: initialData?.priceRange?.minPrice?.toString() ?? '',
    maxPrice: initialData?.priceRange?.maxPrice?.toString() ?? '',
    minPricePerSqm:
      initialData?.priceRange?.minPricePerSqm?.toString() ?? '',
    maxPricePerSqm:
      initialData?.priceRange?.maxPricePerSqm?.toString() ?? '',
    minSizeApartment:
      initialData?.minSizeApartment?.toString() ?? '',
    maxSizeApartment:
      initialData?.maxSizeApartment?.toString() ?? '',
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
      nameEn: form.nameEn.trim(),
      nameKa: form.nameKa.trim(),
      descriptionEn: form.descriptionEn.trim() || undefined,
      descriptionKa: form.descriptionKa.trim() || undefined,
      benefitsEn: form.benefitsEn.trim() || undefined,
      benefitsKa: form.benefitsKa.trim() || undefined,
      location: {
        addressEn: form.addressEn.trim(),
        addressKa: form.addressKa.trim(),
        cityEn: form.cityEn.trim() || undefined,
        cityKa: form.cityKa.trim() || undefined,
        districtEn: form.districtEn.trim() || undefined,
        districtKa: form.districtKa.trim() || undefined,
      },
      status: form.status,
      isActive: form.isActive,
      isFeatured: form.isFeatured,
      startDate: form.startDate || undefined,
      expectedCompletionDate: form.expectedCompletionDate || undefined,
      actualCompletionDate: form.actualCompletionDate || undefined,
      totalLandArea:
        form.totalLandArea !== '' ? Number(form.totalLandArea) : undefined,
      images: form.images,
      mainImage: form.mainImage.trim() || undefined,
      renderImage: form.renderImage.trim() || undefined,
      videoUrl: form.videoUrl.trim() || undefined,
      googleMapLink: form.googleMapLink.trim() || undefined,
      minSizeApartment:
        form.minSizeApartment !== '' ? Number(form.minSizeApartment) : undefined,
      maxSizeApartment:
        form.maxSizeApartment !== '' ? Number(form.maxSizeApartment) : undefined,
      priceRange: {
        currency: form.priceCurrency,
        minPrice: form.minPrice !== '' ? Number(form.minPrice) : undefined,
        maxPrice: form.maxPrice !== '' ? Number(form.maxPrice) : undefined,
        minPricePerSqm:
          form.minPricePerSqm !== '' ? Number(form.minPricePerSqm) : undefined,
        maxPricePerSqm:
          form.maxPricePerSqm !== '' ? Number(form.maxPricePerSqm) : undefined,
      },
    };
    return payload;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.nameEn.trim() || !form.nameKa.trim()) {
      setError('Both English and Georgian names are required');
      tabs.setActive('basics');
      return;
    }
    if (!form.addressEn.trim() || !form.addressKa.trim()) {
      setError('Both English and Georgian addresses are required');
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
            addressEn: form.addressEn,
            addressKa: form.addressKa,
            cityEn: form.cityEn,
            cityKa: form.cityKa,
            districtEn: form.districtEn,
            districtKa: form.districtKa,
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
            benefitsEn: form.benefitsEn,
            benefitsKa: form.benefitsKa,
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
            minSizeApartment: form.minSizeApartment,
            maxSizeApartment: form.maxSizeApartment,
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
            googleMapLink: form.googleMapLink,
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
