'use client';

import { useState } from 'react';
import { ImageIcon } from 'lucide-react';
import { useLocale } from 'next-intl';
import FadeIn from '@/components/FadeIn';
import { fileUrl } from '@/lib/file-url';
import { pickLocalized, type Locale } from '@/lib/i18n-helpers';
import NewsArticleDialog from './NewsArticleDialog';
import type { NewsArticle } from '@/model/types/api';

function estimateReadTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

function NewsCard({
  article,
  index,
  locale,
  onClick,
}: {
  article: NewsArticle;
  index: number;
  locale: Locale;
  onClick: () => void;
}) {
  const hasImage = article.image.length > 0;
  const header = pickLocalized(article.headerEn, article.headerKa, locale);
  const description = pickLocalized(article.descriptionEn, article.descriptionKa, locale);
  const readTime = estimateReadTime(description);

  return (
    <FadeIn delay={(index % 3) * 80} duration={500}>
      <article
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
        className="group rounded-lg border border-news-frame-border bg-pale-gray/15 cursor-pointer hover-lift h-full pt-3 px-3 pb-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-green/60"
      >
        {/* Title */}
        <div className="px-1 pb-2.5">
          <h3 className="font-montserrat font-semibold text-seu-caption-sm text-site-fg leading-snug line-clamp-1">
            {header}
          </h3>
        </div>

        {/* Image */}
        <div className="relative w-full aspect-[16/9] overflow-hidden rounded">
          {hasImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={fileUrl(article.image[0])}
              alt={header}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-secondary-black/60 flex items-center justify-center">
              <ImageIcon className="w-10 h-10 text-site-fg-dim/15" />
            </div>
          )}
        </div>

        {/* Tags — below the image */}
        <div className="flex gap-1.5 mt-3 px-1">
          <span className="px-2.5 py-0.5 rounded-sm bg-white font-montserrat font-medium text-seu-caption-sm text-dark-green">
            {readTime}
          </span>
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 rounded-sm bg-white font-montserrat font-medium text-seu-caption-sm text-dark-green"
            >
              {tag}
            </span>
          ))}
        </div>
      </article>
    </FadeIn>
  );
}

interface NewsGridProps {
  articles: NewsArticle[];
}

export default function NewsGrid({ articles }: NewsGridProps) {
  const [openArticle, setOpenArticle] = useState<NewsArticle | null>(null);
  const locale = useLocale() as Locale;

  return (
    <div className="py-16 lg:py-24">
      <div className="max-w-[1920px] mx-auto px-5 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {articles.map((article, i) => (
            <NewsCard
              key={article.id}
              article={article}
              index={i}
              locale={locale}
              onClick={() => setOpenArticle(article)}
            />
          ))}
        </div>
      </div>

      <NewsArticleDialog
        article={openArticle}
        open={openArticle !== null}
        onOpenChange={(open) => {
          if (!open) setOpenArticle(null);
        }}
      />
    </div>
  );
}
