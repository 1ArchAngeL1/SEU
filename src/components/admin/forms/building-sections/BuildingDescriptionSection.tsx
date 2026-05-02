'use client';

import { Field, Textarea } from '../form-primitives';

export interface BuildingDescriptionSectionValue {
  descriptionKa: string;
  descriptionEn: string;
}

interface Props {
  value: BuildingDescriptionSectionValue;
  update: <K extends keyof BuildingDescriptionSectionValue>(
    k: K,
    v: BuildingDescriptionSectionValue[K]
  ) => void;
}

export default function BuildingDescriptionSection({ value, update }: Props) {
  return (
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
  );
}
