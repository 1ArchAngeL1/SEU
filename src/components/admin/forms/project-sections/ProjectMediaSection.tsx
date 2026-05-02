'use client';

import { Field, Input } from '../form-primitives';
import FileUpload from '../FileUpload';
import FileGallery from '../FileGallery';

export interface ProjectMediaSectionValue {
  mainImage: string;
  images: string[];
  videoUrl: string;
}

interface Props {
  value: ProjectMediaSectionValue;
  update: <K extends keyof ProjectMediaSectionValue>(
    k: K,
    v: ProjectMediaSectionValue[K]
  ) => void;
}

export default function ProjectMediaSection({ value, update }: Props) {
  return (
    <div className="space-y-5">
      <Field label="Main image" hint="Cover image used in cards and headers">
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
      <Field label="Video URL" hint="External video link (YouTube, Vimeo, …)">
        <Input
          value={value.videoUrl}
          onChange={(e) => update('videoUrl', e.target.value)}
          placeholder="https://youtube.com/…"
        />
      </Field>
    </div>
  );
}
