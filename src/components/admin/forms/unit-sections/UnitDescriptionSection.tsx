'use client';

import { Field, Textarea } from '../form-primitives';
import FormBlock from './FormBlock';

export interface UnitDescriptionSectionValue {
  descriptionKa: string;
  descriptionEn: string;
}

interface UnitDescriptionSectionProps {
  value: UnitDescriptionSectionValue;
  update: <K extends keyof UnitDescriptionSectionValue>(
    k: K,
    v: UnitDescriptionSectionValue[K]
  ) => void;
}

export default function UnitDescriptionSection({
  value,
  update,
}: UnitDescriptionSectionProps) {
  return (
    <FormBlock title="Description" subtitle="Localised marketing copy">
      <div className="space-y-3">
        <Field label="Description (Georgian)">
          <Textarea
            value={value.descriptionKa}
            onChange={(e) => update('descriptionKa', e.target.value)}
          />
        </Field>
        <Field label="Description (English)">
          <Textarea
            value={value.descriptionEn}
            onChange={(e) => update('descriptionEn', e.target.value)}
          />
        </Field>
      </div>
    </FormBlock>
  );
}
