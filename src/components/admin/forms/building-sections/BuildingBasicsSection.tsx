'use client';

import { Field, FormSelect, Input, Section } from '../form-primitives';
import type { BuildingStatus } from '@/model/types/api';

const BUILDING_STATUSES: BuildingStatus[] = [
  'planning',
  'foundation',
  'under_construction',
  'finishing',
  'completed',
  'occupied',
];

export interface BuildingBasicsSectionValue {
  project: string;
  nameKa: string;
  nameEn: string;
  block: string;
  status: BuildingStatus;
  address: string;
}

export interface BuildingProjectOption {
  id: string;
  label: string;
}

interface Props {
  value: BuildingBasicsSectionValue;
  update: <K extends keyof BuildingBasicsSectionValue>(
    k: K,
    v: BuildingBasicsSectionValue[K]
  ) => void;
  showProjectPicker: boolean;
  projectOptions: BuildingProjectOption[];
}

export default function BuildingBasicsSection({
  value,
  update,
  showProjectPicker,
  projectOptions,
}: Props) {
  return (
    <div className="space-y-5">
      {showProjectPicker && (
        <Section cols={1}>
          <Field label="Project">
            <FormSelect
              value={value.project}
              onChange={(v) => update('project', v)}
              placeholder="Select a project"
              options={projectOptions.map((p) => ({
                value: p.id,
                label: p.label,
              }))}
            />
          </Field>
        </Section>
      )}
      <Section title="Name">
        <Field label="Name (Georgian)">
          <Input
            value={value.nameKa}
            onChange={(e) => update('nameKa', e.target.value)}
            placeholder="ბლოკი A"
          />
        </Field>
        <Field label="Name (English)">
          <Input
            value={value.nameEn}
            onChange={(e) => update('nameEn', e.target.value)}
            placeholder="Block A"
          />
        </Field>
      </Section>
      <Section title="Identity" cols={3}>
        <Field label="Block code" hint="Single letter, e.g. A">
          <Input
            value={value.block}
            onChange={(e) => update('block', e.target.value)}
            placeholder="A"
            className="uppercase"
          />
        </Field>
        <Field label="Status">
          <FormSelect
            value={value.status}
            onChange={(v) => update('status', v as BuildingStatus)}
            options={BUILDING_STATUSES.map((s) => ({ value: s }))}
          />
        </Field>
        <Field label="Address">
          <Input
            value={value.address}
            onChange={(e) => update('address', e.target.value)}
            placeholder="optional override"
          />
        </Field>
      </Section>
    </div>
  );
}
