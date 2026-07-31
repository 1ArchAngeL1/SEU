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
    <div className="py-16 lg:py-24">
      <div className="max-w-[1920px] mx-auto px-5 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {articles.map((article, i) => (
            <NewsCard key={article.id} article={article} index={i} locale={locale} />
          ))}
        </div>
      </div>
    </div>
  );
}
