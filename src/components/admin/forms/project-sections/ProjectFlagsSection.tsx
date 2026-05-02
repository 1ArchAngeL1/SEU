'use client';

import { Switch } from '../form-primitives';

export interface ProjectFlagsSectionValue {
  isActive: boolean;
  isFeatured: boolean;
}

interface Props {
  value: ProjectFlagsSectionValue;
  update: <K extends keyof ProjectFlagsSectionValue>(
    k: K,
    v: ProjectFlagsSectionValue[K]
  ) => void;
}

export default function ProjectFlagsSection({ value, update }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Switch
          label="Active"
          checked={value.isActive}
          onChange={(v) => update('isActive', v)}
        />
        <Switch
          label="Featured"
          checked={value.isFeatured}
          onChange={(v) => update('isFeatured', v)}
        />
      </div>
    </div>
  );
}
