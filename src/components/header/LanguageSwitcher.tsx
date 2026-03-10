'use client'

import { useRouter, usePathname } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';

export const LanguageSwitcher = () => {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('header');
  const pathname = usePathname();

  function switchLocale(newLocale: 'en' | 'ka') {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <div className="relative flex items-center h-10 border border-secondary-grey bg-pale-gray/10 rounded-[10px] px-[0.175rem]">
      {/* Sliding pill */}
      <div
        className={`absolute top-[0.175rem] h-8 w-16 rounded-[8px] bg-pale-gray/30 border border-secondary-grey transition-transform duration-300 ease-in-out ${
          locale === 'ka' ? 'translate-x-[calc(100%+0.175rem)]' : 'translate-x-0'
        }`}
      />
      <button
        onClick={() => switchLocale('en')}
        className={`relative z-10 h-8 w-16 font-montserrat font-medium text-seu-body-sm leading-[1.1875rem] tracking-[0.15rem] rounded-[8px] transition-colors duration-300 ${
          locale === 'en' ? 'text-pale-gray' : 'text-pale-gray/50 hover:text-pale-gray/70'
        }`}
      >
        {t('en')}
      </button>
      <button
        onClick={() => switchLocale('ka')}
        className={`relative z-10 h-8 w-16 font-montserrat font-medium text-seu-body-sm leading-[1.1875rem] tracking-[0.15rem] rounded-[8px] transition-colors duration-300 ${
          locale === 'ka' ? 'text-pale-gray' : 'text-pale-gray/50 hover:text-pale-gray/70'
        }`}
      >
        {t('ge')}
      </button>
    </div>
  );
};
