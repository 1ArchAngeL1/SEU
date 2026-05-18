'use client';

import NewsHero from '@/components/news/NewsHero';
import NewsGrid from '@/components/news/NewsGrid';
import ContactForm from '@/components/ContactForm';
import ContactPanel from '@/components/ContactPanel';
import { useAllNews } from '@/hooks/queries/use-news';
import { useTranslations } from 'next-intl';

export default function NewsPage() {
  const { data: articles = [], isLoading } = useAllNews();
  const t = useTranslations('news');

  return (
    <main className="bg-site-bg">
      <NewsHero />

      {isLoading ? (
        <div className="py-16 lg:py-24">
          <div className="max-w-[1920px] mx-auto px-5 lg:px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-lg bg-news-frame h-64 animate-pulse" />
            ))}
          </div>
        </div>
      ) : articles.length > 0 ? (
        <NewsGrid articles={articles} />
      ) : (
        <div className="py-16 lg:py-24 text-center">
          <p className="font-montserrat text-seu-body text-site-fg-muted">
            {t('noNews')}
          </p>
        </div>
      )}

      {/* Contact Section */}
      <div className="py-20 lg:py-28 border-t border-site-border">
        <div className="max-w-[1920px] mx-auto px-5 lg:px-10 flex flex-col lg:flex-row justify-between gap-12">
          <ContactForm className="max-w-2xl" />
          <ContactPanel className="max-w-2xl" />
        </div>
      </div>
    </main>
  );
}
