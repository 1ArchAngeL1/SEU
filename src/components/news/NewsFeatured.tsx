'use client';

import { ImageIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import FadeIn from '@/components/FadeIn';
import { fileUrl } from '@/lib/file-url';
import { pickLocalized, type Locale } from '@/lib/i18n-helpers';
import type { NewsArticle } from '@/model/types/api';

interface NewsFeaturedProps {
  article: NewsArticle;
}

export default function NewsFeatured({ article }: NewsFeaturedProps) {
  const t = useTranslations('news');
  const locale = useLocale() as Locale;
  const hasImage = article.image.length > 0;
  const header = pickLocalized(article.headerEn, article.headerKa, locale);
  const imageSrc = hasImage ? fileUrl(article.image[0]) : '';

  return (
    <div className="max-w-[1920px] mx-auto px-5 lg:px-10">
      <FadeIn>
        <Link
          href={`/news/${article.id}`}
          className="group relative block w-full h-[46dvh] min-h-[320px] lg:h-[58dvh] overflow-hidden rounded-xl border border-site-border-soft"
        >
          {/* Full-width image anchored to the top, so the top is never
              cropped — only the bottom is trimmed to fill the banner. */}
          {hasImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageSrc}
              alt={header}
              className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-secondary-black flex items-center justify-center">
              <ImageIcon className="w-14 h-14 text-pale-gray/15" />
            </div>
          )}

          {/* Legibility overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-green/80 via-dark-green/25 to-dark-green/40" />

          {/* Centered title + CTA */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center gap-6 px-6">
            <h2 className="font-[--font-bodoni] font-normal text-seu-title lg:text-seu-title-xl text-pale-gray max-w-4xl leading-tight">
              {header}
            </h2>
            <span className="inline-flex items-center rounded-md bg-primary-orange px-6 py-3 font-montserrat font-semibold text-seu-caption uppercase tracking-widest text-white transition-transform duration-300 group-hover:-translate-y-0.5">
              {t('readThisArticle')}
            </span>
          </div>
        </Link>
      </FadeIn>
    </div>
  );
}
