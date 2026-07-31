'use client';

import { useLocale } from 'next-intl';
import NewsCard from './NewsCard';
import { type Locale } from '@/lib/i18n-helpers';
import type { NewsArticle } from '@/model/types/api';

interface NewsGridProps {
  articles: NewsArticle[];
}

export default function NewsGrid({ articles }: NewsGridProps) {
  const locale = useLocale() as Locale;

  return (
    <div className="py-12 lg:py-16">
      <div className="max-w-[1920px] mx-auto px-5 lg:px-10">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
          {articles.map((article, i) => (
            <NewsCard key={article.id} article={article} index={i} locale={locale} />
          ))}
        </div>
      </div>
    </div>
  );
}
