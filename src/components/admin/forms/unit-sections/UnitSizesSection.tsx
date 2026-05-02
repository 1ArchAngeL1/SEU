'use client';

import { Field, Input, Section } from '../form-primitives';
import FormBlock from './FormBlock';

export interface UnitSizesSectionValue {
  totalSize: string;
  livableArea: string;
  balconySize: string;
  terraceSize: string;
}

interface UnitSizesSectionProps {
  value: UnitSizesSectionValue;
  update: <K extends keyof UnitSizesSectionValue>(
    k: K,
    v: UnitSizesSectionValue[K]
  ) => void;
}

export default function UnitSizesSection({
  value,
  update,
}: UnitSizesSectionProps) {
  return (
    <FormBlock title="Areas (m²)" subtitle="Surfaces in square meters">
      <Section cols={4}>
        <Field label="Total size">
          <Input
            type="number"
            min="0"
            step="0.01"
            value={value.totalSize}
            onChange={(e) => update('totalSize', e.target.value)}
          />
        </Field>
        <Field label="Livable area">
          <Input
            type="number"
            min="0"
            step="0.01"
            value={value.livableArea}
            onChange={(e) => update('livableArea', e.target.value)}
          />
        </Field>
        <Field label="Balcony">
          <Input
            type="number"
            min="0"
            step="0.01"
            value={value.balconySize}
            onChange={(e) => update('balconySize', e.target.value)}
          />
        </Field>
        <Field label="Terrace">
          <Input
            type="number"
            min="0"
            step="0.01"
            value={value.terraceSize}
            onChange={(e) => update('terraceSize', e.target.value)}
          />
        </Field>
      </Section>
    </FormBlock>
  );
}
