'use client';

import FadeIn from '@/components/FadeIn';
import { ImageIcon } from 'lucide-react';
import { fileUrl } from '@/lib/file-url';
import type { NewsArticle } from '@/model/types/api';

interface NewsFeaturedProps {
  article: NewsArticle;
}

export default function NewsFeatured({ article }: NewsFeaturedProps) {
  const hasImage = article.image.length > 0;

  return (
    <div className="max-w-[1920px] mx-auto px-5 lg:px-10 -mt-16 relative z-10">
      <FadeIn>
        <div className="relative w-full h-48 lg:h-72 rounded-xl overflow-hidden border border-site-border-soft">
          {/* Background image or placeholder */}
          {hasImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={fileUrl(article.image[0])}
              alt={article.header}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-secondary-black/80 flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-site-fg-dim/15" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-r from-dark-green/80 to-transparent" />

          <div className="relative z-10 flex items-center h-full px-8 lg:px-16">
            <h2 className="font-[--font-bodoni] font-normal text-seu-heading lg:text-seu-title text-primary-orange italic max-w-2xl">
              {article.header}
            </h2>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
