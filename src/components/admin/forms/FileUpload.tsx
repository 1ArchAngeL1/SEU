'use client';

import { useRef, useState } from 'react';
import { Loader2, Upload, X, FileText, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fileUrl } from '@/lib/file-url';
import { filesService } from '@/service/files.service';

interface FileUploadProps {
  /** Stored value — typically a UUID from the file service, but external URLs are accepted too. */
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  /** Restrict the file picker. Defaults to all images. */
  accept?: string;
  /** When true, render a richer preview tile (best for hero/main images). */
  preview?: boolean;
  /** Helper label shown when empty. */
  emptyLabel?: string;
  className?: string;
  disabled?: boolean;
}

export default function FileUpload({
  value,
  onChange,
  accept = 'image/*',
  preview = true,
  emptyLabel = 'Click to upload or drop a file here',
  className,
  disabled,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const isImage = !accept || accept.startsWith('image');
  const resolvedUrl = value ? fileUrl(value) : '';

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    try {
      const result = await filesService.upload(file);
      onChange(result.uuid);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
    e.target.value = '';
  }

  function onDrop(e: React.DragEvent<HTMLElement>) {
    e.preventDefault();
    setDragActive(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  }

  function clear() {
    onChange(undefined);
    setError(null);
  }

  // Empty state — drop zone
  if (!value) {
    return (
      <div className={cn('w-full', className)}>
        <button
          type="button"
          disabled={disabled || uploading}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={onDrop}
          className={cn(
            'w-full rounded-xl border-2 border-dashed transition-all',
            'flex flex-col items-center justify-center gap-2 px-4 py-7 text-center',
            'bg-admin-input-gradient',
            dragActive
              ? 'border-[color:var(--admin-accent)] bg-[color:var(--admin-accent-soft)]'
              : 'border-admin-border hover:border-[color:var(--admin-accent)]/60 hover:bg-admin-hover',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {uploading ? (
            <>
              <Loader2 className="size-5 text-admin-fg-muted animate-spin" />
              <span className="font-montserrat text-seu-caption-sm text-admin-fg-muted">
                Uploading…
              </span>
            </>
          ) : (
            <>
              <span className="size-10 rounded-full bg-[color:var(--admin-accent-soft)] grid place-items-center text-[color:var(--admin-accent)]">
                <Upload className="size-5" />
              </span>
              <span className="font-montserrat font-medium text-seu-caption text-admin-fg">
                {emptyLabel}
              </span>
              <span className="font-montserrat text-seu-caption-sm text-admin-fg-dim">
                {accept === 'image/*'
                  ? 'PNG, JPG, WEBP, GIF'
                  : accept || 'Any file type'}
              </span>
            </>
          )}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
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

  // Filled state — preview + replace/remove controls
  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'relative rounded-xl border border-admin-border bg-admin-input-gradient overflow-hidden',
          'group shadow-admin'
        )}
      >
        {isImage && resolvedUrl ? (
          <div className="relative aspect-[16/9] bg-admin-deep">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resolvedUrl}
              alt="upload preview"
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        ) : (
          <div className="flex items-center gap-3 px-4 py-3">
            <span className="size-10 rounded-lg bg-admin-deep border border-admin-border-soft grid place-items-center text-admin-fg-muted shrink-0">
              {isImage ? (
                <ImageIcon className="size-5" />
              ) : (
                <FileText className="size-5" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <div className="font-montserrat text-seu-caption text-admin-fg truncate">
                {value}
              </div>
              <div className="font-montserrat text-seu-caption-sm text-admin-fg-dim">
                Stored reference
              </div>
            </div>
          </div>
        )}

        <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled || uploading}
            className="bg-admin-card/95 backdrop-blur border border-admin-border text-admin-fg-muted hover:text-admin-fg p-1.5 rounded-md transition-colors shadow-admin"
            title="Replace file"
          >
            {uploading ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Upload className="size-3.5" />
            )}
          </button>
          <button
            type="button"
            onClick={clear}
            disabled={disabled || uploading}
            className="bg-admin-card/95 backdrop-blur border border-admin-border text-rose-400 hover:text-rose-300 p-1.5 rounded-md transition-colors shadow-admin"
            title="Remove"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={onPick}
        disabled={disabled}
      />

      {!preview && (
        <div className="mt-1.5 font-montserrat text-seu-caption-sm text-admin-fg-dim truncate">
          {value}
        </div>
      )}

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
