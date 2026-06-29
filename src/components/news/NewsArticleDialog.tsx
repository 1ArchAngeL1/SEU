'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ImageIcon, X } from 'lucide-react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { useLocale, useTranslations } from 'next-intl';
import { fileUrl } from '@/lib/file-url';
import { pickLocalized, type Locale } from '@/lib/i18n-helpers';
import { cn } from '@/lib/utils';
import type { NewsArticle } from '@/model/types/api';

function estimateReadMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

interface NewsArticleDialogProps {
  article: NewsArticle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NewsArticleDialog({
  article,
  open,
  onOpenChange,
}: NewsArticleDialogProps) {
  const [imgIdx, setImgIdx] = useState(0);
  const locale = useLocale() as Locale;
  const t = useTranslations('common');
  const tNews = useTranslations('news');

  useEffect(() => {
    if (open) setImgIdx(0);
  }, [open, article?.id]);

  if (!article) return null;

  const images = article.image
    .map((id) => fileUrl(id))
    .filter(Boolean) as string[];
  const total = images.length;
  const header = pickLocalized(article.headerEn, article.headerKa, locale);
  const description = pickLocalized(article.descriptionEn, article.descriptionKa, locale);
  const readTime = tNews('minRead', { minutes: estimateReadMinutes(description) });
  const date = formatDate(article.createdAt);

  function prev() {
    setImgIdx((i) => (i - 1 + total) % total);
  }
  function next() {
    setImgIdx((i) => (i + 1) % total);
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            'fixed top-[50%] left-[50%] z-50 w-full max-w-4xl translate-x-[-50%] translate-y-[-50%]',
            'max-h-[92vh] overflow-hidden rounded-2xl border border-pale-gray/15 bg-dark-green text-pale-gray',
            'shadow-[0_24px_80px_rgba(0,0,0,0.6)] outline-none',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
            'flex flex-col'
          )}
        >
          {/* Hidden a11y title/description (Radix requires) */}
          <DialogPrimitive.Title className="sr-only">
            {header}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            {description.slice(0, 140)}
          </DialogPrimitive.Description>

          {/* Close button */}
          <DialogPrimitive.Close
            className="absolute top-4 right-4 z-20 size-9 rounded-full bg-dark-green/70 backdrop-blur border border-pale-gray/20 grid place-items-center text-pale-gray hover:bg-dark-green hover:border-pale-gray/40 transition-colors"
            aria-label={t('close')}
          >
            <X className="size-4" />
          </DialogPrimitive.Close>

          {/* Hero image */}
          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] bg-secondary-black shrink-0 overflow-hidden">
            {total > 0 ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  key={images[imgIdx]}
                  src={images[imgIdx]}
                  alt={header}
                  className="absolute inset-0 w-full h-full object-cover animate-in fade-in duration-500"
                />
                {/* Bottom fade into the body */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-dark-green to-transparent pointer-events-none" />

                {total > 1 && (
                  <>
                    <button
                      onClick={prev}
                      aria-label={t('previousImage')}
                      className="absolute left-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-dark-green/70 backdrop-blur border border-pale-gray/20 grid place-items-center text-pale-gray hover:bg-dark-green transition-colors"
                    >
                      <ChevronLeft className="size-4" />
                    </button>
                    <button
                      onClick={next}
                      aria-label={t('nextImage')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-dark-green/70 backdrop-blur border border-pale-gray/20 grid place-items-center text-pale-gray hover:bg-dark-green transition-colors"
                    >
                      <ChevronRight className="size-4" />
                    </button>
                    {/* Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-dark-green/80 backdrop-blur border border-pale-gray/20 font-montserrat text-seu-caption-sm text-pale-gray tabular-nums">
                      {String(imgIdx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="absolute inset-0 grid place-items-center">
                <ImageIcon className="size-14 text-pale-gray/15" />
              </div>
            )}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 sm:px-10 lg:px-14 pb-10 -mt-10 relative">
            {/* Meta line: date · read time · tags */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              {date && (
                <span className="font-montserrat text-seu-caption-sm text-secondary-grey uppercase tracking-wider">
                  {date}
                </span>
              )}
              {date && (
                <span className="size-1 rounded-full bg-secondary-grey/50" />
              )}
              <span className="font-montserrat text-seu-caption-sm text-secondary-grey">
                {readTime}
              </span>
              {article.tags.length > 0 && (
                <>
                  <span className="size-1 rounded-full bg-secondary-grey/50" />
                  <div className="flex flex-wrap gap-1.5">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-full bg-pale-gray/10 border border-pale-gray/15 font-montserrat text-seu-caption-sm text-pale-gray"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Header */}
            <h2 className="font-[--font-bodoni] text-seu-heading sm:text-seu-heading-lg lg:text-seu-title text-pale-gray leading-tight mb-6">
              {header}
            </h2>

            {/* Accent rule */}
            <div className="h-px w-16 bg-gradient-to-r from-primary-green to-transparent mb-7" />

            {/* Description */}
            <p className="font-montserrat text-seu-body-sm sm:text-seu-body text-pale-gray/85 leading-relaxed whitespace-pre-line">
              {description}
            </p>

            {/* Thumbnail strip when multiple images */}
            {total > 1 && (
              <div className="mt-10 pt-6 border-t border-pale-gray/10">
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((src, i) => (
                    <button
                      key={`${src}-${i}`}
                      type="button"
                      onClick={() => setImgIdx(i)}
                      className={cn(
                        'relative shrink-0 w-24 h-16 rounded-md overflow-hidden border transition-all',
                        i === imgIdx
                          ? 'border-primary-green ring-2 ring-primary-green/30'
                          : 'border-pale-gray/15 opacity-60 hover:opacity-100'
                      )}
                      aria-label={t('imageN', { n: i + 1 })}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
