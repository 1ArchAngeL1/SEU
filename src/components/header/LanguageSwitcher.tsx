'use client'

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useLocaleTransition } from '@/components/header/LocaleTransitionContext';

export const LanguageSwitcher = () => {
  const locale = useLocale();
  const t = useTranslations('header');
  const { switchLocale } = useLocaleTransition();
  const [activeLocale, setActiveLocale] = useState(locale);

  useEffect(() => {
    setActiveLocale(locale);
  }, [locale]);

  const handleSwitch = (newLocale: 'en' | 'ka') => {
    setActiveLocale(newLocale);
    switchLocale(newLocale);
  };

  return (
    <div className="relative flex items-center h-10 border border-site-border-soft rounded-[10px] px-[0.175rem] bg-site-bg-hover">
      {/* Sliding pill */}
      <div
        className={`absolute top-[0.175rem] h-8 w-16 rounded-[8px] bg-primary-orange border border-primary-orange/60 transition-transform duration-300 ease-in-out ${
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
