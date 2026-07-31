'use client';

import { ImageIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import FadeIn from '@/components/FadeIn';
import { fileUrl } from '@/lib/file-url';
import { pickLocalized, type Locale } from '@/lib/i18n-helpers';
import { estimateReadMinutes } from '@/lib/news-helpers';
import type { NewsArticle } from '@/model/types/api';

interface NewsCardProps {
  article: NewsArticle;
  locale: Locale;
  index?: number;
}

export default function NewsCard({ article, locale, index = 0 }: NewsCardProps) {
  const t = useTranslations('news');
  const hasImage = article.image.length > 0;
  const header = pickLocalized(article.headerEn, article.headerKa, locale);
  const description = pickLocalized(
    article.descriptionEn,
    article.descriptionKa,
    locale,
  );
  const readTime = t('minRead', { minutes: estimateReadMinutes(description) });

  return (
    <FadeIn delay={(index % 4) * 70} duration={500} className="h-full">
      <Link
        href={`/news/${article.id}`}
        className="group flex h-full flex-col rounded-lg border border-site-border-strong bg-pale-gray/[0.06] cursor-pointer hover-lift pt-2.5 px-2.5 pb-3.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-green/60"
      >
        {/* Title */}
        <div className="px-0.5 pb-2">
          <h3 className="font-montserrat font-semibold text-seu-caption-sm uppercase tracking-wide text-site-fg leading-snug line-clamp-1">
            {header}
          </h3>
        </div>

        {/* Image */}
        <div className="relative w-full aspect-[4/3] overflow-hidden rounded">
          {hasImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={fileUrl(article.image[0])}
              alt={header}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-secondary-black/60 flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-site-fg-dim/15" />
            </div>
          )}
        </div>

        {/* Tags — below the image */}
        <div className="flex flex-wrap gap-1 mt-2.5 px-0.5">
          <span className="px-2 py-0.5 rounded-sm bg-white font-montserrat font-medium text-seu-caption-sm uppercase tracking-wide text-dark-green">
            {readTime}
          </span>
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-sm bg-white font-montserrat font-medium text-seu-caption-sm uppercase tracking-wide text-dark-green"
            >
              {tag}
            </span>
          ))}
        </div>
      </Link>
    </FadeIn>
  );
}
