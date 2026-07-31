'use client';

import NewsHero from '@/components/news/NewsHero';
import NewsFeatured from '@/components/news/NewsFeatured';
import NewsGrid from '@/components/news/NewsGrid';
import ContactForm from '@/components/ContactForm';
import ContactPanel from '@/components/ContactPanel';
import { useAllNews } from '@/hooks/queries/use-news';
import { useTranslations } from 'next-intl';

export default function NewsPage() {
  const { data: articles = [], isLoading } = useAllNews();
  const t = useTranslations('news');

  const [featured, ...rest] = articles;

  return (
    <main className="bg-site-bg">
      <NewsHero />

      {isLoading ? (
        <div className="py-16 lg:py-24">
          <div className="max-w-[1920px] mx-auto px-5 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-lg bg-pale-gray/[0.06] h-72 animate-pulse" />
            ))}
          </div>
        </div>
      ) : articles.length > 0 ? (
        <>
          <div className="pt-6 lg:pt-10">
            <NewsFeatured article={featured} />
          </div>
          {rest.length > 0 && <NewsGrid articles={rest} />}
        </>
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
