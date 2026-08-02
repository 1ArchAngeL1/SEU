'use client';

import { ImageIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import FadeIn from '@/components/FadeIn';
import BackButton from '@/components/BackButton';
import { fileUrl } from '@/lib/file-url';
import { pickLocalized, type Locale } from '@/lib/i18n-helpers';
import {
  estimateReadMinutes,
  formatNewsDate,
  toParagraphs,
} from '@/lib/news-helpers';
import type { NewsArticle } from '@/model/types/api';

export default function NewsArticleView({ article }: { article: NewsArticle }) {
  const locale = useLocale() as Locale;
  const t = useTranslations('news');

  const header = pickLocalized(article.headerEn, article.headerKa, locale);
  const description = pickLocalized(
    article.descriptionEn,
    article.descriptionKa,
    locale,
  );

  const images = article.image.map((id) => fileUrl(id)).filter(Boolean);
  const heroImage = images[0];
  const galleryImages = images.slice(1);

  const readTime = t('minRead', { minutes: estimateReadMinutes(description) });
  const date = formatNewsDate(article.createdAt, locale);
  const paragraphs = toParagraphs(description);

  return (
    <div>
      {/* Back control — above the image, not overlaid on it */}
      <div className="max-w-[1600px] mx-auto px-5 lg:px-10 pt-6 lg:pt-8">
        <BackButton href="/news" />
      </div>

      {/* Hero — clean image, no text overlay */}
      <div className="relative w-full h-[45dvh] min-h-[320px] lg:h-[62dvh] overflow-hidden mt-4 lg:mt-6">
        {heroImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroImage}
            alt={header}
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
        ) : (
          <div className="absolute inset-0 bg-secondary-black flex items-center justify-center">
            <ImageIcon className="w-16 h-16 text-pale-gray/15" />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="bg-pale-gray text-dark-green">
        <div className="max-w-4xl mx-auto px-5 lg:px-10 py-14 lg:py-20">
          {/* Title + meta (below the image, not overlaid) */}
          <FadeIn>
            <h1 className="font-[--font-bodoni] font-normal text-seu-heading lg:text-seu-title text-dark-green leading-tight">
              {header}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-4 mb-8">
              <span className="px-3 py-1 rounded-sm bg-dark-green font-montserrat font-medium text-seu-caption-sm uppercase tracking-wide text-pale-gray">
                {readTime}
              </span>
              {date && (
                <span className="px-3 py-1 rounded-sm bg-dark-green font-montserrat font-medium text-seu-caption-sm uppercase tracking-wide text-pale-gray">
                  {date}
                </span>
              )}
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-sm border border-dark-green/20 font-montserrat font-medium text-seu-caption-sm uppercase tracking-wide text-dark-green/70"
                >
                  {tag}
                </span>
              ))}
            </div>
          </FadeIn>

          <FadeIn>
            <div className="space-y-5 font-montserrat text-seu-body lg:text-seu-body-lg leading-relaxed text-dark-green/90">
              {paragraphs.length > 0 ? (
                paragraphs.map((p, i) => (
                  <p key={i} className="whitespace-pre-line">
                    {p}
                  </p>
                ))
              ) : (
                <p className="whitespace-pre-line">{description}</p>
              )}
            </div>
          </FadeIn>

          {/* Image gallery — remaining article images */}
          {galleryImages.length > 0 && (
            <FadeIn>
              <div className="mt-10 lg:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                {galleryImages.map((src, i) => (
                  <div
                    key={`${src}-${i}`}
                    className="relative aspect-[4/3] overflow-hidden rounded-lg bg-secondary-black/10"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`${header} — ${i + 2}`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </FadeIn>
          )}
        </div>
      </div>
    </div>
  );
}
