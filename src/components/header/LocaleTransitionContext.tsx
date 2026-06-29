'use client';

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
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
  const [isPending, setIsPending] = useState(false);
  const fallbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearFallback = useCallback(() => {
    if (fallbackTimer.current) {
      clearTimeout(fallbackTimer.current);
      fallbackTimer.current = null;
    }
  }, []);

  // `locale` only changes once the navigation has committed — that's the reliable
  // signal that the switch finished, so we drop the dimming overlay here.
  // (Previously this was driven by useTransition's isPending, which could get
  // stuck on a stalled soft navigation and leave the whole page frozen/dimmed.)
  useEffect(() => {
    setIsPending(false);
    clearFallback();
  }, [locale, clearFallback]);

  // Clean up any pending timer on unmount.
  useEffect(() => clearFallback, [clearFallback]);

  const switchLocale = useCallback(
    (newLocale: 'en' | 'ka') => {
      if (newLocale === locale) return;
      setIsPending(true);
      router.replace(pathname, { locale: newLocale });
      // Safety net: never leave the page dimmed if the navigation doesn't commit.
      clearFallback();
      fallbackTimer.current = setTimeout(() => setIsPending(false), 4000);
    },
    [locale, pathname, router, clearFallback]
  );

  return (
    <LocaleTransitionContext.Provider value={{ isPending, switchLocale }}>
      <div
        className="transition-opacity duration-300 ease-in-out"
        style={{ opacity: isPending ? 0.6 : 1 }}
      >
        {children}
      </div>
    </LocaleTransitionContext.Provider>
  );
}
