'use client';

import { Field, FormSelect, Input, Section } from '../form-primitives';
import FormBlock from './FormBlock';
import type { UnitStatus, UnitType } from '@/model/types/api';

const STATUSES: UnitStatus[] = [
  'available',
  'reserved',
  'sold',
  'not_for_sale',
];
const TYPES: UnitType[] = ['living', 'commerce', 'parking', 'storage'];

export interface UnitIdentitySectionValue {
  unitNumber: string;
  block: string;
  floor: string;
  entranceEn: string;
  entranceKa: string;
  type: UnitType;
  status: UnitStatus;
}

interface UnitIdentitySectionProps {
  value: UnitIdentitySectionValue;
  update: <K extends keyof UnitIdentitySectionValue>(
    k: K,
    v: UnitIdentitySectionValue[K]
  ) => void;
}

export default function UnitIdentitySection({
  value,
  update,
}: UnitIdentitySectionProps) {
  return (
    <FormBlock
      title="Identity"
      subtitle="Where in the building this unit lives"
    >
      <Section cols={3}>
        <Field label="Unit number" hint="Unique within the building">
          <Input
            value={value.unitNumber}
            onChange={(e) => update('unitNumber', e.target.value)}
            placeholder="e.g. A-12-3"
          />
        </Field>
        <Field label="Block">
          <Input
            value={value.block}
            onChange={(e) => update('block', e.target.value)}
            className="uppercase"
          />
        </Field>
        <Field label="Floor">
          <Input
            type="number"
            value={value.floor}
            onChange={(e) => update('floor', e.target.value)}
          />
        </Field>
        <Field label="Entrance (English)">
          <Input
            value={value.entranceEn}
            onChange={(e) => update('entranceEn', e.target.value)}
            placeholder="optional"
          />
        </Field>
        <Field label="Entrance (Georgian)">
          <Input
            value={value.entranceKa}
            onChange={(e) => update('entranceKa', e.target.value)}
            placeholder="არასავალდებულო"
          />
        </Field>
        <Field label="Type">
          <FormSelect
            value={value.type}
            onChange={(v) => update('type', v as UnitType)}
            options={TYPES.map((t) => ({ value: t }))}
          />
        </Field>
        <Field label="Status">
          <FormSelect
            value={value.status}
            onChange={(v) => update('status', v as UnitStatus)}
            options={STATUSES.map((s) => ({ value: s }))}
          />
        </Field>
      </Section>
    </FormBlock>
  );
}
