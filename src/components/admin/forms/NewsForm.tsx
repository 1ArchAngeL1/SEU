'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Input, Textarea } from '@/components/ui/input';
import {
  Field,
  FormFooter,
  Section,
} from '@/components/admin/forms/form-primitives';
import FileUpload from '@/components/admin/forms/FileUpload';
import type { NewsArticle, CreateNewsInput } from '@/model/types/api';

interface NewsFormProps {
  initialData?: NewsArticle;
  onSubmit: (input: CreateNewsInput) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
}

export default function NewsForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel,
}: NewsFormProps) {
  const [form, setForm] = useState({
    headerEn: initialData?.headerEn ?? '',
    headerKa: initialData?.headerKa ?? '',
    descriptionEn: initialData?.descriptionEn ?? '',
    descriptionKa: initialData?.descriptionKa ?? '',
    image: initialData?.image ?? [] as string[],
    tags: initialData?.tags ?? [] as string[],
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addTag() {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      set('tags', [...form.tags, tag]);
    }
    setTagInput('');
  }

  function removeTag(tag: string) {
    set('tags', form.tags.filter((t) => t !== tag));
  }

  function addImage(fileId: string) {
    set('image', [...form.image, fileId]);
  }

  function removeImage(index: number) {
    set('image', form.image.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.headerEn.trim() || !form.headerKa.trim()) {
      setError('Both English and Georgian headers are required');
      return;
    }
    if (!form.descriptionEn.trim() || !form.descriptionKa.trim()) {
      setError('Both English and Georgian descriptions are required');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const payload: CreateNewsInput = {
        headerEn: form.headerEn.trim(),
        headerKa: form.headerKa.trim(),
        descriptionEn: form.descriptionEn.trim(),
        descriptionKa: form.descriptionKa.trim(),
        ...(form.image.length > 0 && { image: form.image }),
        ...(form.tags.length > 0 && { tags: form.tags }),
      };
      await onSubmit(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Section title="Content">
        <Field label="Header (English) *">
          <Input
            value={form.headerEn}
            onChange={(e) => set('headerEn', e.target.value)}
            placeholder="News article headline"
          />
        </Field>
        <Field label="Header (Georgian) *">
          <Input
            value={form.headerKa}
            onChange={(e) => set('headerKa', e.target.value)}
            placeholder="სტატიის სათაური"
          />
        </Field>
        <Field label="Description (English) *" className="sm:col-span-2">
          <Textarea
            value={form.descriptionEn}
            onChange={(e) => set('descriptionEn', e.target.value)}
            placeholder="Full article content…"
            rows={6}
          />
        </Field>
        <Field label="Description (Georgian) *" className="sm:col-span-2">
          <Textarea
            value={form.descriptionKa}
            onChange={(e) => set('descriptionKa', e.target.value)}
            placeholder="სრული სტატია…"
            rows={6}
          />
        </Field>
      </Section>

      <Section title="Tags" cols={1}>
        <Field label="Tags" hint="Press Enter to add">
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="e.g. seuvarketili"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-admin-hover border border-admin-border-soft rounded-lg text-seu-caption text-admin-fg hover:bg-admin-border-soft transition-colors shrink-0"
            >
              Add
            </button>
          </div>
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1.5 px-3 py-1 bg-admin-hover border border-admin-border-soft rounded-lg font-montserrat text-seu-caption-sm text-admin-fg"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-admin-fg-dim hover:text-red transition-colors"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </Field>
      </Section>

      <Section title="Images" cols={1}>
        <Field label="Article Images">
          <FileUpload
            value={undefined}
            onChange={(v) => {
              if (v) addImage(v);
            }}
            accept="image/*"
            emptyLabel="Upload image"
          />
          {form.image.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {form.image.map((imgId, i) => (
                <div
                  key={i}
                  className="relative group rounded-lg overflow-hidden border border-admin-border-soft w-20 h-20 bg-admin-deep"
                >
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 z-10 size-5 rounded-full bg-black/60 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="size-3 text-white" />
                  </button>
                  <span className="flex items-center justify-center w-full h-full text-admin-fg-dim font-montserrat text-seu-caption-sm">
                    IMG {i + 1}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Field>
      </Section>

      <FormFooter
        onCancel={onCancel}
        loading={loading}
        submitLabel={submitLabel}
        error={error}
      />
    </form>
  );
}
