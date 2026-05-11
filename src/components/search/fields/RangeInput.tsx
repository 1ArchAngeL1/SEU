'use client';

import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { fieldClass, labelClass } from './styles';

export type RangeInputProps = {
  label: string;
  from: string;
  to: string;
  onFromChange: (v: string) => void;
  onToChange: (v: string) => void;
};

export default function RangeInput({
  label,
  from,
  to,
  onFromChange,
  onToChange,
}: RangeInputProps) {
  const t = useTranslations('search');
  return (
    <div>
      <Label className={labelClass}>{label}</Label>
      <div className="flex gap-3">
        <Input
          type="number"
          min={0}
          inputMode="numeric"
          value={from}
          onChange={(e) => onFromChange(e.target.value)}
          placeholder={t('from')}
          className={fieldClass}
        />
        <Input
          type="number"
          min={0}
          inputMode="numeric"
          value={to}
          onChange={(e) => onToChange(e.target.value)}
          placeholder={t('to')}
          className={fieldClass}
        />
      </div>
    </div>
  );
}
