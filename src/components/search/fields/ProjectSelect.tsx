'use client';

import { useLocale, useTranslations } from 'next-intl';
import { pickLocalized, type Locale } from '@/lib/i18n-helpers';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { labelClass, triggerClass, contentClass, itemClass } from './styles';

const ANY_PROJECT = '__any_project__';

export type ProjectSelectProps = {
  value: string;
  onChange: (v: string) => void;
  projects: Array<{ id: string; nameEn: string; nameKa: string }>;
};

export default function ProjectSelect({
  value,
  onChange,
  projects,
}: ProjectSelectProps) {
  const t = useTranslations('search');
  const locale = useLocale() as Locale;
  return (
    <div>
      <Label className={labelClass}>{t('project')}</Label>
      <Select
        value={value || ANY_PROJECT}
        onValueChange={(v) => onChange(v === ANY_PROJECT ? '' : v)}
      >
        <SelectTrigger className={triggerClass}>
          <SelectValue placeholder={t('choose')} />
        </SelectTrigger>
        <SelectContent className={contentClass}>
          <SelectItem value={ANY_PROJECT} className={itemClass}>
            {t('anyProject')}
          </SelectItem>
          {projects.map((p) => (
            <SelectItem value={p.id} key={p.id} className={itemClass}>
              {pickLocalized(p.nameEn, p.nameKa, locale)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
