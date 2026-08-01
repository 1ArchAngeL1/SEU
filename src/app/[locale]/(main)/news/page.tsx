'use client';

import NewsFeatured from '@/components/news/NewsFeatured';
import NewsGrid from '@/components/news/NewsGrid';
import ContactForm from '@/components/ContactForm';
import ContactPanel from '@/components/ContactPanel';
import { useAllNews } from '@/hooks/queries/use-news';
import { useTranslations } from 'next-intl';

export default function NewsPage() {
  const { data: articles = [], isLoading } = useAllNews();
  const t = useTranslations('news');

  // The admin-configured main article drives the wide banner; if none is set,
  // fall back to the newest article. Everything else goes in the grid.
  const main = articles.find((a) => a.isMain) ?? articles[0];
  const rest = main ? articles.filter((a) => a.id !== main.id) : articles;

  return (
    <main className="bg-site-bg">
      {isLoading ? (
        <div className="py-12 lg:py-16">
          <div className="max-w-[1920px] mx-auto px-5 lg:px-10 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-lg bg-pale-gray/[0.06] h-52 animate-pulse" />
            ))}
          </div>
        </div>
      ) : articles.length > 0 ? (
        <>
          {main && (
            <div className="pt-6 lg:pt-10">
              <NewsFeatured article={main} />
            </div>
          )}
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
          <ContactForm className="max-w-3xl" />
          <ContactPanel className="max-w-3xl" />
        </div>
      </div>
    </main>
  );
}
