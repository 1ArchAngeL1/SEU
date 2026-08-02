'use client';

import { useState, useEffect, useCallback } from 'react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface NewsGalleryProps {
  images: string[];
  title: string;
}

export default function NewsGallery({ images, title }: NewsGalleryProps) {
  const t = useTranslations('common');
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const isOpen = openIdx !== null;
  const total = images.length;

  const prev = useCallback(
    () => setOpenIdx((i) => (i === null ? i : (i - 1 + total) % total)),
    [total],
  );
  const next = useCallback(
    () => setOpenIdx((i) => (i === null ? i : (i + 1) % total)),
    [total],
  );

  // Arrow-key navigation while the lightbox is open (Escape handled by Radix).
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, prev, next]);

  if (total === 0) return null;

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {images.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            onClick={() => setOpenIdx(i)}
            className={[
              'group relative aspect-[4/3] overflow-hidden rounded-xl bg-secondary-black/10',
              'ring-1 ring-dark-green/10 hover:ring-primary-green/40',
              'shadow-sm hover:shadow-xl transition-all duration-300',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-green/60',
            ].join(' ')}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`${title} — ${i + 1}`}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Hover veil */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-green/55 via-dark-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {/* Expand affordance */}
            <span className="absolute bottom-3 right-3 size-9 rounded-full bg-white/90 backdrop-blur grid place-items-center text-dark-green opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
              <Maximize2 className="size-4" />
            </span>
          </button>
        ))}
      </div>

      {/* Lightbox preview */}
      <DialogPrimitive.Root
        open={isOpen}
        onOpenChange={(o) => {
          if (!o) setOpenIdx(null);
        }}
      >
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
          <DialogPrimitive.Content
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-10 outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0"
            onClick={() => setOpenIdx(null)}
          >
            <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>
            <DialogPrimitive.Description className="sr-only">
              {title}
            </DialogPrimitive.Description>

            {openIdx !== null && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  key={openIdx}
                  src={images[openIdx]}
                  alt={`${title} — ${openIdx + 1}`}
                  onClick={(e) => e.stopPropagation()}
                  className="max-h-[88vh] max-w-[92vw] object-contain rounded-lg shadow-2xl animate-in fade-in zoom-in-95 duration-300"
                />

                {total > 1 && (
                  <>
                    <button
                      type="button"
                      aria-label={t('previousImage')}
                      onClick={(e) => {
                        e.stopPropagation();
                        prev();
                      }}
                      className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 size-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur grid place-items-center text-white transition-colors"
                    >
                      <ChevronLeft className="size-6" />
                    </button>
                    <button
                      type="button"
                      aria-label={t('nextImage')}
                      onClick={(e) => {
                        e.stopPropagation();
                        next();
                      }}
                      className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 size-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur grid place-items-center text-white transition-colors"
                    >
                      <ChevronRight className="size-6" />
                    </button>
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur font-montserrat text-seu-caption-sm text-white tabular-nums">
                      {openIdx + 1} / {total}
                    </div>
                  </>
                )}
              </>
            )}

            <DialogPrimitive.Close
              aria-label={t('close')}
              className="absolute top-4 right-4 size-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur grid place-items-center text-white transition-colors"
            >
              <X className="size-5" />
            </DialogPrimitive.Close>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}
