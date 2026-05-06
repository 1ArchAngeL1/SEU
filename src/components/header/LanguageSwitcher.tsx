'use client'

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useLocaleTransition } from '@/components/header/LocaleTransitionContext';
import type { HeaderVariant } from './SeuHeader';

export const LanguageSwitcher = ({ variant = 'dark' }: { variant?: HeaderVariant }) => {
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
    <div className={`relative flex items-center h-10 border border-secondary-grey rounded-[10px] px-[0.175rem] ${variant === 'light' ? 'bg-pale-gray/10 border-black/30' : 'bg-pale-gray/10'}`}>
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
            ? 'text-pale-gray'
            : variant === 'light'
              ? 'text-black/50 hover:text-black/70'
              : 'text-pale-gray/50 hover:text-pale-gray/70'
        }`}
      >
        {t('en')}
      </button>
      <button
        onClick={() => handleSwitch('ka')}
        className={`relative z-10 h-8 w-16 font-montserrat font-medium text-seu-body-sm leading-[1.1875rem] tracking-[0.15rem] rounded-[8px] transition-colors duration-300 ${
          activeLocale === 'ka'
            ? 'text-pale-gray'
            : variant === 'light'
              ? 'text-black/50 hover:text-black/70'
              : 'text-pale-gray/50 hover:text-pale-gray/70'
        }`}
      >
        {t('ge')}
      </button>
    </div>
  );
};
