'use client';

import { useLocale, useTranslations } from 'next-intl';
import NewsCard from './NewsCard';
import { type Locale } from '@/lib/i18n-helpers';
import { useAllNews } from '@/hooks/queries/use-news';

export default function MoreNews({ currentId }: { currentId: string }) {
  const t = useTranslations('news');
  const locale = useLocale() as Locale;
  const { data: articles = [] } = useAllNews();

  const others = articles.filter((a) => a.id !== currentId).slice(0, 4);
  if (others.length === 0) return null;

  return (
    <div className="py-16 lg:py-24 border-t border-site-border">
      <div className="max-w-[1920px] mx-auto px-5 lg:px-10">
        <h2 className="font-[--font-bodoni] font-normal text-seu-heading lg:text-seu-heading-lg text-site-fg-strong mb-8 lg:mb-10">
          {t('moreNews')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
          {others.map((article, i) => (
            <NewsCard key={article.id} article={article} index={i} locale={locale} />
          ))}
        </div>
      </div>
    </div>
  );
}
