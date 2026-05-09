import { pickLocale } from '@/lib/i18n-helpers';
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
  projects: Array<{ id: string; name: any }>;
};

export default function ProjectSelect({
  value,
  onChange,
  projects,
}: ProjectSelectProps) {
  return (
    <div>
      <Label className={labelClass}>Project</Label>
      <Select
        value={value || ANY_PROJECT}
        onValueChange={(v) => onChange(v === ANY_PROJECT ? '' : v)}
      >
        <SelectTrigger className={triggerClass}>
          <SelectValue placeholder="Choose" />
        </SelectTrigger>
        <SelectContent className={contentClass}>
          <SelectItem value={ANY_PROJECT} className={itemClass}>
            Any project
          </SelectItem>
          {projects.map((p) => (
            <SelectItem value={p.id} key={p.id} className={itemClass}>
              {pickLocale(p.name)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
