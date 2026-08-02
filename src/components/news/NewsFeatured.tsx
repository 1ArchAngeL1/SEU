'use client';

import { ImageIcon } from 'lucide-react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import FadeIn from '@/components/FadeIn';
import { fileUrl } from '@/lib/file-url';
import { pickLocalized, type Locale } from '@/lib/i18n-helpers';
import type { NewsArticle } from '@/model/types/api';

interface NewsFeaturedProps {
  article: NewsArticle;
}

export default function NewsFeatured({ article }: NewsFeaturedProps) {
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
          {/* Clean image — no text overlay. Anchored to the top so the top is
              never cropped; only the bottom is trimmed to fill the banner. */}
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
        </Link>
      </FadeIn>
    </div>
  );
}
