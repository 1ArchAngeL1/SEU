'use client';

import { Switch } from '../form-primitives';

export interface BuildingFlagsSectionValue {
  isActive: boolean;
}

interface Props {
  value: BuildingFlagsSectionValue;
  update: <K extends keyof BuildingFlagsSectionValue>(
    k: K,
    v: BuildingFlagsSectionValue[K]
  ) => void;
}

export default function BuildingFlagsSection({ value, update }: Props) {
  return (
    <div className="space-y-4">
      <Switch
        label="Active"
        checked={value.isActive}
        onChange={(v) => update('isActive', v)}
      />
    </div>
  );
}
