'use client';

import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Field, Input } from './form-primitives';
import type { PolygonEntry } from '@/model/types/api';

export interface PolygonEditorValue {
  entries: PolygonEntry[];
  /** Source image width in pixels (the image the coordinates were measured on). */
  imageWidth: string;
  /** Source image height in pixels. */
  imageHeight: string;
}

interface PolygonsEditorProps {
  value: PolygonEditorValue;
  onChange: (val: PolygonEditorValue) => void;
}

export default function PolygonsEditor({
  value,
  onChange,
}: PolygonsEditorProps) {
  const [expanded, setExpanded] = useState(false);

  function addPolygon() {
    onChange({
      ...value,
      entries: [...value.entries, { raw: '', label: '' }],
    });
    setExpanded(true);
  }

  function updateEntry(index: number, patch: Partial<PolygonEntry>) {
    onChange({
      ...value,
      entries: value.entries.map((p, i) =>
        i === index ? { ...p, ...patch } : p
      ),
    });
  }

  function removeEntry(index: number) {
    onChange({
      ...value,
      entries: value.entries.filter((_, i) => i !== index),
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 font-montserrat text-seu-caption text-admin-fg-muted hover:text-admin-fg transition-colors"
        >
          {expanded ? (
            <ChevronUp className="size-3.5" />
          ) : (
            <ChevronDown className="size-3.5" />
          )}
          Polygons ({value.entries.length})
        </button>
        <button
          type="button"
          onClick={addPolygon}
          className="flex items-center gap-1 font-montserrat text-seu-caption-sm text-primary-orange hover:text-primary-orange/80 transition-colors"
        >
          <Plus className="size-3.5" />
          Add
        </button>
      </div>

      {expanded && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Field label="Source image width (px)" hint="Width of the image you measured coords on">
              <Input
                type="number"
                min="1"
                value={value.imageWidth}
                onChange={(e) =>
                  onChange({ ...value, imageWidth: e.target.value })
                }
                placeholder="e.g. 3840"
              />
            </Field>
            <Field label="Source image height (px)" hint="Height of the same image">
              <Input
                type="number"
                min="1"
                value={value.imageHeight}
                onChange={(e) =>
                  onChange({ ...value, imageHeight: e.target.value })
                }
                placeholder="e.g. 2160"
              />
            </Field>
          </div>

          {value.entries.length > 0 && (
            <div className="space-y-3">
              {value.entries.map((entry, i) => {
                const pairCount = entry.raw
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean).length;
                const pointCount = Math.floor(pairCount / 2);
                return (
                  <div
                    key={i}
                    className="rounded-lg border border-admin-border-soft bg-admin-deep/40 p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-montserrat text-seu-caption-sm text-admin-fg-muted">
                        #{i + 1} · {pointCount} points
                      </span>
                      <button
                        type="button"
                        onClick={() => removeEntry(i)}
                        className="text-rose-400/70 hover:text-rose-300 transition-colors p-0.5"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                    <Input
                      value={entry.raw}
                      onChange={(e) => updateEntry(i, { raw: e.target.value })}
                      placeholder="x1,y1,x2,y2,x3,y3,x4,y4  (pixel coordinates)"
                      className="font-mono text-seu-caption-sm"
                    />
                    <Input
                      value={entry.label ?? ''}
                      onChange={(e) =>
                        updateEntry(i, { label: e.target.value })
                      }
                      placeholder="Label (optional)"
                    />
                  </div>
                );
              })}
            </div>
          )}

          {value.entries.length === 0 && (
            <p className="font-montserrat text-seu-caption-sm text-admin-fg-dim py-2">
              No polygons yet. Click Add to define clickable areas.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
