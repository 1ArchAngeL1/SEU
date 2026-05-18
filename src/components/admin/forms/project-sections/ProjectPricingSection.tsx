'use client';

import { Field, FormSelect, Input, Section } from '../form-primitives';

export interface ProjectPricingSectionValue {
  startDate: string;
  expectedCompletionDate: string;
  actualCompletionDate: string;
  totalLandArea: string;
  priceCurrency: string;
  minPrice: string;
  maxPrice: string;
  minPricePerSqm: string;
  maxPricePerSqm: string;
  minSizeApartment: string;
  maxSizeApartment: string;
}

interface Props {
  value: ProjectPricingSectionValue;
  update: <K extends keyof ProjectPricingSectionValue>(
    k: K,
    v: ProjectPricingSectionValue[K]
  ) => void;
}

export default function ProjectPricingSection({ value, update }: Props) {
  return (
    <div className="space-y-5">
      <Section title="Dates" cols={3}>
        <Field label="Start date">
          <Input
            type="date"
            value={value.startDate}
            onChange={(e) => update('startDate', e.target.value)}
          />
        </Field>
        <Field label="Expected completion">
          <Input
            type="date"
            value={value.expectedCompletionDate}
            onChange={(e) =>
              update('expectedCompletionDate', e.target.value)
            }
          />
        </Field>
        <Field label="Actual completion">
          <Input
            type="date"
            value={value.actualCompletionDate}
            onChange={(e) =>
              update('actualCompletionDate', e.target.value)
            }
          />
        </Field>
        <Field label="Total land area (m²)">
          <Input
            type="number"
            min="0"
            step="0.01"
            value={value.totalLandArea}
            onChange={(e) => update('totalLandArea', e.target.value)}
          />
        </Field>
      </Section>
      <Section title="Price range" cols={3}>
        <Field label="Currency">
          <FormSelect
            value={value.priceCurrency}
            onChange={(v) => update('priceCurrency', v)}
            options={[
              { value: 'USD', label: 'USD ($)' },
              { value: 'GEL', label: 'GEL (₾)' },
              { value: 'EUR', label: 'EUR (€)' },
            ]}
          />
        </Field>
        <Field label="Min price">
          <Input
            type="number"
            min="0"
            value={value.minPrice}
            onChange={(e) => update('minPrice', e.target.value)}
          />
        </Field>
        <Field label="Max price">
          <Input
            type="number"
            min="0"
            value={value.maxPrice}
            onChange={(e) => update('maxPrice', e.target.value)}
          />
        </Field>
        <Field label="Min price / m²">
          <Input
            type="number"
            min="0"
            value={value.minPricePerSqm}
            onChange={(e) => update('minPricePerSqm', e.target.value)}
          />
        </Field>
        <Field label="Max price / m²">
          <Input
            type="number"
            min="0"
            value={value.maxPricePerSqm}
            onChange={(e) => update('maxPricePerSqm', e.target.value)}
          />
        </Field>
      </Section>
      <Section title="Apartment sizes (m²)" cols={2}>
        <Field label="Min size">
          <Input
            type="number"
            min="0"
            step="0.01"
            value={value.minSizeApartment}
            onChange={(e) => update('minSizeApartment', e.target.value)}
          />
        </Field>
        <Field label="Max size">
          <Input
            type="number"
            min="0"
            step="0.01"
            value={value.maxSizeApartment}
            onChange={(e) => update('maxSizeApartment', e.target.value)}
          />
        </Field>
      </Section>
    </div>
  );
}
