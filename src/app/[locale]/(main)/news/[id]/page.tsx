'use client';

import { use, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import NewsArticleView from '@/components/news/NewsArticleView';
import MoreNews from '@/components/news/MoreNews';
import ContactForm from '@/components/ContactForm';
import ContactPanel from '@/components/ContactPanel';
import { useNewsArticle } from '@/hooks/queries/use-news';
import { pickLocalized, type Locale } from '@/lib/i18n-helpers';
import { trackViewNewsArticle } from '@/lib/analytics/events';

export default function NewsArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const locale = useLocale() as Locale;
  const tCommon = useTranslations('common');
  const articleQ = useNewsArticle(id);

  const headline = articleQ.data
    ? pickLocalized(articleQ.data.headerEn, articleQ.data.headerKa, locale)
    : '';
  useEffect(() => {
    if (!articleQ.data) return;
    trackViewNewsArticle(articleQ.data.id, headline);
  }, [articleQ.data, headline]);

  if (articleQ.isLoading) {
    return (
      <div className="bg-site-bg min-h-[60dvh] flex items-center justify-center">
        <span className="font-montserrat text-seu-body text-site-fg">
          {tCommon('loading')}
        </span>
      </div>
    );
  }

  const article = articleQ.data;
  if (!article) notFound();

  return (
    <main className="bg-site-bg">
      <NewsArticleView article={article} />

      {/* Other news */}
      <MoreNews currentId={article.id} />

      {/* Contact Section */}
      <div className="py-20 lg:py-28 border-t border-site-border">
        <div className="max-w-[1920px] mx-auto px-5 lg:px-10 flex flex-col lg:flex-row justify-between gap-12">
          <ContactForm className="max-w-3xl" source="news_article" />
          <ContactPanel className="max-w-3xl" />
        </div>
      </div>
    </main>
  );
}
