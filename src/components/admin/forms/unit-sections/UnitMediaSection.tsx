'use client';

import { Field, Input, Section } from '../form-primitives';
import FileUpload from '../FileUpload';
import FileGallery from '../FileGallery';
import FormBlock from './FormBlock';

export interface UnitMediaSectionValue {
  mainImage: string;
  images: string[];
  floorPlanImage: string;
  videoTourUrl: string;
  virtualTourUrl: string;
}

interface UnitMediaSectionProps {
  value: UnitMediaSectionValue;
  update: <K extends keyof UnitMediaSectionValue>(
    k: K,
    v: UnitMediaSectionValue[K]
  ) => void;
}

export default function UnitMediaSection({
  value,
  update,
}: UnitMediaSectionProps) {
  return (
    <FormBlock title="Media" subtitle="Image, floor plan, and tour links">
      <div className="space-y-5">
        <Field label="Main image" hint="Cover image used in cards and listings">
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
        <Field label="Floor plan" hint="Image of this unit's layout">
          <FileUpload
            value={value.floorPlanImage || undefined}
            onChange={(v) => update('floorPlanImage', v ?? '')}
          />
        </Field>
        <Section cols={2}>
          <Field
            label="Video tour URL"
            hint="External link (YouTube, Vimeo, …)"
          >
            <Input
              value={value.videoTourUrl}
              onChange={(e) => update('videoTourUrl', e.target.value)}
              placeholder="https://youtube.com/…"
            />
          </Field>
          <Field
            label="Virtual tour URL"
            hint="External link (Matterport, …)"
          >
            <Input
              value={value.virtualTourUrl}
              onChange={(e) => update('virtualTourUrl', e.target.value)}
              placeholder="https://matterport.com/…"
            />
          </Field>
        </Section>
      </div>
    </FormBlock>
  );
}
