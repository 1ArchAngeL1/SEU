'use client';

import { Field, Input, Section } from '../form-primitives';
import FormBlock from './FormBlock';

export interface UnitRoomsSectionValue {
  bedrooms: string;
  bathrooms: string;
  livingRooms: string;
  balconies: string;
  terraces: string;
}

interface UnitRoomsSectionProps {
  value: UnitRoomsSectionValue;
  update: <K extends keyof UnitRoomsSectionValue>(
    k: K,
    v: UnitRoomsSectionValue[K]
  ) => void;
}

export default function UnitRoomsSection({
  value,
  update,
}: UnitRoomsSectionProps) {
  return (
    <FormBlock title="Rooms" subtitle="How the interior is split up">
      <Section cols={3}>
        <Field label="Bedrooms">
          <Input
            type="number"
            min="0"
            value={value.bedrooms}
            onChange={(e) => update('bedrooms', e.target.value)}
          />
        </Field>
        <Field label="Bathrooms">
          <Input
            type="number"
            min="0"
            value={value.bathrooms}
            onChange={(e) => update('bathrooms', e.target.value)}
          />
        </Field>
        <Field label="Living rooms">
          <Input
            type="number"
            min="0"
            value={value.livingRooms}
            onChange={(e) => update('livingRooms', e.target.value)}
          />
        </Field>
        <Field label="Balconies">
          <Input
            type="number"
            min="0"
            value={value.balconies}
            onChange={(e) => update('balconies', e.target.value)}
          />
        </Field>
        <Field label="Terraces">
          <Input
            type="number"
            min="0"
            value={value.terraces}
            onChange={(e) => update('terraces', e.target.value)}
          />
        </Field>
      </Section>
    </FormBlock>
  );
}
