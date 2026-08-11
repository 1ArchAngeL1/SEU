'use client';

import { ArrowRight, ImageIcon } from 'lucide-react';
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
  const locale = useLocale() as Locale;
  const t = useTranslations('news');
  const hasImage = article.image.length > 0;
  const header = pickLocalized(article.headerEn, article.headerKa, locale);
  const imageSrc = hasImage ? fileUrl(article.image[0]) : '';

  return (
    <div className="max-w-[1920px] mx-auto px-5 lg:px-10">
      <FadeIn>
        <div className="group relative w-full h-[46dvh] min-h-[320px] lg:h-[58dvh] overflow-hidden rounded-xl border border-site-border-soft">
          {/* Clickable image fills the banner. Anchored to the top so the top is
              never cropped; only the bottom is trimmed to fill the banner. */}
          <Link href={`/news/${article.id}`} className="absolute inset-0 block">
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

          {/* Bottom scrim so the overlaid button reads clearly on bright images */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/55 to-transparent" />

          {/* Read More CTA — overlaid on the banner, lower-center */}
          <div className="pointer-events-none absolute inset-x-0 bottom-6 lg:bottom-10 flex justify-center">
            <Link
              href={`/news/${article.id}`}
              className="pointer-events-auto inline-flex items-center gap-2 bg-primary-green text-white font-montserrat font-medium text-seu-body px-10 py-3 rounded-lg shadow-lg shadow-black/25 hover:bg-primary-green/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              {t('readMore')}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
