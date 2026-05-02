'use client';

import { useRef, useState } from 'react';
import { Loader2, Plus, X, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fileUrl } from '@/lib/file-url';
import { filesService } from '@/service/files.service';

interface FileGalleryProps {
  value: string[];
  onChange: (next: string[]) => void;
  accept?: string;
  /** Maximum number of files. Optional. */
  max?: number;
  className?: string;
  disabled?: boolean;
}

export default function FileGallery({
  value,
  onChange,
  accept = 'image/*',
  max,
  className,
  disabled,
}: FileGalleryProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isImage = !accept || accept.startsWith('image');

  async function handleFiles(files: FileList | File[]) {
    const list = Array.from(files);
    if (list.length === 0) return;
    setError(null);
    setUploading(true);

    const remainingSlots =
      max !== undefined ? Math.max(0, max - value.length) : list.length;
    const toUpload = list.slice(0, remainingSlots);

    try {
      const uuids: string[] = [];
      for (const f of toUpload) {
        const result = await filesService.upload(f);
        uuids.push(result.uuid);
      }
      onChange([...value, ...uuids]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      void handleFiles(e.target.files);
    }
    e.target.value = '';
  }

  function remove(uuid: string) {
    onChange(value.filter((u) => u !== uuid));
  }

  const limitReached = max !== undefined && value.length >= max;

  return (
    <div className={cn('w-full', className)}>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {value.map((uuid) => {
          const url = fileUrl(uuid);
          return (
            <div
              key={uuid}
              className="group relative aspect-square rounded-lg border border-admin-border bg-admin-input-gradient overflow-hidden shadow-admin"
            >
              {isImage && url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={url}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-admin-fg-muted p-2">
                  <ImageIcon className="size-6" />
                </div>
              )}
              <button
                type="button"
                onClick={() => remove(uuid)}
                disabled={disabled}
                className="absolute top-1.5 right-1.5 bg-admin-card/95 backdrop-blur border border-admin-border text-rose-400 hover:text-rose-300 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-admin"
                title="Remove"
              >
                <X className="size-3" />
              </button>
            </div>
          );
        })}

        {!limitReached && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled || uploading}
            className={cn(
              'aspect-square rounded-lg border-2 border-dashed border-admin-border',
              'bg-admin-input-gradient',
              'flex flex-col items-center justify-center gap-1.5 text-admin-fg-muted',
              'hover:border-[color:var(--admin-accent)]/60 hover:text-[color:var(--admin-accent)] hover:bg-admin-hover',
              'transition-all',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {uploading ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                <span className="font-montserrat text-seu-caption-sm">
                  Uploading…
                </span>
              </>
            ) : (
              <>
                <Plus className="size-5" />
                <span className="font-montserrat text-seu-caption-sm">
                  Add file{value.length > 0 ? 's' : ''}
                </span>
                {max !== undefined && (
                  <span className="font-montserrat text-[0.65rem] text-admin-fg-dim">
                    {value.length}/{max}
                  </span>
                )}
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="hidden"
        onChange={onPick}
        disabled={disabled}
      />

      {error && (
        <p
          className="mt-2 font-montserrat text-seu-caption-sm"
          style={{ color: 'var(--admin-danger-text)' }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
