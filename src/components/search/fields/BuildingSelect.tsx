import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { labelClass, triggerClass, contentClass, itemClass } from './styles';

const ANY_BUILDING = '__any_building__';

export type BuildingSelectProps = {
  value: string;
  onChange: (v: string) => void;
  buildings: Array<{ id: string; block: string }>;
  disabled?: boolean;
};

export default function BuildingSelect({
  value,
  onChange,
  buildings,
  disabled,
}: BuildingSelectProps) {
  return (
    <div>
      <Label className={labelClass}>Block</Label>
      <Select
        value={value || ANY_BUILDING}
        onValueChange={(v) => onChange(v === ANY_BUILDING ? '' : v)}
        disabled={disabled}
      >
        <SelectTrigger className={triggerClass}>
          <SelectValue placeholder="Choose" />
        </SelectTrigger>
        <SelectContent className={contentClass}>
          <SelectItem value={ANY_BUILDING} className={itemClass}>
            Any block
          </SelectItem>
          {buildings.map((b) => (
            <SelectItem value={b.id} key={b.id} className={itemClass}>
              Block {b.block}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
