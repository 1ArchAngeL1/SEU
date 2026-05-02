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
  address: string;
  city: string;
  district: string;
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
        <Field label="Name (Georgian)">
          <Input
            value={value.nameKa}
            onChange={(e) => update('nameKa', e.target.value)}
            placeholder="სახელი"
          />
        </Field>
        <Field label="Name (English)">
          <Input
            value={value.nameEn}
            onChange={(e) => update('nameEn', e.target.value)}
            placeholder="e.g. SEU Varketili"
          />
        </Field>
      </Section>
      <Section title="Location" cols={3}>
        <Field label="Address" className="sm:col-span-3">
          <Input
            value={value.address}
            onChange={(e) => update('address', e.target.value)}
            placeholder="e.g. Vazha-Pshavela Ave 76"
          />
        </Field>
        <Field label="City">
          <Input
            value={value.city}
            onChange={(e) => update('city', e.target.value)}
            placeholder="Tbilisi"
          />
        </Field>
        <Field label="District">
          <Input
            value={value.district}
            onChange={(e) => update('district', e.target.value)}
            placeholder="Saburtalo"
          />
        </Field>
        <Field label="Status">
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
