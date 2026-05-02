'use client';

import { Field } from '../form-primitives';
import FileUpload from '../FileUpload';
import FileGallery from '../FileGallery';

export interface BuildingMediaSectionValue {
  mainImage: string;
  images: string[];
}

interface Props {
  value: BuildingMediaSectionValue;
  update: <K extends keyof BuildingMediaSectionValue>(
    k: K,
    v: BuildingMediaSectionValue[K]
  ) => void;
}

export default function BuildingMediaSection({ value, update }: Props) {
  return (
    <div className="space-y-5">
      <Field label="Main image" hint="Block cover image">
        <FileUpload
          value={value.mainImage || undefined}
          onChange={(v) => update('mainImage', v ?? '')}
        />
      </Field>
      <Field label="Gallery">
        <FileGallery
          value={value.images}
          onChange={(v) => update('images', v)}
        />
      </Field>
    </div>
  );
}
