'use client';

import { Field } from '../form-primitives';
import FileUpload from '../FileUpload';
import FileGallery from '../FileGallery';
import PolygonsEditor, { type PolygonEditorValue } from '../PolygonsEditor';

export interface BuildingMediaSectionValue {
  mainImage: string;
  renderImage: string;
  images: string[];
  polygonEditor: PolygonEditorValue;
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
      <Field label="Render image" hint="Building render / 3D visual for visual search">
        <FileUpload
          value={value.renderImage || undefined}
          onChange={(v) => update('renderImage', v ?? '')}
        />
      </Field>
      <Field label="Gallery">
        <FileGallery
          value={value.images}
          onChange={(v) => update('images', v)}
        />
      </Field>
      <PolygonsEditor
        value={value.polygonEditor}
        onChange={(v) => update('polygonEditor', v)}
      />
    </div>
  );
}
