'use client';

import { Field, Input, Section } from '../form-primitives';

export interface BuildingSizesSectionValue {
  floorsAboveGround: string;
  basementLevels: string;
  totalSize: string;
  livableArea: string;
  constructionProgress: string;
}

interface Props {
  value: BuildingSizesSectionValue;
  update: <K extends keyof BuildingSizesSectionValue>(
    k: K,
    v: BuildingSizesSectionValue[K]
  ) => void;
}

export default function BuildingSizesSection({ value, update }: Props) {
  return (
    <div className="space-y-5">
      <Section title="Floors & basements" cols={2}>
        <Field
          label="Floors above ground"
          hint="How many storeys the building has above ground."
        >
          <Input
            type="number"
            min="0"
            value={value.floorsAboveGround}
            onChange={(e) => update('floorsAboveGround', e.target.value)}
          />
        </Field>
        <Field
          label="Basement / parking levels"
          hint="Underground floors used for parking or storage."
        >
          <Input
            type="number"
            min="0"
            value={value.basementLevels}
            onChange={(e) => update('basementLevels', e.target.value)}
          />
        </Field>
      </Section>
      <Section title="Area" cols={3}>
        <Field label="Total size (m²)">
          <Input
            type="number"
            min="0"
            step="0.01"
            value={value.totalSize}
            onChange={(e) => update('totalSize', e.target.value)}
          />
        </Field>
        <Field label="Livable area (m²)">
          <Input
            type="number"
            min="0"
            step="0.01"
            value={value.livableArea}
            onChange={(e) => update('livableArea', e.target.value)}
          />
        </Field>
        <Field label="Construction progress (%)">
          <Input
            type="number"
            min="0"
            max="100"
            value={value.constructionProgress}
            onChange={(e) =>
              update('constructionProgress', e.target.value)
            }
          />
        </Field>
      </Section>
    </div>
  );
}
