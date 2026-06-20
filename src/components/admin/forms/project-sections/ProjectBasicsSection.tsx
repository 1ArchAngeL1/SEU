'use client';

import { Field, FormSelect, Input, Section } from '../form-primitives';
import type { ProjectStatus } from '@/model/types/api';

const PROJECT_STATUSES: ProjectStatus[] = [
  'planning',
  'presale',
  'under_construction',
  'completed',
  'sold_out',
  'archived',
];

export interface ProjectBasicsSectionValue {
  nameKa: string;
  nameEn: string;
  addressEn: string;
  addressKa: string;
  cityEn: string;
  cityKa: string;
  districtEn: string;
  districtKa: string;
  status: ProjectStatus;
}

interface Props {
  value: ProjectBasicsSectionValue;
  update: <K extends keyof ProjectBasicsSectionValue>(
    k: K,
    v: ProjectBasicsSectionValue[K]
  ) => void;
}

export default function ProjectBasicsSection({ value, update }: Props) {
  return (
    <div className="space-y-5">
      <Section title="Name">
        <Field label="Name (English)">
          <Input
            value={value.nameEn}
            onChange={(e) => update('nameEn', e.target.value)}
            placeholder="e.g. SEU Varketili"
          />
        </Field>
        <Field label="Name (Georgian)">
          <Input
            value={value.nameKa}
            onChange={(e) => update('nameKa', e.target.value)}
            placeholder="სახელი"
          />
        </Field>
      </Section>
      <Section title="Location" cols={2}>
        <Field label="Address (English)">
          <Input
            value={value.addressEn}
            onChange={(e) => update('addressEn', e.target.value)}
            placeholder="e.g. Vazha-Pshavela Ave 76"
          />
        </Field>
        <Field label="Address (Georgian)">
          <Input
            value={value.addressKa}
            onChange={(e) => update('addressKa', e.target.value)}
            placeholder="მაგ. ვაჟა-ფშაველას გამზ. 76"
          />
        </Field>
        <Field label="City (English)">
          <Input
            value={value.cityEn}
            onChange={(e) => update('cityEn', e.target.value)}
            placeholder="Tbilisi"
          />
        </Field>
        <Field label="City (Georgian)">
          <Input
            value={value.cityKa}
            onChange={(e) => update('cityKa', e.target.value)}
            placeholder="თბილისი"
          />
        </Field>
        <Field label="District (English)">
          <Input
            value={value.districtEn}
            onChange={(e) => update('districtEn', e.target.value)}
            placeholder="Saburtalo"
          />
        </Field>
        <Field label="District (Georgian)">
          <Input
            value={value.districtKa}
            onChange={(e) => update('districtKa', e.target.value)}
            placeholder="საბურთალო"
          />
        </Field>
        <Field label="Status" className="sm:col-span-2">
          <FormSelect
            value={value.status}
            onChange={(v) => update('status', v as ProjectStatus)}
            options={PROJECT_STATUSES.map((s) => ({ value: s }))}
          />
        </Field>
      </Section>
    </div>
  );
}
