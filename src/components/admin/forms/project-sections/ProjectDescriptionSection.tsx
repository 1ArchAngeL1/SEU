'use client';

import { Field, Input, Textarea } from '../form-primitives';

export interface ProjectDescriptionSectionValue {
  descriptionKa: string;
  descriptionEn: string;
  benefitsEn: string;
  benefitsKa: string;
}

interface Props {
  value: ProjectDescriptionSectionValue;
  update: <K extends keyof ProjectDescriptionSectionValue>(
    k: K,
    v: ProjectDescriptionSectionValue[K]
  ) => void;
}

export default function ProjectDescriptionSection({ value, update }: Props) {
  return (
    <div className="space-y-3">
      <Field label="Description (English)">
        <Textarea
          value={value.descriptionEn}
          onChange={(e) => update('descriptionEn', e.target.value)}
          placeholder="English description"
        />
      </Field>
      <Field label="Description (Georgian)">
        <Textarea
          value={value.descriptionKa}
          onChange={(e) => update('descriptionKa', e.target.value)}
          placeholder="აღწერა ქართულად"
        />
      </Field>
      <Field label="Benefits (English)">
        <Input
          value={value.benefitsEn}
          onChange={(e) => update('benefitsEn', e.target.value)}
          placeholder="e.g. Pool, Gym, Parking"
        />
      </Field>
      <Field label="Benefits (Georgian)">
        <Input
          value={value.benefitsKa}
          onChange={(e) => update('benefitsKa', e.target.value)}
          placeholder="მაგ. აუზი, სპორტდარბაზი, პარკინგი"
        />
      </Field>
    </div>
  );
}
