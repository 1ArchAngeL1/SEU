'use client';

import { createContext, useContext, useTransition, useCallback, type ReactNode } from 'react';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useLocale } from 'next-intl';

type LocaleTransitionContextValue = {
  isPending: boolean;
  switchLocale: (newLocale: 'en' | 'ka') => void;
};

const LocaleTransitionContext = createContext<LocaleTransitionContextValue>({
  isPending: false,
  switchLocale: () => {},
});

export function useLocaleTransition() {
  return useContext(LocaleTransitionContext);
}

export function LocaleTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLocale = useCallback(
    (newLocale: 'en' | 'ka') => {
      if (newLocale === locale) return;
      startTransition(() => {
        router.replace(pathname, { locale: newLocale });
      });
    },
    [locale, pathname, router]
  );

  return (
    <LocaleTransitionContext.Provider value={{ isPending, switchLocale }}>
      <div
        className="transition-opacity duration-300 ease-in-out"
        style={{ opacity: isPending ? 0.4 : 1 }}
      >
        {children}
      </div>
    </LocaleTransitionContext.Provider>
  );
}
