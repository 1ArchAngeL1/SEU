'use client';

import { Field, Input } from '../form-primitives';
import FileUpload from '../FileUpload';
import FileGallery from '../FileGallery';

export interface ProjectMediaSectionValue {
  mainImage: string;
  renderImage: string;
  images: string[];
  videoUrl: string;
  googleMapLink: string;
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
      <Field label="Render image" hint="Project render / 3D visual for visual search">
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
      <Field label="Video URL" hint="External video link (YouTube, Vimeo, …)">
        <Input
          value={value.videoUrl}
          onChange={(e) => update('videoUrl', e.target.value)}
          placeholder="https://youtube.com/…"
        />
      </Field>
      <Field label="Google Maps Link" hint="Embed URL for the project location map">
        <Input
          value={value.googleMapLink}
          onChange={(e) => update('googleMapLink', e.target.value)}
          placeholder="https://www.google.com/maps/embed?pb=…"
        />
      </Field>
    </div>
  );
}
