'use client';

import { Field, FormSelect, Input, Section } from '../form-primitives';
import FormBlock from './FormBlock';

export interface UnitPriceSectionValue {
  amount: string;
  currency: string;
  pricePerSqm: string;
  discount: string;
  originalPrice: string;
}

interface UnitPriceSectionProps {
  value: UnitPriceSectionValue;
  update: <K extends keyof UnitPriceSectionValue>(
    k: K,
    v: UnitPriceSectionValue[K]
  ) => void;
}

export default function UnitPriceSection({
  value,
  update,
}: UnitPriceSectionProps) {
  return (
    <FormBlock title="Pricing" subtitle="Headline price and discounts">
      <Section cols={3}>
        <Field label="Amount">
          <Input
            type="number"
            min="0"
            step="0.01"
            value={value.amount}
            onChange={(e) => update('amount', e.target.value)}
          />
        </Field>
        <Field label="Currency">
          <FormSelect
            value={value.currency}
            onChange={(v) => update('currency', v)}
            options={[
              { value: 'USD', label: 'USD ($)' },
              { value: 'GEL', label: 'GEL (₾)' },
              { value: 'EUR', label: 'EUR (€)' },
            ]}
          />
        </Field>
        <Field label="Price / m²">
          <Input
            type="number"
            min="0"
            step="0.01"
            value={value.pricePerSqm}
            onChange={(e) => update('pricePerSqm', e.target.value)}
          />
        </Field>
        <Field label="Discount">
          <Input
            type="number"
            min="0"
            step="0.01"
            value={value.discount}
            onChange={(e) => update('discount', e.target.value)}
          />
        </Field>
        <Field label="Original price" hint="Pre-discount">
          <Input
            type="number"
            min="0"
            step="0.01"
            value={value.originalPrice}
            onChange={(e) => update('originalPrice', e.target.value)}
          />
        </Field>
      </Section>
    </FormBlock>
  );
}
