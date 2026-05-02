'use client';

import { Field, FormSelect, Section, Switch } from '../form-primitives';
import FormBlock from './FormBlock';
import type { FurnishingStatus } from '@/model/types/api';

const FURNISHING: FurnishingStatus[] = [
  'without',
  'rough_draft',
  'finishing',
  'shell_and_core',
];

export interface UnitFlagsSectionValue {
  furnishingStatus: FurnishingStatus;
  isActive: boolean;
}

interface UnitFlagsSectionProps {
  value: UnitFlagsSectionValue;
  update: <K extends keyof UnitFlagsSectionValue>(
    k: K,
    v: UnitFlagsSectionValue[K]
  ) => void;
}

export default function UnitFlagsSection({
  value,
  update,
}: UnitFlagsSectionProps) {
  return (
    <FormBlock title="Flags & finishing">
      <Section cols={2}>
        <Field label="Furnishing status">
          <FormSelect
            value={value.furnishingStatus}
            onChange={(v) => update('furnishingStatus', v as FurnishingStatus)}
            options={FURNISHING.map((f) => ({ value: f }))}
          />
        </Field>
        <Switch
          label="Active"
          checked={value.isActive}
          onChange={(v) => update('isActive', v)}
        />
      </Section>
    </FormBlock>
  );
}
