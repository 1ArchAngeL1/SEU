'use client';

import { Switch } from '../form-primitives';

export interface ProjectFlagsSectionValue {
  isActive: boolean;
  isFeatured: boolean;
  isDefault: boolean;
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
        <Switch
          label="Default in search"
          checked={value.isDefault}
          onChange={(v) => update('isDefault', v)}
        />
      </div>
      <p className="font-montserrat text-seu-caption-sm text-secondary-grey">
        “Default in search” pre-selects this project on the apartment search
        page. Turning it on for one project turns it off for the others.
      </p>
    </div>
  );
}
