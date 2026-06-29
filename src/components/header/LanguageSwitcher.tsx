'use client'

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';

export const LanguageSwitcher = () => {
  const locale = useLocale();
  const t = useTranslations('header');
  const router = useRouter();
  const pathname = usePathname();
  const [activeLocale, setActiveLocale] = useState(locale);

  // Re-sync the pill once the navigation has actually switched the locale.
  useEffect(() => {
    setActiveLocale(locale);
  }, [locale]);

  const handleSwitch = (newLocale: 'en' | 'ka') => {
    if (newLocale === locale) return;
    setActiveLocale(newLocale); // optimistic: slide the pill immediately
    // Stay on the current page, just swap the locale. `pathname` from
    // next-intl is already locale-stripped, so this preserves the route.
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="relative flex items-center h-10 border border-site-border-soft rounded-[10px] px-[0.175rem] bg-site-bg-hover">
      {/* Sliding pill */}
      <div
        className={`absolute top-[0.175rem] h-8 w-16 rounded-[8px] bg-primary-green border border-primary-green/60 transition-transform duration-300 ease-in-out ${
          activeLocale === 'ka' ? 'translate-x-[calc(100%+0.175rem)]' : 'translate-x-0'
        }`}
      />
      <button
        onClick={() => handleSwitch('en')}
        className={`relative z-10 h-8 w-16 font-montserrat font-medium text-seu-body-sm leading-[1.1875rem] tracking-[0.15rem] rounded-[8px] transition-colors duration-300 ${
          activeLocale === 'en'
            ? 'text-white'
            : 'text-site-fg-dim hover:text-site-fg'
        }`}
      >
        {t('en')}
      </button>
      <button
        onClick={() => handleSwitch('ka')}
        className={`relative z-10 h-8 w-16 font-montserrat font-medium text-seu-body-sm leading-[1.1875rem] tracking-[0.15rem] rounded-[8px] transition-colors duration-300 ${
          activeLocale === 'ka'
            ? 'text-white'
            : 'text-site-fg-dim hover:text-site-fg'
        }`}
      >
        {t('ge')}
      </button>
    </div>
  );
};
